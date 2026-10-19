# CSC2104: Object Oriented Programming in Java
## Vehicle Parking Management System — Academic Syllabus Mapping & Viva Guide

This comprehensive document maps every single theoretical and practical concept from the **CSC2104 Object Oriented Programming in Java** course syllabus directly to its implementation in this repository. Use this document as your primary study guide for viva examinations, project evaluations, and code walkthroughs.

---

## Quick Navigation Index

1. [Programming Fundamentals](#1-programming-fundamentals)
2. [Type Conversion & Casting](#2-type-conversion--casting)
3. [Wrapper Classes & Autoboxing](#3-wrapper-classes--autoboxing)
4. [Arrays (1D & Multidimensional)](#4-arrays-1d--multidimensional)
5. [Classes, Objects & Encapsulation](#5-classes-objects--encapsulation)
6. [Methods, Overloading & Constructor Chaining](#6-methods-overloading--constructor-chaining)
7. [Objects as Parameters & Return Types](#7-objects-as-parameters--return-types)
8. [Java Argument Passing Mechanism (Pass-by-Value)](#8-java-argument-passing-mechanism-pass-by-value)
9. [Recursion](#9-recursion)
10. [Access Modifiers & Encapsulation](#10-access-modifiers--encapsulation)
11. [The `final` Keyword](#11-the-final-keyword)
12. [Garbage Collection & Object Lifecycle](#12-garbage-collection--object-lifecycle)
13. [Nested & Inner Classes](#13-nested--inner-classes)
14. [Inheritance, Abstract Classes & Polymorphism](#14-inheritance-abstract-classes--polymorphism)
15. [Interfaces & Multiple Implementation](#15-interfaces--multiple-implementation)
16. [Exception Handling (Custom & Global)](#16-exception-handling-custom--global)
17. [Multithreading & Synchronization](#17-multithreading--synchronization)
18. [File I/O (Character & Byte Streams)](#18-file-io-character--byte-streams)
19. [Console I/O (Scanner & BufferedReader)](#19-console-io-scanner--bufferedreader)
20. [Frequently Asked Viva Questions & Model Answers](#20-frequently-asked-viva-questions--model-answers)

---

## 1. Programming Fundamentals

### Concepts Covered
- **Primitive Data Types**: `int` (floor, slot numbers), `long` (durations, primary keys), `double` (rates, fees, revenue), `boolean` (occupancy flags, volatile thread running flags), `char` (slot section prefixes).
- **Reference Types**: `String`, `LocalDateTime`, `Vehicle`, `ParkingSlot`, `ParkingSession`, `BigDecimal`.
- **Operators**: 
  - Arithmetic: `+`, `-`, `*`, `/`, `%` (used in hourly fee formulas, time differences).
  - Relational: `==`, `!=`, `<`, `>`, `<=`, `>=` (used in slot validation, capacity limits).
  - Logical: `&&`, `||`, `!` (used in multi-criteria searches and state checks).
  - Ternary Operator: `? :` (used in concise status badges, default floor selection).
- **Control Flow Statements**:
  - `if / else` & nested `if`: Validating vehicle existence, slot compatibility, and session states.
  - `switch` (modern & classic expressions): Vehicle type rate selection (`BIKE`, `CAR`, `TRUCK`) and payment method handling (`CASH`, `UPI`, `CARD`).
  - `for` loops: Standard indexed loops over multidimensional parking grid floors.
  - Enhanced `for-each` loops: Iterating over collections of active sessions and activity logs.
  - `while` loops: Polling background thread queues.
  - `do-while` loops: Reading console CLI menu selections until exit.
  - `break` & `continue`: Skipping occupied slots during grid scan and breaking when a suitable match is assigned.

### File References
- [Vehicle.java](file:///C:/Users/Asus/.gemini/antigravity/scratch/vehicle-parking-management/backend/src/main/java/com/parking/management/model/Vehicle.java) — Primitive fields, accessors, base rate constants.
- [ParkingLot.java](file:///C:/Users/Asus/.gemini/antigravity/scratch/vehicle-parking-management/backend/src/main/java/com/parking/management/model/ParkingLot.java#L65-L100) — Loops, break/continue, grid traversals.
- [ParkingService.java](file:///C:/Users/Asus/.gemini/antigravity/scratch/vehicle-parking-management/backend/src/main/java/com/parking/management/service/ParkingService.java#L80-L130) — Switch statements, nested if validations.
- [ConsoleParkingDemo.java](file:///C:/Users/Asus/.gemini/antigravity/scratch/vehicle-parking-management/backend/src/main/java/com/parking/management/demo/ConsoleParkingDemo.java#L40-L75) — `do-while` interactive CLI menu loop.

---

## 2. Type Conversion & Casting

### Concepts Covered
1. **Implicit Widening Conversion**:
   - `int` to `long`: Converting slot index count to duration calculation.
   - `long` to `double`: Multiplying duration hours (`long`) by hourly base rate (`double`).
2. **Explicit Narrowing Casting**:
   - Double fee rounding and percentage calculations: `int occupancyInt = (int) Math.round(occupancyPercentage)`.
3. **Reference Type Downcasting**:
   - Upcasting: Subclasses `Bike`, `Car`, `Truck` automatically treated as base reference `Vehicle`.
   - Downcasting with `instanceof` pattern matching:
     ```java
     if (vehicle instanceof Car car) {
         System.out.println("Car with trunk capacity: " + car.getNumberOfDoors());
     }
     ```

### File References
- [ParkingLot.java](file:///C:/Users/Asus/.gemini/antigravity/scratch/vehicle-parking-management/backend/src/main/java/com/parking/management/model/ParkingLot.java#L140-L155) — Floor occupancy percentage casting.
- [Bike.java](file:///C:/Users/Asus/.gemini/antigravity/scratch/vehicle-parking-management/backend/src/main/java/com/parking/management/model/Bike.java) & [Car.java](file:///C:/Users/Asus/.gemini/antigravity/scratch/vehicle-parking-management/backend/src/main/java/com/parking/management/model/Car.java) — Numeric conversions in fee calculations.

---

## 3. Wrapper Classes & Autoboxing

### Concepts Covered
- **Autoboxing**: Automatic conversion of primitive types (`int`, `double`, `long`, `boolean`) into their corresponding wrapper objects (`Integer`, `Double`, `Long`, `Boolean`) when stored in Java Collections (`List<Long>`, `Map<String, Double>`).
- **Unboxing**: Automatic extraction of primitive values from wrapper objects during arithmetic operations and calculations.
- **Utility Methods**: `Long.parseLong()`, `Double.parseDouble()`, `Integer.valueOf()`.

### File References
- [DashboardService.java](file:///C:/Users/Asus/.gemini/antigravity/scratch/vehicle-parking-management/backend/src/main/java/com/parking/management/service/DashboardService.java#L45-L90) — Autoboxing map metrics (`Map<String, Double>`, `Map<String, Long>`).
- [ReportService.java](file:///C:/Users/Asus/.gemini/antigravity/scratch/vehicle-parking-management/backend/src/main/java/com/parking/management/service/ReportService.java#L50-L70) — Wrapper objects in statistical calculations.

---

## 4. Arrays (1D & Multidimensional)

### Concepts Covered
1. **One-Dimensional Arrays**:
   - Fixed floor capacity arrays: `int[] floorCapacities = new int[floors];`
   - Vehicle type summaries and report breakdowns.
2. **Multidimensional Arrays (2D Matrix)**:
   - Physical parking layout represented as a 2D matrix: `ParkingSlot[][] parkingGrid;`
   - Rows represent floors (`floor - 1`), columns represent slot positions (`slotIndex`).
   - Allows $O(1)$ coordinate-based slot lookup and sequential matrix sweeps.

### File References
- [ParkingLot.java](file:///C:/Users/Asus/.gemini/antigravity/scratch/vehicle-parking-management/backend/src/main/java/com/parking/management/model/ParkingLot.java#L25-L55) — `private final ParkingSlot[][] parkingGrid;` definition and matrix initialization.

---

## 5. Classes, Objects & Encapsulation

### Concepts Covered
- **Encapsulation**: All fields marked `private` or `protected`. Public accessor (`get...`) and mutator (`set...`) methods enforce state integrity.
- **State Validation**: Mutators reject invalid values (e.g., negative duration, null license plates, empty owner names).
- **Real-World Domain Objects**:
  - `Vehicle`, `TwoWheeler`, `FourWheeler`, `Bike`, `Car`, `Truck`
  - `ParkingSlot`, `ParkingLot`, `ParkingSession`, `Payment`
  - `ParkingTicket`, `ParkingReceipt`, `ParkingActivityLog`

### File References
- [ParkingSlot.java](file:///C:/Users/Asus/.gemini/antigravity/scratch/vehicle-parking-management/backend/src/main/java/com/parking/management/model/ParkingSlot.java) — Encapsulated slot state (`occupy()`, `vacate()`, validation).
- [ParkingSession.java](file:///C:/Users/Asus/.gemini/antigravity/scratch/vehicle-parking-management/backend/src/main/java/com/parking/management/model/ParkingSession.java) — Life-cycle transitions (`complete()`).

---

## 6. Methods, Overloading & Constructor Chaining

### Concepts Covered
1. **Method Overloading (Compile-Time / Static Polymorphism)**:
   - Multiple methods with identical names but differing parameter lists (types, number of arguments).
   - In `Vehicle.java`:
     - `calculateParkingFee(long hours)` — standard duration fee.
     - `calculateParkingFee(long hours, double discountPercentage)` — fee with promotional discount.
   - In `VehicleService.java`:
     - `searchVehicle(String vehicleNumber)`
     - `searchVehicle(String vehicleNumber, String ownerName)`
   - In `ParkingLot.java`:
     - `findAvailableSlot(VehicleType type)`
     - `findAvailableSlot(VehicleType type, int preferredFloor)`
2. **Constructors & Constructor Chaining**:
   - Default no-argument constructors for JPA entity deserialization.
   - Parameterized constructors initializing domain state.
   - Chaining via `this(...)` to delegate to comprehensive constructors.
   - Invoking superclass constructors via `super(...)`.

### File References
- [Vehicle.java](file:///C:/Users/Asus/.gemini/antigravity/scratch/vehicle-parking-management/backend/src/main/java/com/parking/management/model/Vehicle.java#L45-L75) — Overloaded `calculateParkingFee(...)`.
- [TwoWheeler.java](file:///C:/Users/Asus/.gemini/antigravity/scratch/vehicle-parking-management/backend/src/main/java/com/parking/management/model/TwoWheeler.java) & [FourWheeler.java](file:///C:/Users/Asus/.gemini/antigravity/scratch/vehicle-parking-management/backend/src/main/java/com/parking/management/model/FourWheeler.java) — `super(...)` constructor calls.

---

## 7. Objects as Parameters & Return Types

### Concepts Covered
- **Objects as Parameters**: Demonstrating high cohesion and clean architecture. Methods receive domain entities instead of long lists of primitive variables.
  - `assignSlot(Vehicle vehicle, ParkingSlot slot)`
  - `processPayment(ParkingSession session, PaymentMethod method)`
  - `generateReceipt(ParkingSession session)`
- **Returning Objects**: Factory methods, lookup queries, and builders instantiate and return complex objects.
  - `ParkingSlot findAvailableSlot(...)`
  - `ParkingTicket createTicket(...)`
  - `ParkingReceipt generateReceipt(...)`

### File References
- [ParkingService.java](file:///C:/Users/Asus/.gemini/antigravity/scratch/vehicle-parking-management/backend/src/main/java/com/parking/management/service/ParkingService.java#L80-L160) — Receives and returns domain entity objects.
- [ParkingLot.java](file:///C:/Users/Asus/.gemini/antigravity/scratch/vehicle-parking-management/backend/src/main/java/com/parking/management/model/ParkingLot.java#L85-L110) — Returns `ParkingSlot` objects.

---

## 8. Java Argument Passing Mechanism (Pass-by-Value)

### Fundamental Rule
> **Java is strictly PASS-BY-VALUE for everything.**

1. **Primitive Types**: The actual binary value (copy of data) is passed. Modifications made inside the method do NOT affect the caller's variable.
2. **Object References**: The **copy of the reference address** is passed by value.
   - If the method modifies fields of the object pointed to by the reference (`slot.occupy()`), the change **IS visible** to the caller because both references point to the same memory location on the heap.
   - If the method reassigns the reference parameter (`slot = new ParkingSlot(...)`), it only changes the local copy of the pointer. The caller's original reference continues pointing to the original object.

### Implementation & Live Viva Demo
- [ArgumentPassingDemo.java](file:///C:/Users/Asus/.gemini/antigravity/scratch/vehicle-parking-management/backend/src/main/java/com/parking/management/demo/ArgumentPassingDemo.java)
- Exposed live via endpoint: `GET /api/demo/argument-passing` and the frontend Viva Demos page.

---

## 9. Recursion

### Concepts Covered
- A recursive method calls itself to solve smaller subproblems until a **base case** is reached.
- **Recursive Grid Traversal**:
  - `findAvailableSlotRecursively(int floor, int slotIndex, VehicleType requiredType)`
  - **Base Case 1**: `floor >= totalFloors` (all floors exhausted -> return `null` or throw `ParkingLotFullException`).
  - **Base Case 2**: Current slot is available and type-compatible -> return current slot.
  - **Recursive Step**:
    - If `slotIndex + 1 < slotsPerFloor` -> recurse to `(floor, slotIndex + 1)`.
    - Else -> recurse to next floor `(floor + 1, 0)`.

### Implementation & Live Viva Demo
- [ParkingLot.java](file:///C:/Users/Asus/.gemini/antigravity/scratch/vehicle-parking-management/backend/src/main/java/com/parking/management/model/ParkingLot.java#L115-L135) — Recursive slot search implementation.
- [RecursionDemo.java](file:///C:/Users/Asus/.gemini/antigravity/scratch/vehicle-parking-management/backend/src/main/java/com/parking/management/demo/RecursionDemo.java) — Standalone recursion demonstration.
- Exposed live via endpoint: `GET /api/demo/recursion`.

---

## 10. Access Modifiers & Encapsulation

| Modifier | Class | Package | Subclass | World | Implementation in VPMS |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **`public`** | Yes | Yes | Yes | Yes | Controller endpoints, public service APIs, interface methods |
| **`protected`** | Yes | Yes | Yes | No | Base rate fields in `Vehicle`, accessible by `Bike`, `Car`, `Truck` |
| **`default` (package-private)** | Yes | Yes | No | No | Internal helper methods in `model` and `service` |
| **`private`** | Yes | No | No | No | Entity state variables (`vehicleNumber`, `password`, `parkingGrid`) |

---

## 11. The `final` Keyword

### Concepts Covered
1. **`final` Variables / Constants**:
   - Constant rates that cannot be reassigned:
     ```java
     public static final double BIKE_HOURLY_RATE = 15.0;
     public static final double CAR_HOURLY_RATE = 30.0;
     public static final double TRUCK_HOURLY_RATE = 60.0;
     ```
2. **`final` Methods**:
   - Prevent subclasses from overriding critical security or formatting logic:
     ```java
     public final String getFormattedTicket();
     ```
3. **`final` Classes**:
   - Prevent subclassing to guarantee immutability or integrity:
     ```java
     public final class ParkingTicket { ... }
     public final class ParkingReceipt { ... }
     ```

### File References
- [Vehicle.java](file:///C:/Users/Asus/.gemini/antigravity/scratch/vehicle-parking-management/backend/src/main/java/com/parking/management/model/Vehicle.java#L15-L25) — `static final` base rates.
- [ParkingTicket.java](file:///C:/Users/Asus/.gemini/antigravity/scratch/vehicle-parking-management/backend/src/main/java/com/parking/management/model/ParkingTicket.java) — `final class` definition.
- [ParkingReceipt.java](file:///C:/Users/Asus/.gemini/antigravity/scratch/vehicle-parking-management/backend/src/main/java/com/parking/management/model/ParkingReceipt.java) — `final class` definition.

---

## 12. Garbage Collection & Object Lifecycle

### Concepts Covered
- **Object Lifecycle**: Creation via `new` -> Reachable & Active -> Unreachable / Eligible for GC -> Reclaimed by JVM Garbage Collector.
- **Eligibility Conditions**:
  1. Nullifying all reference variables (`ref = null;`).
  2. Reassigning reference to another object (`ref = new Other();`).
  3. Reference going out of scope (e.g., local method variables when method terminates).
- **`System.gc()`**: A request / suggestion to the JVM execution engine, **not an immediate guarantee**.
- Clean resources: Replaces deprecated `finalize()` with modern `AutoCloseable` / `try-with-resources`.

### Implementation & Live Viva Demo
- [GarbageCollectionDemo.java](file:///C:/Users/Asus/.gemini/antigravity/scratch/vehicle-parking-management/backend/src/main/java/com/parking/management/demo/GarbageCollectionDemo.java)
- Exposed live via endpoint: `GET /api/demo/gc`.

---

## 13. Nested & Inner Classes

### Concepts Covered
1. **Static Nested Class (`ParkingLot.ParkingStatistics`)**:
   - Associated with the outer class `ParkingLot`, but does NOT hold an implicit reference to an instance of `ParkingLot`.
   - Can be instantiated without an outer class instance: `new ParkingLot.ParkingStatistics(...)`.
   - Used to encapsulate aggregated parking metrics.
2. **Non-Static Inner Class (`ParkingLot.SlotManager`)**:
   - Bound directly to an enclosing instance of `ParkingLot`.
   - Has direct access to outer class instance fields (including `parkingGrid` and `totalFloors`).
   - Handles localized slot filtering, grid inspection, and status toggles.

### Implementation & Live Viva Demo
- [ParkingLot.java](file:///C:/Users/Asus/.gemini/antigravity/scratch/vehicle-parking-management/backend/src/main/java/com/parking/management/model/ParkingLot.java#L160-L240) — Both classes implemented.
- [NestedClassDemo.java](file:///C:/Users/Asus/.gemini/antigravity/scratch/vehicle-parking-management/backend/src/main/java/com/parking/management/demo/NestedClassDemo.java) — Standalone comparison and demonstration.
- Exposed live via endpoint: `GET /api/demo/nested-classes`.

---

## 14. Inheritance, Abstract Classes & Polymorphism

### Class Hierarchy
```
               ┌───────────────────────┐
               │    <<abstract>>       │
               │       Vehicle         │
               └───────────┬───────────┘
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
┌─────────────────────────┐ ┌─────────────────────────┐
│      <<abstract>>       │ │      <<abstract>>       │
│       TwoWheeler        │ │       FourWheeler       │
└────────────┬────────────┘ └────────────┬────────────┘
             │                           │
             ▼                 ┌─────────┴─────────┐
    ┌─────────────────┐        ▼                   ▼
    │      Bike       │ ┌──────────────┐   ┌──────────────┐
    │                 │ │     Car      │   │    Truck     │
    └─────────────────┘ └──────────────┘   └──────────────┘
```

### Concepts Covered
- **Abstract Class**: `Vehicle` defines common properties (`vehicleNumber`, `ownerName`, `entryTime`) and forces subclasses to implement:
  - `abstract double calculateParkingFee(long durationHours);`
  - `abstract String getVehicleType();`
- **Inheritance**: Subclasses inherit base state, accessors, and constructors (`super(...)`).
- **Runtime Polymorphism (Dynamic Method Dispatch)**:
  - When calculating fees during checkout:
    ```java
    Vehicle vehicle = session.getVehicle();
    // At runtime, the JVM inspects the actual object type (Bike, Car, or Truck)
    // and invokes the corresponding overridden calculateParkingFee implementation!
    double fee = vehicle.calculateParkingFee(durationHours);
    ```
  - `Bike`: Flat ₹15/hr.
  - `Car`: ₹30/hr for first 2 hours, ₹25/hr thereafter.
  - `Truck`: Flat ₹60/hr + ₹50 loading surcharge.
- **Overriding Standard Methods**:
  - All vehicle entities override `toString()`, `equals()`, and `hashCode()` based on unique `vehicleNumber`.

### File References
- [Vehicle.java](file:///C:/Users/Asus/.gemini/antigravity/scratch/vehicle-parking-management/backend/src/main/java/com/parking/management/model/Vehicle.java)
- [TwoWheeler.java](file:///C:/Users/Asus/.gemini/antigravity/scratch/vehicle-parking-management/backend/src/main/java/com/parking/management/model/TwoWheeler.java)
- [FourWheeler.java](file:///C:/Users/Asus/.gemini/antigravity/scratch/vehicle-parking-management/backend/src/main/java/com/parking/management/model/FourWheeler.java)
- [Bike.java](file:///C:/Users/Asus/.gemini/antigravity/scratch/vehicle-parking-management/backend/src/main/java/com/parking/management/model/Bike.java)
- [Car.java](file:///C:/Users/Asus/.gemini/antigravity/scratch/vehicle-parking-management/backend/src/main/java/com/parking/management/model/Car.java)
- [Truck.java](file:///C:/Users/Asus/.gemini/antigravity/scratch/vehicle-parking-management/backend/src/main/java/com/parking/management/model/Truck.java)

---

## 15. Interfaces & Multiple Implementation

### Concepts Covered
1. **`interface ParkingFeeCalculator`**:
   - Defines calculation contract: `double calculateFee(long durationHours);`.
   - Includes `default` method `double calculateDiscountedFee(long durationHours, double discountPercentage)` demonstrating Java 8+ interface default methods.
2. **`interface PrintableReceipt`**:
   - Defines receipt rendering contract: `String generateReceiptText();`.
3. **Multiple Interface Implementation**:
   - `ParkingReceipt` implements both `PrintableReceipt` and `Serializable`.

### File References
- [ParkingFeeCalculator.java](file:///C:/Users/Asus/.gemini/antigravity/scratch/vehicle-parking-management/backend/src/main/java/com/parking/management/interfaces/ParkingFeeCalculator.java)
- [PrintableReceipt.java](file:///C:/Users/Asus/.gemini/antigravity/scratch/vehicle-parking-management/backend/src/main/java/com/parking/management/interfaces/PrintableReceipt.java)

---

## 16. Exception Handling (Custom & Global)

### Concepts Covered
- **Checked vs Unchecked Exceptions**:
  - Checked (subclasses of `Exception`): Force compile-time handling (`try-catch` or `throws`).
  - Unchecked (subclasses of `RuntimeException`): Represent programming bugs or logical rule violations.
- **Custom Application Exceptions**:
  1. `ParkingLotFullException` (Checked, extends `Exception`): Thrown when no slot is available.
  2. `SlotUnavailableException` (Unchecked, extends `RuntimeException`): Thrown when slot is already occupied or under maintenance.
  3. `VehicleAlreadyParkedException` (Unchecked, extends `RuntimeException`): Thrown on duplicate active check-ins.
  4. `VehicleNotFoundException` (Unchecked, extends `RuntimeException`): Thrown on checkout of unknown vehicle.
  5. `InvalidVehicleException` (Unchecked, extends `RuntimeException`): Thrown on invalid license plates.
- **Exception Mechanics**: `try`, `catch`, `finally`, `throw`, and `throws`.
- **Centralized Spring Exception Handler**:
  - `GlobalExceptionHandler` with `@RestControllerAdvice` intercepts all exceptions and returns standard JSON error responses (`ErrorResponse`).

### File References
- Custom exceptions in package: `com.parking.management.exception.*`
- [GlobalExceptionHandler.java](file:///C:/Users/Asus/.gemini/antigravity/scratch/vehicle-parking-management/backend/src/main/java/com/parking/management/exception/GlobalExceptionHandler.java)

---

## 17. Multithreading & Synchronization

### Concepts Covered
1. **Thread Creation**:
   - **Method 1: Extending `Thread`**: `class ParkingMonitor extends Thread`.
   - **Method 2: Implementing `Runnable`**: `class ReportGenerator implements Runnable` & `class ParkingSessionMonitor implements Runnable`.
2. **Thread Lifecycle**:
   - `NEW` -> `RUNNABLE` -> `TIMED_WAITING` (`sleep`) -> `WAITING` (`wait`) -> `TERMINATED`.
3. **Thread Priority**:
   - Set using `setPriority(Thread.MIN_PRIORITY)` to `setPriority(Thread.MAX_PRIORITY)`. (Demonstrated with Priority 4 for background monitoring).
4. **Thread Coordination with `join()`**:
   - Main thread waits for report generation thread to complete using `thread.join()`.
5. **Thread Synchronization**:
   - Slot assignment is a critical section susceptible to race conditions.
   - Protected using `synchronized` methods/blocks in `ParkingLot.java`:
     ```java
     public synchronized ParkingSlot assignSlotSynchronized(Vehicle vehicle, VehicleType type) { ... }
     ```
6. **Inter-Thread Communication (`wait()`, `notify()`, `notifyAll()`)**:
   - `ParkingRequestQueue` implements producer-consumer pattern.
   - Incoming vehicle threads `wait()` when parking lot is full.
   - Checkout thread calls `notify()` / `notifyAll()` when a slot is vacated to wake up waiting vehicles.
7. **Thread Safety & Volatile Flags**:
   - Safe loop termination using `private volatile boolean running = true;` without deprecated `stop()`.

### File References
- [ParkingMonitor.java](file:///C:/Users/Asus/.gemini/antigravity/scratch/vehicle-parking-management/backend/src/main/java/com/parking/management/threads/ParkingMonitor.java)
- [ReportGenerator.java](file:///C:/Users/Asus/.gemini/antigravity/scratch/vehicle-parking-management/backend/src/main/java/com/parking/management/threads/ReportGenerator.java)
- [ParkingRequestQueue.java](file:///C:/Users/Asus/.gemini/antigravity/scratch/vehicle-parking-management/backend/src/main/java/com/parking/management/threads/ParkingRequestQueue.java)
- [ThreadDemo.java](file:///C:/Users/Asus/.gemini/antigravity/scratch/vehicle-parking-management/backend/src/main/java/com/parking/management/demo/ThreadDemo.java)
- Exposed live via endpoint: `GET /api/demo/threads`.

---

## 18. File I/O (Character & Byte Streams)

### Concepts Covered
1. **Character Streams (Text Processing)**:
   - `FileWriter`: Writes human-readable audit reports (`exports/parking_report.txt`, `exports/parking_history.txt`).
   - `FileReader` & `BufferedReader`: Reads report files line by line using `readLine()` in a `try-with-resources` block.
2. **Byte Streams (Binary Processing)**:
   - `FileOutputStream`: Writes binary state backups (`exports/parking_backup.dat`).
   - `FileInputStream`: Reads raw binary bytes for data restoration and backup verification.
3. **Automatic Resource Management**:
   - Standard `try-with-resources` statements ensuring file handles are closed even if exceptions occur.

### File References
- [ParkingReportWriter.java](file:///C:/Users/Asus/.gemini/antigravity/scratch/vehicle-parking-management/backend/src/main/java/com/parking/management/io/ParkingReportWriter.java) — Character streams.
- [ParkingBackupManager.java](file:///C:/Users/Asus/.gemini/antigravity/scratch/vehicle-parking-management/backend/src/main/java/com/parking/management/io/ParkingBackupManager.java) — Byte streams.
- Triggered live via frontend Reports page "Export Report" and "Export Backup" buttons.

---

## 19. Console I/O (Scanner & BufferedReader)

### Concepts Covered
- Standard input/output streams: `System.in`, `System.out`, `System.err`.
- `java.util.Scanner`: Token-based console input (`nextInt()`, `nextLine()`).
- `java.io.BufferedReader` with `InputStreamReader`: Buffered character input for high-performance reading.
- Console CLI interactive menu demonstrating pure Java terminal interaction.

### File Reference
- [ConsoleParkingDemo.java](file:///C:/Users/Asus/.gemini/antigravity/scratch/vehicle-parking-management/backend/src/main/java/com/parking/management/demo/ConsoleParkingDemo.java) — Executable console application.

---

## 20. Frequently Asked Viva Questions & Model Answers

### Q1: Why is Java strictly "Pass-by-Value" and never "Pass-by-Reference"?
> **Model Answer**: In Java, arguments are always evaluated and their value is copied into parameter variables. For primitive types, the actual data is copied. For objects, the **memory address reference itself is copied by value**. The caller and callee have two distinct pointers pointing to the same object on the heap. Therefore, changing an object's internal fields affects the object, but reassigning the parameter pointer itself does not affect the caller's reference.

### Q2: What is the difference between Method Overloading and Method Overriding in your project?
> **Model Answer**:
> - **Method Overloading** (Compile-time polymorphism) occurs in the same class when methods share the same name but have different parameter signatures (e.g., `calculateParkingFee(long hours)` vs `calculateParkingFee(long hours, double discount)` in `Vehicle.java`). The compiler decides which method to call based on argument types.
> - **Method Overriding** (Runtime polymorphism) occurs across an inheritance hierarchy where a subclass provides a specific implementation of a method declared in its superclass (e.g., `Bike`, `Car`, and `Truck` each override `calculateParkingFee(long durationHours)`). The JVM determines which method to execute at runtime based on the actual object instance on the heap.

### Q3: Why did you declare `Vehicle` as an abstract class instead of an interface or regular class?
> **Model Answer**: An abstract class was chosen because vehicles share both **common state** (`vehicleNumber`, `ownerName`, `entryTime`) and **concrete behavior** (getters, setters, formatters), while still requiring **abstract behavior** (`calculateParkingFee` and `getVehicleType`) that only concrete vehicle types can define. An interface cannot hold mutable instance state, and a regular concrete class would allow instantiating a generic, meaningless "Vehicle" without specific rate rules.

### Q4: How do you prevent race conditions when two vehicles attempt to park in the same slot simultaneously?
> **Model Answer**: In `ParkingLot.java`, the slot assignment method `assignSlotSynchronized` is marked with the `synchronized` keyword. This uses the intrinsic monitor lock of the `ParkingLot` instance, ensuring that only one thread can inspect and assign a free slot at any given millisecond. Furthermore, database transactions use JPA pessimistic/optimistic updates.

### Q5: How do `wait()` and `notify()` work in your parking system?
> **Model Answer**: They are implemented in `ParkingRequestQueue.java` for inter-thread communication. When the parking lot is completely full, incoming vehicle processing threads invoke `wait()`, releasing their monitor lock and entering the waiting state. When another vehicle checks out and vacates a slot, the checkout process invokes `notifyAll()`, waking up the waiting threads to re-evaluate slot availability.

### Q6: What is the difference between a static nested class and an inner class in your project?
> **Model Answer**: In `ParkingLot.java`:
> - `ParkingLot.ParkingStatistics` is a **static nested class**. It does not hold an implicit reference to an outer `ParkingLot` object and can exist independently to convey metrics.
> - `ParkingLot.SlotManager` is a **non-static inner class**. It is bound to an enclosing instance of `ParkingLot` and can directly access outer private members like `parkingGrid` without needing getters.
