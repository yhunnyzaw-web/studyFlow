/**
 * ============================================================================
 * StudyFlow — Student Study Planner & Task Management System
 * File: script.js
 * Description: Client-side logic for managing study tasks, filtering,
 *              statistics calculation, UI rendering, user customization
 *              (subjects, student profile, theme, card density), and feedback.
 * ============================================================================
 */

// Storage keys for persistence in localStorage
const STORAGE_KEY_TASKS = "studyflow_tasks";
const STORAGE_KEY_SUBJECTS = "studyflow_subjects";
const STORAGE_KEY_PROFILE = "studyflow_profile";
const STORAGE_KEY_THEME = "studyflow_theme";

// ============================================================================
// 1. DOM ELEMENT REFERENCES
// ============================================================================

// Form Elements
const taskForm = document.getElementById("taskForm");
const taskTitleInput = document.getElementById("taskTitle");
const taskSubjectSelect = document.getElementById("taskSubject");
const taskDueDateInput = document.getElementById("taskDueDate");
const taskPrioritySelect = document.getElementById("taskPriority");
const taskStatusSelect = document.getElementById("taskStatus");
const taskDescriptionInput = document.getElementById("taskDescription");
const submitTaskBtn = document.getElementById("submitTaskBtn");
const submitBtnText = document.getElementById("submitBtnText");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const formTitle = document.getElementById("formTitle");
const formManageSubjectsBtn = document.getElementById("formManageSubjectsBtn");

// Error Spans
const titleError = document.getElementById("titleError");
const subjectError = document.getElementById("subjectError");
const dueDateError = document.getElementById("dueDateError");

// Metric Stat Elements
const statTotal = document.getElementById("statTotal");
const statPending = document.getElementById("statPending");
const statCompleted = document.getElementById("statCompleted");
const statOverdue = document.getElementById("statOverdue");

// Navigation Badges
const navBadgeAll = document.getElementById("navBadgeAll");
const navBadgePending = document.getElementById("navBadgePending");
const navBadgeCompleted = document.getElementById("navBadgeCompleted");
const navBadgeOverdue = document.getElementById("navBadgeOverdue");

// Progress Bar Elements
const progressPercentBadge = document.getElementById("progressPercentBadge");
const progressBarFill = document.getElementById("progressBarFill");
const progressMotivation = document.getElementById("progressMotivation");

// Filter & Search Toolbar Elements
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const priorityFilter = document.getElementById("priorityFilter");
const subjectFilter = document.getElementById("subjectFilter");
const sortBy = document.getElementById("sortBy");

// Sidebar & Layout Elements
const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const mobileMenuToggle = document.getElementById("mobileMenuToggle");
const sidebarCloseBtn = document.getElementById("sidebarCloseBtn");
const sidebarSubjects = document.getElementById("sidebarSubjects");
const openSubjectManagerBtn = document.getElementById("openSubjectManagerBtn");
const openSettingsNavBtn = document.getElementById("openSettingsNavBtn");
const openSettingsTopBtn = document.getElementById("openSettingsTopBtn");
const navLinks = document.querySelectorAll(".nav-link[data-nav]");

// Profile Display Elements
const topbarGreeting = document.getElementById("topbarGreeting");
const topbarSubtitle = document.getElementById("topbarSubtitle");
const sidebarProfileProgram = document.getElementById("sidebarProfileProgram");
const sidebarProfileSemester = document.getElementById("sidebarProfileSemester");

// Task List Containers
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");
const emptyTitle = document.getElementById("emptyTitle");
const emptyDescription = document.getElementById("emptyDescription");
const loadingState = document.getElementById("loadingState");

// View Task Modal
const viewModal = document.getElementById("viewModal");
const closeViewModalBtn = document.getElementById("closeViewModalBtn");
const closeViewModalFooterBtn = document.getElementById("closeViewModalFooterBtn");
const viewEditBtn = document.getElementById("viewEditBtn");
const viewTaskTitle = document.getElementById("viewTaskTitle");
const viewTaskSubject = document.getElementById("viewTaskSubject");
const viewTaskBadges = document.getElementById("viewTaskBadges");
const viewTaskDescription = document.getElementById("viewTaskDescription");

// Delete Confirmation Modal
const deleteModal = document.getElementById("deleteModal");
const deleteTaskTitle = document.getElementById("deleteTaskTitle");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
const closeDeleteModalBtn = document.getElementById("closeDeleteModalBtn");

// Customization & Settings Modal
const settingsModal = document.getElementById("settingsModal");
const closeSettingsModalBtn = document.getElementById("closeSettingsModalBtn");
const closeSettingsModalFooterBtn = document.getElementById("closeSettingsModalFooterBtn");

// Settings Tabs
const tabBtnSubjects = document.getElementById("tabBtnSubjects");
const tabBtnProfile = document.getElementById("tabBtnProfile");
const tabBtnTheme = document.getElementById("tabBtnTheme");
const tabPanelSubjects = document.getElementById("tabPanelSubjects");
const tabPanelProfile = document.getElementById("tabPanelProfile");
const tabPanelTheme = document.getElementById("tabPanelTheme");

// Subject Manager Elements
const subjectManagerList = document.getElementById("subjectManagerList");
const newSubjectName = document.getElementById("newSubjectName");
const addNewSubjectBtn = document.getElementById("addNewSubjectBtn");
const newSubjectColorSwatches = document.getElementById("newSubjectColorSwatches");

// Profile Form Elements
const profileNameInput = document.getElementById("profileNameInput");
const profileProgramInput = document.getElementById("profileProgramInput");
const profileSemesterInput = document.getElementById("profileSemesterInput");
const profileGoalInput = document.getElementById("profileGoalInput");
const saveProfileBtn = document.getElementById("saveProfileBtn");

