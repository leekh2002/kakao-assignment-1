function createDateFromKey(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number)

  return new Date(year, month - 1, day)
}

function createDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function formatSelectedDate(selectedDate) {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(createDateFromKey(selectedDate))
}

function formatWeekDayName(dateKey) {
  return new Intl.DateTimeFormat('ko-KR', { weekday: 'short' }).format(createDateFromKey(dateKey))
}

function formatMonthDay(dateKey) {
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'numeric',
    day: 'numeric',
  }).format(createDateFromKey(dateKey))
}

function TodoDateNavigation({ selectedDate, weekDateSummaries, onMoveSelectedWeek, onSelectDate }) {
  const todayDateKey = createDateKey(new Date())

  return (
    <div className="mb-5" aria-label="주간 Todo 날짜 선택">
      <div className="mb-3 flex w-full items-center justify-between gap-3 rounded-lg bg-violet-50 px-3 py-2.5">
        <button
          type="button"
          onClick={() => onMoveSelectedWeek(-1)}
          className="min-h-10 shrink-0 rounded-full border border-violet-200 bg-white px-3.5 text-sm font-bold text-violet-700 transition-colors hover:border-violet-700 hover:bg-violet-700 hover:text-white"
          aria-label="이전 주차로 이동"
        >
          이전 주
        </button>
        <p className="min-w-0 flex-1 text-center text-base font-bold text-zinc-900" aria-live="polite">
          {formatSelectedDate(selectedDate)}
        </p>
        <button
          type="button"
          onClick={() => onMoveSelectedWeek(1)}
          className="min-h-10 shrink-0 rounded-full border border-violet-200 bg-white px-3.5 text-sm font-bold text-violet-700 transition-colors hover:border-violet-700 hover:bg-violet-700 hover:text-white"
          aria-label="다음 주차로 이동"
        >
          다음 주
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 overflow-x-auto max-sm:flex max-sm:pb-1">
        {weekDateSummaries.map(({ dateKey, todoCount }) => {
          const isSelectedDate = dateKey === selectedDate
          const isToday = dateKey === todayDateKey

          return (
            <button
              key={dateKey}
              type="button"
              onClick={() => onSelectDate(dateKey)}
              aria-pressed={isSelectedDate}
              aria-label={`${formatSelectedDate(dateKey)} Todo ${todoCount}개`}
              className={`flex min-h-20 min-w-0 flex-col items-center justify-center gap-1 rounded-lg border px-2 py-2 transition-colors max-sm:min-w-20 ${
                isSelectedDate
                  ? 'border-violet-700 bg-violet-700 text-white shadow-[0_8px_18px_rgba(109,40,217,0.22)]'
                  : isToday
                    ? 'border-violet-700 bg-violet-50 text-violet-800'
                    : 'border-violet-100 bg-white text-zinc-700 hover:border-violet-700 hover:text-violet-700'
              }`}
            >
              <span className="text-xs font-bold">{formatWeekDayName(dateKey)}</span>
              <span className="text-sm font-extrabold">{formatMonthDay(dateKey)}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                  isSelectedDate ? 'bg-white text-violet-700' : 'bg-violet-50 text-zinc-500'
                }`}
              >
                {todoCount}개
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default TodoDateNavigation
