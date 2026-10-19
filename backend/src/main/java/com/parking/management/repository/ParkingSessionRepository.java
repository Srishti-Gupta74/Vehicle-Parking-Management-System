package com.parking.management.repository;

import com.parking.management.model.ParkingSession;
import com.parking.management.model.SessionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ParkingSessionRepository extends JpaRepository<ParkingSession, Long> {

    Optional<ParkingSession> findByVehicle_VehicleNumberAndStatus(String vehicleNumber, SessionStatus status);

    Optional<ParkingSession> findBySlot_SlotIdAndStatus(Long slotId, SessionStatus status);

    List<ParkingSession> findByStatusOrderByEntryTimeDesc(SessionStatus status);

    List<ParkingSession> findByVehicle_VehicleIdOrderByEntryTimeDesc(Long vehicleId);

    long countByStatus(SessionStatus status);

    long countByEntryTimeBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT ps FROM ParkingSession ps ORDER BY ps.entryTime DESC")
    List<ParkingSession> findAllSessionsOrdered();

    @Query("SELECT ps FROM ParkingSession ps WHERE ps.status = 'ACTIVE' ORDER BY ps.entryTime DESC")
    List<ParkingSession> findActiveSessions();

    @Query("SELECT ps FROM ParkingSession ps WHERE " +
           "(:vehicleNumber IS NULL OR LOWER(ps.vehicle.vehicleNumber) LIKE LOWER(CONCAT('%', :vehicleNumber, '%'))) AND " +
           "(:status IS NULL OR ps.status = :status) AND " +
           "(:vehicleType IS NULL OR ps.vehicle.class = :vehicleType) " +
           "ORDER BY ps.entryTime DESC")
    List<ParkingSession> searchHistory(
            @Param("vehicleNumber") String vehicleNumber,
            @Param("status") SessionStatus status,
            @Param("vehicleType") String vehicleType);
}
