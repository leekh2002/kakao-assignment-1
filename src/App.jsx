import { useState } from 'react'
import TodoForm from './components/TodoForm'
import TodoList from './components/TodoList'

function App() {
  const [todos, setTodos] = useState([])
  const [editingTodoId, setEditingTodoId] = useState(null)
  const [validationMessage, setValidationMessage] = useState('')

  function createTodoId() {
    return Date.now()
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
    }

    setTodos((currentTodos) => [...currentTodos, newTodo])
    setEditingTodoId(null)
    setValidationMessage('')
    return true
  }

  function handleStartEdit(todoId) {
    setEditingTodoId(todoId)
    setValidationMessage('')
  }

  function handleCancelEdit() {
    setEditingTodoId(null)
    setValidationMessage('')
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
    setEditingTodoId(null)
    setValidationMessage('')
  }

  function handleToggleComplete(todoId) {
    // 완료 버튼을 누른 항목만 completed 값을 반전시켜 취소선 표시 상태를 바꿉니다.
    setTodos((currentTodos) =>
      currentTodos.map((todo) => (todo.id === todoId ? { ...todo, completed: !todo.completed } : todo)),
    )
    setValidationMessage('')
  }

  function handleDeleteTodo(todoId) {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== todoId))

    if (editingTodoId === todoId) {
      setEditingTodoId(null)
    }

    setValidationMessage('')
  }

  return (
    <main className="flex min-h-screen items-start justify-center bg-slate-50 px-5 py-14 text-zinc-900 max-sm:px-3.5 max-sm:py-7">
      <section className="w-full max-w-2xl rounded-lg border border-violet-100 bg-white p-8 shadow-[0_16px_40px_rgba(36,30,54,0.08)] max-sm:p-6" aria-labelledby="app-title">
        <header className="mb-6">
          <p className="mb-2 text-sm font-bold text-violet-700">Productivity</p>
          <h1 id="app-title" className="text-3xl font-bold leading-tight">
            Todo App
          </h1>
        </header>

        <TodoForm onAddTodo={handleAddTodo} validationMessage={validationMessage} />

        <TodoList
          todos={todos}
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