// Theme Elements
const themePickerGrid = document.getElementById("themePickerGrid");
const densityComfortableBtn = document.getElementById("densityComfortableBtn");
const densityCompactBtn = document.getElementById("densityCompactBtn");

// Date & Toast Elements
const currentDateText = document.getElementById("currentDateText");
const toastContainer = document.getElementById("toastContainer");

// ============================================================================
// 2. STATE MANAGEMENT
// ============================================================================

let tasks = [];
let subjects = [];
let userProfile = {};
let userTheme = {};

let editingTaskId = null;
let taskToDeleteId = null;
let currentViewNav = "all";
let currentSidebarSubject = "All";
let selectedNewSubjectColor = "blue";
let editingSubjectId = null;

// Default color mapping for subject dots
const COLOR_MAP = {
  blue: "#2563eb",
  purple: "#7c3aed",
  emerald: "#059669",
  amber: "#d97706",
  rose: "#e11d48",
  cyan: "#0891b2",
  orange: "#ea580c"
};

// ============================================================================
// 3. UTILITY & HELPER FUNCTIONS
// ============================================================================

function getTodayString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function generateId() {
  return "task_" + Date.now().toString(36) + "_" + Math.random().toString(36).substring(2, 7);
}

function generateSubjectId() {
  return "sub_" + Date.now().toString(36) + "_" + Math.random().toString(36).substring(2, 6);
}

function isTaskOverdue(task) {
  if (task.completed) return false;
  return task.dueDate < getTodayString();
}

