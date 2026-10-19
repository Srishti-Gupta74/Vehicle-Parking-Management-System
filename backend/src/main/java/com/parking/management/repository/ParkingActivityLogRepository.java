package com.parking.management.repository;

import com.parking.management.model.ParkingActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParkingActivityLogRepository extends JpaRepository<ParkingActivityLog, Long> {
    List<ParkingActivityLog> findTop15ByOrderByTimestampDesc();
}
