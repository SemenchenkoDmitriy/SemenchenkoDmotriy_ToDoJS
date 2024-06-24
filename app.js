document.addEventListener('DOMContentLoaded', () => {
    const input = document.querySelector('.todo-app input[type="text"]');
    const addButton = document.querySelector('.add-button');
    const todoList = document.querySelector('.todo-app ul');
    const checkAllCheckbox = document.getElementById('check-all');
    const deleteAllCompletedButton = document.querySelector('.todo-app button:nth-of-type(2)');
    const filterAllButton = document.getElementById('filter-all');
    const filterActiveButton = document.getElementById('filter-active');
    const filterCompletedButton = document.getElementById('filter-completed');

    let todos = [];

    const renderTodos = () => {
        todoList.innerHTML = todos.map((todo, index) => `
            <li class="todo-item">
                <input type="checkbox" ${todo.completed ? 'checked' : ''} data-index="${index}">
                <span class="text" data-index="${index}">${todo.text}</span>
                <span class="delete" data-index="${index}">&times;</span>
            </li>
        `).join('');

        updateCounters();
    };

    const addTodo = () => {
        const text = input.value.trim();
        if (text !== '') {
            todos.push({ text, completed: false });
            input.value = '';
            renderTodos();
        }
    };

    const deleteTodo = (index) => {
        todos.splice(index, 1);
        renderTodos();
    };

    const toggleComplete = (index) => {
        todos[index].completed = !todos[index].completed;
        renderTodos();
    };

    const updateCounters = () => {
        const remaining = todos.reduce((count, todo) => !todo.completed ? count + 1 : count, 0);
        const completed = todos.length - remaining;
        filterAllButton.textContent = `All (${todos.length})`;
        filterActiveButton.textContent = `Active (${remaining})`;
        filterCompletedButton.textContent = `Completed (${completed})`;
    };

    const deleteAllCompleted = () => {
        todos = todos.filter(todo => !todo.completed);
        renderTodos();
    };

    const editTodoText = (index) => {
        const todoItem = todoList.children[index];
        const textSpan = todoItem.querySelector('.text');
        const oldText = textSpan.textContent;

        const input = document.createElement('input');
        input.type = 'text';
        input.value = oldText;
        input.className = 'edit-input';

        const saveText = () => {
            todos[index].text = input.value.trim();
            renderTodos();
        };

        input.addEventListener('blur', saveText);
        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                saveText();
            }
        });

        todoItem.replaceChild(input, textSpan);
        input.focus();
    };

    const checkAllTodos = (event) => {
        const isChecked = event.target.checked;
        todos.forEach(todo => {
            todo.completed = isChecked;
        });
        renderTodos();
    };

    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            addTodo();
        }
    });

    addButton.addEventListener('click', addTodo);
    deleteAllCompletedButton.addEventListener('click', deleteAllCompleted);
    checkAllCheckbox.addEventListener('change', checkAllTodos);

    todoList.addEventListener('change', (event) => {
        if (event.target.matches('input[type="checkbox"]')) {
            toggleComplete(event.target.dataset.index);
        }
    });

    todoList.addEventListener('click', (event) => {
        if (event.target.matches('.delete')) {
            deleteTodo(event.target.dataset.index);
        } else if (event.target.matches('.text')) {
            editTodoText(event.target.dataset.index);
        }
    });

    renderTodos();
});