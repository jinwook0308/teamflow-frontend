import { useEffect, useMemo, useState } from 'react'
import { ChevronRight, Plus, Search, X } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { boardColumns, type BoardTask } from '../../data/task-board-data'
import { teamFlowSeed, useTeamFlowStore } from '../../stores/useTeamFlowStore'
import { cn } from '../../utils/format'

type TaskListItem = BoardTask & {
  source: 'seed' | 'local'
}

type TaskComposerDraft = {
  title: string
  assigneeId: string
  category: BoardTask['category']
  priority: BoardTask['priority']
  status: BoardTask['status']
  dueLabel: string
}

const seedTasks: TaskListItem[] = boardColumns.flatMap((column) =>
  column.tasks.map((task) => ({
    ...task,
    source: 'seed' as const,
  })),
)

const statusTabs = [
  { id: 'all', label: '전체' },
  ...boardColumns.map((column) => ({
    id: column.title,
    label: column.title,
  })),
]

function createEmptyTaskDraft(): TaskComposerDraft {
  return {
    title: '',
    assigneeId: teamFlowSeed.users[0].id,
    category: seedTasks[0]?.category ?? '기획',
    priority: seedTasks[0]?.priority ?? '보통',
    status: seedTasks[0]?.status ?? '할 일',
    dueLabel: '6월 5일',
  }
}

