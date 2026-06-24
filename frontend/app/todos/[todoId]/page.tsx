import Link from "next/link";
import { notFound } from "next/navigation";
import { getTodoAction } from "../actions";
import TodoEditForm from "./components/TodoEditForm";

type TodoEditPageProps = {
  params: Promise<{
    todoId: string;
  }>;
};

export default async function TodoEditPage({ params }: TodoEditPageProps) {
  const { todoId } = await params;
  const numericTodoId = Number(todoId);

  if (!Number.isInteger(numericTodoId) || numericTodoId < 1) {
    notFound();
  }

  const todo = await getTodoAction(numericTodoId);

  if (todo === null) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-5 py-10 text-zinc-900">
      <section className="mx-auto w-full max-w-3xl">
        <header className="mb-8">
          <Link
            href="/todos"
            className="mb-4 inline-flex min-h-10 items-center rounded-md border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700 transition-colors hover:border-violet-700 hover:text-violet-700"
          >
            목록으로
          </Link>
          <p className="mb-2 text-sm font-bold text-violet-700">
            Productivity
          </p>
          <h1 className="text-3xl font-bold tracking-normal">Todo 수정</h1>
          <p className="mt-2 text-sm text-zinc-500">
            Todo의 내용, 날짜, 완료 상태를 수정하세요.
          </p>
        </header>

        <TodoEditForm todo={todo} />
      </section>
    </main>
  );
}
