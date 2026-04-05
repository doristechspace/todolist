document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addBtn = document.getElementById('add-btn');
    const taskList = document.getElementById('task-list');
    const taskCount = document.getElementById('task-count');
    const clearAllBtn = document.getElementById('clear-all');

    // Load tasks from local storage
    let tasks = JSON.parse(localStorage.getItem('todo_tasks_somiee')) || [];

    function saveTasks() {
        localStorage.setItem('todo_tasks_somiee', JSON.stringify(tasks));
    }

    function renderTasks() {
        taskList.innerHTML = '';
        let pendingCount = 0;

        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            if (task.completed) {
                li.classList.add('completed');
            } else {
                pendingCount++;
            }

            li.innerHTML = `
                <div class="task-content" data-index="${index}">
                    <div class="checkbox">
                        <i class="fas fa-check"></i>
                    </div>
                    <span class="task-text">${escapeHTML(task.text)}</span>
                </div>
                <button class="delete-btn" data-index="${index}" aria-label="Delete Task">
                    <i class="fas fa-trash-alt"></i>
                </button>
            `;

            taskList.appendChild(li);
        });

        // Add event listeners right after adding elements to the DOM
        document.querySelectorAll('.task-content').forEach(element => {
            element.addEventListener('click', () => toggleTask(element.dataset.index));
        });

        document.querySelectorAll('.delete-btn').forEach(element => {
            element.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteTask(element.dataset.index, element.closest('li'));
            });
        });

        // Update task count footer
        taskCount.textContent = `${pendingCount} ${pendingCount === 1 ? 'task' : 'tasks'} pending`;
        saveTasks();
    }

    function addTask() {
        const text = taskInput.value.trim();
        if (text) {
            tasks.push({ text, completed: false });
            taskInput.value = '';
            renderTasks();
        }
    }

    function toggleTask(index) {
        tasks[index].completed = !tasks[index].completed;
        renderTasks();
    }

    function deleteTask(index, elementNode) {
        // Add animation class for smooth deletion
        elementNode.classList.add('removing');
        
        // Wait for animation to finish before actually removing from array
        setTimeout(() => {
            tasks.splice(index, 1);
            renderTasks();
        }, 300);
    }

    function clearAll() {
        if(tasks.length > 0) {
            const items = document.querySelectorAll('li');
            items.forEach(item => item.classList.add('removing'));
            
            setTimeout(() => {
                tasks = [];
                renderTasks();
            }, 300);
        }
    }

    // Event Listeners
    addBtn.addEventListener('click', addTask);
    
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    clearAllBtn.addEventListener('click', clearAll);

    // Simple HTML escaper to prevent XSS attacks if user enters script tags
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }

    // Initial Render
    renderTasks();
});
