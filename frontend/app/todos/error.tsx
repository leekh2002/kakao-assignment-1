"use client";

import Link from "next/link";
import { useEffect } from "react";

type TodoErrorProps = {
  error: Error & { digest?: string };
  reset?: () => void;
  unstable_retry?: () => void;
};

export default function TodoError({
  error,
  reset,
  unstable_retry,
}: TodoErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const retry = unstable_retry ?? reset;

  return (
    <main className="min-h-screen bg-zinc-50 px-5 py-10 text-zinc-900">
      <section className="mx-auto w-full max-w-3xl">
        <div className="rounded-lg border border-red-200 bg-white p-6 shadow-sm">
          <p className="mb-2 text-sm font-bold text-red-700">Error</p>
          <h1 className="text-2xl font-bold tracking-normal text-zinc-900">
            Todo 화면을 불러오지 못했습니다.
          </h1>
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            잠시 후 다시 시도하거나 백엔드 서버가 실행 중인지 확인해주세요.
          </p>

          <div className="mt-5 rounded-md bg-red-50 px-4 py-3">
            <p className="break-words text-sm font-medium text-red-700">
              {error.message || "알 수 없는 오류가 발생했습니다."}
            </p>
            {error.digest ? (
              <p className="mt-2 text-xs text-red-500">
                오류 코드: {error.digest}
              </p>
            ) : null}
          </div>

          <div className="mt-6 flex gap-2 max-sm:grid max-sm:grid-cols-1">
            {retry ? (
              <button
                type="button"
                onClick={retry}
                className="min-h-11 rounded-md bg-violet-700 px-5 text-sm font-bold text-white transition-colors hover:bg-violet-800"
              >
                다시 시도
              </button>
            ) : null}
            <Link
              href="/todos"
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-700 transition-colors hover:border-violet-700 hover:text-violet-700"
            >
              목록으로 이동
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
