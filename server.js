// server.js - Express Backend for Attendance Management System (MySQL Version)

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// MySQL Connection Pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'attendance_system',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Helper function to execute queries
async function executeQuery(sql, params = []) {
    try {
        const connection = await pool.getConnection();
        const [results] = await connection.execute(sql, params);
        connection.release();
        return results;
    } catch (error) {
        console.error('Database error:', error);
        throw error;
    }
}

// ============ STUDENTS ============

app.get('/api/students', async (req, res) => {
    try {
        const students = await executeQuery('SELECT * FROM students WHERE status = ? ORDER BY rollNumber', ['Active']);
        res.json({ success: true, data: students });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch students' });
    }
});

app.post('/api/students', async (req, res) => {
    const { rollNumber, firstName, lastName, email, phone } = req.body;
    
    if (!rollNumber || !firstName || !lastName || !email) {
        return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    
    try {
        const id = uuidv4();
        await executeQuery(
            'INSERT INTO students (id, rollNumber, firstName, lastName, email, phone, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id, rollNumber, firstName, lastName, email, phone || null, 'Active']
        );
        
        res.json({ 
            success: true, 
            message: 'Student added successfully',
            data: { id, rollNumber, firstName, lastName, email, phone }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.put('/api/students/:id', async (req, res) => {
    const { id } = req.params;
    const { rollNumber, firstName, lastName, email, phone } = req.body;
    
    try {
        await executeQuery(
            'UPDATE students SET rollNumber = ?, firstName = ?, lastName = ?, email = ?, phone = ? WHERE id = ?',
            [rollNumber, firstName, lastName, email, phone || null, id]
        );
        
        res.json({ success: true, message: 'Student updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Update failed' });
    }
});

app.delete('/api/students/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        await executeQuery('UPDATE students SET status = ? WHERE id = ?', ['Inactive', id]);
        res.json({ success: true, message: 'Student deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Delete failed' });
    }
});

// ============ CLASSES ============

app.get('/api/classes', async (req, res) => {
    try {
        const classes = await executeQuery('SELECT * FROM classes ORDER BY code');
        res.json({ success: true, data: classes });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch classes' });
    }
});

app.post('/api/classes', async (req, res) => {
    const { code, name, semester, instructor } = req.body;
    
    if (!code || !name) {
        return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    
    try {
        const id = uuidv4();
        await executeQuery(
            'INSERT INTO classes (id, code, name, semester, instructor) VALUES (?, ?, ?, ?, ?)',
            [id, code, name, semester || null, instructor || null]
        );
        
        res.json({ 
            success: true, 
            message: 'Class added successfully',
            data: { id, code, name, semester, instructor }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============ ATTENDANCE ============

app.get('/api/attendance', async (req, res) => {
    try {
        const records = await executeQuery(`
            SELECT a.*, s.rollNumber, s.firstName, s.lastName, c.code 
            FROM attendance a
            JOIN students s ON a.studentId = s.id
            JOIN classes c ON a.classId = c.id
            ORDER BY a.date DESC
        `);
        res.json({ success: true, data: records });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch attendance' });
    }
});

app.post('/api/attendance', async (req, res) => {
    const { records, date, classId } = req.body;
    
    if (!Array.isArray(records) || !date || !classId) {
        return res.status(400).json({ success: false, error: 'Invalid data' });
    }
    
    try {
        for (const record of records) {
            const id = uuidv4();
            // Delete existing record if it exists
            await executeQuery(
                'DELETE FROM attendance WHERE studentId = ? AND classId = ? AND date = ?',
                [record.studentId, classId, date]
            );
            
            // Insert new record
            await executeQuery(
                'INSERT INTO attendance (id, studentId, classId, date, status) VALUES (?, ?, ?, ?, ?)',
                [id, record.studentId, classId, date, record.status]
            );
        }
        
        res.json({ success: true, message: `Attendance marked for ${records.length} students` });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to save attendance' });
    }
});

// ============ LEAVES ============

app.get('/api/leaves', async (req, res) => {
    try {
        const leaves = await executeQuery(`
            SELECT l.*, s.firstName, s.lastName, s.rollNumber, c.code as classCode
            FROM leaves l
            JOIN students s ON l.studentId = s.id
            JOIN classes c ON l.classId = c.id
            ORDER BY l.createdAt DESC
        `);
        
        const formatted = leaves.map(leave => ({
            id: leave.id,
            studentName: `${leave.firstName} ${leave.lastName}`,
            rollNumber: leave.rollNumber,
            classCode: leave.classCode,
            startDate: leave.startDate,
            endDate: leave.endDate,
            reason: leave.reason,
            status: leave.status,
            createdAt: leave.createdAt
        }));
        
        res.json({ success: true, data: formatted });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch leaves' });
    }
});

app.post('/api/leaves', async (req, res) => {
    const { studentId, classId, startDate, endDate, reason } = req.body;
    
    if (!studentId || !classId || !startDate || !endDate || !reason) {
        return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    
    try {
        const id = uuidv4();
        await executeQuery(
            'INSERT INTO leaves (id, studentId, classId, startDate, endDate, reason, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id, studentId, classId, startDate, endDate, reason, 'Pending']
        );
        
        res.json({ success: true, message: 'Leave request submitted' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to submit leave' });
    }
});

app.put('/api/leaves/:id/approve', async (req, res) => {
    try {
        await executeQuery('UPDATE leaves SET status = ? WHERE id = ?', ['Approved', req.params.id]);
        res.json({ success: true, message: 'Leave approved' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Update failed' });
    }
});

app.put('/api/leaves/:id/reject', async (req, res) => {
    try {
        await executeQuery('UPDATE leaves SET status = ? WHERE id = ?', ['Rejected', req.params.id]);
        res.json({ success: true, message: 'Leave rejected' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Update failed' });
    }
});

// ============ STATISTICS ============

app.get('/api/stats', async (req, res) => {
    try {
        const totalStudents = await executeQuery('SELECT COUNT(*) as count FROM students WHERE status = ?', ['Active']);
        const totalClasses = await executeQuery('SELECT COUNT(*) as count FROM classes');
        
        const today = new Date().toISOString().split('T')[0];
        const presentToday = await executeQuery(
            'SELECT COUNT(*) as count FROM attendance WHERE date = ? AND status = ?',
            [today, 'Present']
        );
        const absentToday = await executeQuery(
            'SELECT COUNT(*) as count FROM attendance WHERE date = ? AND status = ?',
            [today, 'Absent']
        );
        
        res.json({
            success: true,
            data: {
                totalStudents: totalStudents[0].count,
                totalClasses: totalClasses[0].count,
                presentToday: presentToday[0].count,
                absentToday: absentToday[0].count
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch statistics' });
    }
});

app.get('/api/summary', async (req, res) => {
    try {
        const summary = await executeQuery(`
            SELECT 
                s.id,
                s.rollNumber,
                CONCAT(s.firstName, ' ', s.lastName) as name,
                COUNT(DISTINCT a.id) as total,
                SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) as present,
                SUM(CASE WHEN a.status = 'Absent' THEN 1 ELSE 0 END) as absent,
                SUM(CASE WHEN a.status = 'Late' THEN 1 ELSE 0 END) as late,
                ROUND(SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) * 100 / 
                    NULLIF(COUNT(DISTINCT a.id), 0), 2) as percentage
            FROM students s
            LEFT JOIN attendance a ON s.id = a.studentId
            WHERE s.status = 'Active'
            GROUP BY s.id, s.rollNumber, s.firstName, s.lastName
            ORDER BY s.rollNumber
        `);
        
        const formatted = summary.map(record => ({
            rollNumber: record.rollNumber,
            name: record.name,
            total: record.total || 0,
            present: record.present || 0,
            absent: record.absent || 0,
            late: record.late || 0,
            percentage: record.percentage || 0
        }));
        
        res.json({ success: true, data: formatted });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch summary' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Make sure MySQL is running and database is created using schema.sql');
});
