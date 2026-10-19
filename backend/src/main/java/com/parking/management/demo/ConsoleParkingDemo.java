package com.parking.management.demo;

import com.parking.management.model.*;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

/**
 * Educational Console Application for CSC2104: Console I/O.
 *
 * Demonstrates:
 * 1. Standard Input reading using java.util.Scanner
 * 2. Character-stream buffered console reading using java.io.BufferedReader and InputStreamReader
 * 3. Menu-driven CLI loop with switch statement, while loop, and break/continue
 * 4. Runtime polymorphism and fee calculation on the command line
 *
 * Independently runnable via `java ConsoleParkingDemo` or `mvn exec:java`.
 */
public class ConsoleParkingDemo {

    private static final Map<String, Vehicle> activeParked = new HashMap<>();

    public static void main(String[] args) {
        // Demonstrating BufferedReader with InputStreamReader
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
        // Demonstrating Scanner
        Scanner scanner = new Scanner(System.in);

        System.out.println("==========================================================");
        System.out.println("  VEHICLE PARKING MANAGEMENT SYSTEM - CONSOLE INTERFACE   ");
        System.out.println("            CSC2104 Object Oriented Programming           ");
        System.out.println("==========================================================");

        boolean exit = false;

        while (!exit) {
            System.out.println("\n--- MAIN MENU ---");
            System.out.println("1. Park Vehicle (Using Scanner)");
            System.out.println("2. Checkout Vehicle & Calculate Fee (Using BufferedReader)");
            System.out.println("3. Display Currently Parked Vehicles");
            System.out.println("4. Exit Console Demo");
            System.out.print("Enter choice (1-4): ");

            String choiceStr = scanner.hasNextLine() ? scanner.nextLine().trim() : "4";

            switch (choiceStr) {
                case "1":
                    handleParkVehicleScanner(scanner);
                    break;
                case "2":
                    handleCheckoutBufferedReader(reader);
                    break;
                case "3":
                    displayParked();
                    break;
                case "4":
                    System.out.println("Exiting Console Demo. Thank you!");
                    exit = true;
                    break;
                default:
                    System.out.println("Invalid selection. Please choose options 1 to 4.");
                    break;
            }
        }
    }

    /**
     * Demonstrates input gathering using java.util.Scanner.
     */
    private static void handleParkVehicleScanner(Scanner sc) {
        System.out.println("\n--- [CONSOLE I/O: SCANNER] PARK VEHICLE ---");
        System.out.print("Enter Vehicle Registration Number (e.g. KA-01-AB-1234): ");
        String vehicleNumber = sc.nextLine().trim().toUpperCase();

        if (vehicleNumber.isEmpty()) {
            System.out.println("Error: Vehicle number cannot be blank.");
            return;
        }

        if (activeParked.containsKey(vehicleNumber)) {
            System.out.println("Error: Vehicle " + vehicleNumber + " is ALREADY marked as parked!");
            return;
        }

        System.out.print("Enter Vehicle Type (1: BIKE, 2: CAR, 3: TRUCK): ");
        String typeChoice = sc.nextLine().trim();

        System.out.print("Enter Owner Full Name: ");
        String ownerName = sc.nextLine().trim();

        System.out.print("Enter Contact Phone Number: ");
        String phone = sc.nextLine().trim();

        // Demonstrating Polymorphic instantiation (Base Vehicle ref pointing to subclass)
        Vehicle vehicle;
        switch (typeChoice) {
            case "1":
                vehicle = new Bike(vehicleNumber, ownerName, phone);
                break;
            case "3":
                vehicle = new Truck(vehicleNumber, ownerName, phone);
                break;
            case "2":
            default:
                vehicle = new Car(vehicleNumber, ownerName, phone);
                break;
        }

        activeParked.put(vehicleNumber, vehicle);

        System.out.println("\n>>> SUCCESS: Vehicle Parked Successfully! <<<");
        System.out.println("Vehicle Type   : " + vehicle.getVehicleType());
        System.out.println("Vehicle Number : " + vehicle.getVehicleNumber());
        System.out.println("Owner Name     : " + vehicle.getOwnerName());
        System.out.println("Assigned Slot  : SLOT-" + (activeParked.size()));
        System.out.println("Polymorphic Details: " + vehicle.displayDetails());
    }

    /**
     * Demonstrates input gathering using java.io.BufferedReader.
     */
    private static void handleCheckoutBufferedReader(BufferedReader br) {
        System.out.println("\n--- [CONSOLE I/O: BUFFEREDREADER] CHECKOUT VEHICLE ---");
        try {
            System.out.print("Enter Vehicle Number to Checkout: ");
            String vehicleNumber = br.readLine().trim().toUpperCase();

            Vehicle vehicle = activeParked.get(vehicleNumber);
            if (vehicle == null) {
                System.out.println("Error: Vehicle " + vehicleNumber + " not found in active parking.");
                return;
            }

            System.out.print("Enter Total Duration Parked (in Hours): ");
            String durationStr = br.readLine().trim();
            long hours = Long.parseLong(durationStr);

            // RUNTIME POLYMORPHISM: vehicle.calculateParkingFee resolves dynamically to Bike/Car/Truck!
            double fee = vehicle.calculateParkingFee(hours);

            System.out.println("\n>>> CHECKOUT SUMMARY & FEE CALCULATION <<<");
            System.out.println("Vehicle Number : " + vehicle.getVehicleNumber());
            System.out.println("Vehicle Type   : " + vehicle.getVehicleType());
            System.out.println("Duration Hours : " + hours + " hr(s)");
            System.out.println("Calculated Fee : ₹" + String.format("%.2f", fee));
            System.out.println("(Fee calculated via polymorphism: " + vehicle.getClass().getSimpleName() + ".calculateParkingFee)");

            activeParked.remove(vehicleNumber);
            System.out.println("Vehicle checked out and slot freed successfully!");

        } catch (NumberFormatException e) {
            System.out.println("Error: Duration must be a valid integer number.");
        } catch (Exception e) {
            System.out.println("Error reading console input: " + e.getMessage());
        }
    }

    private static void displayParked() {
        System.out.println("\n--- CURRENTLY PARKED VEHICLES (" + activeParked.size() + ") ---");
        if (activeParked.isEmpty()) {
            System.out.println("No vehicles currently parked.");
            return;
        }
        int i = 1;
        for (Vehicle v : activeParked.values()) {
            System.out.println(i++ + ". " + v.displayDetails());
        }
    }
}
