-- 1. Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE
);

-- 2. Buses Table
CREATE TABLE buses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    busNumber VARCHAR(255) NOT NULL,
    totalSeats INT NOT NULL,
    availableSeats INT NOT NULL
);

-- 3. Bookings Table
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    busId INT,
    seatNumber INT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (busId) REFERENCES buses(id) ON DELETE CASCADE
);

-- 4. Payments Table
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bookingId INT,
    amountPaid DECIMAL(10, 2) NOT NULL,
    paymentStatus VARCHAR(255) NOT NULL,
    FOREIGN KEY (bookingId) REFERENCES bookings(id) ON DELETE CASCADE
);