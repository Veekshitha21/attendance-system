// Attendance Management System - Frontend JavaScript

const API_URL = 'http://localhost:3000/api';

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupNavigation();
    setTodayDate();
    updateDateTime();
    setInterval(updateDateTime, 1000); // Update every second
    loadDashboard();
}

// Update Date and Time in Header
function updateDateTime() {
    const now = new Date();
    
    // Format date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr = now.toLocaleDateString('en-US', options);
    
    // Format time
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    // Update DOM
    const dateElement = document.getElementById('current-date');
    const timeElement = document.getElementById('current-time');
    
    if (dateElement) dateElement.textContent = dateStr;
    if (timeElement) timeElement.textContent = timeStr;
}

// Setup Navigation
function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            switchSection(sectionId);
            
            navButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Load section-specific data
            switch(sectionId) {
                case 'attendance':
                    loadClasses();
                    break;
                case 'students':
                    loadStudents();
                    break;
                case 'classes':
                    loadClasses();
                    break;
                case 'leaves':
                    loadLeaveRequests();
                    break;
                case 'reports':
                    loadReports();
                    break;
            }
        });
    });
}

function switchSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}

function setTodayDate() {
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('att-date');
    if (dateInput) {
        dateInput.value = today;
    }
}

// ============ DASHBOARD ============

function loadDashboard() {
    fetch(`${API_URL}/stats`)
        .then(r => r.json())
        .then(data => {
            if (data.success) {
                document.getElementById('stat-students').textContent = data.data.totalStudents;
                document.getElementById('stat-classes').textContent = data.data.totalClasses;
                document.getElementById('stat-present').textContent = data.data.presentToday;
                document.getElementById('stat-absent').textContent = data.data.absentToday;
            }
        })
        .catch(e => console.error('Error:', e));
    
    loadAttendanceSummary();
}

function loadAttendanceSummary() {
    fetch(`${API_URL}/summary`)
        .then(r => r.json())
        .then(data => {
            if (data.success) {
                const tbody = document.getElementById('summary-tbody');
                tbody.innerHTML = '';
                
                data.data.forEach(student => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${student.rollNumber}</td>
                        <td>${student.name}</td>
                        <td>${student.total}</td>
                        <td>${student.present}</td>
                        <td>${student.absent}</td>
                        <td>${student.late}</td>
                        <td><strong>${student.percentage}%</strong></td>
                    `;
                    tbody.appendChild(row);
                });
                
                if (data.data.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="7" class="no-data">No attendance records</td></tr>';
                }
            }
        });
}

// ============ STUDENTS ============

function loadStudents() {
    fetch(`${API_URL}/students`)
        .then(r => r.json())
        .then(data => {
            if (data.success) {
                const tbody = document.getElementById('students-tbody');
                tbody.innerHTML = '';
                
                data.data.forEach(student => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>2026${String(student.id).padStart(6, '0')}</td>
                        <td>${student.rollNumber}</td>
                        <td>${student.firstName} ${student.lastName}</td>
                        <td>${student.email}</td>
                        <td>${student.phone || 'N/A'}</td>
                        <td><span class="status-badge status-active">${student.status}</span></td>
                        <td>
                            <button class="btn btn-primary btn-small" onclick="editStudent('${student.id}')">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="btn btn-danger btn-small" onclick="deleteStudent('${student.id}')">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </td>
                    `;
                    tbody.appendChild(row);
                });
            }
        });
}

function showAddStudentForm() {
    document.getElementById('add-student-form').style.display = 'block';
}

function cancelAddStudent() {
    const form = document.getElementById('add-student-form');
    form.style.display = 'none';
    form.removeAttribute('data-edit-id');
    
    document.getElementById('roll-number').value = '';
    document.getElementById('first-name').value = '';
    document.getElementById('last-name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('phone').value = '';
    
    // Reset button text
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Add Student';
}

function addStudent(event) {
    event.preventDefault();
    
    const form = document.getElementById('add-student-form');
    const editId = form.getAttribute('data-edit-id');
    
    const studentData = {
        rollNumber: document.getElementById('roll-number').value,
        firstName: document.getElementById('first-name').value,
        lastName: document.getElementById('last-name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value
    };
    
    const url = editId ? `${API_URL}/students/${editId}` : `${API_URL}/students`;
    const method = editId ? 'PUT' : 'POST';
    
    fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData)
    })
    .then(r => r.json())
    .then(data => {
        if (data.success) {
            alert(editId ? 'Student updated successfully!' : 'Student added successfully!');
            cancelAddStudent();
            loadStudents();
        } else {
            alert('Error: ' + data.error);
        }
    });
}

function deleteStudent(studentId) {
    if (confirm('Delete this student?')) {
        fetch(`${API_URL}/students/${studentId}`, { method: 'DELETE' })
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    alert('Student deleted!');
                    loadStudents();
                }
            });
    }
}

