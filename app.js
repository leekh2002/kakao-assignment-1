const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const message = document.querySelector("#message");
const filterTabs = document.querySelectorAll(".filter-tab");
const selectedDateText = document.querySelector("#selected-date");
const previousDateButton = document.querySelector("#previous-date-button");
const nextDateButton = document.querySelector("#next-date-button");
const TODO_STORAGE_KEY = "dailyTodoList";

let todos = loadTodosFromLocalStorage();
let editingTodoId = null;
let currentFilter = "all";
let selectedDate = createDateKey(new Date());

// 현재 시간을 기반으로 각 Todo를 구분할 고유 id를 만듭니다.
function createTodoId() {
  return Date.now();
}

// Todo 배열을 JSON 문자열로 변환해 로컬스토리지에 저장합니다.
function saveTodosToLocalStorage() {
  localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos));
}

// 로컬스토리지에 저장된 JSON 문자열을 Todo 배열로 복원합니다.
function loadTodosFromLocalStorage() {
  const savedTodos = localStorage.getItem(TODO_STORAGE_KEY);

  if (savedTodos === null) {
    return [];
  }

  return JSON.parse(savedTodos);
}

// Date 객체를 Todo 저장과 비교에 사용할 YYYY-MM-DD 형식 문자열로 변환합니다.
function createDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// YYYY-MM-DD 형식의 날짜 문자열을 Date 객체로 변환합니다.
function createDateFromKey(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);

  return new Date(year, month - 1, day);
}

// 선택된 날짜를 사용자에게 보여줄 한국어 날짜 형식으로 변환합니다.
function formatSelectedDate(dateKey) {
  const date = createDateFromKey(dateKey);

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(date);
}

// 화면 상단의 선택 날짜 텍스트를 현재 날짜 상태에 맞게 갱신합니다.
function updateSelectedDateText() {
  selectedDateText.textContent = formatSelectedDate(selectedDate);
}

// 선택된 날짜를 이전 날 또는 다음 날로 이동합니다.
function moveSelectedDate(dayOffset) {
  const nextDate = createDateFromKey(selectedDate);
  nextDate.setDate(nextDate.getDate() + dayOffset);

  selectedDate = createDateKey(nextDate);
  editingTodoId = null;
  clearMessage();
  renderTodos();
}

// 화면에 안내 메시지나 오류 메시지를 표시합니다.
function showMessage(messageText) {
  message.textContent = messageText;
}

// 화면에 표시된 안내 메시지를 비웁니다.
function clearMessage() {
  message.textContent = "";
}

// 현재 선택된 날짜와 필터 상태에 맞는 Todo 목록만 골라 반환합니다.
function getFilteredTodos() {
  const todosBySelectedDate = todos.filter((todo) => todo.date === selectedDate);

  if (currentFilter === "active") {
    return todosBySelectedDate.filter((todo) => !todo.completed);
  }

  if (currentFilter === "completed") {
    return todosBySelectedDate.filter((todo) => todo.completed);
  }

  return todosBySelectedDate;
}

// 필터 탭의 활성 스타일과 접근성 속성을 현재 필터 상태에 맞게 갱신합니다.
function updateFilterTabs() {
  filterTabs.forEach((filterTab) => {
    const isSelected = filterTab.dataset.filter === currentFilter;

    filterTab.classList.toggle("active", isSelected);
    filterTab.setAttribute("aria-selected", String(isSelected));
  });
}

// 입력받은 텍스트로 새 Todo 객체를 만들고 목록에 추가합니다.
function createTodo(todoText) {
  const newTodo = {
    id: createTodoId(),
    text: todoText,
    completed: false,
    date: selectedDate,
  };

  todos.push(newTodo);
  saveTodosToLocalStorage();
  renderTodos();
}

// 특정 Todo의 텍스트를 새 내용으로 변경합니다.
function updateTodo(todoId, nextText) {
  todos = todos.map((todo) => {
    if (todo.id === todoId) {
      return {
        ...todo,
        text: nextText,
      };
    }

    return todo;
  });

  saveTodosToLocalStorage();
  renderTodos();
}

// 선택한 Todo를 목록 안에서 바로 수정할 수 있도록 편집 모드로 전환합니다.
function startEditTodo(todoId) {
  editingTodoId = todoId;
  clearMessage();
  renderTodos();
}

// Todo 편집 모드를 취소하고 기존 목록 화면으로 돌아갑니다.
function cancelEditTodo() {
  editingTodoId = null;
  clearMessage();
  renderTodos();
}

// 편집 입력창의 값을 검증한 뒤 Todo 수정 내용을 저장합니다.
function saveEditedTodo(todoId, editInput) {
  const editedText = editInput.value.trim();

  if (editedText === "") {
    showMessage("수정할 내용을 비워둘 수 없습니다.");
    editInput.focus();
    return;
  }

  editingTodoId = null;
  updateTodo(todoId, editedText);
  clearMessage();
}

