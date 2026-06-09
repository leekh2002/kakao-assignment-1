import { useState } from 'react'

function TodoForm({ onAddTodo, validationMessage }) {
  const [todoInputText, setTodoInputText] = useState('')

  function handleTodoInputChange(event) {
    setTodoInputText(event.target.value)
  }

  function handleTodoFormSubmit(event) {
    event.preventDefault()

    // App 컴포넌트에서 실제 생성 가능 여부를 판단하도록 입력값만 전달합니다.
    const isTodoAdded = onAddTodo(todoInputText)

    if (isTodoAdded) {
      setTodoInputText('')
    }
  }

  return (
    <form className="grid grid-cols-[1fr_auto] gap-2.5 max-sm:grid-cols-1" onSubmit={handleTodoFormSubmit}>
      <label className="sr-only" htmlFor="todo-input">
        Todo 입력
      </label>
      <input
        id="todo-input"
        type="text"
        value={todoInputText}
        onChange={handleTodoInputChange}
        className="min-h-11 w-full min-w-0 rounded-md border border-violet-200 px-3.5 text-zinc-900 outline-none focus:border-violet-700 focus:shadow-[0_0_0_3px_rgba(109,40,217,0.14)]"
        placeholder="오늘 할 일을 입력하세요"
        autoComplete="off"
      />
      <button
        type="submit"
        className="min-h-11 rounded-md bg-violet-700 px-5 font-bold text-white transition-colors hover:bg-violet-800"
      >
        추가
      </button>
      <p className="col-span-full min-h-5 text-sm text-red-600" role="alert" aria-live="polite">
        {validationMessage}
      </p>
    </form>
  )
}

export default TodoForm
