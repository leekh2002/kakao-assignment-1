"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createTodoAction,
  deleteTodoAction,
  updateTodoAction,
} from "../actions";
import type { Todo } from "../types";

type TodoAppProps = {
  initialTodos: Todo[];
};

type Filter = "all" | "active" | "completed";

function createTodayKey() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function TodoApp({ initialTodos }: TodoAppProps) {
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [todoText, setTodoText] = useState("");
  const [todoDate, setTodoDate] = useState(createTodayKey);
  const [filter, setFilter] = useState<Filter>("all");
  const [message, setMessage] = useState("");
  const [isPending, setIsPending] = useState(false);

  const filteredTodos = useMemo(() => {
    if (filter === "active") {
      return todos.filter((todo) => !todo.completed);
    }

    if (filter === "completed") {
      return todos.filter((todo) => todo.completed);
    }

    return todos;
  }, [filter, todos]);

  const activeCount = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.length - activeCount;

  async function createTodo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setMessage("");

    const result = await createTodoAction({
      text: todoText,
      completed: false,
      date: todoDate,
    });

    if (result.success) {
      setTodos((currentTodos) => [...currentTodos, result.data]);
      setTodoText("");
      router.refresh();
    } else {
      setMessage(result.message);
    }

    setIsPending(false);
  }

  async function toggleCompleted(todo: Todo) {
    setIsPending(true);
    setMessage("");

    const result = await updateTodoAction(todo.id, {
      text: todo.text,
      completed: !todo.completed,
      date: todo.date,
    });

    if (result.success) {
      setTodos((currentTodos) =>
        currentTodos.map((currentTodo) =>
          currentTodo.id === result.data.id ? result.data : currentTodo,
        ),
      );
      router.refresh();
    } else {
      setMessage(result.message);
    }

    setIsPending(false);
  }

  async function deleteTodo(todoId: number) {
    setIsPending(true);
    setMessage("");

    const result = await deleteTodoAction(todoId);

    if (result.success) {
      setTodos((currentTodos) =>
        currentTodos.filter((todo) => todo.id !== todoId),
      );
      router.refresh();
    } else {
      setMessage(result.message);
    }

    setIsPending(false);
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-5 py-10 text-zinc-900">
      <section className="mx-auto w-full max-w-3xl">
        <header className="mb-8">
          <p className="mb-2 text-sm font-bold text-violet-700">
            Productivity
          </p>
          <div className="flex items-start justify-between gap-4 max-sm:flex-col">
            <div>
              <h1 className="text-3xl font-bold tracking-normal">Todo 목록</h1>
              <p className="mt-2 text-sm text-zinc-500">
                전체 {todos.length}개, 진행 중 {activeCount}개, 완료{" "}
                {completedCount}개
              </p>
            </div>
            <Link
              href="/todos/new"
              className="inline-flex min-h-10 items-center justify-center rounded-md bg-violet-700 px-4 text-sm font-bold text-white transition-colors hover:bg-violet-800"
            >
              새 Todo
            </Link>
          </div>
        </header>

        <form
          onSubmit={createTodo}
          className="mb-5 grid grid-cols-[1fr_150px_auto] gap-2.5 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm max-sm:grid-cols-1"
        >
          <label className="sr-only" htmlFor="todo-text">
            Todo 내용
          </label>
          <input
            id="todo-text"
            type="text"
            value={todoText}
            onChange={(event) => setTodoText(event.target.value)}
            placeholder="할 일을 입력하세요"
            className="min-h-11 min-w-0 rounded-md border border-zinc-200 px-3 text-zinc-900 outline-none focus:border-violet-700 focus:shadow-[0_0_0_3px_rgba(109,40,217,0.14)]"
          />
          <label className="sr-only" htmlFor="todo-date">
            Todo 날짜
          </label>
          <input
            id="todo-date"
            type="date"
            value={todoDate}
            onChange={(event) => setTodoDate(event.target.value)}
            className="min-h-11 rounded-md border border-zinc-200 px-3 text-zinc-900 outline-none focus:border-violet-700 focus:shadow-[0_0_0_3px_rgba(109,40,217,0.14)]"
          />
          <button
            type="submit"
            disabled={isPending}
            className="min-h-11 rounded-md bg-violet-700 px-5 text-sm font-bold text-white transition-colors hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            추가
          </button>
        </form>

        <div className="mb-4 flex gap-2">
          {[
            ["all", "전체"],
            ["active", "진행 중"],
            ["completed", "완료"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value as Filter)}
              className={`min-h-10 rounded-md border px-4 text-sm font-semibold transition-colors ${
                filter === value
                  ? "border-violet-700 bg-violet-700 text-white"
                  : "border-zinc-200 bg-white text-zinc-700 hover:border-violet-700 hover:text-violet-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <p className="mb-3 min-h-5 text-sm text-red-600" role="alert">
          {message}
        </p>

        {filteredTodos.length === 0 ? (
          <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-8 text-center">
            <p className="text-base font-semibold text-zinc-800">
              표시할 Todo가 없습니다.
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              새 할 일을 추가하거나 다른 필터를 선택하세요.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {filteredTodos.map((todo) => (
              <li
                key={todo.id}
                className="grid grid-cols-[1fr_auto] items-center gap-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm max-sm:grid-cols-1"
              >
                <div className="min-w-0">
                  <p
                    className={`break-words text-base font-medium ${
                      todo.completed
                        ? "text-zinc-400 line-through"
                        : "text-zinc-900"
                    }`}
                  >
                    {todo.text}
                  </p>
                  <p className="mt-1 text-sm text-zinc-500">{todo.date}</p>
                </div>

                <div className="flex shrink-0 gap-2 max-sm:grid max-sm:grid-cols-3">
                  <Link
                    href={`/todos/${todo.id}`}
                    className="inline-flex min-h-10 items-center justify-center rounded-md border border-zinc-200 bg-white px-3 text-sm font-semibold text-zinc-700 transition-colors hover:border-violet-700 hover:text-violet-700"
                  >
                    수정
                  </Link>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => toggleCompleted(todo)}
                    className="min-h-10 rounded-md border border-zinc-200 bg-white px-3 text-sm font-semibold text-zinc-700 transition-colors hover:border-violet-700 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {todo.completed ? "취소" : "완료"}
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => deleteTodo(todo.id)}
                    className="min-h-10 rounded-md border border-zinc-200 bg-white px-3 text-sm font-semibold text-zinc-700 transition-colors hover:border-red-600 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    삭제
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