function editStudent(studentId) {
    // Fetch student details
    fetch(`${API_URL}/students`)
        .then(r => r.json())
        .then(data => {
            if (data.success) {
                const student = data.data.find(s => s.id === studentId);
                if (student) {
                    // Populate form with student data
                    document.getElementById('roll-number').value = student.rollNumber;
                    document.getElementById('first-name').value = student.firstName;
                    document.getElementById('last-name').value = student.lastName;
                    document.getElementById('email').value = student.email;
                    document.getElementById('phone').value = student.phone || '';
                    
                    // Show form and change behavior to update
                    const form = document.getElementById('add-student-form');
                    form.style.display = 'block';
                    form.setAttribute('data-edit-id', studentId);
                    
                    // Change form submit to update
                    const submitBtn = form.querySelector('button[type="submit"]');
                    submitBtn.textContent = 'Update Student';
                }
            }
        });
}

// ============ CLASSES ============

function loadClasses() {
    fetch(`${API_URL}/classes`)
        .then(r => r.json())
        .then(data => {
            if (data.success) {
                // Load in classes section
                const tbody = document.getElementById('classes-tbody');
                if (tbody) {
                    tbody.innerHTML = '';
                    data.data.forEach(cls => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>2026${String(cls.id).padStart(6, '0')}</td>
                            <td>${cls.code}</td>
                            <td>${cls.name}</td>
                            <td>${cls.semester || 'N/A'}</td>
                            <td>${cls.instructor || 'N/A'}</td>
                            <td>
                                <button class="btn btn-primary btn-small" onclick="editClass('${cls.id}')">
                                    <i class="fas fa-edit"></i> Edit
                                </button>
                            </td>
                        `;
                        tbody.appendChild(row);
                    });
                }
                
                // Load in attendance dropdown
                const select = document.getElementById('att-class');
                if (select) {
                    select.innerHTML = '<option value="">Choose a class...</option>';
                    data.data.forEach(cls => {
                        const option = document.createElement('option');
                        option.value = cls.id;
                        option.textContent = `${cls.code} - ${cls.name}`;
                        select.appendChild(option);
                    });
                }
            }
        });
}

function showAddClassForm() {
    document.getElementById('add-class-form').style.display = 'block';
}

function cancelAddClass() {
    const form = document.getElementById('add-class-form');
    form.style.display = 'none';
    form.removeAttribute('data-edit-id');
    
    document.getElementById('class-code').value = '';
    document.getElementById('class-name').value = '';
    document.getElementById('class-semester').value = '';
    document.getElementById('class-instructor').value = '';
    
    // Reset button text
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Add Class';
}

function addClass(event) {
    event.preventDefault();
    
    const form = document.getElementById('add-class-form');
    const editId = form.getAttribute('data-edit-id');
    
    const classData = {
        code: document.getElementById('class-code').value,
        name: document.getElementById('class-name').value,
        semester: document.getElementById('class-semester').value,
        instructor: document.getElementById('class-instructor').value
    };
    
    const url = editId ? `${API_URL}/classes/${editId}` : `${API_URL}/classes`;
    const method = editId ? 'PUT' : 'POST';
    
    fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(classData)
    })
    .then(r => r.json())
    .then(data => {
        if (data.success) {
            alert(editId ? 'Class updated successfully!' : 'Class added successfully!');
            cancelAddClass();
            loadClasses();
        } else {
            alert('Error: ' + data.error);
        }
    });
}

function editClass(classId) {
    // Fetch class details
    fetch(`${API_URL}/classes`)
        .then(r => r.json())
        .then(data => {
            if (data.success) {
                const classItem = data.data.find(c => c.id === classId);
                if (classItem) {
                    // Populate form with class data
                    document.getElementById('class-code').value = classItem.code;
                    document.getElementById('class-name').value = classItem.name;
                    document.getElementById('class-semester').value = classItem.semester || '';
                    document.getElementById('class-instructor').value = classItem.instructor || '';
                    
                    // Show form and change behavior to update
                    const form = document.getElementById('add-class-form');
                    form.style.display = 'block';
                    form.setAttribute('data-edit-id', classId);
                    
                    // Change form submit to update
                    const submitBtn = form.querySelector('button[type="submit"]');
                    submitBtn.textContent = 'Update Class';
                }
            }
        });
}

// ============ ATTENDANCE ============

function loadClassStudents() {
    const classId = document.getElementById('att-class').value;
    
    if (!classId) {
        alert('Please select a class');
        return;
    }
    
    fetch(`${API_URL}/students`)
        .then(r => r.json())
        .then(data => {
            if (data.success) {
                displayStudentAttendanceForm(data.data);
            }
        });
}

function displayStudentAttendanceForm(students) {
    const container = document.getElementById('students-list');
    container.innerHTML = '';
    
    students.forEach(student => {
        const item = document.createElement('div');
        item.className = 'attendance-item';
        item.innerHTML = `
            <div class="attendance-info">
                <h4>${student.rollNumber}</h4>
                <p>${student.firstName} ${student.lastName}</p>
            </div>
            <div class="attendance-controls">
                <select class="status-select" data-student-id="${student.id}">
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Late">Late</option>
                    <option value="Excused">Excused</option>
                </select>
            </div>
        `;
        container.appendChild(item);
    });
    
    document.getElementById('attendance-list').style.display = 'block';
}

function saveAttendance() {
    const classId = document.getElementById('att-class').value;
    const date = document.getElementById('att-date').value;
    const records = [];
    
    document.querySelectorAll('.status-select').forEach(select => {
        records.push({
            studentId: select.getAttribute('data-student-id'),
            status: select.value
        });
    });
    
    fetch(`${API_URL}/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records, date, classId })
    })
    .then(r => r.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            cancelAttendance();
        } else {
            alert('Error: ' + data.error);
        }
    });
}

