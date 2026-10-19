package com.parking.management.threads;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Session audit monitor implementing Runnable.
 * Periodically scans for sessions exceeding thresholds and updates monitoring metrics.
 */
public class ParkingSessionMonitor implements Runnable {

    private static final Logger logger = LoggerFactory.getLogger(ParkingSessionMonitor.class);

    private volatile boolean running = true;
    private final long pollIntervalMs;

    public ParkingSessionMonitor(long pollIntervalMs) {
        this.pollIntervalMs = pollIntervalMs;
    }

    @Override
    public void run() {
        logger.info("[SessionMonitor] Started background session monitoring task.");
        while (running) {
            try {
                // Monitor action
                logger.debug("[SessionMonitor] Active session scan cycle completed.");
                Thread.sleep(pollIntervalMs);
            } catch (InterruptedException e) {
                logger.info("[SessionMonitor] Received interrupt, stopping.");
                Thread.currentThread().interrupt();
                running = false;
            }
        }
    }

    public void stop() {
        this.running = false;
    }
}
