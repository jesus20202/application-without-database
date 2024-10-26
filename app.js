class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.renderTasks();
        this.updatePendingCount();
    }

    addTask(text) {
        if (text.trim() === '') return;
        
        const task = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.tasks.push(task);
        this.saveTasks();
        this.renderTasks();
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
        }
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.saveTasks();
        this.renderTasks();
    }

    filterTasks(filter) {
        this.currentFilter = filter;
        this.renderTasks();
        
        // Update filter buttons
        document.querySelectorAll('.filters button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`.filters button[onclick="filterTasks('${filter}')"]`).classList.add('active');
    }

    getFilteredTasks() {
        switch (this.currentFilter) {
            case 'active':
                return this.tasks.filter(t => !t.completed);
            case 'completed':
                return this.tasks.filter(t => t.completed);
            default:
                return this.tasks;
        }
    }

    renderTasks() {
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = '';
        
        const filteredTasks = this.getFilteredTasks();
        
        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            
            li.innerHTML = `
                <input type="checkbox" 
                       ${task.completed ? 'checked' : ''} 
                       onchange="taskManager.toggleTask(${task.id})">
                <span>${task.text}</span>
                <button onclick="taskManager.deleteTask(${task.id})">Eliminar</button>
            `;
            
            taskList.appendChild(li);
        });

        this.updatePendingCount();
    }

    updatePendingCount() {
        const pendingCount = this.tasks.filter(t => !t.completed).length;
        document.getElementById('pendingTasks').textContent = pendingCount;
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
}

// Inicializar el gestor de tareas
const taskManager = new TaskManager();

// Funciones globales para los eventos HTML
function addTask() {
    const input = document.getElementById('taskInput');
    taskManager.addTask(input.value);
    input.value = '';
}

function filterTasks(filter) {
    taskManager.filterTasks(filter);
}

// Evento para añadir tarea con Enter
document.getElementById('taskInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});