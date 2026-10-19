package com.parking.management.repository;

import com.parking.management.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    Optional<Vehicle> findByVehicleNumber(String vehicleNumber);

    List<Vehicle> findByVehicleNumberContainingIgnoreCaseOrOwnerNameContainingIgnoreCase(
            String vehicleNumber, String ownerName);

    @Query("SELECT v FROM Vehicle v WHERE LOWER(v.vehicleNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(v.ownerName) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Vehicle> searchVehicles(@Param("query") String query);
}
