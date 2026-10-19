package com.parking.management.config;

import com.parking.management.model.*;
import com.parking.management.repository.*;
import com.parking.management.threads.ParkingMonitor;
import com.parking.management.threads.ParkingSessionMonitor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final ParkingSlotRepository slotRepository;
    private final ParkingActivityLogRepository activityLogRepository;

    @Autowired
    public DataInitializer(UserRepository userRepository,
                           ParkingSlotRepository slotRepository,
                           ParkingActivityLogRepository activityLogRepository) {
        this.userRepository = userRepository;
        this.slotRepository = slotRepository;
        this.activityLogRepository = activityLogRepository;
    }

    @Override
    public void run(String... args) {
        logger.info("Initializing Vehicle Parking Management System runtime...");

        // 1. Verify / Create default Administrator
        if (userRepository.findByEmail("admin@parking.com").isEmpty()) {
            User admin = new User("System Administrator", "admin@parking.com", "admin123", "ADMIN");
            userRepository.save(admin);
            logger.info("Default administrator created: admin@parking.com");
        }

        // 2. Ensure initial parking slots exist
        if (slotRepository.count() == 0) {
            logger.info("Seeding initial 20 parking slots across 2 floors...");
            // Floor 1
            slotRepository.save(new ParkingSlot("B-01", SlotType.BIKE, 1, SlotStatus.AVAILABLE));
            slotRepository.save(new ParkingSlot("B-02", SlotType.BIKE, 1, SlotStatus.AVAILABLE));
            slotRepository.save(new ParkingSlot("B-03", SlotType.BIKE, 1, SlotStatus.AVAILABLE));
            slotRepository.save(new ParkingSlot("B-04", SlotType.BIKE, 1, SlotStatus.AVAILABLE));
            slotRepository.save(new ParkingSlot("C-01", SlotType.CAR, 1, SlotStatus.AVAILABLE));
            slotRepository.save(new ParkingSlot("C-02", SlotType.CAR, 1, SlotStatus.AVAILABLE));
            slotRepository.save(new ParkingSlot("C-03", SlotType.CAR, 1, SlotStatus.AVAILABLE));
            slotRepository.save(new ParkingSlot("C-04", SlotType.CAR, 1, SlotStatus.AVAILABLE));
            slotRepository.save(new ParkingSlot("T-01", SlotType.TRUCK, 1, SlotStatus.AVAILABLE));
            slotRepository.save(new ParkingSlot("T-02", SlotType.TRUCK, 1, SlotStatus.AVAILABLE));

            // Floor 2
            slotRepository.save(new ParkingSlot("B-05", SlotType.BIKE, 2, SlotStatus.AVAILABLE));
            slotRepository.save(new ParkingSlot("B-06", SlotType.BIKE, 2, SlotStatus.AVAILABLE));
            slotRepository.save(new ParkingSlot("B-07", SlotType.BIKE, 2, SlotStatus.AVAILABLE));
            slotRepository.save(new ParkingSlot("B-08", SlotType.BIKE, 2, SlotStatus.AVAILABLE));
            slotRepository.save(new ParkingSlot("C-05", SlotType.CAR, 2, SlotStatus.AVAILABLE));
            slotRepository.save(new ParkingSlot("C-06", SlotType.CAR, 2, SlotStatus.AVAILABLE));
            slotRepository.save(new ParkingSlot("C-07", SlotType.CAR, 2, SlotStatus.AVAILABLE));
            slotRepository.save(new ParkingSlot("C-08", SlotType.CAR, 2, SlotStatus.AVAILABLE));
            slotRepository.save(new ParkingSlot("T-03", SlotType.TRUCK, 2, SlotStatus.AVAILABLE));
            slotRepository.save(new ParkingSlot("T-04", SlotType.TRUCK, 2, SlotStatus.AVAILABLE));
        }

        // 3. START BACKGROUND THREADS (Demonstrating Multithreading in production application)
        // Approach 1: Thread subclass (ParkingMonitor)
        ParkingMonitor monitorThread = new ParkingMonitor("BackgroundParkingMonitor", 10000);
        monitorThread.start(); // Demonstrates start() lifecycle transition
        logger.info("Background thread [ParkingMonitor] started successfully with priority {}.", monitorThread.getPriority());

        // Approach 2: Runnable task (ParkingSessionMonitor)
        ParkingSessionMonitor sessionMonitorTask = new ParkingSessionMonitor(30000);
        Thread sessionWorker = new Thread(sessionMonitorTask, "SessionAuditWorker");
        sessionWorker.setDaemon(true);
        sessionWorker.start();
        logger.info("Background thread [SessionAuditWorker] (Runnable) started successfully.");

        activityLogRepository.save(new ParkingActivityLog("SYSTEM_STARTUP",
                "Vehicle Parking Management System started. Backend threads and database online."));
    }
}
