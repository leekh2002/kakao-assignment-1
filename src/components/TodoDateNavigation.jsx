function createDateFromKey(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number)

  return new Date(year, month - 1, day)
}

function formatSelectedDate(selectedDate) {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(createDateFromKey(selectedDate))
}

function TodoDateNavigation({ selectedDate, onMoveSelectedDate }) {
  return (
    <div className="mb-5 grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-lg bg-violet-50 p-3" aria-label="일간 Todo 날짜 선택">
      <button
        type="button"
        onClick={() => onMoveSelectedDate(-1)}
        className="min-h-11 rounded-md border border-violet-200 bg-white px-4 font-bold text-zinc-700 transition-colors hover:border-violet-700 hover:text-violet-700"
      >
        이전
      </button>
      <p className="text-center text-base font-bold text-zinc-900" aria-live="polite">
        {formatSelectedDate(selectedDate)}
      </p>
      <button
        type="button"
        onClick={() => onMoveSelectedDate(1)}
        className="min-h-11 rounded-md border border-violet-200 bg-white px-4 font-bold text-zinc-700 transition-colors hover:border-violet-700 hover:text-violet-700"
      >
        다음
      </button>
    </div>
  )
}

export default TodoDateNavigation
