export type TaskPriority = '높음' | '보통' | '낮음'
export type TaskStatus = '할 일' | '진행 중' | '검토 중' | '완료'
export type TaskCategory = '프론트엔드' | '백엔드' | '기획' | '디자인' | '협업' | 'DevOps'
export type AttachmentType = 'pdf' | 'image' | 'sheet'

export type BoardTask = {
  id: string
  title: string
  category: TaskCategory
  priority: TaskPriority
  dueLabel: string
  checklist: string
  comments: number
  progress: number
  assigneeId: string
  status: TaskStatus
}

export type BoardColumn = {
  id: string
  title: TaskStatus
  accentClass: string
  tasks: BoardTask[]
}

export type ChecklistItem = {
  id: string
  label: string
  done: boolean
}

export type TaskAttachment = {
  id: string
  name: string
  size: string
  type: AttachmentType
}

export type TaskComment = {
  id: string
  authorId: string
  time: string
  content: string
  mention?: string
}

export type TaskActivityLog = {
  id: string
  actorId: string
  time: string
  content: string
}

export type TaskDetail = {
  id: string
  title: string
  category: TaskCategory
  priority: TaskPriority
  status: TaskStatus
  assigneeId: string
  startDate: string
  dueDate: string
  tags: string[]
  description: string
  checklistItems: ChecklistItem[]
  attachments: TaskAttachment[]
  comments: TaskComment[]
  activityLogs: TaskActivityLog[]
}

const boardTasks: BoardTask[] = [
  { id: 'task-login-ui', title: '로그인 UI', category: '프론트엔드', priority: '높음', dueLabel: '5월 24일', checklist: '0/5', comments: 2, progress: 12, assigneeId: 'user-owner', status: '할 일' },
  { id: 'task-signup-api', title: '회원가입 API', category: '백엔드', priority: '높음', dueLabel: '5월 25일', checklist: '2/4', comments: 1, progress: 22, assigneeId: 'user-member-2', status: '할 일' },
  { id: 'task-product-list', title: '상품 목록 화면', category: '프론트엔드', priority: '보통', dueLabel: '5월 28일', checklist: '0/6', comments: 0, progress: 18, assigneeId: 'user-member-1', status: '할 일' },
  { id: 'task-search-filter', title: '검색 필터 설계', category: '기획', priority: '보통', dueLabel: '5월 29일', checklist: '1/4', comments: 1, progress: 24, assigneeId: 'user-member-4', status: '할 일' },
  { id: 'task-banner-copy', title: '메인 배너 문구', category: '디자인', priority: '낮음', dueLabel: '5월 31일', checklist: '1/3', comments: 0, progress: 36, assigneeId: 'user-member-2', status: '할 일' },
  { id: 'task-footer-links', title: '푸터 링크 정리', category: '프론트엔드', priority: '낮음', dueLabel: '6월 1일', checklist: '2/3', comments: 0, progress: 48, assigneeId: 'user-member-1', status: '할 일' },

  { id: 'task-db-design', title: 'DB 설계', category: '백엔드', priority: '높음', dueLabel: '5월 23일', checklist: '3/5', comments: 3, progress: 68, assigneeId: 'user-member-2', status: '진행 중' },
  { id: 'task-jwt', title: 'JWT 인증', category: '백엔드', priority: '높음', dueLabel: '5월 26일', checklist: '2/4', comments: 2, progress: 52, assigneeId: 'user-owner', status: '진행 중' },
  { id: 'task-cart', title: '장바구니 기능', category: '프론트엔드', priority: '보통', dueLabel: '5월 30일', checklist: '1/5', comments: 1, progress: 28, assigneeId: 'user-member-2', status: '진행 중' },
  { id: 'task-payment-state', title: '결제 상태 처리', category: '백엔드', priority: '보통', dueLabel: '6월 2일', checklist: '2/5', comments: 1, progress: 60, assigneeId: 'user-member-4', status: '진행 중' },

  { id: 'task-payment', title: '결제 모듈 연동', category: '백엔드', priority: '높음', dueLabel: '5월 22일', checklist: '4/6', comments: 4, progress: 76, assigneeId: 'user-owner', status: '검토 중' },
  { id: 'task-admin-page', title: '관리자 페이지', category: '프론트엔드', priority: '보통', dueLabel: '5월 27일', checklist: '3/5', comments: 2, progress: 64, assigneeId: 'user-member-2', status: '검토 중' },
  { id: 'task-api-docs', title: 'API 문서 작성', category: '백엔드', priority: '낮음', dueLabel: '5월 29일', checklist: '1/3', comments: 1, progress: 34, assigneeId: 'user-member-4', status: '검토 중' },
  { id: 'task-qa-sheet', title: 'QA 체크리스트', category: '기획', priority: '보통', dueLabel: '5월 30일', checklist: '2/4', comments: 1, progress: 58, assigneeId: 'user-member-4', status: '검토 중' },
  { id: 'task-review-notes', title: '코드 리뷰 정리', category: '협업', priority: '낮음', dueLabel: '6월 1일', checklist: '2/3', comments: 3, progress: 72, assigneeId: 'user-member-3', status: '검토 중' },

  { id: 'task-deploy-check', title: '배포 확인', category: 'DevOps', priority: '높음', dueLabel: '5월 20일', checklist: '6/6', comments: 5, progress: 100, assigneeId: 'user-owner', status: '완료' },
  { id: 'task-test-code', title: '테스트 코드 작성', category: '백엔드', priority: '보통', dueLabel: '5월 19일', checklist: '3/5', comments: 3, progress: 100, assigneeId: 'user-member-2', status: '완료' },
  { id: 'task-ui-draft', title: 'UI/UX 초안', category: '프론트엔드', priority: '낮음', dueLabel: '5월 18일', checklist: '4/4', comments: 2, progress: 100, assigneeId: 'user-member-4', status: '완료' },
  { id: 'task-requirements', title: '요구사항 정리', category: '기획', priority: '보통', dueLabel: '5월 17일', checklist: '5/5', comments: 1, progress: 100, assigneeId: 'user-member-3', status: '완료' },
  { id: 'task-wireframe', title: '와이어프레임 검수', category: '디자인', priority: '낮음', dueLabel: '5월 16일', checklist: '4/4', comments: 1, progress: 100, assigneeId: 'user-member-2', status: '완료' },
]

