let currentFilter = "all";

    document.addEventListener("DOMContentLoaded", () => {
      loadTheme();
      loadTasks();
    });

    function toggleTheme() {
      document.body.classList.toggle("light");
      localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark");
    }

    function loadTheme() {
      const theme = localStorage.getItem("theme");
      if (theme === "light") document.body.classList.add("light");
    }

    function addTask() {
      const input = document.getElementById("taskInput");
      const dateInput = document.getElementById("dueDate");
      const taskText = input.value.trim();
      const dueDate = dateInput.value;

      if (taskText === "") {
        alert("⚠ Please enter a task!");
        return;
      }

      const task = {
        text: taskText,
        completed: false,
        dueDate: dueDate || null
      };

      saveTask(task);
      input.value = "";
      dateInput.value = "";
      loadTasks();
    }

    function addTaskToDOM(task) {
      const list = document.getElementById("taskList");

      const li = document.createElement("li");
      if (task.completed) li.classList.add("completed");

      const taskInfo = document.createElement("div");
      taskInfo.classList.add("task-info");

      const text = document.createElement("span");
      text.textContent = task.text;

      const due = document.createElement("div");
      due.classList.add("due-date");
      if (task.dueDate) due.textContent = "Due: " + task.dueDate;

      taskInfo.appendChild(text);
      taskInfo.appendChild(due);

      const actions = document.createElement("div");
      actions.classList.add("actions");

      const completeBtn = document.createElement("button");
      completeBtn.textContent = "✔";
      completeBtn.classList.add("complete-btn");
      completeBtn.onclick = () => toggleComplete(task.text);

      const editBtn = document.createElement("button");
      editBtn.textContent = "✏";
      editBtn.classList.add("edit-btn");
      editBtn.onclick = () => editTask(task.text);

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "✖";
      deleteBtn.classList.add("delete-btn");
      deleteBtn.onclick = () => deleteTask(task.text);

      actions.appendChild(completeBtn);
      actions.appendChild(editBtn);
      actions.appendChild(deleteBtn);

      li.appendChild(taskInfo);
      li.appendChild(actions);
      list.appendChild(li);
    }

    function toggleComplete(taskText) {
      let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      tasks = tasks.map(task => {
        if (task.text === taskText) task.completed = !task.completed;
        return task;
      });
      localStorage.setItem("tasks", JSON.stringify(tasks));
      loadTasks();
    }

    function editTask(taskText) {
      let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      const task = tasks.find(t => t.text === taskText);

      if (task) {
        const newText = prompt("Edit your task:", task.text);
        if (newText !== null && newText.trim() !== "") {
          task.text = newText.trim();
          localStorage.setItem("tasks", JSON.stringify(tasks));
          loadTasks();
        }
      }
    }

    function deleteTask(taskText) {
      let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      tasks = tasks.filter(task => task.text !== taskText);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      loadTasks();
    }

    function saveTask(task) {
      let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      tasks.push(task);
      tasks.sort((a, b) => new Date(a.dueDate || "9999-12-31") - new Date(b.dueDate || "9999-12-31"));
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function loadTasks() {
      const list = document.getElementById("taskList");
      list.innerHTML = "";

      let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

      if (currentFilter === "completed") {
        tasks = tasks.filter(t => t.completed);
      } else if (currentFilter === "pending") {
        tasks = tasks.filter(t => !t.completed);
      }

      tasks.forEach(task => addTaskToDOM(task));
      updateCounters();
    }

    function filterTasks(filter) {
      currentFilter = filter;
      document.querySelectorAll(".filters button").forEach(btn => btn.classList.remove("active"));
      document.querySelector(`.filters button[onclick="filterTasks('${filter}')"]`).classList.add("active");
      loadTasks();
    }

    function updateCounters() {
      let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      const total = tasks.length;
      const completed = tasks.filter(t => t.completed).length;
      const pending = total - completed;

      document.getElementById("taskCounters").textContent =
        `Total: ${total} | Completed: ${completed} | Pending: ${pending}`;
    }