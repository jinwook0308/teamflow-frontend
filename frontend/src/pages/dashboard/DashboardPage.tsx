import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  CheckSquare2,
  ChevronLeft,
  ChevronRight,
  CircleEllipsis,
  Clock3,
  FileText,
  GanttChartSquare,
  LayoutPanelTop,
  List,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Settings,
  Share2,
  SlidersHorizontal,
  Star,
  X,
} from 'lucide-react'
import { SectionCard } from '../../components/common'
import { boardColumns } from '../../data/task-board-data'
import { teamFlowSeed, useTeamFlowStore } from '../../stores/useTeamFlowStore'

type ActivityItem = {
  id: string
  actor: string
  detail: string
  time: string
}

const tabs = [
  { id: 'board', label: '보드', icon: LayoutPanelTop },
  { id: 'list', label: '목록', icon: List },
  { id: 'gantt', label: '간트 차트', icon: GanttChartSquare },
  { id: 'files', label: '파일', icon: FileText },
  { id: 'settings', label: '설정', icon: Settings },
]

const recentActivities: ActivityItem[] = [
  { id: 'activity-1', actor: '이지은', detail: 'JWT 인증 업무에 댓글을 남겼습니다.', time: '10분 전' },
  { id: 'activity-2', actor: '박민수', detail: '배포 확인 업무를 완료 상태로 옮겼습니다.', time: '1시간 전' },
  { id: 'activity-3', actor: '최유리', detail: 'API 명세서 v1.2.pdf 파일을 업로드했습니다.', time: '3시간 전' },
  { id: 'activity-4', actor: '김태현', detail: '관리자 페이지 업무를 검토 중으로 이동했습니다.', time: '5시간 전' },
  { id: 'activity-5', actor: '송다운', detail: '배포 스크립트 환경 변수를 업데이트했습니다.', time: '어제' },
  { id: 'activity-6', actor: '한서준', detail: 'QA 체크리스트 검토 의견을 등록했습니다.', time: '어제' },
  { id: 'activity-7', actor: '이지은', detail: '회원가입 API 예외 처리 이슈를 수정했습니다.', time: '2일 전' },
  { id: 'activity-8', actor: '최유리', detail: 'UI/UX 초안 피드백 반영본을 업로드했습니다.', time: '2일 전' },
]

const calendarCells = ['28', '29', '30', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '1']