export const boardColumns: BoardColumn[] = [
  { id: 'todo', title: '할 일', accentClass: 'column-todo', tasks: boardTasks.filter((task) => task.status === '할 일') },
  { id: 'progress', title: '진행 중', accentClass: 'column-progress', tasks: boardTasks.filter((task) => task.status === '진행 중') },
  { id: 'review', title: '검토 중', accentClass: 'column-review', tasks: boardTasks.filter((task) => task.status === '검토 중') },
  { id: 'done', title: '완료', accentClass: 'column-done', tasks: boardTasks.filter((task) => task.status === '완료') },
]

export function findBoardTask(taskId: string) {
  return boardTasks.find((task) => task.id === taskId)
}

const detailOverrides: Record<string, Partial<TaskDetail>> = {
  'task-login-ui': {
    title: '로그인 UI 구현',
    category: '프론트엔드',
    priority: '높음',
    status: '할 일',
    assigneeId: 'user-owner',
    startDate: '2024.05.20',
    dueDate: '2024.06.10',
    tags: ['UI', '로그인'],
    description: '이메일과 비밀번호를 입력받아 로그인 처리 화면을 구성합니다.',
    checklistItems: [
      { id: 'login-check-1', label: '로그인 레이아웃 구성', done: true },
      { id: 'login-check-2', label: '입력 검증 메시지 처리', done: true },
      { id: 'login-check-3', label: '오류 상태 UI 추가', done: false },
      { id: 'login-check-4', label: '반응형 대응', done: false },
      { id: 'login-check-5', label: '접근성 점검', done: false },
    ],
  },
  'task-signup-api': {
    title: '회원가입 API 구현',
    category: '백엔드',
    priority: '높음',
    status: '진행 중',
    assigneeId: 'user-member-2',
    startDate: '2024.05.20',
    dueDate: '2024.06.10',
    tags: ['API', '인증'],
    description: '이메일과 비밀번호를 입력받아 회원가입 처리 API를 구현합니다.',
    checklistItems: [
      { id: 'signup-check-1', label: 'User 엔티티 생성', done: true },
      { id: 'signup-check-2', label: '비밀번호 암호화', done: true },
      { id: 'signup-check-3', label: 'JWT 토큰 발급', done: true },
      { id: 'signup-check-4', label: '회원가입 테스트', done: false },
      { id: 'signup-check-5', label: '예외 처리 추가', done: false },
    ],
  },
  'task-db-design': {
    title: 'DB 설계',
    category: '백엔드',
    priority: '높음',
    status: '진행 중',
    assigneeId: 'user-member-2',
    startDate: '2024.05.18',
    dueDate: '2024.06.05',
    tags: ['ERD', '설계'],
    description: '회원, 상품, 주문, 결제 구조를 반영한 서비스 DB 스키마를 설계합니다.',
  },
  'task-jwt': {
    title: 'JWT 인증',
    category: '백엔드',
    priority: '높음',
    status: '진행 중',
    assigneeId: 'user-owner',
    startDate: '2024.05.20',
    dueDate: '2024.06.12',
    tags: ['보안', '인증'],
    description: '액세스 토큰과 리프레시 토큰 전략을 정리하고 인증 흐름을 구현합니다.',
  },
}

