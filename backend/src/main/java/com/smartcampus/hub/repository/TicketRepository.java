package com.smartcampus.hub.repository;

import com.smartcampus.hub.entity.Ticket;
import com.smartcampus.hub.entity.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, UUID> {
    List<Ticket> findByReporterIdOrderByCreatedAtDesc(UUID reporterId);
    List<Ticket> findByStatusOrderByCreatedAtDesc(TicketStatus status);
    long countByStatus(TicketStatus status);
}