function cancelAttendance() {
    document.getElementById('attendance-list').style.display = 'none';
    document.getElementById('att-class').value = '';
    document.getElementById('students-list').innerHTML = '';
}

// ============ LEAVE REQUESTS ============

function loadLeaveRequests() {
    fetch(`${API_URL}/leaves`)
        .then(r => r.json())
        .then(data => {
            if (data.success) {
                const pendingTbody = document.getElementById('pending-leaves-tbody');
                const allTbody = document.getElementById('all-leaves-tbody');
                
                pendingTbody.innerHTML = '';
                allTbody.innerHTML = '';
                
                const pending = data.data.filter(l => l.status === 'Pending');
                
                pending.forEach(leave => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>2026${String(leave.id).padStart(6, '0')}</td>
                        <td>2026${String(leave.studentId).padStart(6, '0')}</td>
                        <td>${leave.studentName}</td>
                        <td>2026${String(leave.classId).padStart(6, '0')}</td>
                        <td>${leave.classCode}</td>
                        <td>${leave.startDate} to ${leave.endDate}</td>
                        <td>${leave.reason}</td>
                        <td>
                            <button class="btn btn-success btn-small" onclick="approveLeave('${leave.id}')">
                                <i class="fas fa-check"></i> Approve
                            </button>
                            <button class="btn btn-danger btn-small" onclick="rejectLeave('${leave.id}')">
                                <i class="fas fa-times"></i> Reject
                            </button>
                        </td>
                    `;
                    pendingTbody.appendChild(row);
                });
                
                data.data.forEach(leave => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>2026${String(leave.id).padStart(6, '0')}</td>
                        <td>2026${String(leave.studentId).padStart(6, '0')}</td>
                        <td>${leave.studentName}</td>
                        <td>2026${String(leave.classId).padStart(6, '0')}</td>
                        <td>${leave.classCode}</td>
                        <td>${leave.startDate} to ${leave.endDate}</td>
                        <td>${leave.reason}</td>
                        <td><span class="status-badge status-${leave.status.toLowerCase()}">${leave.status}</span></td>
                    `;
                    allTbody.appendChild(row);
                });
                
                if (pending.length === 0) {
                    pendingTbody.innerHTML = '<tr><td colspan="8" class="no-data">No pending requests</td></tr>';
                }
                if (data.data.length === 0) {
                    allTbody.innerHTML = '<tr><td colspan="8" class="no-data">No leave requests</td></tr>';
                }
            }
        });
}

function approveLeave(leaveId) {
    if (confirm('Approve this leave?')) {
        fetch(`${API_URL}/leaves/${leaveId}/approve`, { method: 'PUT' })
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    alert('Leave approved!');
                    loadLeaveRequests();
                }
            });
    }
}

function rejectLeave(leaveId) {
    if (confirm('Reject this leave?')) {
        fetch(`${API_URL}/leaves/${leaveId}/reject`, { method: 'PUT' })
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    alert('Leave rejected!');
                    loadLeaveRequests();
                }
            });
    }
}

function showRequestLeaveForm() {
    const form = document.getElementById('request-leave-form');
    if (form) {
        form.style.display = 'block';
        loadStudentsForLeave();
        loadClassesForLeave();
    }
}

function cancelRequestLeave() {
    const form = document.getElementById('request-leave-form');
    if (form) {
        form.style.display = 'none';
        form.reset();
    }
}

function loadStudentsForLeave() {
    fetch(`${API_URL}/students`)
        .then(r => r.json())
        .then(data => {
            if (data.success) {
                const select = document.getElementById('leave-student');
                if (select) {
                    select.innerHTML = '<option value="">Select Student...</option>';
                    data.data.forEach(student => {
                        const option = document.createElement('option');
                        option.value = student.id;
                        option.textContent = `${student.rollNumber} - ${student.firstName} ${student.lastName}`;
                        select.appendChild(option);
                    });
                }
            }
        });
}

