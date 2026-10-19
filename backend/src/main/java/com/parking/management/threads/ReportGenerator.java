package com.parking.management.threads;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Asynchronous report generation task implementing java.lang.Runnable.
 *
 * Demonstrates the following CSC2104 OOP Syllabus Concepts:
 * 1. Multithreading by implementing java.lang.Runnable (Approach 2)
 * 2. Thread.join() (Caller thread waits for completion of this worker)
 * 3. Separation of task definition (Runnable) from thread execution (Thread)
 */
public class ReportGenerator implements Runnable {

    private static final Logger logger = LoggerFactory.getLogger(ReportGenerator.class);

    private final String reportType;
    private volatile boolean completed = false;
    private String generatedSummary;

    public ReportGenerator(String reportType) {
        this.reportType = reportType;
    }

    @Override
    public void run() {
        String threadName = Thread.currentThread().getName();
        logger.info("[Runnable: {}] Starting background report compilation for type: {}", threadName, reportType);

        try {
            // Simulate complex report compilation processing
            Thread.sleep(600);

            this.generatedSummary = String.format("Report [%s] compiled successfully at %s by thread %s.",
                    reportType, java.time.LocalDateTime.now(), threadName);

            this.completed = true;
            logger.info("[Runnable: {}] Report compilation finished.", threadName);

        } catch (InterruptedException e) {
            logger.warn("[Runnable: {}] Report generation interrupted: {}", threadName, e.getMessage());
            Thread.currentThread().interrupt();
        }
    }

    public boolean isCompleted() {
        return completed;
    }

    public String getGeneratedSummary() {
        return generatedSummary;
    }

    /**
     * Helper method demonstrating Thread.start() and Thread.join().
     * Spawns a dedicated thread for this runnable and joins it.
     */
    public static ReportGenerator runAndJoin(String reportType) throws InterruptedException {
        ReportGenerator task = new ReportGenerator(reportType);
        Thread workerThread = new Thread(task, "ReportWorker-" + System.currentTimeMillis() % 1000);
        workerThread.start();
        workerThread.join(); // Demonstrates join(): Caller waits until workerThread finishes!
        return task;
    }
}
