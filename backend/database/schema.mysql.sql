CREATE DATABASE IF NOT EXISTS mentormatch
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE mentormatch;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(40) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'mentor', 'mentee')),
    programme VARCHAR(255) DEFAULT NULL,
    year_of_study VARCHAR(30) DEFAULT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    api_token VARCHAR(255) DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_email_unique UNIQUE (email),
    CONSTRAINT users_phone_unique UNIQUE (phone),
    CONSTRAINT users_api_token_unique UNIQUE (api_token),
    KEY users_role_status_idx (role, status)
);

CREATE TABLE IF NOT EXISTS subscriptions (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'active', 'expired', 'rejected')),
    requested_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    approved_at DATETIME DEFAULT NULL,
    expires_at DATETIME DEFAULT NULL,
    reviewed_by BIGINT UNSIGNED DEFAULT NULL,
    reviewed_at DATETIME DEFAULT NULL,
    KEY subscriptions_user_status_idx (user_id, status, expires_at),
    KEY subscriptions_status_requested_idx (status, requested_at),
    CONSTRAINT subscriptions_user_fk FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT subscriptions_reviewer_fk FOREIGN KEY (reviewed_by) REFERENCES users (id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS system_settings (
    setting_key VARCHAR(100) PRIMARY KEY,
    setting_value TEXT NOT NULL,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS semesters (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    semester_name VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    registration_open DATE NOT NULL,
    registration_close DATE NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'upcoming',
    KEY semesters_status_idx (status),
    KEY semesters_start_date_idx (start_date)
);

CREATE TABLE IF NOT EXISTS courses (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    course_code VARCHAR(40) NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT courses_course_code_unique UNIQUE (course_code)
);

CREATE TABLE IF NOT EXISTS mentor_applications (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    mentor_id BIGINT UNSIGNED NOT NULL,
    semester_id BIGINT UNSIGNED NOT NULL,
    course_code VARCHAR(40) NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    grade VARCHAR(10) DEFAULT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reviewed_by BIGINT UNSIGNED DEFAULT NULL,
    reviewed_at DATETIME DEFAULT NULL,
    comments TEXT DEFAULT NULL,
    KEY mentor_applications_mentor_idx (mentor_id),
    KEY mentor_applications_semester_status_idx (semester_id, status),
    CONSTRAINT mentor_applications_mentor_fk FOREIGN KEY (mentor_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT mentor_applications_semester_fk FOREIGN KEY (semester_id) REFERENCES semesters (id) ON DELETE CASCADE,
    CONSTRAINT mentor_applications_reviewer_fk FOREIGN KEY (reviewed_by) REFERENCES users (id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS mentee_enrollments (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    mentee_id BIGINT UNSIGNED NOT NULL,
    semester_id BIGINT UNSIGNED NOT NULL,
    course_code VARCHAR(40) NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reviewed_by BIGINT UNSIGNED DEFAULT NULL,
    reviewed_at DATETIME DEFAULT NULL,
    comments TEXT DEFAULT NULL,
    KEY mentee_enrollments_mentee_idx (mentee_id),
    KEY mentee_enrollments_semester_status_idx (semester_id, status),
    CONSTRAINT mentee_enrollments_mentee_fk FOREIGN KEY (mentee_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT mentee_enrollments_semester_fk FOREIGN KEY (semester_id) REFERENCES semesters (id) ON DELETE CASCADE,
    CONSTRAINT mentee_enrollments_reviewer_fk FOREIGN KEY (reviewed_by) REFERENCES users (id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS mentor_rates (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    mentor_id BIGINT UNSIGNED NOT NULL,
    course_code VARCHAR(40) NOT NULL,
    rate_per_hour DECIMAL(12,2) NOT NULL,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT mentor_rates_mentor_course_unique UNIQUE (mentor_id, course_code),
    CONSTRAINT mentor_rates_mentor_fk FOREIGN KEY (mentor_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS mentor_availability (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    mentor_id BIGINT UNSIGNED NOT NULL,
    day_of_week SMALLINT NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_recurring TINYINT NOT NULL DEFAULT 1 CHECK (is_recurring IN (0, 1)),
    KEY mentor_availability_mentor_day_idx (mentor_id, day_of_week),
    CONSTRAINT mentor_availability_mentor_fk FOREIGN KEY (mentor_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sessions (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    mentor_id BIGINT UNSIGNED NOT NULL,
    mentee_id BIGINT UNSIGNED NOT NULL,
    semester_id BIGINT UNSIGNED NOT NULL,
    course_code VARCHAR(40) NOT NULL,
    session_date DATETIME NOT NULL,
    duration_minutes INTEGER NOT NULL,
    mentor_rate DECIMAL(12,2) NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    admin_fee DECIMAL(12,2) NOT NULL DEFAULT 0,
    mentor_payout DECIMAL(12,2) NOT NULL DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    payment_status VARCHAR(30) NOT NULL DEFAULT 'pending',
    payment_date DATETIME DEFAULT NULL,
    payout_date DATETIME DEFAULT NULL,
    transaction_id VARCHAR(255) DEFAULT NULL,
    payment_method VARCHAR(50) DEFAULT NULL,
    meeting_link TEXT DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT sessions_transaction_id_unique UNIQUE (transaction_id),
    KEY sessions_mentor_date_idx (mentor_id, session_date),
    KEY sessions_mentee_date_idx (mentee_id, session_date),
    KEY sessions_semester_idx (semester_id),
    KEY sessions_status_payment_idx (status, payment_status),
    CONSTRAINT sessions_mentor_fk FOREIGN KEY (mentor_id) REFERENCES users (id) ON DELETE RESTRICT,
    CONSTRAINT sessions_mentee_fk FOREIGN KEY (mentee_id) REFERENCES users (id) ON DELETE RESTRICT,
    CONSTRAINT sessions_semester_fk FOREIGN KEY (semester_id) REFERENCES semesters (id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS feedback (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    session_id BIGINT UNSIGNED NOT NULL,
    mentee_id BIGINT UNSIGNED NOT NULL,
    mentor_id BIGINT UNSIGNED NOT NULL,
    rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comments TEXT DEFAULT NULL,
    submitted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY feedback_session_idx (session_id),
    KEY feedback_mentor_submitted_idx (mentor_id, submitted_at),
    KEY feedback_mentee_idx (mentee_id),
    CONSTRAINT feedback_session_fk FOREIGN KEY (session_id) REFERENCES sessions (id) ON DELETE CASCADE,
    CONSTRAINT feedback_mentee_fk FOREIGN KEY (mentee_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT feedback_mentor_fk FOREIGN KEY (mentor_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS payments (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    session_id BIGINT UNSIGNED NOT NULL,
    mentee_id BIGINT UNSIGNED NOT NULL,
    mentor_id BIGINT UNSIGNED NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    admin_fee DECIMAL(12,2) NOT NULL DEFAULT 0,
    mentor_payout DECIMAL(12,2) NOT NULL DEFAULT 0,
    payment_status VARCHAR(30) NOT NULL DEFAULT 'pending',
    transaction_reference VARCHAR(255) NOT NULL,
    payment_method VARCHAR(50) NOT NULL DEFAULT 'mobile_money',
    payment_date DATETIME DEFAULT NULL,
    payout_date DATETIME DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT payments_transaction_reference_unique UNIQUE (transaction_reference),
    KEY payments_session_idx (session_id),
    KEY payments_status_created_idx (payment_status, created_at),
    KEY payments_mentee_idx (mentee_id),
    KEY payments_mentor_idx (mentor_id),
    CONSTRAINT payments_session_fk FOREIGN KEY (session_id) REFERENCES sessions (id) ON DELETE CASCADE,
    CONSTRAINT payments_mentee_fk FOREIGN KEY (mentee_id) REFERENCES users (id) ON DELETE RESTRICT,
    CONSTRAINT payments_mentor_fk FOREIGN KEY (mentor_id) REFERENCES users (id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS payout_requests (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    mentor_id BIGINT UNSIGNED NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    phone_number VARCHAR(40) DEFAULT NULL,
    account_details TEXT DEFAULT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    processed_by BIGINT UNSIGNED DEFAULT NULL,
    processed_at DATETIME DEFAULT NULL,
    KEY payout_requests_mentor_status_idx (mentor_id, status),
    CONSTRAINT payout_requests_mentor_fk FOREIGN KEY (mentor_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT payout_requests_processor_fk FOREIGN KEY (processed_by) REFERENCES users (id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS certificates (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    mentor_id BIGINT UNSIGNED NOT NULL,
    semester_id BIGINT UNSIGNED NOT NULL,
    total_hours DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_sessions INTEGER NOT NULL DEFAULT 0,
    issue_date DATE NOT NULL,
    certificate_hash VARCHAR(128) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'issued',
    CONSTRAINT certificates_hash_unique UNIQUE (certificate_hash),
    CONSTRAINT certificates_mentor_semester_unique UNIQUE (mentor_id, semester_id),
    CONSTRAINT certificates_mentor_fk FOREIGN KEY (mentor_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT certificates_semester_fk FOREIGN KEY (semester_id) REFERENCES semesters (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS system_logs (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED DEFAULT NULL,
    action TEXT NOT NULL,
    ip_address VARCHAR(64) DEFAULT NULL,
    user_agent TEXT DEFAULT NULL,
    details TEXT DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY system_logs_created_at_idx (created_at),
    KEY system_logs_user_idx (user_id)
);

CREATE TABLE IF NOT EXISTS admin_revenue (
    semester_id BIGINT UNSIGNED NOT NULL PRIMARY KEY,
    total_fees_collected DECIMAL(14,2) NOT NULL DEFAULT 0,
    total_payouts_made DECIMAL(14,2) NOT NULL DEFAULT 0,
    total_service_fees DECIMAL(14,2) NOT NULL DEFAULT 0,
    CONSTRAINT admin_revenue_semester_fk FOREIGN KEY (semester_id) REFERENCES semesters (id) ON DELETE CASCADE
);
