const INPUT_SELECTOR = '.todo-app input[type="text"]';
const ADD_BUTTON_SELECTOR = '.add-button';
const TODO_LIST_SELECTOR = '.todo-app ul';
const CHECK_ALL_CHECKBOX_ID = 'check-all';
const DELETE_ALL_COMPLETED_BUTTON_SELECTOR = '.todo-app button:nth-of-type(2)';
const FILTER_ALL_BUTTON_ID = 'filter-all';
const FILTER_ACTIVE_BUTTON_ID = 'filter-active';
const FILTER_COMPLETED_BUTTON_ID = 'filter-completed';

document.addEventListener('DOMContentLoaded', () => {
const input = document.querySelector(INPUT_SELECTOR);
const addButton = document.querySelector(ADD_BUTTON_SELECTOR);
const todoList = document.querySelector(TODO_LIST_SELECTOR);
const checkAllCheckbox = document.getElementById(CHECK_ALL_CHECKBOX_ID);
const deleteAllCompletedButton = document.querySelector(DELETE_ALL_COMPLETED_BUTTON_SELECTOR);
const filterAllButton = document.getElementById(FILTER_ALL_BUTTON_ID);
const filterActiveButton = document.getElementById(FILTER_ACTIVE_BUTTON_ID);
const filterCompletedButton = document.getElementById(FILTER_COMPLETED_BUTTON_ID);

let todos = [];
let currentFilter = 'all';

const renderTodos = () => {
  const filteredTodos = todos.filter(todo => {
    if (currentFilter === 'active') return !todo.completed;
    if (currentFilter === 'completed') return todo.completed;
    return true;
  });

  todoList.innerHTML = filteredTodos.map((todo, index) => `
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

const handleInputKeydown = (event) => {
    if (event.key === 'Enter') {
    addTodo();
  }
};

const handleTodoListChange = (event) => {
  if (event.target.matches('input[type="checkbox"]')) {
    toggleComplete(event.target.dataset.index);
  }
};

const handleTodoListClick = (event) => {
  if (event.target.matches('.delete')) {
    deleteTodo(event.target.dataset.index);
  } else if (event.target.matches('.text')) {
    editTodoText(event.target.dataset.index);
  }
};

const handleFilterClick = (filter) => {
  currentFilter = filter;
  renderTodos();
};

input.addEventListener('keydown', handleInputKeydown);
addButton.addEventListener('click', addTodo);
deleteAllCompletedButton.addEventListener('click', deleteAllCompleted);
checkAllCheckbox.addEventListener('change', checkAllTodos);
todoList.addEventListener('change', handleTodoListChange);
todoList.addEventListener('click', handleTodoListClick);
filterAllButton.addEventListener('click', () => handleFilterClick('all'));
filterActiveButton.addEventListener('click', () => handleFilterClick('active'));
filterCompletedButton.addEventListener('click', () => handleFilterClick('completed'));

renderTodos();
});