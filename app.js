document.addEventListener('DOMContentLoaded', () => {
    const input = document.querySelector('.todo-app input[type="text"]');
    const addButton = document.querySelector('.add-button');
    const todoList = document.querySelector('.todo-app ul');
    const itemsLeft = document.querySelector('.todo-app .center-text span:first-of-type');
    const itemsCompleted = document.querySelector('.todo-app .center-text span:last-of-type');

    let todos = [];

    function renderTodos() {
        todoList.innerHTML = '';
        todos.forEach((todo, index) => {
            const li = document.createElement('li');
            li.className = 'todo-item';
            li.innerHTML = `
                <input type="checkbox" ${todo.completed ? 'checked' : ''}>
                <span class="text">${todo.text}</span>
                <span class="delete">&times;</span>
            `;
            li.querySelector('input[type="checkbox"]').addEventListener('change', () => {
                toggleComplete(index);
            });
            li.querySelector('.delete').addEventListener('click', () => {
                deleteTodo(index);
            });
            todoList.appendChild(li);
        });
    }

    function addTodo() {
        const text = input.value.trim();
        if (text !== '') {
            todos.push({ text, completed: false });
            input.value = '';
            renderTodos();
        }
    }

    function deleteTodo(index) {
        todos.splice(index, 1);
        renderTodos();
    }
    
    addButton.addEventListener('click', addTodo);
    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            addTodo();
        }
    });

    renderTodos();

});