function loadClassesForLeave() {
    fetch(`${API_URL}/classes`)
        .then(r => r.json())
        .then(data => {
            if (data.success) {
                const select = document.getElementById('leave-class');
                if (select) {
                    select.innerHTML = '<option value="">Select Class...</option>';
                    data.data.forEach(cls => {
                        const option = document.createElement('option');
                        option.value = cls.id;
                        option.textContent = `${cls.code} - ${cls.name}`;
                        select.appendChild(option);
                    });
                }
            }
        });
}

function submitLeaveRequest(event) {
    event.preventDefault();
    
    const leaveData = {
        studentId: document.getElementById('leave-student').value,
        classId: document.getElementById('leave-class').value,
        startDate: document.getElementById('leave-start-date').value,
        endDate: document.getElementById('leave-end-date').value,
        reason: document.getElementById('leave-reason').value
    };
    
    // Validate all required fields
    if (!leaveData.studentId || !leaveData.classId || !leaveData.startDate || !leaveData.endDate || !leaveData.reason) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Validate date range
    if (new Date(leaveData.startDate) > new Date(leaveData.endDate)) {
        alert('End date must be after start date');
        return;
    }
    
    fetch(`${API_URL}/leaves`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leaveData)
    })
    .then(r => r.json())
    .then(data => {
        if (data.success) {
            alert('Leave request submitted successfully!');
            document.querySelector('#request-leave-form form').reset();
            cancelRequestLeave();
            loadLeaveRequests();
        } else {
            alert('Error: ' + (data.error || 'Unknown error'));
        }
    })
    .catch(error => {
        alert('Error submitting leave request: ' + error.message);
        console.error('Leave submission error:', error);
    });
}

// ============ REPORTS ============

function loadReports() {
    loadLowAttendance();
    loadFullSummary();
}

function loadLowAttendance() {
    fetch(`${API_URL}/summary`)
        .then(r => r.json())
        .then(data => {
            if (data.success) {
                const tbody = document.getElementById('low-attendance-tbody');
                tbody.innerHTML = '';
                
                const lowAttendance = data.data.filter(s => s.percentage < 75);
                
                lowAttendance.forEach(student => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${student.rollNumber}</td>
                        <td>${student.name}</td>
                        <td>${student.total}</td>
                        <td>${student.present}</td>
                        <td><strong style="color: #F44336;">${student.percentage}%</strong></td>
                    `;
                    tbody.appendChild(row);
                });
                
                if (lowAttendance.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="5" class="no-data">All students have good attendance</td></tr>';
                }
            }
        });
}
// Initialize Default Subjects
function initializeDefaultSubjects() {
    const defaultSubjects = [
        { code: 'DBMS', name: 'Database Management Systems', semester: 5, instructor: 'TBA' },
        { code: 'CN', name: 'Computer Networks', semester: 5, instructor: 'TBA' },
        { code: 'POC', name: 'Principles of Computing', semester: 5, instructor: 'TBA' },
        { code: 'AI', name: 'Artificial Intelligence', semester: 6, instructor: 'TBA' },
        { code: 'CNS', name: 'Cryptography and Network Security', semester: 6, instructor: 'TBA' }
    ];
    
    let added = 0;
    let failed = 0;
    const promises = defaultSubjects.map(subject => 
        fetch(`${API_URL}/classes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(subject)
        })
        .then(r => r.json())
        .then(data => {
            if (data.success) {
                added++;
                console.log(`Added: ${subject.code}`);
            } else {
                failed++;
                console.log(`Already exists or error: ${subject.code}`);
            }
            return data;
        })
        .catch(err => {
            failed++;
            console.log('Error:', err);
        })
    );
    
    Promise.all(promises).then(() => {
        if (added > 0) {
            alert(`✅ Added ${added} subjects successfully!`);
            loadClasses();
        } else if (failed > 0) {
            alert('ℹ️ Subjects may already exist. Check the Classes table!');
            loadClasses();
        } else {
            alert('⚠️ Check your database connection.');
        }
    });
}
function loadFullSummary() {
    fetch(`${API_URL}/summary`)
        .then(r => r.json())
        .then(data => {
            if (data.success) {
                const tbody = document.getElementById('report-summary-tbody');
                tbody.innerHTML = '';
                
                data.data.forEach(student => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${student.rollNumber}</td>
                        <td>${student.name}</td>
                        <td>${student.total}</td>
                        <td>${student.present}</td>
                        <td>${student.absent}</td>
                        <td>${student.late}</td>
                        <td><strong>${student.percentage}%</strong></td>
                    `;
                    tbody.appendChild(row);
                });
            }
        });
}
