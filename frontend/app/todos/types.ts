export type Todo = {
  id: number;
  text: string;
  completed: boolean;
  date: string;
};

export type TodoPayload = {
  text: string;
  completed: boolean;
  date: string;
};

export type TodoActionResult<T = void> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      message: string;
    };
