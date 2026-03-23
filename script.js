const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const prioritySelect = document.getElementById("priority");
const progressBar = document.getElementById("progressBar");
const themeToggle = document.getElementById("themeToggle");
const emptyMsg = document.getElementById("emptyMsg");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// SAVE
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// RENDER
function renderTasks() {
  taskList.innerHTML = "";

  emptyMsg.style.display = tasks.length === 0 ? "block" : "none";

  let completedCount = 0;

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.draggable = true;

    li.classList.add(task.priority);

    if (task.completed) {
      li.classList.add("completed");
      completedCount++;
    }

    const span = document.createElement("span");
    span.textContent = task.text;

    // TOGGLE COMPLETE
    li.addEventListener("click", () => {
      tasks[index].completed = !tasks[index].completed;
      saveTasks();
      renderTasks();
    });

    // DELETE
    const del = document.createElement("button");
    del.textContent = "X";

    del.onclick = (e) => {
      e.stopPropagation();
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    };

    // DRAG EVENTS
    li.addEventListener("dragstart", () => {
      li.classList.add("dragging");
    });

    li.addEventListener("dragend", () => {
      li.classList.remove("dragging");
    });

    li.append(span, del);
    taskList.appendChild(li);
  });

  updateProgress(completedCount);
}

// PROGRESS
function updateProgress(completed) {
  const percent = tasks.length === 0 ? 0 : (completed / tasks.length) * 100;
  progressBar.style.width = percent + "%";
}

// ADD TASK
function addTask() {
  const text = input.value.trim();
  if (!text) return;

  tasks.push({
    text,
    completed: false,
    priority: prioritySelect.value
  });

  input.value = "";
  saveTasks();
  renderTasks();
}

// DRAG DROP REORDER
taskList.addEventListener("dragover", (e) => {
  e.preventDefault();
  const dragging = document.querySelector(".dragging");
  const afterElement = [...taskList.children].find(child => {
    return e.clientY <= child.getBoundingClientRect().top + child.offsetHeight / 2;
  });

  if (afterElement == null) {
    taskList.appendChild(dragging);
  } else {
    taskList.insertBefore(dragging, afterElement);
  }
});

// THEME TOGGLE
themeToggle.onclick = () => {
  document.body.classList.toggle("dark");
};

// EVENTS
addBtn.onclick = addTask;
input.addEventListener("keypress", e => {
  if (e.key === "Enter") addTask();
});

// INIT
renderTasks();