import os
from pathlib import Path
from typing import Optional

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import Boolean, Column, Integer, String, create_engine, select
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session, sessionmaker


def load_env_file(file_name: str = ".env.local") -> None:
    env_path = Path(__file__).resolve().parent / file_name

    if not env_path.exists():
        return

    for line in env_path.read_text(encoding="utf-8").splitlines():
        line = line.strip()

        if not line or line.startswith("#") or "=" not in line:
            continue

        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip("\"'"))


load_env_file()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./todos.db")
CORS_ALLOW_ORIGINS = [
    origin.strip()
    for origin in os.getenv("CORS_ALLOW_ORIGINS", "http://localhost:3000").split(",")
    if origin.strip()
]

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class Todo(Base):
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, nullable=False)
    completed = Column(Boolean, default=False, nullable=False)
    date = Column(String, nullable=False, index=True)


class TodoCreate(BaseModel):
    text: str
    completed: bool = False
    date: str


class TodoUpdate(BaseModel):
    text: Optional[str] = None
    completed: Optional[bool] = None
    date: Optional[str] = None


class TodoResponse(BaseModel):
    id: int
    text: str
    completed: bool
    date: str

    class Config:
        from_attributes = True


Base.metadata.create_all(bind=engine)

app = FastAPI(title=os.getenv("APP_NAME", "Todo API"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ALLOW_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_todo_or_404(todo_id: int, db: Session) -> Todo:
    todo = db.scalar(select(Todo).where(Todo.id == todo_id))

    if todo is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found",
        )

    return todo


@app.get("/todos", response_model=list[TodoResponse])
def get_todos(db: Session = Depends(get_db)):
    return db.scalars(select(Todo)).all()


@app.post("/todos", response_model=TodoResponse, status_code=201)
def create_todos(todo: TodoCreate, db: Session = Depends(get_db)):
    try:
        data = Todo(text=todo.text, completed=todo.completed, date=todo.date)
        db.add(data)
        db.commit()
        db.refresh(data)
        return data
    except Exception as error:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Todo create failed: {error}",
        ) from error


@app.put("/todos/{id}", response_model=TodoResponse)
def update_todos(id: int, todo_update: TodoUpdate, db: Session = Depends(get_db)):
    todo = get_todo_or_404(id, db)

    if todo_update.text is not None:
        todo.text = todo_update.text
    if todo_update.completed is not None:
        todo.completed = todo_update.completed
    if todo_update.date is not None:
        todo.date = todo_update.date

    db.commit()
    db.refresh(todo)
    return todo


@app.delete("/todos/{id}", status_code=204)
def delete_todos(id: int, db: Session = Depends(get_db)):
    todo = get_todo_or_404(id, db)
    db.delete(todo)
    db.commit()
