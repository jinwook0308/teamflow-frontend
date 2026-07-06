import { useEffect, useState } from 'react'
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  FileImage,
  FileSpreadsheet,
  FileText,
  ListTodo,
  MessageSquareText,
  MoreHorizontal,
  Paperclip,
  PencilLine,
  Plus,
  Save,
  Users,
  X,
} from 'lucide-react'
import teamFlowLogoFull from '../../assets/logo/teamflow-logo.png'
import { Avatar, SecondaryButton } from '../../components/common'
import { teamFlowSeed, useTeamFlowStore } from '../../stores/useTeamFlowStore'
import { cn } from '../../utils/format'
import { useParams } from 'react-router-dom'

type AttachmentType = 'pdf' | 'image' | 'sheet'

type MeetingAttachment = {
  id: string
  name: string
  size: string
  type: AttachmentType
}

type FollowUpTask = {
  id: string
  ownerId: string
  task: string
  dueDate: string
  done: boolean
}

type MeetingRecord = {
  title: string
  date: string
  time: string
  participantIds: string[]
  extraParticipants: number
  agenda: string[]
  decisions: string[]
  followUps: FollowUpTask[]
  attachments: MeetingAttachment[]
}

type AttachmentDraft = {
  name: string
  size: string
  type: AttachmentType
}

const initialMeeting: MeetingRecord = {
  title: '2차 개발 회의',
  date: '2024.05.20',
  time: '10:00 ~ 11:30',
  participantIds: ['user-owner', 'user-admin', 'user-member-4', 'user-member-2', 'user-member-1'],
  extraParticipants: 2,
  agenda: [
    '로그인 및 회원 가입 플로우 리뷰',
    '대시보드 지표 정의 및 데이터 시각화 검토',
    '새로운 UI Kit 적용 범위 논의',
    'API 연동: Ubuntu → Nginx 사용',
  ],
  decisions: [
    '회원 가입 시 이메일 인증 필수 적용',
    '대시보드 KPI: 활성 사용자, 완료 업무, 프로젝트 수',
    'UI Kit 1.2 버전 전체 적용',
    'API 서버 인프라: Nginx로 교체 확정',
  ],
  followUps: [
    { id: 'followup-1', ownerId: 'user-owner', task: '로그인 API', dueDate: '2024.05.22', done: false },
    { id: 'followup-2', ownerId: 'user-member-4', task: '로그인 UI', dueDate: '2024.05.23', done: false },
    { id: 'followup-3', ownerId: 'user-member-1', task: '대시보드 데이터 연동', dueDate: '2024.05.24', done: false },
    { id: 'followup-4', ownerId: 'user-admin', task: 'API 문서 업데이트', dueDate: '2024.05.24', done: false },
  ],
  attachments: [
    { id: 'attachment-1', name: '회의록.pdf', size: '1.2 MB', type: 'pdf' },
    { id: 'attachment-2', name: '화면 설계서.pdf', size: '2.4 MB', type: 'pdf' },
    { id: 'attachment-3', name: 'API 명세서.pdf', size: '1.8 MB', type: 'image' },
    { id: 'attachment-4', name: 'ERD 설계.png', size: '920 KB', type: 'sheet' },
  ],
}

function cloneMeeting(source: MeetingRecord): MeetingRecord {
  return {
    ...source,
    agenda: [...source.agenda],
    decisions: [...source.decisions],
    followUps: source.followUps.map((item) => ({ ...item })),
    attachments: source.attachments.map((item) => ({ ...item })),
  }
}

function createEmptyAttachmentDraft(): AttachmentDraft {
  return {
    name: '',
    size: '',
    type: 'pdf',
  }
}

function renderAttachmentIcon(type: AttachmentType) {
  if (type === 'pdf') {
    return <FileText size={20} />
  }

  if (type === 'image') {
    return <FileImage size={20} />
  }

  return <FileSpreadsheet size={20} />
}

