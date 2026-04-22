package com.smartcampus.hub.repository;

import com.smartcampus.hub.entity.IncidentTicket;
import com.smartcampus.hub.entity.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface IncidentTicketRepository extends JpaRepository<IncidentTicket, UUID> {

    @Query("SELECT t FROM IncidentTicket t LEFT JOIN FETCH t.reporter LEFT JOIN FETCH t.assignedTechnician LEFT JOIN FETCH t.attachmentUrls WHERE t.reporter.id = :reporterId ORDER BY t.createdAt DESC")
    List<IncidentTicket> findByReporterIdOrderByCreatedAtDesc(@Param("reporterId") UUID reporterId);

    @Query("SELECT t FROM IncidentTicket t LEFT JOIN FETCH t.reporter LEFT JOIN FETCH t.assignedTechnician LEFT JOIN FETCH t.attachmentUrls WHERE t.assignedTechnician.id = :technicianId ORDER BY t.createdAt DESC")
    List<IncidentTicket> findByAssignedTechnicianIdOrderByCreatedAtDesc(@Param("technicianId") UUID technicianId);

    @Query("SELECT t FROM IncidentTicket t LEFT JOIN FETCH t.reporter LEFT JOIN FETCH t.assignedTechnician LEFT JOIN FETCH t.attachmentUrls ORDER BY t.createdAt DESC")
    List<IncidentTicket> findAllByOrderByCreatedAtDesc();

    long countByStatus(TicketStatus status);

    @Query("SELECT COUNT(t) FROM IncidentTicket t WHERE t.reporter.id = :reporterId AND (t.status = :openStatus OR t.status = :progressStatus)")
    long countPendingTicketsByReporter(
            @Param("reporterId") UUID reporterId, 
            @Param("openStatus") TicketStatus openStatus, 
            @Param("progressStatus") TicketStatus progressStatus
    );

    @Query("SELECT COUNT(t) FROM IncidentTicket t WHERE t.assignedTechnician.id = :techId AND t.status IN :statuses")
    long countByAssignedTechnicianIdAndStatusIn(
            @Param("techId") UUID techId, 
            @Param("statuses") java.util.List<TicketStatus> statuses
    );

    @Query("SELECT COUNT(t) FROM IncidentTicket t WHERE t.assignedTechnician.id = :techId AND t.status = :status AND t.updatedAt >= :since")
    long countByAssignedTechnicianAndStatusAndUpdatedAtAfter(
            @Param("techId") UUID techId, 
            @Param("status") TicketStatus status, 
            @Param("since") java.time.Instant since
    );
}
