# Quick Start Guide - Using Fixed Features

## 🎯 How to Use the Edit Button

### For Students:

1. **Navigate to Students Section**
   ```
   Click "Students" in the navigation bar
   ```

2. **Find the Student to Edit**
   ```
   Look in the "All Students" table
   Each row has Edit and Delete buttons
   ```

3. **Click Edit Button**
   ```
   Click the blue "Edit" button next to the student
   The form will appear at the top with student data pre-filled
   ```

4. **Make Your Changes**
   ```
   Modify any field (name, email, phone, etc.)
   ```

5. **Save Changes**
   ```
   Click "Update Student" button (notice it changed from "Add Student")
   You'll see a success message
   The table will refresh with updated data
   ```

---

## 📝 How to Request Leave

### Step-by-Step Process:

1. **Go to Leave Requests Section**
   ```
   Click "Leave Requests" in the navigation bar
   ```

2. **Click Request Leave Button**
   ```
   At the top of the page, click the green "+ Request Leave" button
   A form will appear
   ```

3. **Fill in the Form**
   ```
   Student: Select from dropdown (e.g., "101 - John Doe")
   Class: Select from dropdown (e.g., "CS101 - Computer Science")
   Start Date: Click calendar icon and pick date
   End Date: Click calendar icon and pick date
   Reason: Type your reason (e.g., "Medical appointment")
   ```

4. **Submit Request**
   ```
   Click "Submit Request" button
   You'll see confirmation message
   Form will close automatically
   ```

5. **View Your Request**
   ```
   Scroll down to "Pending Leave Requests" table
   Your request will be listed there
   Status will show as "Pending"
   ```

6. **Approval Process**
   ```
   Administrators can:
   - Click "Approve" (green button) to accept
   - Click "Reject" (red button) to decline
   
   After action, status updates in "All Leave Requests" table
   ```

---

## 🖼️ Visual Layout Reference

```
┌─────────────────────────────────────────────────────┐
│  📚 Attendance Management System                    │
│  Track Student Attendance & Leave Requests          │
│                                    📅 Jan 4, 2026    │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Dashboard | Attendance | [Students] | Classes | etc │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ 👨‍🎓 Student Management        [+ Add Student] ←──────┐
├─────────────────────────────────────────────────────┤
│                                                      │
│ ┌──────────────────────────────────────────┐        │
│ │  Add New Student (appears when adding)   │        │
│ │  or                                      │        │
│ │  Edit Student (appears when editing) ←───┼──┐     │
│ │                                          │  │     │
│ │  Roll Number: [101    ]                  │  │     │
│ │  First Name:  [John   ]                  │  │     │
│ │  Last Name:   [Doe    ]                  │  │     │
│ │  Email:       [john@  ]                  │  │     │
│ │  Phone:       [555-   ]                  │  │     │
│ │                                          │  │     │
│ │  [Add/Update Student] [Cancel]           │  │     │
│ └──────────────────────────────────────────┘  │     │
│                                               │     │
│ All Students                                  │     │
│ ┌───────────────────────────────────────────┐ │     │
│ │ Roll │ Name │ Email │ Phone │ Status │    │ │     │
│ ├───────────────────────────────────────────┤ │     │
│ │ 101  │ John │ ...   │ ...   │ Active │    │ │     │
│ │      │      │       │       │        │    │ │     │
│ │ [Edit] [Delete] ─────────────────────────┘ │     │
│ └───────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────┐
│ Dashboard | Attendance | Students | Classes | etc   │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ 📄 Leave Requests            [+ Request Leave] ←─────┐
├─────────────────────────────────────────────────────┤
│                                                      │
│ ┌──────────────────────────────────────────┐        │
│ │  📧 Submit Leave Request                 │        │
│ │                                          │        │
│ │  Student:    [Select Student... ▼]      │        │
│ │  Class:      [Select Class... ▼]        │        │
│ │  Start Date: [📅 01/05/2026]            │        │
│ │  End Date:   [📅 01/07/2026]            │        │
│ │  Reason:     ┌────────────────────────┐ │        │
│ │              │ Medical appointment    │ │        │
│ │              │                        │ │        │
│ │              └────────────────────────┘ │        │
│ │                                          │        │
│ │  [✓ Submit Request] [✗ Cancel]          │        │
│ └──────────────────────────────────────────┘        │
│                                                      │
│ Pending Leave Requests                               │
│ ┌───────────────────────────────────────────┐       │
│ │ Student│Class│Period│Reason│ Actions      │       │
│ ├───────────────────────────────────────────┤       │
│ │ John   │CS101│1/5-7 │Medical│[Approve][×] │       │
│ └───────────────────────────────────────────┘       │
│                                                      │
│ All Leave Requests                                   │
│ ┌───────────────────────────────────────────┐       │
│ │ Student│Class│Period│Reason│Status        │       │
│ ├───────────────────────────────────────────┤       │
│ │ John   │CS101│1/5-7 │Medical│Pending      │       │
│ │ Jane   │CS102│1/3-4 │Family │Approved     │       │
│ └───────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────┘
```

---

## ⚡ Quick Tips

### Edit Tips:
- ✅ Form populates automatically with existing data
- ✅ Button text changes to "Update" when editing
- ✅ Click Cancel to discard changes
- ✅ All fields are validated before saving

### Leave Request Tips:
- ✅ End date must be same or after start date
- ✅ All fields are required
- ✅ Reason can be multi-line
- ✅ Requests appear immediately after submission
- ✅ You can submit multiple requests for different classes

### Common Actions:
- **Add New:** Click "+ Add Student/Class" → Fill form → Submit
- **Edit Existing:** Click "Edit" button → Modify → Update
- **Request Leave:** Click "+ Request Leave" → Fill form → Submit
- **Approve/Reject:** Go to pending requests → Click action button

---

## 🔧 Troubleshooting

**Problem:** Edit button does nothing
- **Solution:** Refresh the page to load new JavaScript

**Problem:** Leave form doesn't show students
- **Solution:** Make sure you have students added first

**Problem:** Can't submit leave request
- **Solution:** Check all fields are filled in

**Problem:** Form shows old data after cancel
- **Solution:** This is now fixed - form resets properly

---

## 📱 Works On All Devices

- ✅ Desktop (full features)
- ✅ Tablet (responsive layout)
- ✅ Mobile (optimized forms)

---

**Need Help?** All features are now working correctly! Just follow the steps above.
