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
    <div
      className="mb-5 flex w-full items-center justify-between gap-3 rounded-lg bg-violet-50 px-3 py-2.5"
      aria-label="일간 Todo 날짜 선택"
    >
      <button
        type="button"
        onClick={() => onMoveSelectedDate(-1)}
        className="min-h-10 shrink-0 rounded-full border border-violet-200 bg-white px-3.5 text-sm font-bold text-violet-700 transition-colors hover:border-violet-700 hover:bg-violet-700 hover:text-white"
        aria-label="이전 날짜로 이동"
      >
        이전
      </button>
      <p className="min-w-0 flex-1 text-center text-base font-bold text-zinc-900" aria-live="polite">
        {formatSelectedDate(selectedDate)}
      </p>
      <button
        type="button"
        onClick={() => onMoveSelectedDate(1)}
        className="min-h-10 shrink-0 rounded-full border border-violet-200 bg-white px-3.5 text-sm font-bold text-violet-700 transition-colors hover:border-violet-700 hover:bg-violet-700 hover:text-white"
        aria-label="다음 날짜로 이동"
      >
        다음
      </button>
    </div>
  )
}

export default TodoDateNavigation
