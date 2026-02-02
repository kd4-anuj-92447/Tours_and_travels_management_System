/* ===============================
   DROP & CREATE DATABASE
================================ */
DROP DATABASE IF EXISTS tours_travels;
CREATE DATABASE tours_travels;
USE tours_travels;

/* ===============================
   ROLES TABLE
================================ */
CREATE TABLE roles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(30) NOT NULL UNIQUE
);

INSERT INTO roles (role_name) VALUES
('ADMIN'),
('AGENT'),
('CUSTOMER');

/* ===============================
   USERS TABLE
================================ */
CREATE TABLE users (
    user_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    address VARCHAR(255),
    profile_pic_url VARCHAR(500),

    -- Agent specific
    company_name VARCHAR(150),
    license_number VARCHAR(100),
    is_approved BOOLEAN DEFAULT FALSE,
    approval_date DATE,
    approved_by VARCHAR(100),

    role_id BIGINT NOT NULL,
    CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES roles(id)
);

/* ===============================
   ADMIN INSERTION
================================ */
INSERT INTO users (
    name,
    email,
    password,
    phone,
    address,
    profile_pic_url,
    is_approved,
    role_id
) VALUES (
    'Admin',
    'admin@tourstravels.com',
    '$2a$10$leQeDzAR4b9bMJ0A1MQ7bukiQFQmiHO5cDuThoeDd/mGax1cUPOvu',
    '7378051911',
    'Tours & Travels HeadQuarters, Pune',
    NULL,
    TRUE,
    (SELECT id FROM roles WHERE role_name = 'ADMIN')
);

/* ===============================
   TRAVEL PACKAGES TABLE
================================ */
CREATE TABLE travel_packages (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    destination VARCHAR(100),
    duration VARCHAR(50),
    price DECIMAL(10,2) NOT NULL,

    status VARCHAR(30) NOT NULL, -- PENDING / APPROVED / REJECTED
    agent_id BIGINT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_package_agent FOREIGN KEY (agent_id)
        REFERENCES users(user_id)
);

/* ===============================
   PACKAGE IMAGES TABLE
================================ */
CREATE TABLE package_images (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    package_id BIGINT NOT NULL,
    image_url VARCHAR(500),

    CONSTRAINT fk_image_package FOREIGN KEY (package_id)
        REFERENCES travel_packages(id)
        ON DELETE CASCADE
);

/* ===============================
   BOOKINGS TABLE
================================ */
CREATE TABLE bookings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    user_id BIGINT NOT NULL,
    package_id BIGINT NOT NULL,

    -- 🔑 NEW DATE FIELDS
    booking_date DATE NOT NULL,
    tour_start_date DATE NOT NULL,

    status VARCHAR(40) NOT NULL,
    payment_status VARCHAR(40) NOT NULL,

    amount DECIMAL(10,2) NOT NULL,

    CONSTRAINT fk_booking_user FOREIGN KEY (user_id)
        REFERENCES users(user_id),

    CONSTRAINT fk_booking_package FOREIGN KEY (package_id)
        REFERENCES travel_packages(id)
);

/* ===============================
   PAYMENTS TABLE
================================ */
CREATE TABLE payments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_id BIGINT NOT NULL,

    payment_status VARCHAR(40) NOT NULL,
    payment_method VARCHAR(50),
    transaction_id VARCHAR(150),
    amount DECIMAL(10,2),

    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_payment_booking FOREIGN KEY (booking_id)
        REFERENCES bookings(id)
);

/* ===============================
   INDEXES (PERFORMANCE)
================================ */
CREATE INDEX idx_booking_user ON bookings(user_id);
CREATE INDEX idx_booking_package ON bookings(package_id);
CREATE INDEX idx_package_agent ON travel_packages(agent_id);

/* ===============================
    DATe TIME COLUMNS FOR TRAVEL PACKAGES    
================================ */

ALTER TABLE travel_packages
ADD COLUMN tour_start_time DATETIME NOT NULL,
ADD COLUMN tour_end_time   DATETIME NOT NULL,
ADD COLUMN transport_mode VARCHAR(50),
ADD COLUMN transport_details VARCHAR(500);

