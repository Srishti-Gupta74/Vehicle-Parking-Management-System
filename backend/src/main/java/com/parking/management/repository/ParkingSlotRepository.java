package com.parking.management.repository;

import com.parking.management.model.ParkingSlot;
import com.parking.management.model.SlotStatus;
import com.parking.management.model.SlotType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ParkingSlotRepository extends JpaRepository<ParkingSlot, Long> {

    Optional<ParkingSlot> findBySlotNumber(String slotNumber);

    List<ParkingSlot> findBySlotTypeAndStatus(SlotType slotType, SlotStatus status);

    List<ParkingSlot> findByStatus(SlotStatus status);

    List<ParkingSlot> findByFloor(int floor);

    long countByStatus(SlotStatus status);

    long countBySlotTypeAndStatus(SlotType slotType, SlotStatus status);

    long countBySlotType(SlotType slotType);

    List<ParkingSlot> findAllByOrderByFloorAscSlotNumberAsc();
}
