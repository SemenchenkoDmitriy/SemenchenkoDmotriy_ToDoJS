document.addEventListener('DOMContentLoaded', () => {
    const input = document.querySelector('.todo-app input[type="text"]');
    const addButton = document.querySelector('.add-button');
    const todoList = document.querySelector('.todo-app ul');
    const itemsLeft = document.querySelector('.todo-app .center-text span:first-of-type');
    const itemsCompleted = document.querySelector('.todo-app .center-text span:last-of-type');
    const checkAllButton = document.querySelector('.todo-app button:nth-of-type(2)');
    const deleteAllCompletedButton = document.querySelector('.todo-app button:nth-of-type(3)');

    let todos = [];

    const renderTodos = () => {
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
            li.querySelector('.text').addEventListener('dblclick', () => {
                editTodoText(index);
            });

            todoList.appendChild(li);
        });
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
        const remaining = todos.filter(todo => !todo.completed).length;
        const completed = todos.filter(todo => todo.completed).length;
        itemsLeft.textContent = `${remaining} tasks active`;
        itemsCompleted.textContent = `${completed} completed`;
    };

    const checkAll = () => {
        todos.forEach(todo => todo.completed = true);
        renderTodos();
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

    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            addTodo();
        }
    });

    checkAllButton.addEventListener('click', checkAll);
    deleteAllCompletedButton.addEventListener('click', deleteAllCompleted);
    addButton.addEventListener('click', addTodo);
    
    renderTodos();
});