export function DashboardPage() {
  const currentUserId = useTeamFlowStore((state) => state.currentUserId)
  const currentProjectId = useTeamFlowStore((state) => state.currentProjectId)
  const [isActivityModalOpen, setActivityModalOpen] = useState(false)

  const currentUser = teamFlowSeed.users.find((user) => user.id === currentUserId) ?? teamFlowSeed.users[0]
  const currentProject = teamFlowSeed.projects.find((project) => project.id === currentProjectId) ?? teamFlowSeed.projects[0]
  const currentMembers = teamFlowSeed.users.filter((user) => currentProject.memberIds.includes(user.id))

  const projectTitleById: Record<string, string> = {
    'project-shopping': '온라인 쇼핑몰 개발',
    'project-docs': '프로젝트 계획서 정리',
    'project-ui': 'UI 시안 반영',
  }

  const projectTitle = projectTitleById[currentProject.id] ?? currentProject.name

  const stats = [
    { label: '참여 프로젝트', value: '5', caption: '전체 8개 중' },
    { label: '내 담당 업무', value: '7', caption: '진행 중 4개' },
    { label: '마감 임박', value: '3', caption: '3일 이내 마감' },
    { label: '완료 업무', value: '12', caption: '전체 23개 중' },
  ]

  const scheduleItems = [
    { id: 'schedule-1', title: '전체 회의', time: '오전 10:00 - 11:00', toneClass: 'schedule-purple' },
    { id: 'schedule-2', title: 'DB 설계 검토', time: '오후 2:00 - 3:00', toneClass: 'schedule-green' },
  ]

  const activityToneClass = ['activity-blue', 'activity-green', 'activity-indigo', 'activity-orange']

  return (
    <>
      <div className="dashboard-home">
        <div className="dashboard-project-meta">
          <div className="dashboard-breadcrumb">
            <ArrowLeft size={15} />
            <span>프로젝트 목록으로</span>
          </div>

          <div className="dashboard-heading-row">
            <div className="dashboard-heading-copy">
              <div className="dashboard-title-row">
                <h1>{projectTitle}</h1>
                <button type="button" className="favorite-button" aria-label="즐겨찾기">
                  <Star size={16} />
                </button>
              </div>
            </div>

            <div className="dashboard-heading-actions">
              <button type="button" className="button button-secondary">
                <Share2 size={16} />
                공유
              </button>
              <button type="button" className="icon-button" aria-label="더 보기">
                <MoreHorizontal size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="dashboard-tabs">
          {tabs.map((tab, index) => {
            const Icon = tab.icon

            return (
              <button
                key={tab.id}
                type="button"
                className={index === 0 ? 'dashboard-tab dashboard-tab-active' : 'dashboard-tab'}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        <div className="dashboard-layout">
          <div className="dashboard-main">
            <div className="dashboard-summary-grid">
              <div className="summary-card summary-card-progress">
                <div className="summary-card-title">프로젝트 진행률</div>
                <div className="progress-circle-wrap">
                  <div
                    className="progress-circle"
                    style={{ background: `conic-gradient(#4a59ff 0 ${currentProject.progress}%, #eef1fb ${currentProject.progress}% 100%)` }}
                  >
                    <div className="progress-circle-inner">{currentProject.progress}%</div>
                  </div>

                  <div className="summary-progress-meta">
                    <div className="summary-progress-label">전체 진행률</div>
                    <div className="summary-progress-bar">
                      <div className="summary-progress-bar-fill" style={{ width: `${currentProject.progress}%` }} />
                    </div>
                    <strong>2024.05.01 ~ 2024.06.30</strong>
                    <span>D-18일 남음</span>
                  </div>
                </div>
              </div>

              {stats.map((stat, index) => (
                <div key={stat.label} className="summary-card summary-card-metric">
                  <div className="summary-card-title">{stat.label}</div>
                  <strong>{stat.value}</strong>
                  <span>{stat.caption}</span>
                  <em className={`summary-metric-icon summary-metric-${index + 1}`} />
                </div>
              ))}
            </div>

            <div className="board-toolbar">
              <div className="toolbar-group">
                <button type="button" className="toolbar-button">
                  <SlidersHorizontal size={15} />
                  필터
                </button>
                <button type="button" className="toolbar-button">
                  <CircleEllipsis size={15} />
                  정렬
                </button>
              </div>

              <button type="button" className="button button-primary">
                <Plus size={16} />
                업무 추가
              </button>
            </div>

            <div className="kanban-grid">
              {boardColumns.map((column) => (
                <section key={column.id} className={`kanban-column ${column.accentClass}`}>
                  <div className="kanban-column-header">
                    <div className="kanban-column-title">
                      <strong>{column.title}</strong>
                      <span>{column.tasks.length}</span>
                    </div>
                    <button type="button" className="icon-button icon-button-small" aria-label={`${column.title} 메뉴`}>
                      <MoreHorizontal size={16} />
                    </button>
                  </div>

                  <div className="kanban-task-list">
                    {column.tasks.map((task) => {
                      const assignee = currentMembers.find((member) => member.id === task.assigneeId) ?? currentUser
                      const priorityClass =
                        task.priority === '높음'
                          ? 'task-priority-high'
                          : task.priority === '보통'
                            ? 'task-priority-medium'
                            : 'task-priority-low'

                      return (
                        <Link
                          key={task.id}
                          to={`/projects/${currentProject.id}/tasks/${task.id}`}
                          className="task-card-link"
                        >
                          <article className="task-card">
                            <div className="task-card-top">
                              <div>
                                <h3>{task.title}</h3>
                                <div className="task-badges">
                                  <span className="task-category">{task.category}</span>
                                  <span className={`task-priority ${priorityClass}`}>{task.priority}</span>
                                </div>
                              </div>
                              <div className={`mini-avatar task-avatar ${assignee.avatarColor}`}>{assignee.avatarLabel}</div>
                            </div>

                            <div className="task-card-meta">
                              <span>
                                <Clock3 size={13} />
                                {task.dueLabel}
                              </span>
                              <span>
                                <MessageSquare size={13} />
                                {task.comments}
                              </span>
                              <span>
                                <CheckSquare2 size={13} />
                                {task.checklist}
                              </span>
                            </div>

                            <div className="task-card-progress-bar">
                              <div style={{ width: `${task.progress}%` }} />
                            </div>
                          </article>
                        </Link>
                      )
                    })}
                  </div>

                  <button type="button" className="column-add-button">
                    <Plus size={14} />
                    업무 추가
                  </button>
                </section>
              ))}
            </div>
          </div>

          <aside className="dashboard-side-panel">
            <SectionCard title="예정 일정" className="schedule-card">
              <div className="calendar-header">
                <button type="button" className="calendar-arrow" aria-label="이전 달">
                  <ChevronLeft size={16} />
                </button>
                <strong>2024년 5월</strong>
                <button type="button" className="calendar-arrow" aria-label="다음 달">
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="mini-calendar">
                {['일', '월', '화', '수', '목', '금', '토'].map((weekday) => (
                  <div key={weekday} className="mini-calendar-weekday">
                    {weekday}
                  </div>
                ))}

                {calendarCells.map((day, index) => {
                  const isCurrentMonth = index >= 3 && index <= 33
                  const isActive = day === '16'
                  const isMarked = day === '16' || day === '24'

                  return (
                    <div
                      key={`${day}-${index}`}
                      className={[
                        'mini-calendar-day',
                        !isCurrentMonth && 'is-muted',
                        isActive && 'is-active',
                        isMarked && 'is-marked',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      {day}
                    </div>
                  )
                })}
              </div>

              <div className="schedule-date-label">5월 16일 (목) 오늘</div>
              <div className="schedule-list">
                {scheduleItems.map((item) => (
                  <div key={item.id} className="schedule-item">
                    <span className={`schedule-dot ${item.toneClass}`} />
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard
              title="최근 활동"
              className="recent-activity-card"
              actions={
                <button
                  type="button"
                  className="icon-button icon-button-small recent-activity-expand"
                  aria-label="최근 활동 크게 보기"
                  onClick={() => setActivityModalOpen(true)}
                >
                  <Plus size={16} />
                </button>
              }
            >
              <div className="activity-list-compact">
                {recentActivities.map((activity, index) => (
                  <div key={activity.id} className="activity-item-compact">
                    <div className={`activity-item-icon ${activityToneClass[index % activityToneClass.length]}`} />
                    <div>
                      <strong>{activity.actor}</strong>
                      <p>{activity.detail}</p>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </aside>
        </div>
      </div>

      {isActivityModalOpen ? (
        <div className="activity-modal-backdrop" onClick={() => setActivityModalOpen(false)}>
          <div
            className="activity-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="activity-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="activity-modal-header">
              <div>
                <h2 id="activity-modal-title">최근 활동 전체 보기</h2>
                <p>{projectTitle} 프로젝트의 최신 흐름을 한 번에 확인할 수 있습니다.</p>
              </div>
              <button type="button" className="icon-button" aria-label="닫기" onClick={() => setActivityModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="activity-modal-list">
              {recentActivities.map((activity, index) => (
                <div key={activity.id} className="activity-modal-item">
                  <div className={`activity-item-icon ${activityToneClass[index % activityToneClass.length]}`} />
                  <div className="activity-modal-copy">
                    <div className="activity-modal-meta">
                      <strong>{activity.actor}</strong>
                      <span>{activity.time}</span>
                    </div>
                    <p>{activity.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
