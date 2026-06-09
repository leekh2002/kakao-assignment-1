import TodoItem from './TodoItem'

function TodoList({ todos, editingTodoId, onStartEdit, onCancelEdit, onUpdateTodo, onToggleComplete, onDeleteTodo }) {
  if (todos.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-violet-200 bg-violet-50/40 p-5 text-center text-zinc-500">
        표시할 Todo가 없습니다.
      </p>
    )
  }

  return (
    <ul className="flex flex-col gap-2.5" aria-label="Todo 목록">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          editingTodoId={editingTodoId}
          onStartEdit={onStartEdit}
          onCancelEdit={onCancelEdit}
          onUpdateTodo={onUpdateTodo}
          onToggleComplete={onToggleComplete}
          onDeleteTodo={onDeleteTodo}
        />
      ))}
    </ul>
  )
}

export default TodoList
