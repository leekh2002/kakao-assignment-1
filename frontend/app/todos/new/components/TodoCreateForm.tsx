"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createTodoAction } from "../../actions";

function createTodayKey() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function TodoCreateForm() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [date, setDate] = useState(createTodayKey);
  const [message, setMessage] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function createTodo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setMessage("");

    const result = await createTodoAction({
      text,
      completed: false,
      date,
    });

    if (result.success) {
      router.push("/todos");
      router.refresh();
    } else {
      setMessage(result.message);
    }

    setIsPending(false);
  }

  return (
    <form
      onSubmit={createTodo}
      className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm"
    >
      <div className="space-y-5">
        <div>
          <label
            htmlFor="todo-text"
            className="mb-2 block text-sm font-semibold text-zinc-800"
          >
            Todo 내용
          </label>
          <input
            id="todo-text"
            type="text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="할 일을 입력하세요"
            className="min-h-11 w-full min-w-0 rounded-md border border-zinc-200 px-3 text-zinc-900 outline-none focus:border-violet-700 focus:shadow-[0_0_0_3px_rgba(109,40,217,0.14)]"
          />
        </div>

        <div>
          <label
            htmlFor="todo-date"
            className="mb-2 block text-sm font-semibold text-zinc-800"
          >
            Todo 날짜
          </label>
          <input
            id="todo-date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="min-h-11 w-full rounded-md border border-zinc-200 px-3 text-zinc-900 outline-none focus:border-violet-700 focus:shadow-[0_0_0_3px_rgba(109,40,217,0.14)]"
          />
        </div>
      </div>

      <p className="mt-4 min-h-5 text-sm text-red-600" role="alert">
        {message}
      </p>

      <div className="mt-5 flex justify-end gap-2 max-sm:grid max-sm:grid-cols-1">
        <button
          type="button"
          onClick={() => router.push("/todos")}
          disabled={isPending}
          className="min-h-11 rounded-md border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-700 transition-colors hover:border-violet-700 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="min-h-11 rounded-md bg-violet-700 px-5 text-sm font-bold text-white transition-colors hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "생성 중..." : "Todo 생성"}
        </button>
      </div>
    </form>
  );
}
