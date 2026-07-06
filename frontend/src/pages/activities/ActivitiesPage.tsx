import { useEffect, useMemo, useState } from 'react'
import { CirclePlus, FileText, MessageCircleMore, RefreshCcw, UserRound, ChevronDown } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { useTeamFlowStore } from '../../stores/useTeamFlowStore'
import { cn } from '../../utils/format'

type ActivityType = 'created' | 'assigned' | 'uploaded' | 'updated' | 'commented'
type ActivityFilter = 'all' | ActivityType

type ActivityEntry = {
  id: string
  actor: string
  detail: string
  timestamp: string
  type: ActivityType
}

const filterOptions: Array<{ id: ActivityFilter; label: string }> = [
  { id: 'all', label: '전체' },
  { id: 'created', label: '업무 생성' },
  { id: 'assigned', label: '담당자 지정' },
  { id: 'uploaded', label: '파일 업로드' },
  { id: 'updated', label: '상태 변경' },
  { id: 'commented', label: '댓글 작성' },
]

const activityEntries: ActivityEntry[] = [
  { id: 'activity-1', actor: '김태현', detail: "'로그인 API' 업무를 생성했습니다.", timestamp: '2024.05.30 10:30', type: 'created' },
  { id: 'activity-2', actor: '김영희', detail: "'로그인 UI 디자인' 업무의 담당자로 지정되었습니다.", timestamp: '2024.05.30 10:20', type: 'assigned' },
  { id: 'activity-3', actor: '박민수', detail: 'DB 설계서.pdf 파일을 업로드했습니다.', timestamp: '2024.05.30 10:15', type: 'uploaded' },
  { id: 'activity-4', actor: '이지은', detail: "'로그인 API' 업무 상태를 '검토 중'으로 변경했습니다.", timestamp: '2024.05.30 10:02', type: 'updated' },
  { id: 'activity-5', actor: '최유진', detail: "'로그인 API' 댓글을 작성했습니다.", timestamp: '2024.05.29 14:30', type: 'commented' },
  { id: 'activity-6', actor: '송다운', detail: '발표자료.pptx 파일을 업로드했습니다.', timestamp: '2024.05.29 11:40', type: 'uploaded' },
  { id: 'activity-7', actor: '한서준', detail: "'QA 체크리스트' 업무를 생성했습니다.", timestamp: '2024.05.29 09:55', type: 'created' },
  { id: 'activity-8', actor: '김태현', detail: "'결제 모듈 연동' 업무의 담당자를 박민수님으로 지정했습니다.", timestamp: '2024.05.28 18:10', type: 'assigned' },
  { id: 'activity-9', actor: '최유리', detail: "'관리자 페이지' 댓글을 작성했습니다.", timestamp: '2024.05.28 16:45', type: 'commented' },
  { id: 'activity-10', actor: '이지은', detail: "'JWT 인증' 업무 상태를 '진행 중'으로 변경했습니다.", timestamp: '2024.05.28 15:20', type: 'updated' },
]

function renderActivityIcon(type: ActivityType) {
  if (type === 'assigned') {
    return <UserRound size={24} />
  }

  if (type === 'uploaded') {
    return <FileText size={24} />
  }

  if (type === 'updated') {
    return <RefreshCcw size={24} />
  }

  if (type === 'commented') {
    return <MessageCircleMore size={24} />
  }

  return <CirclePlus size={24} />
}

export function ActivitiesPage() {
  const { projectId } = useParams()
  const selectProject = useTeamFlowStore((state) => state.selectProject)
  const [filter, setFilter] = useState<ActivityFilter>('all')

  useEffect(() => {
    if (projectId) {
      selectProject(projectId)
    }
  }, [projectId, selectProject])

  const visibleActivities = useMemo(() => {
    if (filter === 'all') {
      return activityEntries
    }

    return activityEntries.filter((entry) => entry.type === filter)
  }, [filter])

  return (
    <div className="activity-history-page">
      <section className="activity-history-shell">
        <div className="activity-history-header">
          <h1>활동 기록</h1>
        </div>

        <div className="activity-history-filter-row">
          <label className="activity-history-filter">
            <select value={filter} onChange={(event) => setFilter(event.target.value as ActivityFilter)} aria-label="활동 기록 필터">
              {filterOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown size={18} />
          </label>
        </div>

        <section className="activity-history-card">
          <div className="activity-history-list">
            {visibleActivities.map((entry, index) => (
              <article key={entry.id} className={cn('activity-history-item', index === visibleActivities.length - 1 && 'last')}>
                <div className={cn('activity-history-icon', `activity-history-${entry.type}`)}>{renderActivityIcon(entry.type)}</div>
                <div className="activity-history-copy">
                  <strong>
                    {entry.actor}님이 {entry.detail}
                  </strong>
                  <time>{entry.timestamp}</time>
                </div>
              </article>
            ))}

            {visibleActivities.length === 0 ? (
              <div className="activity-history-empty">
                <strong>선택한 조건의 활동이 아직 없습니다.</strong>
                <p>다른 필터를 선택하거나 이후 활동이 쌓이면 이곳에 표시됩니다.</p>
              </div>
            ) : null}
          </div>
        </section>
      </section>
    </div>
  )
}