function buildGenericDetail(task: BoardTask): TaskDetail {
  const completedCount = Number(task.checklist.split('/')[0] ?? 0)
  const totalCount = Number(task.checklist.split('/')[1] ?? 5)
  const checklistItems = Array.from({ length: totalCount }).map((_, index) => ({
    id: `${task.id}-check-${index + 1}`,
    label:
      [
        `${task.title} 요구사항 정리`,
        `${task.title} 1차 구현`,
        `${task.title} 예외 처리`,
        `${task.title} 테스트 진행`,
        `${task.title} 문서 정리`,
        `${task.title} 리뷰 반영`,
      ][index] ?? `${task.title} 세부 항목 ${index + 1}`,
    done: index < completedCount,
  }))

  return {
    id: task.id,
    title: task.title,
    category: task.category,
    priority: task.priority,
    status: task.status,
    assigneeId: task.assigneeId,
    startDate: '2024.05.20',
    dueDate: '2024.06.10',
    tags: [task.category, task.priority],
    description: `${task.title} 작업을 진행하기 위한 상세 내용과 체크리스트입니다.`,
    checklistItems,
    attachments: [
      { id: `${task.id}-att-1`, name: 'API 명세서.pdf', size: '1.2 MB', type: 'pdf' },
      { id: `${task.id}-att-2`, name: 'ERD 설계.png', size: '980 KB', type: 'image' },
      { id: `${task.id}-att-3`, name: `${task.title} 테스트 케이스.xlsx`, size: '256 KB', type: 'sheet' },
    ],
    comments: [
      { id: `${task.id}-comment-1`, authorId: 'user-member-2', time: '2024.05.24 10:30', mention: '@김태현', content: '관련 예외 케이스도 같이 정리해두면 좋을 것 같습니다.' },
      { id: `${task.id}-comment-2`, authorId: 'user-owner', time: '2024.05.24 10:35', mention: '@최유리', content: '좋아요. 문서화할 때 실패 케이스도 함께 추가하겠습니다.' },
      { id: `${task.id}-comment-3`, authorId: 'user-member-1', time: '2024.05.24 11:02', content: '에러 코드도 정의해서 팀 문서에 같이 반영 부탁드립니다.' },
    ],
    activityLogs: [
      { id: `${task.id}-activity-1`, actorId: 'user-owner', time: '2024.05.23 15:00', content: '업무가 생성되었습니다.' },
      { id: `${task.id}-activity-2`, actorId: task.assigneeId, time: '2024.05.24 09:20', content: '체크리스트가 업데이트되었습니다.' },
      { id: `${task.id}-activity-3`, actorId: 'user-member-2', time: '2024.05.24 10:30', content: '댓글이 추가되었습니다.' },
    ],
  }
}

export function getTaskDetail(taskId: string): TaskDetail | null {
  const task = findBoardTask(taskId)

  if (!task) {
    return null
  }

  const genericDetail = buildGenericDetail(task)
  const override = detailOverrides[task.id] ?? {}

  return {
    ...genericDetail,
    ...override,
    checklistItems: override.checklistItems ?? genericDetail.checklistItems,
    attachments: override.attachments ?? genericDetail.attachments,
    comments: override.comments ?? genericDetail.comments,
    activityLogs: override.activityLogs ?? genericDetail.activityLogs,
  }
}