// 특정 Todo의 완료 상태를 완료 또는 진행 중으로 바꿉니다.
function toggleTodoComplete(todoId) {
  todos = todos.map((todo) => {
    if (todo.id === todoId) {
      return {
        ...todo,
        completed: !todo.completed,
      };
    }

    return todo;
  });

  saveTodosToLocalStorage();
  renderTodos();
}

// 특정 Todo를 목록에서 삭제하고, 삭제한 항목이 편집 중이면 편집 상태도 해제합니다.
function deleteTodo(todoId) {
  todos = todos.filter((todo) => todo.id !== todoId);

  if (editingTodoId === todoId) {
    editingTodoId = null;
  }

  saveTodosToLocalStorage();
  renderTodos();
}

// Todo 추가 폼 제출을 처리하고 빈 입력값이면 안내 메시지를 표시합니다.
function handleTodoSubmit(event) {
  event.preventDefault();

  const todoText = todoInput.value.trim();

  if (todoText === "") {
    showMessage("할 일을 입력한 뒤 추가해 주세요.");
    todoInput.focus();
    return;
  }

  createTodo(todoText);
  todoInput.value = "";
  clearMessage();
  todoInput.focus();
}

// 클릭한 필터 탭의 상태를 저장하고 해당 상태의 Todo만 다시 렌더링합니다.
function handleFilterTabClick(event) {
  const selectedFilter = event.currentTarget.dataset.filter;

  currentFilter = selectedFilter;
  editingTodoId = null;
  clearMessage();
  renderTodos();
}

// Todo 데이터 하나를 받아 목록에 표시할 li 요소를 생성합니다.
function createTodoElement(todo) {
  const todoItem = document.createElement("li");
  todoItem.className = "todo-item";
  const isEditing = editingTodoId === todo.id;

  if (todo.completed) {
    todoItem.classList.add("completed");
  }

  const todoContent = isEditing
    ? createTodoEditInput(todo)
    : createTodoTextElement(todo);

  const todoActions = document.createElement("div");
  todoActions.className = "todo-actions";

  if (isEditing) {
    const saveButton = document.createElement("button");
    saveButton.type = "button";
    saveButton.className = "todo-button save-button";
    saveButton.textContent = "저장";
    saveButton.addEventListener("click", () => saveEditedTodo(todo.id, todoContent));

    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.className = "todo-button";
    cancelButton.textContent = "취소";
    cancelButton.addEventListener("click", cancelEditTodo);

    todoActions.append(saveButton, cancelButton);
  } else {
    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "todo-button";
    editButton.textContent = "수정";
    editButton.addEventListener("click", () => startEditTodo(todo.id));

    const completeButton = document.createElement("button");
    completeButton.type = "button";
    completeButton.className = "todo-button";
    completeButton.textContent = todo.completed ? "취소" : "완료";
    completeButton.addEventListener("click", () => toggleTodoComplete(todo.id));

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "todo-button delete-button";
    deleteButton.textContent = "삭제";
    deleteButton.addEventListener("click", () => deleteTodo(todo.id));

    todoActions.append(editButton, completeButton, deleteButton);
  }

  todoItem.append(todoContent, todoActions);

  return todoItem;
}

// 일반 보기 상태에서 Todo 텍스트를 표시할 span 요소를 생성합니다.
function createTodoTextElement(todo) {
  const todoText = document.createElement("span");
  todoText.className = "todo-text";
  todoText.textContent = todo.text;

  return todoText;
}

// 편집 모드에서 Todo 내용을 직접 수정할 input 요소를 생성합니다.
function createTodoEditInput(todo) {
  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.className = "todo-edit-input";
  editInput.value = todo.text;
  editInput.setAttribute("aria-label", "Todo 수정 입력");

  // Enter는 저장, Escape는 취소로 처리해 키보드로도 바로 편집할 수 있게 합니다.
  editInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      saveEditedTodo(todo.id, editInput);
    }

    if (event.key === "Escape") {
      cancelEditTodo();
    }
  });

  return editInput;
}

// 현재 Todo 상태와 필터 상태를 기준으로 화면의 Todo 목록을 다시 그립니다.
function renderTodos() {
  todoList.innerHTML = "";

  const filteredTodos = getFilteredTodos();

  filteredTodos.forEach((todo) => {
    const todoElement = createTodoElement(todo);
    todoList.append(todoElement);
  });

  updateFilterTabs();
  updateSelectedDateText();
  focusEditingInput();
}

// 편집 모드로 전환된 입력창에 자동으로 포커스를 주고 기존 텍스트를 선택합니다.
function focusEditingInput() {
  const editingInput = document.querySelector(".todo-edit-input");

  if (editingInput) {
    editingInput.focus();
    editingInput.select();
  }
}

todoForm.addEventListener("submit", handleTodoSubmit);
previousDateButton.addEventListener("click", () => moveSelectedDate(-1));
nextDateButton.addEventListener("click", () => moveSelectedDate(1));

filterTabs.forEach((filterTab) => {
  filterTab.addEventListener("click", handleFilterTabClick);
});

renderTodos();
