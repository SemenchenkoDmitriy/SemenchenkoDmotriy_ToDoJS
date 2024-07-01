(() => {

let todos = [];
let currentFilter = 'all';
let currentPage = 1;

const ITEMS_PER_PAGE = 5;
const KEY_ENTER = 'Enter';
const KEY_ESCAPE = 'Escape';
const input = document.querySelector('.todo-app input[type="text"]');
const addButton = document.querySelector('.add-button');
const todoList = document.querySelector('.todo-app ul');
const checkAllCheckbox = document.getElementById('check-all');
const deleteAllCompletedButton = document.querySelector('.todo-app button.red');
const filterAllButton = document.getElementById('filter-all');
const filterActiveButton = document.getElementById('filter-active');
const filterCompletedButton = document.getElementById('filter-completed');
const paginationContainer = document.querySelector('.pagination');

// Отображение списка задач с учетом фильтрации и пагинации
const renderTodos = () => {
    const filteredTodos = filterTodos(todos, currentFilter);
    const { paginatedTodos, totalPages } = paginateTodos(filteredTodos, currentPage, ITEMS_PER_PAGE);

    todoList.innerHTML = "";
    paginatedTodos.forEach((todo) => {
        todoList.innerHTML += `
            <li class="todo-item" data-id="${todo.id}">
                <input type="checkbox" ${todo.completed ? 'checked' : ''} data-id="${todo.id}">
                <span class="text" data-id="${todo.id}">${escapeHtml(todo.text)}</span>
                <span class="delete" data-id="${todo.id}">&times;</span>
            </li>
        `;
    });

    updateCounters();
    renderPagination(totalPages);
    updateFilterButtons();
};

// Для проверки экранирования &quot &#8470; &#58; &#37; &#63; &#42;
const escapeHtml = (text) => {
    const map = {
        '<': '&lt;',
        '>': '&gt;',
        '/': '&#x2F;',
        '№': '&#8470;',
        '%': '&#37;',
        ':': '&#58;',
        '?': '&#63;',
        '*': '&#42;',
        '"': '&quot;',
    };
    return text.replace(/[<>/№%:?*"]/g, (m) => map[m]);
};

// Фильтрация задач по текущему фильтру
const filterTodos = (todos, filter) => {
    return todos.filter(todo => {
        if (filter === 'active') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        return true;
    });
};

// Пагинация задач
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

// Добавление новой задачи
const addTodo = () => {
    let text = escapeHtml(input.value.trim().replace(/\s+/g, ' '));
    if (text.length > 255) {
        text = text.substring(0, 255);
    }
    if (text !== '') {
        todos.push({ id: Date.now(), text, completed: false });
        input.value = '';
        if (currentFilter === 'completed') {
            currentFilter = 'all';
        }
        currentPage = Math.ceil(todos.length / ITEMS_PER_PAGE);
        renderTodos();
    }
};

// Удаление задачи по id
const deleteTodo = (id) => {
    todos = todos.filter(todo => todo.id !== parseInt(id, 10));
    if ((currentPage - 1) * ITEMS_PER_PAGE >= todos.length && currentPage > 1) {
        currentPage--;
    }
    renderTodos();
};

// Переключение состояния выполнения задачи
const toggleComplete = (id) => {
    const todo = todos.find(todo => todo.id === parseInt(id, 10));
    if (todo) {
        todo.completed = !todo.completed;
    }
    renderTodos();
};

// Обновление счетчиков задач (все, активные, выполненные)
const updateCounters = () => {
    const remaining = todos.reduce((count, todo) => !todo.completed ? count + 1 : count, 0);
    const completed = todos.length - remaining;
    filterAllButton.textContent = `All (${todos.length})`;
    filterActiveButton.textContent = `Active (${remaining})`;
    filterCompletedButton.textContent = `Completed (${completed})`;
};

// Удаление всех выполненных задач
const deleteAllCompleted = () => {
    todos = todos.filter(todo => !todo.completed);
    currentPage = Math.min(currentPage, Math.ceil(todos.length / ITEMS_PER_PAGE));
    checkAllCheckbox.checked = false; // Сброс галочки "check all"
    renderTodos();
};

// Создание элемента ввода для редактирования текста задачи
const createEditInput = (id, oldText) => {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = oldText;
    input.className = 'edit-input';
    input.dataset.oldText = oldText; // Сохраняем старый текст в data-атрибуте

    return input;
};

// Редактирование текста задачи
const editTodoText = (id) => {
    const todoItem = todoList.querySelector(`li[data-id="${id}"]`);
    const textSpan = todoItem.querySelector('.text');
    const oldText = textSpan.textContent;

    const input = createEditInput(id, oldText);

    todoItem.replaceChild(input, textSpan);
    input.focus();
};

// Обработка события ввода при редактировании задачи
const handleEditInput = (event) => {
    if (event.target.matches('.edit-input')) {
        const id = parseInt(event.target.closest('li').dataset.id, 10);

        if (event.type === 'focusout' || (event.type === 'keydown' && event.key === KEY_ENTER)) {
            let newText = escapeHtml(event.target.value.trim().replace(/\s+/g, ' '));
            if (newText.length > 255) {
                newText = newText.substring(0, 255);
            }
            if (newText !== '') {
                todos.find(todo => todo.id === id).text = newText;
            }
            renderTodos();
        } else if (event.type === 'keydown' && event.key === KEY_ESCAPE) {
            event.target.value = event.target.dataset.oldText; // Восстанавливаем старый текст
            renderTodos();
        }
    }
};

// Отметить все задачи как выполненные/невыполненные
const checkAllTodos = (event) => {
    const isChecked = event.target.checked;
    todos.forEach(todo => {
        todo.completed = isChecked;
    });
    renderTodos();
};

// Добавление задачи по нажатию клавиши Enter
const handleInputKeydown = (event) => {
    if (event.key === KEY_ENTER) {
        addTodo();
    }
};

// Обработка изменения состояния выполнения задачи
const handleTodoListChange = (event) => {
    if (event.target.matches('input[type="checkbox"]')) {
        toggleComplete(event.target.closest('li').dataset.id);
        checkAllCheckbox.checked = todos.length > 0 && todos.every(todo => todo.completed);
    }
};

// Обработка клика по кнопке удаления задачи
const handleTodoListClick = (event) => {
    if (event.target.matches('.delete')) {
        const id = event.target.closest('li').dataset.id;
        deleteTodo(id);
    }
};

// Обработка двойного клика по тексту задачи для редактирования
const handleTodoListDoubleClick = (event) => {
    if (event.target.matches('.text')) {
        editTodoText(event.target.closest('li').dataset.id);
    }
};

// Обработка клика по кнопкам фильтрации задач
const handleFilterClick = (filter) => {
    currentFilter = filter;
    currentPage = 1;
    renderTodos();
};

// Обновление кнопок фильтрации в зависимости от выбранного фильтра
const updateFilterButtons = () => {
    filterAllButton.classList.toggle('active', currentFilter === 'all');
    filterActiveButton.classList.toggle('active', currentFilter === 'active');
    filterCompletedButton.classList.toggle('active', currentFilter === 'completed');
};

// Отображение кнопок пагинации
const renderPagination = (totalPages) => {
    paginationContainer.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.className = 'page-number';
        if (i === currentPage) {
            pageButton.disabled = true;
        }
        paginationContainer.appendChild(pageButton);
    }
};

// Обработка клика по кнопкам пагинации
const handlePageClick = (event) => {
    if (event.target.matches('.page-number')) {
        currentPage = parseInt(event.target.textContent, 10);
        renderTodos();
    }
};

// Привязка обработчиков событий
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
todoList.addEventListener('focusout', handleEditInput);
todoList.addEventListener('keydown', handleEditInput);
paginationContainer.addEventListener('click', handlePageClick);

// Первоначальное отображение списка задач
renderTodos();
})();