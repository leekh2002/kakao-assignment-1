import { useEffect, useState } from 'react'
import TodoDateNavigation from './components/TodoDateNavigation'
import TodoFilterTabs from './components/TodoFilterTabs'
import TodoForm from './components/TodoForm'
import TodoList from './components/TodoList'

const TODO_STORAGE_KEY = 'dailyTodoList'
const SELECTED_DATE_STORAGE_KEY = 'dailyTodoSelectedDate'

function createDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function createDateFromKey(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number)

  return new Date(year, month - 1, day)
}

function getMondayOfSelectedWeek(dateKey) {
  const date = createDateFromKey(dateKey)
  const day = date.getDay()
  const mondayOffset = day === 0 ? -6 : 1 - day

  date.setDate(date.getDate() + mondayOffset)

  return date
}

function getWeekDateKeys(dateKey) {
  const monday = getMondayOfSelectedWeek(dateKey)

  return Array.from({ length: 7 }, (_, dayIndex) => {
    const weekDate = new Date(monday)
    weekDate.setDate(monday.getDate() + dayIndex)

    return createDateKey(weekDate)
  })
}

function loadTodosFromLocalStorage() {
  const savedTodos = localStorage.getItem(TODO_STORAGE_KEY)

  if (savedTodos === null) {
    return []
  }

  // 로컬스토리지에 저장된 JSON 문자열을 Todo 배열로 복원합니다.
  return JSON.parse(savedTodos)
}

function loadSelectedDateFromLocalStorage() {
  const savedSelectedDate = localStorage.getItem(SELECTED_DATE_STORAGE_KEY)

  return savedSelectedDate ?? createDateKey(new Date())
}

function App() {
  const [todos, setTodos] = useState(loadTodosFromLocalStorage)
  const [editingTodoId, setEditingTodoId] = useState(null)
  const [validationMessage, setValidationMessage] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [selectedDate, setSelectedDate] = useState(loadSelectedDateFromLocalStorage)

  useEffect(() => {
    // todos가 추가, 수정, 삭제, 완료 처리로 바뀔 때마다 JSON 문자열로 저장합니다.
    localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  useEffect(() => {
    // 선택된 날짜를 저장해 새로고침 후에도 같은 주간 뷰를 복원합니다.
    localStorage.setItem(SELECTED_DATE_STORAGE_KEY, selectedDate)
  }, [selectedDate])

  const weekDateSummaries = getWeekDateKeys(selectedDate).map((dateKey) => ({
    dateKey,
    todoCount: todos.filter((todo) => todo.date === dateKey).length,
  }))

  // 선택된 날짜를 먼저 맞춘 뒤, 선택된 상태 필터까지 적용한 Todo만 화면에 전달합니다.
  const filteredTodos = todos.filter((todo) => {
    if (todo.date !== selectedDate) {
      return false
    }

    if (selectedFilter === 'active') {
      return !todo.completed
    }

    if (selectedFilter === 'completed') {
      return todo.completed
    }

    return true
  })

  function createTodoId() {
    return Date.now()
  }

  function clearValidationMessage() {
    setValidationMessage('')
  }

  function resetTodoUiState() {
    setEditingTodoId(null)
    setValidationMessage('')
  }

  function handleAddTodo(todoText) {
    const trimmedTodoText = todoText.trim()

    // 입력값이 비어 있으면 목록을 변경하지 않고 사용자에게 안내합니다.
    if (trimmedTodoText === '') {
      setValidationMessage('Todo 내용을 입력한 뒤 추가해 주세요.')
      return false
    }

    const newTodo = {
      id: createTodoId(),
      text: trimmedTodoText,
      completed: false,
      date: selectedDate,
    }

    setTodos((currentTodos) => [...currentTodos, newTodo])
    resetTodoUiState()
    return true
  }

  function handleStartEdit(todoId) {
    setEditingTodoId(todoId)
    clearValidationMessage()
  }

  function handleCancelEdit() {
    resetTodoUiState()
  }

  function handleUpdateTodo(todoId, nextTodoText) {
    const trimmedTodoText = nextTodoText.trim()

    // 수정값도 빈 문자열로 저장되지 않도록 생성과 같은 기준으로 검증합니다.
    if (trimmedTodoText === '') {
      setValidationMessage('수정할 Todo 내용을 입력해 주세요.')
      return
    }

    setTodos((currentTodos) =>
      currentTodos.map((todo) => (todo.id === todoId ? { ...todo, text: trimmedTodoText } : todo)),
    )
    resetTodoUiState()
  }

  function handleToggleComplete(todoId) {
    // 완료 버튼을 누른 항목만 completed 값을 반전시켜 진행 중/완료 상태를 바꿉니다.
    setTodos((currentTodos) =>
      currentTodos.map((todo) => (todo.id === todoId ? { ...todo, completed: !todo.completed } : todo)),
    )
    clearValidationMessage()
  }

  function handleDeleteTodo(todoId) {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== todoId))

    if (editingTodoId === todoId) {
      setEditingTodoId(null)
    }

    clearValidationMessage()
  }

  function handleFilterChange(nextFilter) {
    // 필터를 바꾸면 선택한 상태의 Todo만 보이도록 상태를 갱신합니다.
    setSelectedFilter(nextFilter)
    resetTodoUiState()
  }

  function handleMoveSelectedWeek(weekOffset) {
    // 현재 선택된 날짜를 기준으로 이전 주차 또는 다음 주차로 이동합니다.
    setSelectedDate((currentSelectedDate) => {
      const nextDate = createDateFromKey(currentSelectedDate)
      nextDate.setDate(nextDate.getDate() + weekOffset * 7)

      return createDateKey(nextDate)
    })
    resetTodoUiState()
  }

  function handleSelectDate(nextSelectedDate) {
    // 주간 날짜 버튼을 클릭하면 해당 날짜의 Todo만 보이도록 선택 날짜를 바꿉니다.
    setSelectedDate(nextSelectedDate)
    resetTodoUiState()
  }

  return (
    <main className="flex min-h-screen items-start justify-center bg-slate-50 px-5 py-14 text-zinc-900 max-sm:px-3.5 max-sm:py-7">
      <section
        className="w-full max-w-2xl rounded-lg border border-violet-100 bg-white p-8 shadow-[0_16px_40px_rgba(36,30,54,0.08)] max-sm:p-6"
        aria-labelledby="app-title"
      >
        <header className="mb-6">
          <p className="mb-2 text-sm font-bold text-violet-700">Productivity</p>
          <h1 id="app-title" className="text-3xl font-bold leading-tight">
            Todo App
          </h1>
        </header>

        <TodoDateNavigation
          selectedDate={selectedDate}
          weekDateSummaries={weekDateSummaries}
          onMoveSelectedWeek={handleMoveSelectedWeek}
          onSelectDate={handleSelectDate}
        />

        <TodoForm onAddTodo={handleAddTodo} validationMessage={validationMessage} />

        <TodoFilterTabs selectedFilter={selectedFilter} onFilterChange={handleFilterChange} />

        <TodoList
          todos={filteredTodos}
          editingTodoId={editingTodoId}
          onStartEdit={handleStartEdit}
          onCancelEdit={handleCancelEdit}
          onUpdateTodo={handleUpdateTodo}
          onToggleComplete={handleToggleComplete}
          onDeleteTodo={handleDeleteTodo}
        />
      </section>
    </main>
  )
}

export default App
