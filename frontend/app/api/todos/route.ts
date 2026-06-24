import { NextResponse } from "next/server";

const BACKEND_API_URL =
  process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000";

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

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_API_URL}/todos`, {
      cache: "no-store",
    });
    const body = await parseResponseBody(response);

    return NextResponse.json(body, { status: response.status });
  } catch {
    return createErrorResponse("백엔드 서버와 연결할 수 없습니다.", 502);
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const response = await fetch(`${BACKEND_API_URL}/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const body = await parseResponseBody(response);

    return NextResponse.json(body, { status: response.status });
  } catch {
    return createErrorResponse("Todo 생성 요청을 처리할 수 없습니다.", 500);
  }
}