export function TasksPage() {
  const { projectId } = useParams()
  const selectProject = useTeamFlowStore((state) => state.selectProject)
  const currentProjectId = useTeamFlowStore((state) => state.currentProjectId)
  const [tasks, setTasks] = useState<TaskListItem[]>(seedTasks)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [keyword, setKeyword] = useState('')
  const [isComposerOpen, setIsComposerOpen] = useState(false)
  const [draft, setDraft] = useState<TaskComposerDraft>(() => createEmptyTaskDraft())

  useEffect(() => {
    if (projectId) {
      selectProject(projectId)
    }
  }, [projectId, selectProject])

  const currentProject = teamFlowSeed.projects.find((project) => project.id === currentProjectId) ?? teamFlowSeed.projects[0]
  const members = teamFlowSeed.users.filter((user) => currentProject.memberIds.includes(user.id))

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter
      const matchesKeyword =
        keyword.trim().length === 0 ||
        task.title.toLowerCase().includes(keyword.trim().toLowerCase()) ||
        task.category.toLowerCase().includes(keyword.trim().toLowerCase())

      return matchesStatus && matchesKeyword
    })
  }, [keyword, statusFilter, tasks])

  const summaryItems = useMemo(
    () =>
      boardColumns.map((column) => ({
        id: column.id,
        label: column.title,
        value: tasks.filter((task) => task.status === column.title).length,
        accentClass: column.accentClass,
      })),
    [tasks],
  )

  const handleTaskCreate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const title = draft.title.trim()
    if (!title) {
      return
    }

    setTasks((current) => [
      {
        id: `local-task-${Date.now()}`,
        title,
        category: draft.category,
        priority: draft.priority,
        dueLabel: draft.dueLabel.trim() || '일정 미정',
        checklist: '0/3',
        comments: 0,
        progress: 0,
        assigneeId: draft.assigneeId,
        status: draft.status,
        source: 'local',
      },
      ...current,
    ])
    setDraft(createEmptyTaskDraft())
    setStatusFilter('all')
    setKeyword('')
    setIsComposerOpen(false)
  }

  return (
    <>
      <div className="tasks-page">
        <section className="tasks-shell">
          <div className="tasks-header">
            <div>
              <p className="tasks-eyebrow">프로젝트 전체 업무 보기</p>
              <h1>작업</h1>
            </div>
            <button type="button" className="button button-primary" onClick={() => setIsComposerOpen(true)}>
              <Plus size={18} />
              작업 추가
            </button>
          </div>

          <div className="tasks-summary-grid">
            {summaryItems.map((item) => (
              <article key={item.id} className={cn('tasks-summary-card', item.accentClass)}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
                <p>{currentProject.name} 기준 업무 수</p>
              </article>
            ))}
          </div>

          <div className="tasks-toolbar">
            <div className="tasks-filter-tabs" role="tablist" aria-label="업무 상태 필터">
              {statusTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={statusFilter === tab.id}
                  className={cn('tasks-filter-tab', statusFilter === tab.id && 'active')}
                  onClick={() => setStatusFilter(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <label className="tasks-search-box">
              <Search size={18} />
              <input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="작업명 또는 카테고리 검색" />
            </label>
          </div>

          <div className="tasks-list-card">
            <div className="tasks-list-head">
              <span>작업명</span>
              <span>담당자</span>
              <span>상태</span>
              <span>우선순위</span>
              <span>마감일</span>
              <span>진행률</span>
              <span className="tasks-head-action" aria-hidden="true" />
            </div>

            <div className="tasks-list-body">
              {filteredTasks.map((task) => {
                const assignee = teamFlowSeed.users.find((user) => user.id === task.assigneeId) ?? teamFlowSeed.users[0]
                const statusClass =
                  task.status === '진행 중'
                    ? 'task-chip-progress'
                    : task.status === '검토 중'
                      ? 'task-chip-review'
                      : task.status === '완료'
                        ? 'task-chip-done'
                        : 'task-chip-todo'

                const priorityClass =
                  task.priority === '높음'
                    ? 'task-priority-high'
                    : task.priority === '보통'
                      ? 'task-priority-medium'
                      : 'task-priority-low'

                return (
                  <div key={task.id} className="tasks-list-row">
                    <div className="tasks-name-cell">
                      <div className={cn('avatar', 'tasks-row-avatar', assignee.avatarColor)}>{assignee.avatarLabel}</div>
                      <div>
                        <strong>{task.title}</strong>
                        <p>{task.category}</p>
                      </div>
                    </div>
                    <span>{assignee.name}</span>
                    <span className={cn('tasks-status-chip', statusClass)}>{task.status}</span>
                    <span className={cn('tasks-priority-chip', priorityClass)}>{task.priority}</span>
                    <span>{task.dueLabel}</span>
                    <div className="tasks-progress-cell">
                      <div className="tasks-progress-track">
                        <div style={{ width: `${task.progress}%` }} />
                      </div>
                      <strong>{task.progress}%</strong>
                    </div>
                    {task.source === 'seed' ? (
                      <Link className="tasks-detail-link" to={`/projects/${currentProjectId}/tasks/${task.id}`}>
                        상세
                        <ChevronRight size={16} />
                      </Link>
                    ) : (
                      <span className="tasks-local-badge">목록 전용</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </div>

      {isComposerOpen ? (
        <div className="tasks-modal-backdrop" onClick={() => setIsComposerOpen(false)}>
          <div
            className="tasks-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="tasks-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="tasks-modal-header">
              <div>
                <h2 id="tasks-modal-title">작업 추가</h2>
                <p>프로젝트 전체 업무 목록에 새 작업을 추가합니다. 지금은 프론트 데모 기준으로 목록에 바로 반영됩니다.</p>
              </div>
              <button type="button" className="icon-button" aria-label="닫기" onClick={() => setIsComposerOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form className="tasks-modal-form" onSubmit={handleTaskCreate}>
              <label className="tasks-field">
                <span>작업명</span>
                <input value={draft.title} onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))} placeholder="예: 공지 배너 검토" />
              </label>

              <div className="tasks-field-grid">
                <label className="tasks-field">
                  <span>담당자</span>
                  <select
                    value={draft.assigneeId}
                    onChange={(event) => setDraft((current) => ({ ...current, assigneeId: event.target.value }))}
                  >
                    {members.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="tasks-field">
                  <span>상태</span>
                  <select
                    value={draft.status}
                    onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value as TaskComposerDraft['status'] }))}
                  >
                    {boardColumns.map((column) => (
                      <option key={column.id} value={column.title}>
                        {column.title}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="tasks-field-grid">
                <label className="tasks-field">
                  <span>카테고리</span>
                  <select
                    value={draft.category}
                    onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value as TaskComposerDraft['category'] }))}
                  >
                    {[...new Set(seedTasks.map((task) => task.category))].map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="tasks-field">
                  <span>우선순위</span>
                  <select
                    value={draft.priority}
                    onChange={(event) => setDraft((current) => ({ ...current, priority: event.target.value as TaskComposerDraft['priority'] }))}
                  >
                    {[...new Set(seedTasks.map((task) => task.priority))].map((priority) => (
                      <option key={priority} value={priority}>
                        {priority}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="tasks-field">
                <span>마감일</span>
                <input value={draft.dueLabel} onChange={(event) => setDraft((current) => ({ ...current, dueLabel: event.target.value }))} placeholder="예: 6월 5일" />
              </label>

              <div className="tasks-modal-actions">
                <button type="button" className="button button-secondary" onClick={() => setIsComposerOpen(false)}>
                  취소
                </button>
                <button type="submit" className="button button-primary">
                  작업 저장
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  )
}
