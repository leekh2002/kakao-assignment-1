import { NextResponse } from "next/server";
import type { Todo } from "@/app/todos/types";

const BACKEND_API_URL =
  process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000";

type TodoRouteContext = {
  params: Promise<{
    todoId: string;
  }>;
};

async function parseResponseBody(response: Response) {
  const text = await response.text();

  if (text === "") {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

function createErrorResponse(message: string, status = 500) {
  return NextResponse.json({ message }, { status });
}

function parseTodoId(todoId: string) {
  const numericTodoId = Number(todoId);

  if (!Number.isInteger(numericTodoId) || numericTodoId < 1) {
    return null;
  }

  return numericTodoId;
}

export async function GET(_request: Request, { params }: TodoRouteContext) {
  const { todoId } = await params;
  const numericTodoId = parseTodoId(todoId);

  if (numericTodoId === null) {
    return createErrorResponse("유효하지 않은 Todo ID입니다.", 400);
  }

  try {
    const response = await fetch(`${BACKEND_API_URL}/todos`, {
      cache: "no-store",
    });

    if (!response.ok) {
      const body = await parseResponseBody(response);
      return NextResponse.json(body, { status: response.status });
    }

    const todos: Todo[] = await response.json();
    const todo = todos.find((item) => item.id === numericTodoId);

    if (!todo) {
      return createErrorResponse("Todo를 찾을 수 없습니다.", 404);
    }

    return NextResponse.json(todo);
  } catch {
    return createErrorResponse("백엔드 서버와 연결할 수 없습니다.", 502);
  }
}

export async function PUT(request: Request, { params }: TodoRouteContext) {
  const { todoId } = await params;
  const numericTodoId = parseTodoId(todoId);

  if (numericTodoId === null) {
    return createErrorResponse("유효하지 않은 Todo ID입니다.", 400);
  }

  try {
    const payload = await request.json();
    const response = await fetch(`${BACKEND_API_URL}/todos/${numericTodoId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const body = await parseResponseBody(response);

    return NextResponse.json(body, { status: response.status });
  } catch {
    return createErrorResponse("Todo 수정 요청을 처리할 수 없습니다.", 500);
  }
}

export async function DELETE(_request: Request, { params }: TodoRouteContext) {
  const { todoId } = await params;
  const numericTodoId = parseTodoId(todoId);

  if (numericTodoId === null) {
    return createErrorResponse("유효하지 않은 Todo ID입니다.", 400);
  }

  try {
    const response = await fetch(`${BACKEND_API_URL}/todos/${numericTodoId}`, {
      method: "DELETE",
    });

    if (response.status === 204) {
      return new Response(null, { status: 204 });
    }

    const body = await parseResponseBody(response);

    return NextResponse.json(body, { status: response.status });
  } catch {
    return createErrorResponse("Todo 삭제 요청을 처리할 수 없습니다.", 500);
  }
}
