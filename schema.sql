-- Attendance Management System Database Schema

CREATE DATABASE IF NOT EXISTS attendance_system;
USE attendance_system;

-- Students Table
CREATE TABLE students (
    id VARCHAR(36) PRIMARY KEY,
    rollNumber VARCHAR(50) UNIQUE NOT NULL,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    status VARCHAR(20) DEFAULT 'Active',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Classes Table
CREATE TABLE classes (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    semester VARCHAR(50),
    instructor VARCHAR(150),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Attendance Table
CREATE TABLE attendance (
    id VARCHAR(36) PRIMARY KEY,
    studentId VARCHAR(36) NOT NULL,
    classId VARCHAR(36) NOT NULL,
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL,
    remarks VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (classId) REFERENCES classes(id) ON DELETE CASCADE,
    UNIQUE KEY unique_attendance (studentId, classId, date)
);

-- Leaves Table
CREATE TABLE leaves (
    id VARCHAR(36) PRIMARY KEY,
    studentId VARCHAR(36) NOT NULL,
    classId VARCHAR(36) NOT NULL,
    startDate DATE NOT NULL,
    endDate DATE NOT NULL,
    reason VARCHAR(500) NOT NULL,
    status VARCHAR(20) DEFAULT 'Pending',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (classId) REFERENCES classes(id) ON DELETE CASCADE
);

-- Indexes for better query performance
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_attendance_student ON attendance(studentId);
CREATE INDEX idx_leaves_status ON leaves(status);
CREATE INDEX idx_leaves_student ON leaves(studentId);

-- Sample Data
INSERT INTO students (id, rollNumber, firstName, lastName, email, phone, status) VALUES
('CSE-2026-001', 'CS-2023-001', 'John', 'Doe', 'john.doe@college.edu', '9876543210', 'Active'),
('CSE-2026-002', 'CS-2023-002', 'Jane', 'Smith', 'jane.smith@college.edu', '9876543211', 'Active'),
('CSE-2026-003', 'CS-2023-003', 'Mike', 'Johnson', 'mike.johnson@college.edu', '9876543212', 'Active'),
('CSE-2026-004', 'CS-2023-004', 'Sarah', 'Williams', 'sarah.williams@college.edu', '9876543213', 'Active'),
('CSE-2026-005', 'CS-2023-005', 'Robert', 'Brown', 'robert.brown@college.edu', '9876543214', 'Active');
INSERT INTO classes (id, code, name, semester, instructor) VALUES

('CSE-2026-001', '22CS501 ', 'Database Management Systems', '5', 'TBA'),
('CSE-2026-002', '22CS502', 'Computer Networks', '5', 'TBA'),
('CSE-2026-003', '22CS503', 'Principles of Computing', '5', 'TBA'),
('CSE-2026-004', '22CS504', 'Artificial Intelligence', '6', 'TBA'),
('CSE-2026-005', '22CS505', 'Cryptography and Network Security', '6', 'TBA');
INSERT INTO attendance (id, studentId, classId, date, status, remarks) VALUES
('ATT-2026-001', 'CSE-2026-001', 'CSE-2026-001', '2025-12-31', 'Present', NULL),
('ATT-2026-002', 'CSE-2026-002', 'CSE-2026-002', '2025-12-31', 'Present', NULL),
('ATT-2026-003', 'CSE-2026-003', 'CSE-2026-003', '2025-12-31', 'Absent', NULL),
('ATT-2026-004', 'CSE-2026-004', 'CSE-2026-004', '2025-12-31', 'Present', NULL),
('ATT-2026-005', 'CSE-2026-005', 'CSE-2026-005', '2025-12-31', 'Late', NULL);
INSERT INTO leaves (id, studentId, classId, startDate, endDate, reason, status) VALUES
('LV-2026-001', 'CSE-2026-001', 'CSE-2026-001', '2026-01-05', '2026-01-07', 'Medical appointment', 'Pending'),
('LV-2026-002', 'CSE-2026-002', 'CSE-2026-002', '2026-01-02', '2026-01-03', 'Family emergency', 'Approved');