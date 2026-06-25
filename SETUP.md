# Attendance Management System - Setup Guide (MySQL Version)

## Prerequisites
- Node.js installed
- MySQL/XAMPP running
- npm installed

## Setup Steps

### 1. Create Database
Open MySQL CLI or phpMyAdmin and run the `schema.sql` file:

**Option A: Using MySQL CLI**
```bash
mysql -u root < schema.sql
```

**Option B: Using phpMyAdmin**
- Go to `http://localhost/phpmyadmin`
- Click "Import"
- Select `schema.sql` file
- Click "Go"

### 2. Install Dependencies
Navigate to the project folder and run:
```bash
cd c:\xampp\htdocs\myproject\attendance-system
npm install
```

This will install:
- express (4.18.2)
- cors
- body-parser
- uuid
- mysql2 (for database connection)

### 3. Configure Database Connection (if needed)
Open `server.js` and update MySQL credentials if different:
```javascript
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',           // Change if different
    password: '',           // Add password if set
    database: 'attendance_system',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
```

### 4. Start the Application
```bash
npm start
```

The server will start on `http://localhost:3000`

### 5. Access the Application
- Open browser and go to: `http://localhost:3000`
- Dashboard loads automatically with sample data

## Features

✅ **Student Management** - Add, edit, delete students
✅ **Class Management** - Manage classes and instructors
✅ **Attendance Marking** - Mark attendance by class and date
✅ **Leave Management** - Request and approve/reject leaves
✅ **Reports** - View attendance summary and low attendance alerts
✅ **Real-time Stats** - Dashboard with live statistics

## Database Tables

1. **students** - Student information
2. **classes** - Class details
3. **attendance** - Attendance records
4. **leaves** - Leave requests
5. Foreign keys ensure data integrity

## Sample Data Included
- 5 Students (CS-2023-001 to CS-2023-005)
- 3 Classes (CS301, CS302, CS303)
- Sample attendance records
- Sample leave requests

## Development Mode
For auto-reload on file changes:
```bash
npm run dev
```

This uses nodemon for automatic server restart.

## Troubleshooting

**Error: connect ECONNREFUSED 127.0.0.1:3306**
- MySQL is not running
- Start XAMPP and enable MySQL

**Error: ER_ACCESS_DENIED_FOR_USER**
- Check MySQL credentials in server.js
- Default: user='root', password=''

**Error: ER_BAD_DB_ERROR**
- Database not created
- Run schema.sql to create database

**Port 3000 already in use**
- Change PORT in server.js or kill process using port 3000

## API Endpoints

### Students
- GET `/api/students` - Get all students
- POST `/api/students` - Add student
- PUT `/api/students/:id` - Update student
- DELETE `/api/students/:id` - Delete student

### Classes
- GET `/api/classes` - Get all classes
- POST `/api/classes` - Add class

### Attendance
- GET `/api/attendance` - Get attendance records
- POST `/api/attendance` - Mark attendance

### Leaves
- GET `/api/leaves` - Get all leave requests
- POST `/api/leaves` - Create leave request
- PUT `/api/leaves/:id/approve` - Approve leave
- PUT `/api/leaves/:id/reject` - Reject leave

### Statistics
- GET `/api/stats` - Get dashboard statistics
- GET `/api/summary` - Get attendance summary per student
