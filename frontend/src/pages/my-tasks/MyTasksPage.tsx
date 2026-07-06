import { useMemo, useState } from 'react'
import { ChevronRight, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { boardColumns } from '../../data/task-board-data'
import { teamFlowSeed, useTeamFlowStore } from '../../stores/useTeamFlowStore'
import { cn } from '../../utils/format'

type MyTaskStatusFilter = 'all' | (typeof boardColumns)[number]['title']
type MyTaskPriorityFilter = 'all' | (typeof boardColumns)[number]['tasks'][number]['priority']

type MyTaskItem = (typeof boardColumns)[number]['tasks'][number] & {
  projectId: string
  projectName: string
}

const statusTabs: Array<{ id: MyTaskStatusFilter; label: string }> = [
  { id: 'all', label: '전체' },
  ...boardColumns.map((column) => ({
    id: column.title,
    label: column.title,
  })),
]

function getStatusClass(status: MyTaskItem['status']) {
  if (status === '진행 중') {
    return 'task-chip-progress'
  }

  if (status === '검토 중') {
    return 'task-chip-review'
  }

  if (status === '완료') {
    return 'task-chip-done'
  }

  return 'task-chip-todo'
}

function getPriorityClass(priority: MyTaskItem['priority']) {
  if (priority === '높음') {
    return 'task-priority-high'
  }

  if (priority === '보통') {
    return 'task-priority-medium'
  }

  return 'task-priority-low'
}

export function MyTasksPage() {
  const currentUserId = useTeamFlowStore((state) => state.currentUserId)
  const currentUser = teamFlowSeed.users.find((user) => user.id === currentUserId) ?? teamFlowSeed.users[0]
  const [statusFilter, setStatusFilter] = useState<MyTaskStatusFilter>('all')
  const [priorityFilter, setPriorityFilter] = useState<MyTaskPriorityFilter>('all')
  const [keyword, setKeyword] = useState('')

  const myProjects = useMemo(() => {
    return teamFlowSeed.projects.filter((project) => project.memberIds.includes(currentUserId))
  }, [currentUserId])

  const myTasks = useMemo<MyTaskItem[]>(() => {
    const ownTasks = boardColumns.flatMap((column) => column.tasks).filter((task) => task.assigneeId === currentUserId)

    return ownTasks.map((task, index) => {
      const fallbackProject = teamFlowSeed.projects[0]
      const project = myProjects[index % Math.max(myProjects.length, 1)] ?? fallbackProject

      return {
        ...task,
        projectId: project.id,
        projectName: project.name,
      }
    })
  }, [currentUserId, myProjects])

  const filteredTasks = useMemo(() => {
    return myTasks.filter((task) => {
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter
      const normalizedKeyword = keyword.trim().toLowerCase()
      const matchesKeyword =
        normalizedKeyword.length === 0 ||
        task.title.toLowerCase().includes(normalizedKeyword) ||
        task.category.toLowerCase().includes(normalizedKeyword) ||
        task.projectName.toLowerCase().includes(normalizedKeyword)

      return matchesStatus && matchesPriority && matchesKeyword
    })
  }, [keyword, myTasks, priorityFilter, statusFilter])

  const summary = useMemo(
    () => [
      {
        id: 'all',
        label: '전체 업무',
        value: myTasks.length,
        caption: `${currentUser.name}님에게 배정된 전체 항목`,
        toneClass: 'my-tasks-summary-primary',
      },
      {
        id: 'progress',
        label: '진행 중',
        value: myTasks.filter((task) => task.status === '진행 중').length,
        caption: '지금 바로 작업 중인 업무',
        toneClass: 'my-tasks-summary-progress',
      },
      {
        id: 'review',
        label: '검토 중',
        value: myTasks.filter((task) => task.status === '검토 중').length,
        caption: '리뷰와 확인이 필요한 업무',
        toneClass: 'my-tasks-summary-review',
      },
      {
        id: 'priority',
        label: '높은 우선순위',
        value: myTasks.filter((task) => task.priority === '높음' && task.status !== '완료').length,
        caption: '먼저 챙겨야 하는 핵심 업무',
        toneClass: 'my-tasks-summary-alert',
      },
    ],
    [currentUser.name, myTasks],
  )

  const priorityOptions: MyTaskPriorityFilter[] = ['all', '높음', '보통', '낮음']

  return (
    <div className="my-tasks-page">
      <section className="my-tasks-shell">
        <div className="my-tasks-header">
          <div>
            <p className="my-tasks-eyebrow">내가 맡은 업무 모아보기</p>
            <h1>내 업무</h1>
            <p className="my-tasks-description">
              현재 로그인한 <strong>{currentUser.name}</strong>님 기준으로, 프로젝트별 담당 업무를 빠르게 확인할 수 있게 정리했습니다.
            </p>
          </div>

          <div className="my-tasks-user-card">
            <div className={cn('avatar', currentUser.avatarColor, 'my-tasks-user-avatar')}>{currentUser.avatarLabel}</div>
            <div>
              <strong>{currentUser.name}</strong>
              <span>{currentUser.position}</span>
            </div>
          </div>
        </div>

        <div className="my-tasks-summary-grid">
          {summary.map((item) => (
            <article key={item.id} className={cn('my-tasks-summary-card', item.toneClass)}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <p>{item.caption}</p>
            </article>
          ))}
        </div>

        <div className="my-tasks-toolbar">
          <div className="my-tasks-filter-tabs" role="tablist" aria-label="내 업무 상태 필터">
            {statusTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={statusFilter === tab.id}
                className={cn('my-tasks-filter-tab', statusFilter === tab.id && 'active')}
                onClick={() => setStatusFilter(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="my-tasks-toolbar-actions">
            <label className="my-tasks-select-box">
              <span className="sr-only">우선순위 필터</span>
              <select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value as MyTaskPriorityFilter)}>
                {priorityOptions.map((option) => (
                  <option key={option} value={option}>
                    {option === 'all' ? '우선순위 전체' : option}
                  </option>
                ))}
              </select>
            </label>

            <label className="my-tasks-search-box">
              <Search size={18} />
              <input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="업무명, 카테고리, 프로젝트 검색" />
            </label>
          </div>
        </div>

        <div className="my-tasks-list-card">
          <div className="my-tasks-list-head">
            <span>업무명</span>
            <span>프로젝트</span>
            <span>상태</span>
            <span>우선순위</span>
            <span>마감일</span>
            <span>진행률</span>
            <span className="my-tasks-head-action" aria-hidden="true" />
          </div>

          <div className="my-tasks-list-body">
            {filteredTasks.map((task) => (
              <div key={task.id} className="my-tasks-list-row">
                <div className="my-tasks-name-cell">
                  <div className={cn('avatar', currentUser.avatarColor, 'my-tasks-row-avatar')}>{currentUser.avatarLabel}</div>
                  <div>
                    <strong>{task.title}</strong>
                    <p>{task.category}</p>
                  </div>
                </div>

                <span className="my-tasks-project-name">{task.projectName}</span>
                <span className={cn('tasks-status-chip', getStatusClass(task.status))}>{task.status}</span>
                <span className={cn('tasks-priority-chip', getPriorityClass(task.priority))}>{task.priority}</span>
                <span>{task.dueLabel}</span>

                <div className="my-tasks-progress-cell">
                  <div className="my-tasks-progress-track">
                    <div style={{ width: `${task.progress}%` }} />
                  </div>
                  <strong>{task.progress}%</strong>
                </div>

                <Link className="my-tasks-detail-link" to={`/projects/${task.projectId}/tasks/${task.id}`}>
                  상세
                  <ChevronRight size={16} />
                </Link>
              </div>
            ))}

            {filteredTasks.length === 0 ? (
              <div className="my-tasks-empty">
                <strong>조건에 맞는 내 업무가 아직 없습니다.</strong>
                <p>상태나 우선순위를 바꾸거나, 다른 계정으로 로그인해서 배정 상태를 확인해보세요.</p>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  )
}
