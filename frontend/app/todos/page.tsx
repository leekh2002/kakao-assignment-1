import { getTodosAction } from "./actions";
import TodoApp from "./components/TodoApp";

export default async function TodosPage() {
  const todos = await getTodosAction();

  return <TodoApp initialTodos={todos} />;
}
