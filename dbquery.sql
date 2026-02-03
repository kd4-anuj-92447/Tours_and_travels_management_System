CREATE DATABASE IF NOT EXISTS tours_travels;
USE tours_travels;

-- -------------------------------------------------
-- ROLES
-- -------------------------------------------------
CREATE TABLE IF NOT EXISTS roles (
    id BIGINT NOT NULL AUTO_INCREMENT,
    role_name VARCHAR(255) NOT NULL UNIQUE,
    PRIMARY KEY (id)
);

-- -------------------------------------------------
-- USERS
-- -------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    user_id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(255),
    address VARCHAR(255),
    profile_pic_url VARCHAR(255),
    company_name VARCHAR(150),
    license_number VARCHAR(100),
    is_approved TINYINT(1) DEFAULT 0,
    approval_date DATETIME(6),
    approved_by VARCHAR(100),
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id),
    CONSTRAINT fk_users_role
        FOREIGN KEY (role_id)
        REFERENCES roles(id)
);

-- -------------------------------------------------
-- TRAVEL PACKAGES
-- -------------------------------------------------
CREATE TABLE IF NOT EXISTS travel_packages (
    id BIGINT NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(2000),
    destination VARCHAR(100),
    duration VARCHAR(100),
    price DOUBLE NOT NULL,
    status VARCHAR(30) NOT NULL,
    agent_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tour_start_time DATETIME NULL,
    tour_end_time DATETIME NULL,
    transport_mode VARCHAR(255),
    transport_details VARCHAR(500),
    PRIMARY KEY (id),
    CONSTRAINT fk_packages_agent
        FOREIGN KEY (agent_id)
        REFERENCES users(user_id)
);

-- -------------------------------------------------
-- PACKAGE IMAGES
-- -------------------------------------------------
CREATE TABLE IF NOT EXISTS package_images (
    id BIGINT NOT NULL AUTO_INCREMENT,
    package_id BIGINT NOT NULL,
    image_url VARCHAR(255),
    PRIMARY KEY (id),
    CONSTRAINT fk_package_images_package
        FOREIGN KEY (package_id)
        REFERENCES travel_packages(id)
        ON DELETE CASCADE
);

-- -------------------------------------------------
-- BOOKINGS
-- -------------------------------------------------
CREATE TABLE IF NOT EXISTS bookings (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    package_id BIGINT NOT NULL,
    booking_date DATE NOT NULL,
    tour_start_date DATE NOT NULL,
    status VARCHAR(40) NOT NULL,
    payment_status VARCHAR(40) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    tourists_count INT NOT NULL DEFAULT 1,
    PRIMARY KEY (id),
    CONSTRAINT fk_bookings_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id),
    CONSTRAINT fk_bookings_package
        FOREIGN KEY (package_id)
        REFERENCES travel_packages(id)
);

-- -------------------------------------------------
-- PAYMENTS
-- -------------------------------------------------
CREATE TABLE IF NOT EXISTS payments (
    id BIGINT NOT NULL AUTO_INCREMENT,
    booking_id BIGINT NOT NULL,
    payment_status VARCHAR(40) NOT NULL,
    payment_method VARCHAR(50),
    transaction_id VARCHAR(150),
    amount DECIMAL(10,2),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('FAILED','INITIATED','PENDING','REFUNDED','SUCCESS') NOT NULL,
    payment_mode VARCHAR(255),
    razorpay_order_id VARCHAR(255),
    razorpay_payment_id VARCHAR(255),
    razorpay_signature VARCHAR(255),
    PRIMARY KEY (id),
    CONSTRAINT fk_payments_booking
        FOREIGN KEY (booking_id)
        REFERENCES bookings(id)
);

-- -------------------------------------------------
-- INSERT ROLES
-- -------------------------------------------------
INSERT INTO roles (role_name)
VALUES
('ADMIN'),
('AGENT'),
('CUSTOMER');

-- -------------------------------------------------
-- INSERT ADMIN USER
-- -------------------------------------------------
INSERT INTO users
(
    name,
    email,
    password,
    phone,
    address,
    profile_pic_url,
    company_name,
    license_number,
    is_approved,
    approval_date,
    approved_by,
    role_id
)
VALUES
(
    'admin',
    'admin@tourstravels.com',
    '$2a$10$1z7cLh69ypm4AQM2JzLBiu24i02STMLKfatn/ribDg/wBnlCWpNm2',
    '7378051911',
    'ToursNtravels HQ, Pune',
    NULL,
    'ToursNtravels',
    NULL,
    NULL,
    NULL,
    NULL,
    (
        SELECT id
        FROM roles
        WHERE role_name = 'ADMIN'
        LIMIT 1
    )
);
