package com.smartcampus.hub.service;

import com.smartcampus.hub.dto.CommentResponse;
import com.smartcampus.hub.entity.IncidentTicket;
import com.smartcampus.hub.entity.NotificationType;
import com.smartcampus.hub.entity.TicketComment;
import com.smartcampus.hub.entity.User;
import com.smartcampus.hub.repository.IncidentTicketRepository;
import com.smartcampus.hub.repository.TicketCommentRepository;
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
public class TicketCommentService {

    private final TicketCommentRepository commentRepo;
    private final IncidentTicketRepository ticketRepo;
    private final UserRepository userRepo;
    private final NotificationService notificationService;

    @Transactional
    public CommentResponse addComment(UUID ticketId, String content) {
        User author = getCurrentUser();
        log.info("Adding comment to ticket {} by user {}: {}", ticketId, author.getEmail(), content);

        IncidentTicket ticket = ticketRepo.findById(ticketId)
                .orElseThrow(() -> new NoSuchElementException("Ticket not found: " + ticketId));

        TicketComment comment = TicketComment.builder()
                .content(content)
                .ticket(ticket)
                .author(author)
                .build();

        TicketComment saved = commentRepo.save(comment);

        // Notify participants (Reporter and Technician)
        UUID recipient = author.getId().equals(ticket.getReporter().getId()) 
                ? (ticket.getAssignedTechnician() != null ? ticket.getAssignedTechnician().getId() : null)
                : ticket.getReporter().getId();

        if (recipient != null) {
            try {
                notificationService.createNotification(
                        recipient,
                        NotificationType.TICKET,
                        "New Comment on Ticket",
                        author.getFullName() + ": " + (content.length() > 50 ? content.substring(0, 47) + "..." : content),
                        "/dashboard/tickets/" + ticketId
                );
            } catch (Exception e) {
                log.error("Failed to deliver notification for comment on ticket {}: {}", ticketId, e.getMessage());
                // Non-blocking: continue so the comment is still saved
            }
        }

        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<CommentResponse> getComments(UUID ticketId) {
        return commentRepo.findByTicketIdOrderByCreatedAtAsc(ticketId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public CommentResponse updateComment(UUID commentId, String newContent) {
        User user = getCurrentUser();
        TicketComment comment = commentRepo.findById(commentId)
                .orElseThrow(() -> new NoSuchElementException("Comment not found"));

        if (!comment.getAuthor().getId().equals(user.getId())) {
            throw new AccessDeniedException("You can only edit your own comments");
        }

        comment.setContent(newContent);
        return mapToResponse(commentRepo.save(comment));
    }

    @Transactional
    public void deleteComment(UUID commentId) {
        User user = getCurrentUser();
        TicketComment comment = commentRepo.findById(commentId)
                .orElseThrow(() -> new NoSuchElementException("Comment not found"));

        if (!comment.getAuthor().getId().equals(user.getId())) {
            throw new AccessDeniedException("You can only delete your own comments");
        }

        commentRepo.delete(comment);
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepo.findByEmail(email).orElseThrow();
    }

    private CommentResponse mapToResponse(TicketComment c) {
        return CommentResponse.builder()
                .id(c.getId())
                .content(c.getContent())
                .authorId(c.getAuthor().getId())
                .authorName(c.getAuthor().getFullName())
                .profileImageUrl(c.getAuthor().getProfileImageUrl())
                .createdAt(c.getCreatedAt())
                .build();
    }
}
