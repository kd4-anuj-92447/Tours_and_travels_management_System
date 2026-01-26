/* =========================================================
   DATABASE
   ========================================================= */
DROP DATABASE IF EXISTS tours_travels;
CREATE DATABASE tours_travels;
USE tours_travels;

/* =========================================================
   ROLES
   ========================================================= */
CREATE TABLE roles (
    role_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO roles (role_name) VALUES
('ADMIN'),
('AGENT'),
('CUSTOMER');

/* =========================================================
   USERS
   ========================================================= */
CREATE TABLE users (
    user_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role_id BIGINT NOT NULL,
    phone VARCHAR(255),
    address VARCHAR(255),
    profile_pic_url VARCHAR(255),
    CONSTRAINT fk_user_role
        FOREIGN KEY (role_id)
        REFERENCES roles(role_id)
);

/* =========================================================
   TRAVEL PACKAGES
   ========================================================= */
CREATE TABLE travel_packages (
    package_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    status ENUM(
        'PENDING',
        'APPROVED',
        'REJECTED',
        'PENDING_DELETE'
    ) NOT NULL DEFAULT 'PENDING',
    agent_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_package_agent
        FOREIGN KEY (agent_id)
        REFERENCES users(user_id)
);

/* =========================================================
   PACKAGE IMAGES (simple persistence)
   ========================================================= */
CREATE TABLE package_images (
    image_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    image_url VARCHAR(500) NOT NULL,
    package_id BIGINT NOT NULL,
    CONSTRAINT fk_image_package
        FOREIGN KEY (package_id)
        REFERENCES travel_packages(package_id)
        ON DELETE CASCADE
);

/* =========================================================
   BOOKINGS
   ========================================================= */
CREATE TABLE bookings (
    booking_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    package_id BIGINT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status ENUM(
        'PENDING',
        'AGENT_APPROVED',
        'AGENT_REJECTED',
        'CONFIRMED',
        'CANCELLED',
        'CANCELLED_BY_CUSTOMER'
    ) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_booking_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id),
    CONSTRAINT fk_booking_package
        FOREIGN KEY (package_id)
        REFERENCES travel_packages(package_id)
);

/* =========================================================
   PAYMENTS
   ========================================================= */
CREATE TABLE payments (
    payment_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_id BIGINT UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_mode VARCHAR(50),
    status ENUM(
        'INITIATED',
        'SUCCESS',
        'FAILED',
        'REFUNDED'
    ) NOT NULL DEFAULT 'INITIATED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payment_booking
        FOREIGN KEY (booking_id)
        REFERENCES bookings(booking_id)
);