function formatDateDisplay(dateString) {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-").map(Number);
  const dateObj = new Date(year, month - 1, day);
  return dateObj.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function renderCurrentDate() {
  const now = new Date();
  const options = { weekday: "short", month: "short", day: "numeric", year: "numeric" };
  if (currentDateText) {
    currentDateText.textContent = now.toLocaleDateString(undefined, options);
  }
}

function escapeHtml(text) {
  if (!text) return "";
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}

// ============================================================================
// 4. TOAST NOTIFICATION SYSTEM
// ============================================================================

function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;

  let iconSvg = "";
  if (type === "success") {
    iconSvg = `<svg class="toast-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
  } else if (type === "error") {
    iconSvg = `<svg class="toast-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
  } else {
    iconSvg = `<svg class="toast-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
  }

  toast.innerHTML = `${iconSvg}<span>${message}</span>`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "all 0.25s ease-out";
    setTimeout(() => toast.remove(), 250);
  }, 3200);
}

// ============================================================================
// 5. STORAGE & INITIAL DEFAULT DATA
// ============================================================================

function getDefaultSubjects() {
  return [
    { id: "sub_1", name: "Java Programming", color: "blue" },
    { id: "sub_2", name: "Database Systems", color: "emerald" },
    { id: "sub_3", name: "Mathematics", color: "amber" },
    { id: "sub_4", name: "Web Development", color: "purple" }
  ];
}

function getDefaultProfile() {
  return {
    name: "Student",
    program: "Diploma in Computer Science",
    semester: "Semester 2 • 2026",
    studyGoal: "Stay organized and on top of your study schedule."
  };
}

function getDefaultTheme() {
  return {
    theme: "blue",
    density: "comfortable"
  };
}

function getSampleTasks() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 4);
  const nextWeekStr = nextWeek.toISOString().split("T")[0];

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  return [
    {
      id: generateId(),
      title: "Complete Java Lab 5 — Polymorphism Exercise",
      subject: "Java Programming",
      dueDate: tomorrowStr,
      priority: "High",
      completed: false,
      description: "Implement method overriding and abstract class hierarchy as described in Chapter 4.",
      createdAt: Date.now() - 100000
    },
    {
      id: generateId(),
      title: "Database ER Diagram Assignment",
      subject: "Database Systems",
      dueDate: yesterdayStr,
      priority: "High",
      completed: false,
      description: "Normalize the StudyFlow database schema to 3NF and sketch relationships.",
      createdAt: Date.now() - 200000
    },
    {
      id: generateId(),
      title: "Review Discrete Mathematics Notes",
      subject: "Mathematics",
      dueDate: nextWeekStr,
      priority: "Medium",
      completed: false,
      description: "Read logic gates and set theory proof techniques for upcoming midterm quiz.",
      createdAt: Date.now() - 300000
    },
    {
      id: generateId(),
      title: "Setup VS Code & GitHub Repository",
      subject: "Web Development",
      dueDate: yesterdayStr,
      priority: "Low",
      completed: true,
      description: "Initialize git repository, commit Phase 1 frontend files, and verify setup.",
      createdAt: Date.now() - 400000
    }
  ];
}

function loadTasks() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_TASKS);
    if (!stored) {
      const initial = getSampleTasks();
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Error reading tasks:", error);
    return [];
  }
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
  } catch (error) {
    console.error("Error saving tasks:", error);
    showToast("Storage error: Could not save your tasks.", "error");
  }
}

function loadSubjects() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_SUBJECTS);
    if (!stored) {
      const initial = getDefaultSubjects();
      localStorage.setItem(STORAGE_KEY_SUBJECTS, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : getDefaultSubjects();
  } catch (error) {
    console.error("Error reading subjects:", error);
    return getDefaultSubjects();
  }
}

function saveSubjects() {
  try {
    localStorage.setItem(STORAGE_KEY_SUBJECTS, JSON.stringify(subjects));
  } catch (error) {
    console.error("Error saving subjects:", error);
    showToast("Storage error: Could not save subjects.", "error");
  }
}

function loadProfile() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (!stored) {
      const initial = getDefaultProfile();
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(initial));
      return initial;
    }
    return { ...getDefaultProfile(), ...JSON.parse(stored) };
  } catch (error) {
    console.error("Error reading profile:", error);
    return getDefaultProfile();
  }
}

function saveProfile() {
  try {
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(userProfile));
  } catch (error) {
    console.error("Error saving profile:", error);
    showToast("Storage error: Could not save profile.", "error");
  }
}

function loadTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_THEME);
    if (!stored) {
      const initial = getDefaultTheme();
      localStorage.setItem(STORAGE_KEY_THEME, JSON.stringify(initial));
      return initial;
    }
    return { ...getDefaultTheme(), ...JSON.parse(stored) };
  } catch (error) {
    console.error("Error reading theme:", error);
    return getDefaultTheme();
  }
}

function saveTheme() {
  try {
    localStorage.setItem(STORAGE_KEY_THEME, JSON.stringify(userTheme));
  } catch (error) {
    console.error("Error saving theme:", error);
  }
}

// ============================================================================
// 6. SUBJECT MANAGEMENT (ADD, EDIT / RENAME, DELETE)
// ============================================================================

/**
 * Returns color category for a given subject name.
 */
function getSubjectColor(subjectName) {
  const match = subjects.find(s => s.name.toLowerCase() === (subjectName || "").toLowerCase());
  return match ? match.color : "blue";
}

/**
 * Adds a new custom subject.
 */
function addNewSubject(name, color = "blue") {
  const trimmed = name.trim();
  if (!trimmed) {
    showToast("Please enter a subject name.", "error");
    return false;
  }

  // Check duplicate
  if (subjects.some(s => s.name.toLowerCase() === trimmed.toLowerCase())) {
    showToast(`Subject "${trimmed}" already exists.`, "error");
    return false;
  }

  const newSub = {
    id: generateSubjectId(),
    name: trimmed,
    color: color
  };

  subjects.push(newSub);
  saveSubjects();
  showToast(`Subject "${trimmed}" added successfully!`, "success");

  // Refresh UI
  populateSubjectDropdowns();
  renderSubjectManager();
  return true;
}

/**
 * Edits / Renames an existing subject.
 * Automatically updates ALL tasks assigned to this subject!
 */
function editSubject(subjectId, newName, newColor) {
  const trimmed = newName.trim();
  if (!trimmed) {
    showToast("Subject name cannot be empty.", "error");
    return false;
  }

  const subIndex = subjects.findIndex(s => s.id === subjectId);
  if (subIndex === -1) return false;

  const oldName = subjects[subIndex].name;

  // Check duplicate with other subjects
  if (subjects.some(s => s.id !== subjectId && s.name.toLowerCase() === trimmed.toLowerCase())) {
    showToast(`Another subject named "${trimmed}" already exists.`, "error");
    return false;
  }

  // 1. Update in subjects array
  subjects[subIndex].name = trimmed;
  subjects[subIndex].color = newColor;
  saveSubjects();

  // 2. Cascade update to all tasks with oldName
  let affectedTasksCount = 0;
  tasks.forEach(task => {
    if (task.subject.toLowerCase() === oldName.toLowerCase()) {
      task.subject = trimmed;
      affectedTasksCount++;
    }
  });

  if (affectedTasksCount > 0) {
    saveTasks();
  }

  showToast(`Renamed "${oldName}" to "${trimmed}" across ${affectedTasksCount} task(s)!`, "success");

  // 3. Re-render UI
  editingSubjectId = null;
  populateSubjectDropdowns();
  renderSubjectManager();
  renderTasks();
  return true;
}

/**
 * Deletes a subject with confirmation and safely reassigns tasks.
 */
function deleteSubject(subjectId) {
  const sub = subjects.find(s => s.id === subjectId);
  if (!sub) return;

  if (subjects.length <= 1) {
    showToast("You must keep at least one subject.", "error");
    return;
  }

  const taskCount = tasks.filter(t => t.subject.toLowerCase() === sub.name.toLowerCase()).length;
  let confirmMsg = `Delete subject "${sub.name}"?`;
  if (taskCount > 0) {
    confirmMsg += `\n${taskCount} task(s) currently use this subject and will be reassigned to "General".`;
  }

  if (!confirm(confirmMsg)) {
    return;
  }

  // Ensure "General" exists if reassigning
  if (taskCount > 0) {
    let generalSub = subjects.find(s => s.name.toLowerCase() === "general");
    if (!generalSub) {
      generalSub = { id: generateSubjectId(), name: "General", color: "blue" };
      subjects.push(generalSub);
    }

    tasks.forEach(t => {
      if (t.subject.toLowerCase() === sub.name.toLowerCase()) {
        t.subject = "General";
      }
    });
    saveTasks();
  }

  subjects = subjects.filter(s => s.id !== subjectId);
  saveSubjects();
  showToast(`Subject "${sub.name}" deleted.`, "info");

  populateSubjectDropdowns();
  renderSubjectManager();
  renderTasks();
}

/**
 * Populates all Subject Dropdowns & Sidebar Pills.
 */
function populateSubjectDropdowns() {
  // 1. Task Form Subject Select
  const currentFormVal = taskSubjectSelect.value;
  taskSubjectSelect.innerHTML = '<option value="" disabled selected>Select a subject...</option>';
  subjects.forEach(sub => {
    const opt = document.createElement("option");
    opt.value = sub.name;
    opt.textContent = sub.name;
    taskSubjectSelect.appendChild(opt);
  });

  // "+ Add New Subject..." option at bottom of select
  const addOpt = document.createElement("option");
  addOpt.value = "__NEW__";
  addOpt.textContent = "➕ Add New Subject...";
  taskSubjectSelect.appendChild(addOpt);

  if (subjects.some(s => s.name === currentFormVal)) {
    taskSubjectSelect.value = currentFormVal;
  }

  // 2. Toolbar Filter Select
  const currentFilterVal = subjectFilter.value;
  subjectFilter.innerHTML = '<option value="All">All Subjects</option>';
  subjects.forEach(sub => {
    const opt = document.createElement("option");
    opt.value = sub.name;
    opt.textContent = sub.name;
    subjectFilter.appendChild(opt);
  });
  if (subjects.some(s => s.name === currentFilterVal)) {
    subjectFilter.value = currentFilterVal;
  } else {
    subjectFilter.value = "All";
  }

  // 3. Sidebar Subject Pills
  sidebarSubjects.innerHTML = "";
  const allPill = document.createElement("button");
  allPill.className = `subject-pill ${currentSidebarSubject === "All" ? "active" : ""}`;
  allPill.innerHTML = `All`;
  allPill.dataset.subject = "All";
  sidebarSubjects.appendChild(allPill);

  subjects.forEach(sub => {
    const pill = document.createElement("button");
    pill.className = `subject-pill ${currentSidebarSubject === sub.name ? "active" : ""}`;
    const dotColor = COLOR_MAP[sub.color] || COLOR_MAP.blue;
    pill.innerHTML = `<span class="subject-pill-dot" style="background-color: ${dotColor};"></span>${escapeHtml(sub.name)}`;
    pill.dataset.subject = sub.name;
    sidebarSubjects.appendChild(pill);
  });
}

/**
 * Renders the Subject Manager list inside the Customization Modal.
 */
function renderSubjectManager() {
  subjectManagerList.innerHTML = "";

  subjects.forEach(sub => {
    const taskCount = tasks.filter(t => t.subject.toLowerCase() === sub.name.toLowerCase()).length;
    const item = document.createElement("div");
    item.className = "subject-manager-item";
    item.dataset.id = sub.id;

    if (editingSubjectId === sub.id) {
      // INLINE EDIT MODE
      item.innerHTML = `
        <div class="subject-edit-row">
          <input type="text" class="subject-edit-input" id="inlineEditNameInput" value="${escapeHtml(sub.name)}" maxlength="50">
          <div class="color-swatches" id="inlineColorSwatches" style="gap: 4px;">
            ${Object.keys(COLOR_MAP).map(color => `
              <button type="button" class="color-swatch-btn color-dot-${color} ${sub.color === color ? "selected" : ""}" data-color="${color}" style="width: 20px; height: 20px;"></button>
            `).join("")}
          </div>
          <button type="button" class="btn btn-primary btn-sm" data-action="save-edit" title="Save">✓</button>
          <button type="button" class="btn btn-secondary btn-sm" data-action="cancel-edit" title="Cancel">✕</button>
        </div>
      `;
    } else {
      // STANDARD DISPLAY MODE
      const dotColor = COLOR_MAP[sub.color] || COLOR_MAP.blue;
      item.innerHTML = `
        <div class="subject-item-left">
          <span class="subject-dot" style="background-color: ${dotColor};"></span>
          <span class="subject-name-text">${escapeHtml(sub.name)}</span>
          <span class="subject-task-count">${taskCount} task${taskCount !== 1 ? "s" : ""}</span>
        </div>
        <div class="subject-item-actions">
          <button type="button" class="btn-icon" data-action="start-edit" title="Rename or recolor subject" aria-label="Edit ${escapeHtml(sub.name)}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button type="button" class="btn-icon delete" data-action="delete-subject" title="Delete subject" aria-label="Delete ${escapeHtml(sub.name)}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      `;
    }

    subjectManagerList.appendChild(item);
  });
}

// Subject Manager Event Delegation (Edit & Delete)
subjectManagerList.addEventListener("click", (e) => {
  const item = e.target.closest(".subject-manager-item");
  if (!item) return;
  const subId = item.dataset.id;
  const sub = subjects.find(s => s.id === subId);

  const actionBtn = e.target.closest("[data-action]");
  if (actionBtn) {
    const action = actionBtn.dataset.action;
    if (action === "start-edit") {
      editingSubjectId = subId;
      renderSubjectManager();
      const input = document.getElementById("inlineEditNameInput");
      if (input) input.focus();
    } else if (action === "cancel-edit") {
      editingSubjectId = null;
      renderSubjectManager();
    } else if (action === "save-edit") {
      const input = document.getElementById("inlineEditNameInput");
      const selectedColorBtn = item.querySelector("#inlineColorSwatches .selected");
      const color = selectedColorBtn ? selectedColorBtn.dataset.color : sub.color;
      if (input) {
        editSubject(subId, input.value, color);
      }
    } else if (action === "delete-subject") {
      deleteSubject(subId);
    }
    return;
  }

  // Handle color swatch clicking in inline editor
  const swatchBtn = e.target.closest("#inlineColorSwatches .color-swatch-btn");
  if (swatchBtn) {
    item.querySelectorAll("#inlineColorSwatches .color-swatch-btn").forEach(b => b.classList.remove("selected"));
    swatchBtn.classList.add("selected");
  }
});

// Add New Subject Event Listener
addNewSubjectBtn.addEventListener("click", () => {
  const name = newSubjectName.value.trim();
  if (addNewSubject(name, selectedNewSubjectColor)) {
    newSubjectName.value = "";
  }
});

newSubjectName.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    addNewSubjectBtn.click();
  }
});

// Color swatch selector for new subject
newSubjectColorSwatches.addEventListener("click", (e) => {
  const btn = e.target.closest(".color-swatch-btn");
  if (!btn) return;
  newSubjectColorSwatches.querySelectorAll(".color-swatch-btn").forEach(b => b.classList.remove("selected"));
  btn.classList.add("selected");
  selectedNewSubjectColor = btn.dataset.color;
});

// When user selects "➕ Add New Subject..." from Form dropdown
taskSubjectSelect.addEventListener("change", (e) => {
  if (e.target.value === "__NEW__") {
    e.target.value = "";
    openSettingsModal("subjects");
  }
});

formManageSubjectsBtn.addEventListener("click", () => {
  openSettingsModal("subjects");
});

openSubjectManagerBtn.addEventListener("click", () => {
  openSettingsModal("subjects");
});

// ============================================================================
// 7. USER PROFILE PERSONALIZATION
// ============================================================================

function renderProfileUI() {
  if (topbarGreeting) {
    topbarGreeting.textContent = `Welcome back, ${userProfile.name} 👋`;
  }
  if (topbarSubtitle) {
    topbarSubtitle.textContent = userProfile.studyGoal;
  }
  if (sidebarProfileProgram) {
    sidebarProfileProgram.textContent = userProfile.program;
  }
  if (sidebarProfileSemester) {
    sidebarProfileSemester.textContent = userProfile.semester;
  }

  // Populate inputs in Settings Modal
  profileNameInput.value = userProfile.name;
  profileProgramInput.value = userProfile.program;
  profileSemesterInput.value = userProfile.semester;
  profileGoalInput.value = userProfile.studyGoal;
}

saveProfileBtn.addEventListener("click", () => {
  const name = profileNameInput.value.trim() || "Student";
  const program = profileProgramInput.value.trim() || "Diploma in Computer Science";
  const semester = profileSemesterInput.value.trim() || "Semester 2 • 2026";
  const studyGoal = profileGoalInput.value.trim() || "Stay organized and on top of your study schedule.";

  userProfile = { name, program, semester, studyGoal };
  saveProfile();
  renderProfileUI();
  showToast("Profile personalized successfully! ✨", "success");
});

// ============================================================================
// 8. THEME & DISPLAY CUSTOMIZATION
// ============================================================================

function applyTheme(themeName) {
  userTheme.theme = themeName;
  if (themeName === "blue") {
    delete document.documentElement.dataset.theme;
  } else {
    document.documentElement.dataset.theme = themeName;
  }
  saveTheme();

  // Update active state in theme buttons
  themePickerGrid.querySelectorAll(".theme-card-btn").forEach(btn => {
    if (btn.dataset.theme === themeName) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

function applyDensity(density) {
  userTheme.density = density;
  if (density === "compact") {
    document.body.classList.add("compact-mode");
    densityCompactBtn.classList.replace("btn-secondary", "btn-primary");
    densityComfortableBtn.classList.replace("btn-primary", "btn-secondary");
  } else {
    document.body.classList.remove("compact-mode");
    densityComfortableBtn.classList.replace("btn-secondary", "btn-primary");
    densityCompactBtn.classList.replace("btn-primary", "btn-secondary");
  }
  saveTheme();
}

themePickerGrid.addEventListener("click", (e) => {
  const btn = e.target.closest(".theme-card-btn");
  if (!btn) return;
  applyTheme(btn.dataset.theme);
  showToast(`Theme changed to ${btn.textContent.trim()}! 🎨`, "info");
});

densityComfortableBtn.addEventListener("click", () => {
  applyDensity("comfortable");
  showToast("Switched to Comfortable view.", "info");
});

densityCompactBtn.addEventListener("click", () => {
  applyDensity("compact");
  showToast("Switched to Compact view.", "info");
});

// ============================================================================
// 9. SETTINGS MODAL & TAB NAVIGATION
// ============================================================================

function openSettingsModal(defaultTab = "subjects") {
  settingsModal.classList.add("open");
  switchSettingsTab(defaultTab);
  renderSubjectManager();
  renderProfileUI();
}

function closeSettingsModal() {
  settingsModal.classList.remove("open");
  editingSubjectId = null;
}

function switchSettingsTab(tabName) {
  // Reset tabs
  [tabBtnSubjects, tabBtnProfile, tabBtnTheme].forEach(btn => {
    btn.classList.remove("active");
    btn.setAttribute("aria-selected", "false");
  });
  [tabPanelSubjects, tabPanelProfile, tabPanelTheme].forEach(panel => {
    panel.classList.remove("active");
  });

  if (tabName === "subjects") {
    tabBtnSubjects.classList.add("active");
    tabBtnSubjects.setAttribute("aria-selected", "true");
    tabPanelSubjects.classList.add("active");
  } else if (tabName === "profile") {
    tabBtnProfile.classList.add("active");
    tabBtnProfile.setAttribute("aria-selected", "true");
    tabPanelProfile.classList.add("active");
  } else if (tabName === "theme") {
    tabBtnTheme.classList.add("active");
    tabBtnTheme.setAttribute("aria-selected", "true");
    tabPanelTheme.classList.add("active");
  }
}

tabBtnSubjects.addEventListener("click", () => switchSettingsTab("subjects"));
tabBtnProfile.addEventListener("click", () => switchSettingsTab("profile"));
tabBtnTheme.addEventListener("click", () => switchSettingsTab("theme"));

openSettingsTopBtn.addEventListener("click", () => openSettingsModal("profile"));
openSettingsNavBtn.addEventListener("click", () => openSettingsModal("subjects"));
closeSettingsModalBtn.addEventListener("click", closeSettingsModal);
closeSettingsModalFooterBtn.addEventListener("click", closeSettingsModal);

// ============================================================================
// 10. METRICS & STATISTICS CALCULATION
// ============================================================================

function updateDashboardMetrics() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const overdue = tasks.filter(isTaskOverdue).length;

  // Stat Cards
  statTotal.textContent = total;
  statPending.textContent = pending;
  statCompleted.textContent = completed;
  statOverdue.textContent = overdue;

  // Sidebar Badges
  navBadgeAll.textContent = total;
  navBadgePending.textContent = pending;
  navBadgeCompleted.textContent = completed;
  navBadgeOverdue.textContent = overdue;

  // Progress Bar
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  progressPercentBadge.textContent = `${percentage}% Completed`;
  progressBarFill.style.width = `${percentage}%`;

  // Motivational message
  if (total === 0) {
    progressMotivation.textContent = "Your task list is empty. Add a study goal above to get started!";
  } else if (percentage === 100) {
    progressMotivation.textContent = "🎉 Outstanding! All study tasks are completed. You're fully caught up!";
  } else if (percentage >= 50) {
    progressMotivation.textContent = `💪 Halfway there! You have completed ${completed} out of ${total} tasks. Keep going!`;
  } else if (completed > 0) {
    progressMotivation.textContent = `🚀 Good start! ${completed} task finished, ${pending} more to complete.`;
  } else {
    progressMotivation.textContent = `⚡ You have ${pending} pending task${pending > 1 ? "s" : ""}. Start tackling them today!`;
  }
}

// ============================================================================
// 11. TASK RENDERING LOGIC
// ============================================================================

function renderTasks() {
  taskList.innerHTML = "";

  const query = searchInput.value.trim().toLowerCase();
  const selectedStatus = statusFilter.value;
  const selectedPriority = priorityFilter.value;
  const selectedSubject = subjectFilter.value;
  const selectedSort = sortBy.value;

  // Filter tasks
  let filtered = tasks.filter(task => {
    // 1. Search Query
    const matchesSearch =
      task.title.toLowerCase().includes(query) ||
      task.subject.toLowerCase().includes(query) ||
      (task.description && task.description.toLowerCase().includes(query));

    // 2. Subject Filter
    const matchesSubject =
      selectedSubject === "All" ||
      task.subject.trim().toLowerCase() === selectedSubject.toLowerCase();

    // 3. Priority Filter
    const matchesPriority =
      selectedPriority === "All" ||
      task.priority === selectedPriority;

    // 4. Status Filter
    let matchesStatus = true;
    if (selectedStatus === "Pending") {
      matchesStatus = !task.completed;
    } else if (selectedStatus === "Completed") {
      matchesStatus = task.completed;
    } else if (selectedStatus === "Overdue") {
      matchesStatus = isTaskOverdue(task);
    }

    return matchesSearch && matchesSubject && matchesPriority && matchesStatus;
  });

  // Sort tasks
  filtered.sort((a, b) => {
    if (selectedSort === "dueDate") {
      return a.dueDate.localeCompare(b.dueDate);
    }
    if (selectedSort === "priority") {
      const priorityRanks = { High: 1, Medium: 2, Low: 3 };
      return (priorityRanks[a.priority] || 4) - (priorityRanks[b.priority] || 4);
    }
    if (selectedSort === "newest") {
      return (b.createdAt || 0) - (a.createdAt || 0);
    }
    return 0;
  });

  // Empty State vs Task List
  if (filtered.length === 0) {
    emptyState.classList.add("visible");
    if (tasks.length === 0) {
      emptyTitle.textContent = "No Tasks Yet";
      emptyDescription.textContent = "Your study list is clean! Use the form above to add your first assignment.";
    } else {
      emptyTitle.textContent = "No Matching Tasks Found";
      emptyDescription.textContent = "Try adjusting your search terms or filter selections to view tasks.";
    }
  } else {
    emptyState.classList.remove("visible");
    filtered.forEach(task => {
      const card = createTaskCardElement(task);
      taskList.appendChild(card);
    });
  }
}

function createTaskCardElement(task) {
  const card = document.createElement("article");
  card.className = `task-item ${task.completed ? "completed" : ""}`;
  card.dataset.id = task.id;

  const overdue = isTaskOverdue(task);
  const color = getSubjectColor(task.subject);
  const subjectBadgeClass = `badge-subject-${color}`;

  const priorityClass = {
    Low: "badge-priority-low",
    Medium: "badge-priority-med",
    High: "badge-priority-high"
  }[task.priority] || "badge-priority-med";

  card.innerHTML = `
    <div class="task-checkbox-wrap">
      <input
        type="checkbox"
        class="task-checkbox"
        ${task.completed ? "checked" : ""}
        aria-label="Mark task '${escapeHtml(task.title)}' as ${task.completed ? "pending" : "completed"}"
        data-action="toggle"
      >
    </div>

    <div class="task-content">
      <div class="task-header-row">
        <h4 class="task-title">${escapeHtml(task.title)}</h4>
      </div>

      ${task.description ? `<p class="task-desc">${escapeHtml(task.description)}</p>` : ""}

      <div class="task-meta-row">
        <span class="badge ${subjectBadgeClass}">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          ${escapeHtml(task.subject)}
        </span>

        <span class="badge ${priorityClass}">
          ${escapeHtml(task.priority)} Priority
        </span>

        <span class="badge badge-due">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          Due: ${formatDateDisplay(task.dueDate)}
        </span>

        ${overdue ? `
          <span class="badge badge-overdue">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            Overdue
          </span>
        ` : ""}

        ${task.completed ? `
          <span class="badge badge-completed">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            Completed
          </span>
        ` : ""}
      </div>
    </div>

    <div class="task-actions">
      <button class="btn-icon" data-action="view" title="View Details" aria-label="View Details for ${escapeHtml(task.title)}">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
      </button>

      <button class="btn-icon" data-action="edit" title="Edit Task" aria-label="Edit ${escapeHtml(task.title)}">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
      </button>

      <button class="btn-icon delete" data-action="delete" title="Delete Task" aria-label="Delete ${escapeHtml(task.title)}">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
      </button>
    </div>
  `;

  return card;
}

// ============================================================================
// 12. FORM VALIDATION & TASK MUTATIONS (ADD / EDIT)
// ============================================================================

function clearValidationErrors() {
  taskTitleInput.classList.remove("is-invalid");
  taskSubjectSelect.classList.remove("is-invalid");
  taskDueDateInput.classList.remove("is-invalid");

  titleError.classList.remove("visible");
  subjectError.classList.remove("visible");
  dueDateError.classList.remove("visible");
}

function validateTaskForm() {
  let isValid = true;
  clearValidationErrors();

  const title = taskTitleInput.value.trim();
  const subject = taskSubjectSelect.value;
  const dueDate = taskDueDateInput.value;

  if (!title) {
    taskTitleInput.classList.add("is-invalid");
    titleError.classList.add("visible");
    isValid = false;
  }

  if (!subject || subject === "__NEW__") {
    taskSubjectSelect.classList.add("is-invalid");
    subjectError.classList.add("visible");
    isValid = false;
  }

  if (!dueDate || !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
    taskDueDateInput.classList.add("is-invalid");
    dueDateError.classList.add("visible");
    isValid = false;
  }

  return isValid;
}

function resetForm() {
  taskForm.reset();
  editingTaskId = null;
  clearValidationErrors();

  formTitle.textContent = "Add New Study Task";
  submitBtnText.textContent = "Add Task";
  cancelEditBtn.style.display = "none";
  taskStatusSelect.value = "Pending";
  taskDueDateInput.min = getTodayString();
}

taskForm.addEventListener("submit", function(e) {
  e.preventDefault();

  if (!validateTaskForm()) {
    showToast("Please fill in all required fields marked with an asterisk.", "error");
    return;
  }

  const title = taskTitleInput.value.trim();
  const subject = taskSubjectSelect.value;
  const dueDate = taskDueDateInput.value;
  const priority = taskPrioritySelect.value;
  const status = taskStatusSelect.value;
  const description = taskDescriptionInput.value.trim();
  const completed = status === "Completed";

  if (editingTaskId) {
    // EDIT MODE
    const taskIndex = tasks.findIndex(t => t.id === editingTaskId);
    if (taskIndex !== -1) {
      tasks[taskIndex] = {
        ...tasks[taskIndex],
        title,
        subject,
        dueDate,
        priority,
        completed,
        description
      };
      saveTasks();
      showToast("Study task updated successfully!", "success");
    }
  } else {
    // CREATE MODE
    const newTask = {
      id: generateId(),
      title,
      subject,
      dueDate,
      priority,
      completed,
      description,
      createdAt: Date.now()
    };
    tasks.unshift(newTask);
    saveTasks();
    showToast("New study task created successfully!", "success");
  }

  resetForm();
  updateDashboardMetrics();
  renderTasks();
});

cancelEditBtn.addEventListener("click", resetForm);

function startEditTask(taskId) {
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;

  editingTaskId = taskId;
  taskTitleInput.value = task.title;

  // Ensure subject exists in dropdown
  if (!subjects.some(s => s.name === task.subject)) {
    addNewSubject(task.subject, "blue");
  }
  taskSubjectSelect.value = task.subject;

  taskDueDateInput.value = task.dueDate;
  taskPrioritySelect.value = task.priority;
  taskStatusSelect.value = task.completed ? "Completed" : "Pending";
  taskDescriptionInput.value = task.description || "";

  taskDueDateInput.removeAttribute("min");

  formTitle.textContent = "Edit Study Task";
  submitBtnText.textContent = "Save Changes";
  cancelEditBtn.style.display = "inline-flex";

  clearValidationErrors();
  taskForm.scrollIntoView({ behavior: "smooth", block: "start" });
  taskTitleInput.focus();
}

// ============================================================================
// 13. MODAL INTERACTIONS (VIEW & DELETE)
// ============================================================================

function openViewModal(taskId) {
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;

  viewTaskTitle.textContent = task.title;
  viewTaskSubject.textContent = task.subject;
  viewTaskDescription.textContent = task.description || "No description provided.";

  const overdue = isTaskOverdue(task);
  const color = getSubjectColor(task.subject);
  const subjectBadgeClass = `badge-subject-${color}`;

  const priorityClass = {
    Low: "badge-priority-low",
    Medium: "badge-priority-med",
    High: "badge-priority-high"
  }[task.priority] || "badge-priority-med";

  viewTaskBadges.innerHTML = `
    <span class="badge ${subjectBadgeClass}">${escapeHtml(task.subject)}</span>
    <span class="badge ${priorityClass}">${task.priority} Priority</span>
    <span class="badge badge-due">Due: ${formatDateDisplay(task.dueDate)}</span>
    ${overdue ? '<span class="badge badge-overdue">Overdue</span>' : ""}
    <span class="badge ${task.completed ? "badge-completed" : "badge-subject-blue"}">${task.completed ? "Completed" : "Pending"}</span>
  `;

  viewEditBtn.onclick = () => {
    closeViewModal();
    startEditTask(task.id);
  };

  viewModal.classList.add("open");
}

function closeViewModal() {
  viewModal.classList.remove("open");
}

closeViewModalBtn.addEventListener("click", closeViewModal);
closeViewModalFooterBtn.addEventListener("click", closeViewModal);

function openDeleteModal(taskId) {
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;

  taskToDeleteId = taskId;
  deleteTaskTitle.textContent = `"${task.title}"`;
  deleteModal.classList.add("open");
}

function closeDeleteModal() {
  deleteModal.classList.remove("open");
  taskToDeleteId = null;
}

cancelDeleteBtn.addEventListener("click", closeDeleteModal);
closeDeleteModalBtn.addEventListener("click", closeDeleteModal);

confirmDeleteBtn.addEventListener("click", () => {
  if (!taskToDeleteId) return;

  const deletedTask = tasks.find(t => t.id === taskToDeleteId);
  tasks = tasks.filter(t => t.id !== taskToDeleteId);
  saveTasks();

  if (editingTaskId === taskToDeleteId) {
    resetForm();
  }

  closeDeleteModal();
  updateDashboardMetrics();
  renderTasks();

  showToast(`Task "${deletedTask ? deletedTask.title : ""}" deleted.`, "info");
});

// Window listeners for modal clicks & Escape key
window.addEventListener("click", (e) => {
  if (e.target === viewModal) closeViewModal();
  if (e.target === deleteModal) closeDeleteModal();
  if (e.target === settingsModal) closeSettingsModal();
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeViewModal();
    closeDeleteModal();
    closeSettingsModal();
    closeSidebar();
  }
});

// ============================================================================
// 14. TASK LIST EVENT DELEGATION
// ============================================================================

taskList.addEventListener("click", (e) => {
  const target = e.target;
  const card = target.closest(".task-item");
  if (!card) return;
  const taskId = card.dataset.id;

  // Toggle Checkbox
  if (target.matches('input[type="checkbox"]')) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      task.completed = target.checked;
      saveTasks();
      updateDashboardMetrics();
      renderTasks();
      showToast(task.completed ? "Marked as completed! 🎉" : "Marked as pending.", "info");
    }
    return;
  }

  // Action Buttons
  const actionBtn = target.closest("[data-action]");
  if (!actionBtn) return;

  const action = actionBtn.dataset.action;
  if (action === "view") {
    openViewModal(taskId);
  } else if (action === "edit") {
    startEditTask(taskId);
  } else if (action === "delete") {
    openDeleteModal(taskId);
  }
});

// ============================================================================
// 15. SEARCH, FILTER & SORT LISTENERS
// ============================================================================

searchInput.addEventListener("input", renderTasks);
statusFilter.addEventListener("change", (e) => {
  const val = e.target.value.toLowerCase();
  updateSidebarActiveNav(val);
  renderTasks();
});
priorityFilter.addEventListener("change", renderTasks);
subjectFilter.addEventListener("change", (e) => {
  currentSidebarSubject = e.target.value;
  populateSubjectDropdowns();
  renderTasks();
});
sortBy.addEventListener("change", renderTasks);

// ============================================================================
// 16. SIDEBAR NAVIGATION & MOBILE DRAWER
// ============================================================================

function updateSidebarActiveNav(navType) {
  navLinks.forEach(link => {
    if (link.dataset.nav === navType) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    const nav = link.dataset.nav;
    if (nav === "settings") {
      openSettingsModal("subjects");
      closeSidebar();
      return;
    }

    currentViewNav = nav;
    updateSidebarActiveNav(nav);

    if (nav === "all") {
      statusFilter.value = "All";
    } else if (nav === "pending") {
      statusFilter.value = "Pending";
    } else if (nav === "completed") {
      statusFilter.value = "Completed";
    } else if (nav === "overdue") {
      statusFilter.value = "Overdue";
    }

    renderTasks();
    closeSidebar();
  });
});

sidebarSubjects.addEventListener("click", (e) => {
  const pill = e.target.closest(".subject-pill");
  if (!pill) return;

  currentSidebarSubject = pill.dataset.subject;
  subjectFilter.value = currentSidebarSubject;
  populateSubjectDropdowns();
  renderTasks();
  closeSidebar();
});

function openSidebar() {
  sidebar.classList.add("open");
  sidebarOverlay.classList.add("open");
}

function closeSidebar() {
  sidebar.classList.remove("open");
  sidebarOverlay.classList.remove("open");
}

mobileMenuToggle.addEventListener("click", openSidebar);
sidebarCloseBtn.addEventListener("click", closeSidebar);
sidebarOverlay.addEventListener("click", closeSidebar);

// ============================================================================
// 17. APPLICATION INITIALIZATION
// ============================================================================

function initializeApp() {
  // 1. Current date header
  renderCurrentDate();

  // 2. Load stored data
  tasks = loadTasks();
  subjects = loadSubjects();
  userProfile = loadProfile();
  userTheme = loadTheme();

  // 3. Apply Theme & Density
  applyTheme(userTheme.theme || "blue");
  applyDensity(userTheme.density || "comfortable");

  // 4. Render User Profile
  renderProfileUI();

  // 5. Populate Subjects in Form & Filters
  populateSubjectDropdowns();

  // 6. Set minimum due date to today
  taskDueDateInput.min = getTodayString();

  // 7. Update Dashboard Metrics & Task List
  updateDashboardMetrics();
  renderTasks();
}

// Run when DOM is ready
document.addEventListener("DOMContentLoaded", initializeApp);
