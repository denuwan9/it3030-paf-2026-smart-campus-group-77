package com.smartcampus.hub.controller;

import com.smartcampus.hub.dto.ApiResponse;
import com.smartcampus.hub.dto.CreateTicketRequest;
import com.smartcampus.hub.dto.TicketResponse;
import com.smartcampus.hub.entity.TicketStatus;
import com.smartcampus.hub.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<TicketResponse>>> getAllTickets() {
        return ResponseEntity.ok(ApiResponse.success("Tickets fetched successfully", ticketService.getAllTickets()));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<List<TicketResponse>>> getMyTickets() {
        return ResponseEntity.ok(ApiResponse.success("My tickets fetched successfully", ticketService.getMyTickets()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TicketResponse>> createTicket(@RequestBody CreateTicketRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Ticket created successfully", ticketService.createTicket(request)));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<TicketResponse>> updateStatus(@PathVariable UUID id, @RequestParam TicketStatus status) {
        return ResponseEntity.ok(ApiResponse.success("Ticket status updated", ticketService.updateTicketStatus(id, status)));
    }
}
