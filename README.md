# Todo App React Migration

Vanilla JavaScript로 구현된 Todo 앱을 React Function Component 구조로 마이그레이션한 프로젝트입니다.  
React, Vite, Tailwind CSS, JavaScript만 사용했습니다.

## 사용 기술

- React
- Vite
- Tailwind CSS
- JavaScript
- LocalStorage

## 구현 기능

### Todo 기본 기능

- Todo 추가
- Todo 수정
- Todo 삭제
- Todo 완료 / 완료 취소
- 빈 입력값 검증 메시지 표시

### 상태별 필터링

- `전체`, `진행 중`, `완료` 탭 제공
- 선택한 상태에 해당하는 Todo만 목록에 표시
- 현재 선택된 필터 탭에 활성 스타일 적용
- 필터 상태는 `useState`로 관리

### 일간 뷰

- 선택된 날짜에 해당하는 Todo만 표시
- Todo 생성 시 현재 선택된 날짜를 함께 저장
- 날짜는 `YYYY-MM-DD` 문자열 형태로 저장

### 주간 뷰

- 선택된 주의 월요일부터 일요일까지 날짜를 가로로 표시
- `이전 주`, `다음 주` 버튼으로 주차 이동
- 날짜 클릭 시 해당 날짜의 Todo만 목록에 표시
- 각 날짜 아래에 해당 날짜의 Todo 개수 표시
- 오늘 날짜와 선택된 날짜에 시각적 구분 스타일 적용
- 선택 날짜 상태는 `useState`로 관리
- 선택 날짜는 새로고침 후에도 유지되도록 LocalStorage에 저장

### LocalStorage 연동

- Todo 추가, 수정, 삭제, 완료 처리 시 Todo 목록 자동 저장
- 페이지 새로고침 시 저장된 Todo 목록 복원
- `JSON.stringify`로 저장하고 `JSON.parse`로 불러오기
- `useEffect`를 활용해 `todos` 상태 변경 시 자동 저장

## 폴더 구조

```text
src
├─ components
│  ├─ TodoDateNavigation.jsx
│  ├─ TodoFilterTabs.jsx
│  ├─ TodoForm.jsx
│  ├─ TodoItem.jsx
│  └─ TodoList.jsx
├─ App.jsx
├─ index.css
└─ main.jsx
```

## 컴포넌트 역할

- `App.jsx`: Todo 목록, 선택 날짜, 필터 상태, LocalStorage 연동 등 전체 상태 관리
- `TodoDateNavigation.jsx`: 주간 뷰 날짜 목록, 주차 이동, 날짜 선택 UI
- `TodoFilterTabs.jsx`: 전체 / 진행 중 / 완료 필터 탭 UI
- `TodoForm.jsx`: Todo 입력 및 추가 폼
- `TodoList.jsx`: 필터링된 Todo 목록 렌더링
- `TodoItem.jsx`: Todo 수정, 삭제, 완료 처리 UI
