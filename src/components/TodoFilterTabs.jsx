const TODO_FILTER_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'active', label: '진행 중' },
  { value: 'completed', label: '완료' },
]

function TodoFilterTabs({ selectedFilter, onFilterChange }) {
  return (
    <div className="mb-5 mt-1 flex rounded-lg border border-violet-100 bg-violet-50 p-1" role="tablist" aria-label="Todo 상태 필터">
      {TODO_FILTER_OPTIONS.map((filterOption) => {
        const isSelectedFilter = selectedFilter === filterOption.value

        return (
          <button
            key={filterOption.value}
            type="button"
            role="tab"
            aria-selected={isSelectedFilter}
            onClick={() => onFilterChange(filterOption.value)}
            className={`min-h-11 flex-1 rounded-md px-3 font-bold transition-colors ${
              isSelectedFilter
                ? 'bg-violet-700 text-white shadow-sm'
                : 'text-zinc-600 hover:bg-white hover:text-violet-700'
            }`}
          >
            {filterOption.label}
          </button>
        )
      })}
    </div>
  )
}

export default TodoFilterTabs
