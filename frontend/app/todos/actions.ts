"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import type { Todo, TodoActionResult, TodoPayload } from "./types";

async function getApiBaseUrl() {
  const headerList = await headers();
  const host = headerList.get("host") ?? "localhost:3000";
  const protocol = headerList.get("x-forwarded-proto") ?? "http";

  return `${protocol}://${host}/api/todos`;
}

async function parseActionError(response: Response, fallbackMessage: string) {
  try {
    const body = await response.json();

    if (typeof body?.message === "string") {
      return body.message;
    }

    if (typeof body?.detail === "string") {
      return body.detail;
    }
  } catch {
    return fallbackMessage;
  }

  return fallbackMessage;
}

async function requestApi<T>(path = "", init?: RequestInit): Promise<T> {
  const apiBaseUrl = await getApiBaseUrl();
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      await parseActionError(response, "Todo 요청 처리에 실패했습니다."),
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

function validateTodoPayload(payload: TodoPayload) {
  if (payload.text.trim() === "") {
    return "Todo 내용을 입력해주세요.";
  }

  if (payload.date === "") {
    return "Todo 날짜를 선택해주세요.";
  }

  return null;
}

function toActionError(error: unknown, fallbackMessage: string) {
  return {
    success: false,
    message: error instanceof Error ? error.message : fallbackMessage,
  } satisfies TodoActionResult<never>;
}

export async function getTodosAction() {
  return requestApi<Todo[]>();
}

export async function getTodoAction(todoId: number) {
  const apiBaseUrl = await getApiBaseUrl();
  const response = await fetch(`${apiBaseUrl}/${todoId}`, {
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      await parseActionError(response, "Todo를 불러오지 못했습니다."),
    );
  }

  return response.json() as Promise<Todo>;
}

export async function createTodoAction(
  payload: TodoPayload,
): Promise<TodoActionResult<Todo>> {
  const validationMessage = validateTodoPayload(payload);

  if (validationMessage !== null) {
    return {
      success: false,
      message: validationMessage,
    };
  }

  try {
    const todo = await requestApi<Todo>("", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...payload,
        text: payload.text.trim(),
      }),
    });

    revalidatePath("/todos");

    return {
      success: true,
      data: todo,
    };
  } catch (error) {
    return toActionError(error, "Todo 생성에 실패했습니다.");
  }
}

export async function updateTodoAction(
  todoId: number,
  payload: TodoPayload,
): Promise<TodoActionResult<Todo>> {
  const validationMessage = validateTodoPayload(payload);

  if (validationMessage !== null) {
    return {
      success: false,
      message: validationMessage,
    };
  }

  try {
    const todo = await requestApi<Todo>(`/${todoId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...payload,
        text: payload.text.trim(),
      }),
    });

    revalidatePath("/todos");
    revalidatePath(`/todos/${todoId}`);

    return {
      success: true,
      data: todo,
    };
  } catch (error) {
    return toActionError(error, "Todo 수정에 실패했습니다.");
  }
}

export async function deleteTodoAction(
  todoId: number,
): Promise<TodoActionResult> {
  try {
    await requestApi(`/${todoId}`, {
      method: "DELETE",
    });

    revalidatePath("/todos");

    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    return toActionError(error, "Todo 삭제에 실패했습니다.");
  }
}
