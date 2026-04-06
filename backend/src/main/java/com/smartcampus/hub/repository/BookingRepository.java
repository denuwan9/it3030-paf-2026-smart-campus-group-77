package com.smartcampus.hub.repository;

import com.smartcampus.hub.entity.Booking;
import com.smartcampus.hub.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {

  Optional<Booking> findByCheckInToken(String checkInToken);

    @Query("""
            SELECT COUNT(b) FROM Booking b
            WHERE b.resource.id = :resourceId
              AND b.bookingDate = :bookingDate
              AND b.status IN :statuses
              AND b.startTime < :endTime
              AND b.endTime > :startTime
            """)
    long countConflictingBookings(@Param("resourceId") UUID resourceId,
                                  @Param("bookingDate") LocalDate bookingDate,
                                  @Param("startTime") LocalTime startTime,
                                  @Param("endTime") LocalTime endTime,
                                  @Param("statuses") List<BookingStatus> statuses);

    @Query("""
            SELECT COUNT(b) FROM Booking b
            WHERE b.resource.id = :resourceId
              AND b.bookingDate = :bookingDate
              AND b.status IN :statuses
              AND b.id <> :excludeBookingId
              AND b.startTime < :endTime
              AND b.endTime > :startTime
            """)
    long countConflictingBookingsExcludingBooking(@Param("resourceId") UUID resourceId,
                                                  @Param("bookingDate") LocalDate bookingDate,
                                                  @Param("startTime") LocalTime startTime,
                                                  @Param("endTime") LocalTime endTime,
                                                  @Param("statuses") List<BookingStatus> statuses,
                                                  @Param("excludeBookingId") UUID excludeBookingId);

    @Query("""
            SELECT b FROM Booking b
            JOIN FETCH b.resource r
            JOIN FETCH b.requestedBy u
            LEFT JOIN FETCH b.reviewedBy rv
            WHERE u.id = :userId
              AND (:status IS NULL OR b.status = :status)
              AND (:fromDate IS NULL OR b.bookingDate >= :fromDate)
              AND (:toDate IS NULL OR b.bookingDate <= :toDate)
            ORDER BY b.bookingDate DESC, b.startTime DESC
            """)
    List<Booking> findUserBookings(@Param("userId") UUID userId,
                                   @Param("status") BookingStatus status,
                                   @Param("fromDate") LocalDate fromDate,
                                   @Param("toDate") LocalDate toDate);

    @Query("""
            SELECT b FROM Booking b
            JOIN FETCH b.resource r
            JOIN FETCH b.requestedBy u
            LEFT JOIN FETCH b.reviewedBy rv
            WHERE (:status IS NULL OR b.status = :status)
              AND (:resourceId IS NULL OR r.id = :resourceId)
              AND (:requesterId IS NULL OR u.id = :requesterId)
              AND (:fromDate IS NULL OR b.bookingDate >= :fromDate)
              AND (:toDate IS NULL OR b.bookingDate <= :toDate)
            ORDER BY b.createdAt DESC
            """)
    List<Booking> findAllBookings(@Param("status") BookingStatus status,
                                  @Param("resourceId") UUID resourceId,
                                  @Param("requesterId") UUID requesterId,
                                  @Param("fromDate") LocalDate fromDate,
                                  @Param("toDate") LocalDate toDate);
}