export function MeetingsPage() {
  const { projectId } = useParams()
  const selectProject = useTeamFlowStore((state) => state.selectProject)
  const [meeting, setMeeting] = useState<MeetingRecord>(() => cloneMeeting(initialMeeting))
  const [draftMeeting, setDraftMeeting] = useState<MeetingRecord>(() => cloneMeeting(initialMeeting))
  const [isEditMode, setIsEditMode] = useState(false)
  const [isAttachmentComposerOpen, setIsAttachmentComposerOpen] = useState(false)
  const [attachmentDraft, setAttachmentDraft] = useState<AttachmentDraft>(() => createEmptyAttachmentDraft())

  useEffect(() => {
    if (projectId) {
      selectProject(projectId)
    }
  }, [projectId, selectProject])

  const currentMeeting = isEditMode ? draftMeeting : meeting
  const participants = teamFlowSeed.users.filter((user) => currentMeeting.participantIds.includes(user.id))

  const handleEditStart = () => {
    setDraftMeeting(cloneMeeting(meeting))
    setIsEditMode(true)
  }

  const handleEditCancel = () => {
    setDraftMeeting(cloneMeeting(meeting))
    setIsEditMode(false)
  }

  const handleEditSave = () => {
    setMeeting(cloneMeeting(draftMeeting))
    setIsEditMode(false)
  }

  const handleAgendaChange = (index: number, value: string) => {
    setDraftMeeting((current) => {
      const nextAgenda = [...current.agenda]
      nextAgenda[index] = value
      return {
        ...current,
        agenda: nextAgenda,
      }
    })
  }

  const handleDecisionChange = (index: number, value: string) => {
    setDraftMeeting((current) => {
      const nextDecisions = [...current.decisions]
      nextDecisions[index] = value
      return {
        ...current,
        decisions: nextDecisions,
      }
    })
  }

  const handleAddAgenda = () => {
    setDraftMeeting((current) => ({
      ...current,
      agenda: [...current.agenda, '새 회의 안건을 입력하세요.'],
    }))
  }

  const handleAddDecision = () => {
    setDraftMeeting((current) => ({
      ...current,
      decisions: [...current.decisions, '새 결정 사항을 입력하세요.'],
    }))
  }

  const handleFollowUpToggle = (taskId: string) => {
    setMeeting((current) => ({
      ...current,
      followUps: current.followUps.map((item) => (item.id === taskId ? { ...item, done: !item.done } : item)),
    }))
  }

  const handleAttachmentAdd = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const name = attachmentDraft.name.trim()
    if (!name) {
      return
    }

    setMeeting((current) => ({
      ...current,
      attachments: [
        ...current.attachments,
        {
          id: `attachment-${Date.now()}`,
          name,
          size: attachmentDraft.size.trim() || '용량 미정',
          type: attachmentDraft.type,
        },
      ],
    }))
    setAttachmentDraft(createEmptyAttachmentDraft())
    setIsAttachmentComposerOpen(false)
  }

  return (
    <div className="meeting-page">
      <section className="meeting-shell">
        <header className="meeting-shell-header">
          <div className="meeting-shell-brand">
            <img src={teamFlowLogoFull} alt="TeamFlow" />
            <span className="meeting-shell-divider" />
            <strong>회의록</strong>
          </div>

          <div className="meeting-shell-actions">
            {isEditMode ? (
              <>
                <SecondaryButton onClick={handleEditCancel}>
                  <X size={18} />
                  취소
                </SecondaryButton>
                <button type="button" className="button button-primary" onClick={handleEditSave}>
                  <Save size={18} />
                  저장
                </button>
              </>
            ) : (
              <button type="button" className="button button-secondary" onClick={handleEditStart}>
                <PencilLine size={18} />
                편집
              </button>
            )}
            <button type="button" className="icon-button" aria-label="더 보기">
              <MoreHorizontal size={20} />
            </button>
          </div>
        </header>

        <div className="meeting-shell-body">
          <div className="meeting-main-column">
            <section className="meeting-summary-card">
              {isEditMode ? (
                <div className="meeting-edit-grid">
                  <input
                    className="meeting-title-input"
                    value={draftMeeting.title}
                    onChange={(event) => setDraftMeeting((current) => ({ ...current, title: event.target.value }))}
                  />
                  <div className="meeting-meta-edit-row">
                    <input
                      className="meeting-inline-input"
                      value={draftMeeting.date}
                      onChange={(event) => setDraftMeeting((current) => ({ ...current, date: event.target.value }))}
                    />
                    <input
                      className="meeting-inline-input"
                      value={draftMeeting.time}
                      onChange={(event) => setDraftMeeting((current) => ({ ...current, time: event.target.value }))}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h1>{meeting.title}</h1>
                  <div className="meeting-summary-meta">
                    <div className="meeting-meta-chip">
                      <CalendarDays size={18} />
                      <span>{meeting.date}</span>
                    </div>
                    <div className="meeting-meta-chip">
                      <Clock3 size={18} />
                      <span>{meeting.time}</span>
                    </div>
                  </div>
                </>
              )}

              <div className="meeting-participant-row">
                <div className="meeting-participant-label">
                  <Users size={18} />
                  <strong>참석자 {participants.length + meeting.extraParticipants}</strong>
                </div>
                <div className="meeting-participant-group">
                  {participants.map((user) => (
                    <Avatar key={user.id} user={user} />
                  ))}
                  {meeting.extraParticipants > 0 ? <span className="meeting-extra-badge">+{meeting.extraParticipants}</span> : null}
                </div>
              </div>
            </section>

            <section className="meeting-section">
              <div className="meeting-section-header">
                <div className="meeting-section-title">
                  <MessageSquareText size={20} />
                  <h2>회의 내용</h2>
                </div>
                {isEditMode ? (
                  <button type="button" className="meeting-inline-action" onClick={handleAddAgenda}>
                    <Plus size={16} />
                    안건 추가
                  </button>
                ) : null}
              </div>

              {isEditMode ? (
                <div className="meeting-edit-list">
                  {draftMeeting.agenda.map((item, index) => (
                    <label key={`agenda-${index}`} className="meeting-edit-item">
                      <span>{index + 1}.</span>
                      <textarea value={item} onChange={(event) => handleAgendaChange(index, event.target.value)} />
                    </label>
                  ))}
                </div>
              ) : (
                <ol className="meeting-text-list">
                  {meeting.agenda.map((item, index) => (
                    <li key={`agenda-${index}`}>{item}</li>
                  ))}
                </ol>
              )}
            </section>

            <section className="meeting-section">
              <div className="meeting-section-header">
                <div className="meeting-section-title">
                  <CheckCircle2 size={20} />
                  <h2>결정 사항</h2>
                </div>
                {isEditMode ? (
                  <button type="button" className="meeting-inline-action" onClick={handleAddDecision}>
                    <Plus size={16} />
                    항목 추가
                  </button>
                ) : null}
              </div>

              {isEditMode ? (
                <div className="meeting-edit-list">
                  {draftMeeting.decisions.map((item, index) => (
                    <label key={`decision-${index}`} className="meeting-edit-item">
                      <span>{index + 1}.</span>
                      <textarea value={item} onChange={(event) => handleDecisionChange(index, event.target.value)} />
                    </label>
                  ))}
                </div>
              ) : (
                <ul className="meeting-decision-list">
                  {meeting.decisions.map((item, index) => (
                    <li key={`decision-${index}`}>
                      <span className="meeting-decision-check">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="meeting-section">
              <div className="meeting-section-header">
                <div className="meeting-section-title">
                  <ListTodo size={20} />
                  <h2>후속 할 일</h2>
                </div>
              </div>

              <div className="meeting-followup-list">
                {meeting.followUps.map((item) => {
                  const owner = teamFlowSeed.users.find((user) => user.id === item.ownerId) ?? teamFlowSeed.users[0]

                  return (
                    <label key={item.id} className={cn('meeting-followup-item', item.done && 'is-done')}>
                      <input type="checkbox" checked={item.done} onChange={() => handleFollowUpToggle(item.id)} />
                      <div className="meeting-followup-copy">
                        <strong>
                          {owner.name} - {item.task}
                        </strong>
                      </div>
                      <span className="meeting-followup-date">{item.dueDate}</span>
                    </label>
                  )
                })}
              </div>
            </section>
          </div>

          <aside className="meeting-side-column">
            <section className="meeting-attachment-card">
              <div className="meeting-section-header">
                <div className="meeting-section-title">
                  <Paperclip size={20} />
                  <h2>첨부파일</h2>
                </div>
              </div>

              <div className="meeting-attachment-list">
                {meeting.attachments.map((item) => (
                  <div key={item.id} className="meeting-attachment-item">
                    <div className={cn('meeting-attachment-icon', `meeting-attachment-${item.type}`)}>
                      {renderAttachmentIcon(item.type)}
                    </div>
                    <div className="meeting-attachment-copy">
                      <strong>{item.name}</strong>
                      <p>{item.size}</p>
                    </div>
                    <button type="button" className="meeting-attachment-download" aria-label={`${item.name} 다운로드`}>
                      <Download size={20} />
                    </button>
                  </div>
                ))}
              </div>

              {isAttachmentComposerOpen ? (
                <form className="meeting-attachment-form" onSubmit={handleAttachmentAdd}>
                  <input
                    className="meeting-inline-input"
                    value={attachmentDraft.name}
                    onChange={(event) => setAttachmentDraft((current) => ({ ...current, name: event.target.value }))}
                    placeholder="파일 이름"
                  />
                  <div className="meeting-attachment-form-row">
                    <input
                      className="meeting-inline-input"
                      value={attachmentDraft.size}
                      onChange={(event) => setAttachmentDraft((current) => ({ ...current, size: event.target.value }))}
                      placeholder="예: 1.4 MB"
                    />
                    <select
                      className="meeting-inline-input"
                      value={attachmentDraft.type}
                      onChange={(event) => setAttachmentDraft((current) => ({ ...current, type: event.target.value as AttachmentType }))}
                    >
                      <option value="pdf">PDF</option>
                      <option value="image">이미지</option>
                      <option value="sheet">시트</option>
                    </select>
                  </div>
                  <div className="meeting-attachment-form-actions">
                    <button type="button" className="button button-secondary" onClick={() => setIsAttachmentComposerOpen(false)}>
                      닫기
                    </button>
                    <button type="submit" className="button button-primary">
                      추가
                    </button>
                  </div>
                </form>
              ) : (
                <button type="button" className="button button-primary meeting-attachment-add" onClick={() => setIsAttachmentComposerOpen(true)}>
                  <Plus size={18} />
                  파일 추가
                </button>
              )}
            </section>
          </aside>
        </div>
      </section>
    </div>
  )
}
