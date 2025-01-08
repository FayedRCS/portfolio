// Select DOM elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

// Load tasks from localStorage on page load
document.addEventListener('DOMContentLoaded', loadTasks);

// Add a new task
addTaskBtn.addEventListener('click', addTask);

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') return; // Prevent adding empty tasks

    // Create a new list item
    const li = createTaskElement(taskText, false); // New tasks are not completed by default
    taskList.appendChild(li);

    taskInput.value = ''; // Clear input field
    saveTasks(); // Save updated tasks
    sortTasks(); // Sort tasks
}

function createTaskElement(taskText, isCompleted) {
    const li = document.createElement('li');

    // Add a checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = isCompleted;
    checkbox.addEventListener('change', () => {
        li.style.color = checkbox.checked ? 'green' : 'black'; // Change font color
        saveTasks(); // Update localStorage
        sortTasks(); // Re-sort tasks
    });

    // Set initial style based on completion status
    li.style.color = isCompleted ? 'green' : 'black';

    // Add task text in a span (editable later)
    const taskSpan = document.createElement('span');
    taskSpan.textContent = taskText;

    // Add an Edit button
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => {
        const newText = prompt('Edit your task:', taskSpan.textContent);
        if (newText !== null && newText.trim() !== '') {
            taskSpan.textContent = newText.trim();
            saveTasks(); // Save updated task
        }
    });

    // Add a Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => {
        taskList.removeChild(li);
        saveTasks(); // Update localStorage
    });

    li.appendChild(checkbox);
    li.appendChild(taskSpan);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    return li;
}

function saveTasks() {
    const tasks = [];
    taskList.querySelectorAll('li').forEach(li => {
        const checkbox = li.querySelector('input[type="checkbox"]');
        const taskText = li.querySelector('span').textContent;
        tasks.push({ text: taskText, completed: checkbox.checked }); // Save task text and completion status
    });
    localStorage.setItem('tasks', JSON.stringify(tasks)); // Save tasks as JSON
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const li = createTaskElement(task.text, task.completed);
        taskList.appendChild(li);
    });
    sortTasks(); // Ensure tasks are sorted after loading
}

function sortTasks() {
    const items = Array.from(taskList.children);
    items.sort((a, b) => {
        const aCompleted = a.querySelector('input[type="checkbox"]').checked;
        const bCompleted = b.querySelector('input[type="checkbox"]').checked;
        return aCompleted - bCompleted; // Unchecked (false) comes before checked (true)
    });
    items.forEach(item => taskList.appendChild(item)); // Re-append sorted items
}

