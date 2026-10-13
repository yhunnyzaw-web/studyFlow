# StudyFlow — Study Planner and Task Management System

A modern, portfolio-ready study planner and task management web application designed for diploma and undergraduate computer science students. Built with clean HTML5, CSS3, and Vanilla JavaScript.

---

## 🌟 Key Features

### 1. Task Management (CRUD)
- **Add Tasks**: Set title, subject, due date, priority (Low, Medium, High), and detailed notes.
- **View Details**: Full-screen modal to review notes, dates, and status.
- **Edit Tasks**: Seamless in-place task updating.
- **Delete Tasks**: Safe confirmation modal with cancellation support.
- **Status Toggle**: One-click checkbox completion with instant progress updates.

### 2. User Customization & Personalization
- **Manage & Rename Subjects**:
  - Add custom subjects with custom color tags (Blue, Purple, Emerald, Amber, Rose, Cyan, Orange).
  - **Inline Subject Renaming**: Editing a subject name automatically cascades and updates all associated tasks!
  - Delete subjects with safe task reassignment to prevent data loss.
- **Student Profile Personalization**:
  - Customize student name (`Welcome back, [Name] 👋`).
  - Set diploma/degree program and current semester/term.
  - Define a personal study motto or daily goal displayed on the dashboard.
- **Theme & Appearance Settings**:
  - 5 accent color themes: Classic Blue, Royal Purple, Emerald Green, Ocean Cyan, Crimson Rose.
  - Card density modes: Comfortable (standard) and Compact (view more tasks at once).

### 3. Dashboard Metrics & Progress Tracking
- Live counters for **Total Tasks**, **Pending**, **Completed**, and **Overdue**.
- Animated **Study Progress Bar** with completion percentage and encouraging motivational feedback.
- Highlighted badges for overdue assignments.

### 4. Search, Filter & Sort
- Live search by task title, subject, or description notes.
- Multi-dimensional filters: by Status (`Pending`, `Completed`, `Overdue`), Priority (`High`, `Medium`, `Low`), and Subject.
- Sorting by Due Date, Priority (High to Low), or Newest First.

---

## 🛠️ Technology Stack

- **Frontend**: Semantic HTML5, CSS3 (CSS Variables, Flexbox, Grid), Vanilla JavaScript (ES6+).
- **Icons**: Inline SVG icons (zero external CDN dependencies; works 100% offline).
- **Data Persistence**: Browser Local Storage (`studyflow_tasks`, `studyflow_subjects`, `studyflow_profile`, `studyflow_theme`).
- **Backend (Upcoming in Phase 2)**: Java 21, Spring Boot, Spring Web REST API, Spring Data JPA.
- **Database (Upcoming in Phase 3)**: MySQL (`studyflow_db`).

---

## 🚀 How to Run in VS Code on Windows

1. Open this project folder in **Visual Studio Code**.
2. Right-click [index.html](file:///c:/Users/YOON/OneDrive/Documents/Project/StudyFlow/index.html) and select **Open with Live Server** (or open the file directly in any modern web browser: Chrome, Edge, Firefox).
3. Alternatively, launch a quick local server in the VS Code terminal (PowerShell):
   ```powershell
   python -m http.server 5500
   ```
   Then navigate to `http://localhost:5500` in your browser.

---

## ⚙️ How to Test Customization

1. Click the **⚙️ Customize** button in the top navigation bar or the **⚙️ Manage** link in the sidebar under "My Subjects".
2. **Rename a Subject**:
   - In the **Subjects** tab, click the ✏️ pencil icon next to "Java Programming".
   - Change the name to "Advanced Java & Spring Boot" and click the **✓** button.
   - Observe that all tasks formerly assigned to "Java Programming" now instantly display the new name!
3. **Personalize Your Profile**:
   - Switch to the **👤 Student Profile** tab.
   - Type your own name (e.g. *Alex* or *Yoon*), course, and personal study goal.
   - Click **Save Profile Changes** and see your header greeting update immediately.
4. **Switch Themes**:
   - Switch to the **🎨 Theme & Style** tab.
   - Click "Royal Purple" or "Emerald Green" to instantly theme your entire interface!

---

## 📅 Roadmap

- [x] **Phase 1**: Responsive Frontend & User Customization (Completed & Verified)
- [ ] **Phase 2**: Java 21 & Spring Boot REST API
- [ ] **Phase 3**: MySQL Database Integration & JPA Persistence
- [ ] **Phase 4**: Connect Frontend to Spring Boot API via `fetch()`
- [ ] **Phase 5**: Full-Stack Testing & Validation
- [ ] **Phase 6**: Internship Portfolio & GitHub Packaging