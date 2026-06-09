import { useEffect, useRef, useState } from 'react'

function TodoItem({ todo, editingTodoId, onStartEdit, onCancelEdit, onUpdateTodo, onToggleComplete, onDeleteTodo }) {
  const isEditing = editingTodoId === todo.id
  const [editedTodoText, setEditedTodoText] = useState(todo.text)
  const editInputRef = useRef(null)

  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus()
      editInputRef.current?.select()
    }
  }, [isEditing])

  function handleEditedTodoTextChange(event) {
    setEditedTodoText(event.target.value)
  }

  function handleEditedTodoSave() {
    // 수정 저장 시에도 빈 문자열 검증은 App의 공통 핸들러에서 처리합니다.
    onUpdateTodo(todo.id, editedTodoText)
  }

  function handleStartEditClick() {
    // 수정 모드로 바뀌기 전에 현재 Todo 내용을 편집용 상태에 복사합니다.
    setEditedTodoText(todo.text)
    onStartEdit(todo.id)
  }

  function handleEditInputKeyDown(event) {
    if (event.key === 'Enter') {
      handleEditedTodoSave()
    }

    if (event.key === 'Escape') {
      onCancelEdit()
    }
  }

  return (
    <li className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-lg border border-violet-100 bg-violet-50/40 p-3.5 max-sm:grid-cols-1">
      {isEditing ? (
        <input
          ref={editInputRef}
          type="text"
          value={editedTodoText}
          onChange={handleEditedTodoTextChange}
          onKeyDown={handleEditInputKeyDown}
          className="w-full min-w-0 rounded-md border border-violet-700 bg-white px-3 py-2.5 text-zinc-900 outline-none focus:shadow-[0_0_0_3px_rgba(109,40,217,0.14)]"
          aria-label="Todo 수정 입력"
        />
      ) : (
        <span className={`min-w-0 break-words text-base ${todo.completed ? 'text-zinc-400 line-through' : 'text-zinc-900'}`}>
          {todo.text}
        </span>
      )}

      <div className="flex gap-2 max-sm:grid max-sm:grid-cols-3">
        {isEditing ? (
          <>
            <button
              type="button"
              onClick={handleEditedTodoSave}
              className="min-h-11 rounded-md border border-violet-700 bg-violet-700 px-3 font-bold text-white transition-colors hover:bg-violet-800"
            >
              저장
            </button>
            <button
              type="button"
              onClick={onCancelEdit}
              className="min-h-11 rounded-md border border-violet-200 bg-white px-3 font-bold text-zinc-700 transition-colors hover:border-violet-700 hover:text-violet-700"
            >
              취소
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={handleStartEditClick}
              className="min-h-11 rounded-md border border-violet-200 bg-white px-3 font-bold text-zinc-700 transition-colors hover:border-violet-700 hover:text-violet-700"
            >
              수정
            </button>
            <button
              type="button"
              onClick={() => onToggleComplete(todo.id)}
              className="min-h-11 rounded-md border border-violet-200 bg-white px-3 font-bold text-zinc-700 transition-colors hover:border-violet-700 hover:text-violet-700"
            >
              {todo.completed ? '취소' : '완료'}
            </button>
            <button
              type="button"
              onClick={() => onDeleteTodo(todo.id)}
              className="min-h-11 rounded-md border border-violet-200 bg-white px-3 font-bold text-zinc-700 transition-colors hover:border-red-600 hover:text-red-600"
            >
              삭제
            </button>
          </>
        )}
      </div>
    </li>
  )
}

export default TodoItem
