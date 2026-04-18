package com.smartcampus.hub.service;

import com.smartcampus.hub.dto.CreateTicketRequest;
import com.smartcampus.hub.dto.TicketResponse;
import com.smartcampus.hub.entity.*;
import com.smartcampus.hub.repository.TicketRepository;
import com.smartcampus.hub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<TicketResponse> getAllTickets() {
        return ticketRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TicketResponse> getMyTickets() {
        User currentUser = getCurrentUser();
        return ticketRepository.findByReporterIdOrderByCreatedAtDesc(currentUser.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public TicketResponse createTicket(CreateTicketRequest request) {
        User currentUser = getCurrentUser();
        Ticket ticket = Ticket.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .location(request.getLocation())
                .category(request.getCategory())
                .priority(request.getPriority() != null ? request.getPriority() : TicketPriority.MEDIUM)
                .status(TicketStatus.OPEN)
                .reporter(currentUser)
                .build();
        
        Ticket saved = ticketRepository.save(ticket);
        return mapToResponse(saved);
    }

    @Transactional
    public TicketResponse updateTicketStatus(UUID ticketId, TicketStatus status) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        ticket.setStatus(status);
        return mapToResponse(ticketRepository.save(ticket));
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private TicketResponse mapToResponse(Ticket ticket) {
        return TicketResponse.builder()
                .id(ticket.getId())
                .title(ticket.getTitle())
                .description(ticket.getDescription())
                .location(ticket.getLocation())
                .category(ticket.getCategory())
                .status(ticket.getStatus())
                .priority(ticket.getPriority())
                .reporterName(ticket.getReporter() != null ? ticket.getReporter().getFullName() : "Anonymous")
                .reporterId(ticket.getReporter() != null ? ticket.getReporter().getId() : null)
                .assigneeName(ticket.getAssignee() != null ? ticket.getAssignee().getFullName() : null)
                .assigneeId(ticket.getAssignee() != null ? ticket.getAssignee().getId() : null)
                .createdAt(ticket.getCreatedAt())
                .updatedAt(ticket.getUpdatedAt())
                .build();
    }
}
