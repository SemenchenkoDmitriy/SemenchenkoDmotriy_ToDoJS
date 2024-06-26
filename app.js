document.addEventListener('DOMContentLoaded', () => {
const ITEMS_PER_PAGE = 5;

const input = document.querySelector('.todo-app input[type="text"]');
const addButton = document.querySelector('.add-button');
const todoList = document.querySelector('.todo-app ul');
const checkAllCheckbox = document.getElementById('check-all');
const deleteAllCompletedButton = document.querySelector('.todo-app button.red');
const filterAllButton = document.getElementById('filter-all');
const filterActiveButton = document.getElementById('filter-active');
const filterCompletedButton = document.getElementById('filter-completed');
const paginationContainer = document.querySelector('.pagination');

let todos = [];
let currentFilter = 'all';
let currentPage = 1;

const renderTodos = () => {
    const filteredTodos = filterTodos(todos, currentFilter);
    const { paginatedTodos, totalPages } = paginateTodos(filteredTodos, currentPage, ITEMS_PER_PAGE);

    todoList.innerHTML = paginatedTodos.map((todo, index) => `
        <li class="todo-item" data-id="${todos.indexOf(todo)}">
            <input type="checkbox" ${todo.completed ? 'checked' : ''} data-index="${index}">
            <span class="text" data-index="${index}">${todo.text}</span>
            <span class="delete" data-index="${index}">&times;</span>
        </li>
    `).join('');

    updateCounters();
    renderPagination(totalPages);
    updateFilterButtons();
};

const filterTodos = (todos, filter) => {
    return todos.filter(todo => {
        if (filter === 'active') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        return true;
    });
};

const paginateTodos = (todos, page, itemsPerPage) => {
    const totalPages = Math.ceil(todos.length / itemsPerPage);
    page = Math.min(page, totalPages);

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    return {
        paginatedTodos: todos.slice(start, end),
        totalPages: totalPages,
    };
};

const addTodo = () => {
    const text = input.value.trim();
    if (text !== '') {
        todos.push({ text, completed: false });
        input.value = '';
        currentPage = Math.ceil(todos.length / ITEMS_PER_PAGE);
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

const createEditInput = (index, oldText, saveTextCallback) => {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = oldText;
    input.className = 'edit-input';

    input.addEventListener('blur', saveTextCallback);
    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            saveTextCallback();
        }
    });

    return input;
};

const editTodoText = (index) => {
    const todoItem = todoList.querySelector(`li[data-id="${index}"]`);
    const textSpan = todoItem.querySelector('.text');
    const oldText = textSpan.textContent;

    const saveText = () => {
        todos[index].text = input.value.trim();
        renderTodos();
    };

    const input = createEditInput(index, oldText, saveText);

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

const handleInputKeydown = (event) => {
    if (event.key === 'Enter') {
        addTodo();
    }
};

const handleTodoListChange = (event) => {
    if (event.target.matches('input[type="checkbox"]')) {
        toggleComplete(event.target.closest('li').dataset.id);
    }
};

const handleTodoListClick = (event) => {
    if (event.target.matches('.delete')) {
        deleteTodo(event.target.closest('li').dataset.id);
    }
};

const handleTodoListDoubleClick = (event) => {
    if (event.target.matches('.text')) {
        editTodoText(event.target.closest('li').dataset.id);
    }
};

const handleFilterClick = (filter) => {
    currentFilter = filter;
    currentPage = 1;
    renderTodos();
};

const updateFilterButtons = () => {
    filterAllButton.classList.toggle('active', currentFilter === 'all');
    filterActiveButton.classList.toggle('active', currentFilter === 'active');
    filterCompletedButton.classList.toggle('active', currentFilter === 'completed');
};

const renderPagination = (totalPages) => {
    paginationContainer.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.className = 'page-number';
        if (i === currentPage) {
            pageButton.disabled = true;
        }
        pageButton.addEventListener('click', () => {
            currentPage = i;
            renderTodos();
        });
        paginationContainer.appendChild(pageButton);
    }
};

input.addEventListener('keydown', handleInputKeydown);
addButton.addEventListener('click', addTodo);
deleteAllCompletedButton.addEventListener('click', deleteAllCompleted);
checkAllCheckbox.addEventListener('change', checkAllTodos);
todoList.addEventListener('change', handleTodoListChange);
todoList.addEventListener('click', handleTodoListClick);
todoList.addEventListener('dblclick', handleTodoListDoubleClick);
filterAllButton.addEventListener('click', () => handleFilterClick('all'));
filterActiveButton.addEventListener('click', () => handleFilterClick('active'));
filterCompletedButton.addEventListener('click', () => handleFilterClick('completed'));

renderTodos();
});
