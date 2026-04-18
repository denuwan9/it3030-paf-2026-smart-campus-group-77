package com.smartcampus.hub.service;

import com.smartcampus.hub.dto.IncidentTicketRequest;
import com.smartcampus.hub.dto.IncidentTicketResponse;
import com.smartcampus.hub.entity.*;
import com.smartcampus.hub.repository.IncidentTicketRepository;
import com.smartcampus.hub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class IncidentTicketService {

    private final IncidentTicketRepository ticketRepo;
    private final UserRepository userRepo;
    private final NotificationService notificationService;

    @Transactional
    public IncidentTicketResponse createTicket(IncidentTicketRequest request) {
        User reporter = getCurrentUser();
        log.info("Creating new incident ticket by: {}", reporter.getEmail());

        IncidentTicket ticket = IncidentTicket.builder()
                .category(request.getCategory())
                .description(request.getDescription())
                .priority(request.getPriority())
                .location(request.getLocation())
                .contactDetails(request.getContactDetails())
                .attachmentUrls(request.getAttachmentUrls() != null ? request.getAttachmentUrls() : List.of())
                .status(TicketStatus.OPEN)
                .reporter(reporter)
                .build();

        IncidentTicket saved = ticketRepo.save(ticket);
        
        // Notify Admins via Targeted Announcement
        notificationService.createTargetedAnnouncement(com.smartcampus.hub.dto.AnnouncementDTO.builder()
                .targetType("ROLE")
                .targetValue("ROLE_ADMIN")
                .message("A new " + request.getCategory() + " incident was reported at " + request.getLocation())
                .build());

        return mapToResponse(saved);
    }

    @Transactional
    public IncidentTicketResponse assignTechnician(UUID ticketId, UUID technicianId) {
        User admin = getCurrentUser();
        if (admin.getRole() != Role.ROLE_ADMIN) {
            throw new AccessDeniedException("Only Admins can assign technicians");
        }

        IncidentTicket ticket = getTicketOrThrow(ticketId);
        User technician = userRepo.findById(technicianId)
                .orElseThrow(() -> new NoSuchElementException("Technician not found: " + technicianId));

        if (technician.getRole() != Role.ROLE_TECHNICIAN && technician.getRole() != Role.ROLE_ADMIN) {
            throw new IllegalArgumentException("Target user must be a technician or admin");
        }

        ticket.setAssignedTechnician(technician);
        ticket.setStatus(TicketStatus.IN_PROGRESS);
        
        IncidentTicket saved = ticketRepo.save(ticket);

        // Notify Technician
        try {
            notificationService.createNotification(
                    technicianId,
                    NotificationType.TICKET,
                    "New Task Assigned",
                    "You have been assigned to ticket #" + saved.getId().toString().substring(0, 8),
                    "/technician/tasks/" + saved.getId()
            );
        } catch (Exception e) {
            log.error("Notification failed for technician {}: {}", technicianId, e.getMessage());
        }

        // Notify Reporter
        try {
            notificationService.createNotification(
                    saved.getReporter().getId(),
                    NotificationType.TICKET,
                    "Technician Assigned",
                    "A technician has been assigned to your report: " + saved.getCategory(),
                    "/dashboard/tickets/" + saved.getId()
            );
        } catch (Exception e) {
            log.error("Notification failed for ticket {}: {}", saved.getId(), e.getMessage());
        }

        return mapToResponse(saved);
    }

    @Transactional
    public IncidentTicketResponse updateStatus(UUID ticketId, TicketStatus newStatus, String notes) {
        User user = getCurrentUser();
        IncidentTicket ticket = getTicketOrThrow(ticketId);

        // Verification: Only Admin or Assigned Technician can update status
        boolean isAdmin = user.getRole() == Role.ROLE_ADMIN;
        boolean isAssigned = ticket.getAssignedTechnician() != null && ticket.getAssignedTechnician().getId().equals(user.getId());

        if (!isAdmin && !isAssigned) {
            throw new AccessDeniedException("You are not authorized to update this ticket status");
        }

        ticket.setStatus(newStatus);
        if (notes != null) {
            ticket.setResolutionNotes(notes);
        }

        IncidentTicket saved = ticketRepo.save(ticket);

        // Trigger Notifications based on status
        String title = "Ticket Status Updated";
        String message = "Your ticket status has changed to " + newStatus;

        if (newStatus == TicketStatus.RESOLVED) {
            title = "Issue Resolved";
            message = "Your reported incident has been marked as RESOLVED. Please check the resolution notes.";
        }

        try {
            notificationService.createNotification(
                    saved.getReporter().getId(),
                    NotificationType.TICKET,
                    title,
                    message,
                    "/dashboard/tickets/" + saved.getId()
            );
        } catch (Exception e) {
            log.error("Notification failed for status update on ticket {}: {}", saved.getId(), e.getMessage());
        }

        return mapToResponse(saved);
    }

    @Transactional
    public IncidentTicketResponse rejectTicket(UUID ticketId, String reason) {
        User admin = getCurrentUser();
        if (admin.getRole() != Role.ROLE_ADMIN) {
            throw new AccessDeniedException("Only Admins can reject tickets");
        }

        IncidentTicket ticket = getTicketOrThrow(ticketId);
        ticket.setStatus(TicketStatus.REJECTED);
        ticket.setRejectionReason(reason);

        IncidentTicket saved = ticketRepo.save(ticket);

        try {
            notificationService.createNotification(
                    saved.getReporter().getId(),
                    NotificationType.TICKET,
                    "Ticket Rejected",
                    "Your incident report was rejected. Reason: " + reason,
                    "/dashboard/tickets/" + saved.getId()
            );
        } catch (Exception e) {
            log.error("Notification failed for rejection on ticket {}: {}", saved.getId(), e.getMessage());
        }

        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<IncidentTicketResponse> getMyTickets() {
        User user = getCurrentUser();
        return ticketRepo.findByReporterIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<IncidentTicketResponse> getTechnicianTasks() {
        User user = getCurrentUser();
        return ticketRepo.findByAssignedTechnicianIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<IncidentTicketResponse> getGlobalQueue() {
        User user = getCurrentUser();
        if (user.getRole() != Role.ROLE_ADMIN) {
            throw new AccessDeniedException("Admin access required for global queue");
        }
        return ticketRepo.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public IncidentTicketResponse getTicketDetails(UUID ticketId) {
        return mapToResponse(getTicketOrThrow(ticketId));
    }

    private IncidentTicket getTicketOrThrow(UUID id) {
        return ticketRepo.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Incident Ticket not found: " + id));
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepo.findByEmail(email).orElseThrow();
    }

    private IncidentTicketResponse mapToResponse(IncidentTicket t) {
        if (t == null) return null;
        
        return IncidentTicketResponse.builder()
                .id(t.getId())
                .category(t.getCategory())
                .description(t.getDescription())
                .priority(t.getPriority())
                .location(t.getLocation())
                .contactDetails(t.getContactDetails())
                .status(t.getStatus())
                .attachmentUrls(t.getAttachmentUrls() != null ? new java.util.ArrayList<>(t.getAttachmentUrls()) : java.util.Collections.emptyList())
                .rejectionReason(t.getRejectionReason())
                .resolutionNotes(t.getResolutionNotes())
                .reporterName(t.getReporter() != null ? t.getReporter().getFullName() : "Unknown Reporter")
                .reporterId(t.getReporter() != null ? t.getReporter().getId() : null)
                .technicianName(t.getAssignedTechnician() != null ? t.getAssignedTechnician().getFullName() : null)
                .technicianId(t.getAssignedTechnician() != null ? t.getAssignedTechnician().getId() : null)
                .createdAt(t.getCreatedAt())
                .updatedAt(t.getUpdatedAt())
                .build();
    }
}
