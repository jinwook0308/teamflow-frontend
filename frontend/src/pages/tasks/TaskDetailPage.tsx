import { useEffect, useMemo, useState } from 'react'
import {
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  CloudUpload,
  Download,
  FileSpreadsheet,
  FileText,
  Flag,
  GripVertical,
  Image as ImageIcon,
  Paperclip,
  Smile,
  X,
} from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { cn } from '../../utils/format'
import { getTaskDetail } from '../../data/task-board-data'
import { teamFlowSeed, useTeamFlowStore } from '../../stores/useTeamFlowStore'

type DetailTab = 'comments' | 'activity'

function attachmentIconByType(type: 'pdf' | 'image' | 'sheet') {
  if (type === 'pdf') {
    return <FileText size={18} />
  }

  if (type === 'image') {
    return <ImageIcon size={18} />
  }

  return <FileSpreadsheet size={18} />
}

export function TaskDetailPage() {
  const navigate = useNavigate()
  const { projectId, taskId } = useParams()
  const selectProject = useTeamFlowStore((state) => state.selectProject)
  const currentUserId = useTeamFlowStore((state) => state.currentUserId)
  const [activeTab, setActiveTab] = useState<DetailTab>('comments')

  const taskDetail = useMemo(() => (taskId ? getTaskDetail(taskId) : null), [taskId])

  useEffect(() => {
    if (projectId) {
      selectProject(projectId)
    }
  }, [projectId, selectProject])

  const currentUser = teamFlowSeed.users.find((user) => user.id === currentUserId) ?? teamFlowSeed.users[0]
  const assignee = teamFlowSeed.users.find((user) => user.id === taskDetail?.assigneeId) ?? teamFlowSeed.users[0]

  const completedCount = taskDetail?.checklistItems.filter((item) => item.done).length ?? 0
  const totalCount = taskDetail?.checklistItems.length ?? 0
  const progressPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100)

  if (!taskDetail) {
    return (
      <div className="task-detail-page">
        <div className="task-detail-shell task-detail-shell-empty">
          <strong>업무 정보를 찾을 수 없습니다.</strong>
          <button type="button" className="button button-primary" onClick={() => navigate('/dashboard')}>
            대시보드로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  const statusClass =
    taskDetail.status === '진행 중'
      ? 'task-detail-status-progress'
      : taskDetail.status === '검토 중'
        ? 'task-detail-status-review'
        : taskDetail.status === '완료'
          ? 'task-detail-status-done'
          : 'task-detail-status-todo'

  const priorityClass =
    taskDetail.priority === '높음'
      ? 'task-detail-priority-high'
      : taskDetail.priority === '보통'
        ? 'task-detail-priority-medium'
        : 'task-detail-priority-low'

  return (
    <div className="task-detail-page">
      <section className="task-detail-shell">
        <div className="task-detail-topbar">
          <div className="task-detail-title-wrap">
            <div className="task-detail-title-row">
              <div className="task-detail-title-icon">
                <ClipboardList size={20} />
              </div>
              <h1>{taskDetail.title}</h1>
              <span className="task-detail-category-badge">{taskDetail.category}</span>
            </div>
          </div>

          <div className="task-detail-topbar-actions">
            <button type="button" className={cn('task-detail-status-chip', statusClass)}>
              {taskDetail.status}
              <ChevronDown size={15} />
            </button>
            <button type="button" className="task-detail-close-button" aria-label="닫기" onClick={() => navigate(-1)}>
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="task-detail-main-grid">
          <div className="task-detail-left-column">
            <div className="task-detail-meta-grid">
              <div className="task-detail-meta-item">
                <span>담당자</span>
                <div className="task-detail-assignee">
                  <div className={cn('avatar', 'task-detail-inline-avatar', assignee.avatarColor)}>{assignee.avatarLabel}</div>
                  <strong>{assignee.name}</strong>
                </div>
              </div>

              <div className="task-detail-meta-item">
                <span>우선순위</span>
                <div className={cn('task-detail-priority-chip', priorityClass)}>
                  <Flag size={14} />
                  <strong>{taskDetail.priority}</strong>
                </div>
              </div>

              <div className="task-detail-meta-item">
                <span>시작일</span>
                <strong>{taskDetail.startDate}</strong>
              </div>

              <div className="task-detail-meta-item">
                <span>마감일</span>
                <strong>{taskDetail.dueDate}</strong>
              </div>

              <div className="task-detail-meta-item">
                <span>태그</span>
                <div className="task-detail-tag-list">
                  {taskDetail.tags.map((tag) => (
                    <span key={tag} className="task-detail-tag-chip">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="task-detail-section">
              <h2>설명</h2>
              <p>{taskDetail.description}</p>
            </div>

            <div className="task-detail-divider" />

            <div className="task-detail-section">
              <div className="task-detail-checklist-header">
                <h2>체크리스트</h2>
                <div className="task-detail-progress-summary">
                  <strong>
                    {completedCount} / {totalCount} 완료
                  </strong>
                  <div className="task-detail-progress-bar">
                    <div style={{ width: `${progressPercent}%` }} />
                  </div>
                </div>
              </div>

              <div className="task-detail-checklist-list">
                {taskDetail.checklistItems.map((item) => (
                  <div key={item.id} className="task-detail-checklist-item">
                    <div className="task-detail-checklist-label">
                      {item.done ? (
                        <span className="task-detail-check-icon task-detail-check-icon-done">
                          <Check size={14} />
                        </span>
                      ) : (
                        <span className="task-detail-check-icon">
                          <span />
                        </span>
                      )}
                      <strong>{item.label}</strong>
                    </div>
                    <GripVertical size={16} />
                  </div>
                ))}
              </div>

              <div className="task-detail-checklist-actions">
                <button type="button" className="button button-secondary">
                  + 항목 추가
                </button>
                <button type="button" className="button button-secondary">
                  <CheckCircle2 size={16} />
                  모두 완료 처리
                </button>
              </div>
            </div>
          </div>

          <div className="task-detail-right-column">
            <div className="task-detail-attachment-head">
              <h2>첨부파일</h2>
              <button type="button" className="task-detail-file-count">
                {taskDetail.attachments.length}개 파일
                <ChevronDown size={14} />
              </button>
            </div>

            <div className="task-detail-attachment-list">
              {taskDetail.attachments.map((attachment) => (
                <div key={attachment.id} className="task-detail-attachment-item">
                  <div className="task-detail-attachment-icon">{attachmentIconByType(attachment.type)}</div>
                  <div className="task-detail-attachment-copy">
                    <strong>{attachment.name}</strong>
                    <span>{attachment.size}</span>
                  </div>
                  <button type="button" className="task-detail-download-button" aria-label={`${attachment.name} 다운로드`}>
                    <Download size={18} />
                  </button>
                </div>
              ))}
            </div>

            <button type="button" className="task-detail-upload-box">
              <CloudUpload size={28} />
              <strong>파일을 드래그하거나 클릭하여 첨부하세요</strong>
              <span>지원 형식: jpg, png, pdf, docx, xlsx (최대 20MB)</span>
            </button>
          </div>
        </div>

        <div className="task-detail-discussion-card">
          <div className="task-detail-discussion-header">
            <div className="task-detail-tab-list">
              <button
                type="button"
                className={cn('task-detail-tab-button', activeTab === 'comments' && 'active')}
                onClick={() => setActiveTab('comments')}
              >
                댓글 {taskDetail.comments.length}
              </button>
              <button
                type="button"
                className={cn('task-detail-tab-button', activeTab === 'activity' && 'active')}
                onClick={() => setActiveTab('activity')}
              >
                활동 기록
              </button>
            </div>

            <div className="task-detail-discussion-actions">
              <button type="button" className="task-detail-sort-button">
                최신순
                <ChevronDown size={14} />
              </button>
              <button type="button" className="button button-primary">
                댓글 작성
              </button>
            </div>
          </div>

          <div className="task-detail-discussion-list">
            {activeTab === 'comments'
              ? taskDetail.comments.map((comment) => {
                  const author = teamFlowSeed.users.find((user) => user.id === comment.authorId) ?? teamFlowSeed.users[0]

                  return (
                    <div key={comment.id} className="task-detail-comment-item">
                      <div className={cn('avatar', 'task-detail-comment-avatar', author.avatarColor)}>{author.avatarLabel}</div>
                      <div className="task-detail-comment-body">
                        <div className="task-detail-comment-meta">
                          <div className="task-detail-comment-author">
                            <strong>{author.name}</strong>
                            {comment.mention ? <span className="task-detail-mention-chip">{comment.mention}</span> : null}
                            <time>{comment.time}</time>
                          </div>
                          <div className="task-detail-comment-links">
                            <button type="button">수정</button>
                            <button type="button">삭제</button>
                          </div>
                        </div>
                        <p>{comment.content}</p>
                      </div>
                    </div>
                  )
                })
              : taskDetail.activityLogs.map((log) => {
                  const actor = teamFlowSeed.users.find((user) => user.id === log.actorId) ?? teamFlowSeed.users[0]

                  return (
                    <div key={log.id} className="task-detail-comment-item">
                      <div className={cn('avatar', 'task-detail-comment-avatar', actor.avatarColor)}>{actor.avatarLabel}</div>
                      <div className="task-detail-comment-body">
                        <div className="task-detail-comment-meta">
                          <div className="task-detail-comment-author">
                            <strong>{actor.name}</strong>
                            <time>{log.time}</time>
                          </div>
                        </div>
                        <p>{log.content}</p>
                      </div>
                    </div>
                  )
                })}
          </div>

          <div className="task-detail-comment-compose">
            <div className={cn('avatar', 'task-detail-comment-avatar', currentUser.avatarColor)}>{currentUser.avatarLabel}</div>
            <div className="task-detail-comment-input-wrap">
              <input type="text" placeholder="댓글을 입력하세요..." />
              <div className="task-detail-comment-tools">
                <button type="button" aria-label="이모지">
                  <Smile size={18} />
                </button>
                <button type="button" aria-label="파일 첨부">
                  <Paperclip size={18} />
                </button>
                <button type="button" className="task-detail-send-button" aria-label="댓글 전송">
                  <span>전송</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
