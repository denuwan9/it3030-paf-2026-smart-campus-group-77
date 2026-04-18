package com.smartcampus.hub.controller;

import com.smartcampus.hub.dto.*;
import com.smartcampus.hub.entity.TicketStatus;
import com.smartcampus.hub.service.IncidentTicketService;
import com.smartcampus.hub.service.TicketCommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/tickets")
@RequiredArgsConstructor
public class IncidentTicketController {

    private final IncidentTicketService ticketService;
    private final TicketCommentService commentService;

    // --- User Endpoints ---

    @PostMapping
    public ResponseEntity<ApiResponse<IncidentTicketResponse>> createTicket(@Valid @RequestBody IncidentTicketRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Incident reported successfully", ticketService.createTicket(request)));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<IncidentTicketResponse>>> getMyTickets() {
        return ResponseEntity.ok(ApiResponse.success("Personal tickets fetched", ticketService.getMyTickets()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<IncidentTicketResponse>> getTicketDetails(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Ticket details fetched", ticketService.getTicketDetails(id)));
    }

    // --- Admin Endpoints ---

    @GetMapping("/admin/queue")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<List<IncidentTicketResponse>>> getGlobalQueue() {
        return ResponseEntity.ok(ApiResponse.success("Global operations queue fetched", ticketService.getGlobalQueue()));
    }

    @PostMapping("/{id}/assign")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<IncidentTicketResponse>> assignTechnician(
            @PathVariable UUID id,
            @RequestParam UUID technicianId) {
        return ResponseEntity.ok(ApiResponse.success("Technician assigned successfully", ticketService.assignTechnician(id, technicianId)));
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<IncidentTicketResponse>> rejectTicket(
            @PathVariable UUID id,
            @RequestParam String reason) {
        return ResponseEntity.ok(ApiResponse.success("Ticket rejected", ticketService.rejectTicket(id, reason)));
    }

    // --- Technician Endpoints ---

    @GetMapping("/technician/tasks")
    @PreAuthorize("hasRole('ROLE_TECHNICIAN') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<List<IncidentTicketResponse>>> getTechnicianTasks() {
        return ResponseEntity.ok(ApiResponse.success("Assigned tasks fetched", ticketService.getTechnicianTasks()));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<IncidentTicketResponse>> updateStatus(
            @PathVariable UUID id,
            @RequestParam TicketStatus status,
            @RequestParam(required = false) String notes) {
        return ResponseEntity.ok(ApiResponse.success("Status updated to " + status, ticketService.updateStatus(id, status, notes)));
    }

    // --- Comment Endpoints ---

    @GetMapping("/{id}/comments")
    public ResponseEntity<ApiResponse<List<CommentResponse>>> getComments(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Comments fetched", commentService.getComments(id)));
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<ApiResponse<CommentResponse>> addComment(
            @PathVariable UUID id,
            @Valid @RequestBody CommentRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Comment added", commentService.addComment(id, request.getContent())));
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<ApiResponse<Void>> deleteComment(@PathVariable UUID commentId) {
        commentService.deleteComment(commentId);
        return ResponseEntity.ok(ApiResponse.success("Comment deleted", null));
    }
}
