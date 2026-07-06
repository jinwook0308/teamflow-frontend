import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react'
import { cn } from '../../utils/format'

type CalendarViewMode = 'month' | 'week' | 'agenda'
type CalendarEventTone = 'violet' | 'orange' | 'green'

type CalendarEvent = {
  id: string
  date: string
  title: string
  time: string
  tone: CalendarEventTone
}

type CalendarDraft = {
  title: string
  time: string
  tone: CalendarEventTone
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']
const REFERENCE_TODAY = new Date(2024, 4, 16)

const viewModes: Array<{ id: CalendarViewMode; label: string }> = [
  { id: 'month', label: '월' },
  { id: 'week', label: '주' },
  { id: 'agenda', label: '일정' },
]

const initialEvents: CalendarEvent[] = [
  { id: 'calendar-event-1', date: '2024-05-08', title: 'DB 설계 미팅', time: '오후 2:00 - 3:00', tone: 'violet' },
  { id: 'calendar-event-2', date: '2024-05-21', title: '로그인 API 연동', time: '오전 11:00 - 12:00', tone: 'orange' },
  { id: 'calendar-event-3', date: '2024-05-23', title: '화면 설계 리뷰', time: '오후 4:00 - 5:00', tone: 'orange' },
  { id: 'calendar-event-4', date: '2024-05-27', title: '배포 테스트', time: '오전 10:00 - 11:00', tone: 'violet' },
  { id: 'calendar-event-5', date: '2024-05-30', title: '세팅 점검', time: '오후 3:00 - 4:00', tone: 'violet' },
]

function toDateKey(value: Date) {
  const year = value.getFullYear()
  const month = `${value.getMonth() + 1}`.padStart(2, '0')
  const day = `${value.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

function parseDateKey(value: string) {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function addDays(value: Date, amount: number) {
  const next = new Date(value)
  next.setDate(next.getDate() + amount)
  return next
}

function formatMonthLabel(value: Date) {
  return `${value.getFullYear()}년 ${value.getMonth() + 1}월`
}

function formatFullDate(value: string) {
  const date = parseDateKey(value)
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
}

function createEmptyDraft(): CalendarDraft {
  return {
    title: '',
    time: '',
    tone: 'violet',
  }
}

export function CalendarPage() {
  const [viewMode, setViewMode] = useState<CalendarViewMode>('month')
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(REFERENCE_TODAY.getFullYear(), REFERENCE_TODAY.getMonth(), 1))
  const [selectedDateKey, setSelectedDateKey] = useState(() => toDateKey(REFERENCE_TODAY))
  const [composerDateKey, setComposerDateKey] = useState(() => toDateKey(REFERENCE_TODAY))
  const [isComposerOpen, setIsComposerOpen] = useState(false)
  const [draft, setDraft] = useState<CalendarDraft>(() => createEmptyDraft())
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(initialEvents)

  const monthStart = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1)
  const monthEnd = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0)
  const leadingDays = monthStart.getDay()
  const totalCells = Math.ceil((leadingDays + monthEnd.getDate()) / 7) * 7
  const gridStart = addDays(monthStart, -leadingDays)
  const monthCells = Array.from({ length: totalCells }, (_, index) => addDays(gridStart, index))
  const selectedDateEvents = calendarEvents.filter((item) => item.date === selectedDateKey)
  const composerDateEvents = calendarEvents.filter((item) => item.date === composerDateKey)

  const openComposer = (dateKey: string) => {
    setSelectedDateKey(dateKey)
    setComposerDateKey(dateKey)
    setDraft(createEmptyDraft())
    setIsComposerOpen(true)
  }

  const handleMonthMove = (offset: number) => {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1))
  }

  const handleToday = () => {
    setVisibleMonth(new Date(REFERENCE_TODAY.getFullYear(), REFERENCE_TODAY.getMonth(), 1))
    setSelectedDateKey(toDateKey(REFERENCE_TODAY))
  }

  const handleAddEvent = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const title = draft.title.trim()
    if (!title) {
      return
    }

    setCalendarEvents((current) => [
      ...current,
      {
        id: `calendar-custom-${Date.now()}`,
        date: composerDateKey,
        title,
        time: draft.time.trim() || '시간 미정',
        tone: draft.tone,
      },
    ])
    setSelectedDateKey(composerDateKey)
    setDraft(createEmptyDraft())
    setIsComposerOpen(false)
  }

  return (
    <>
      <div className="calendar-page">
        <section className="calendar-surface">
          <div className="calendar-page-header">
            <div>
              <p className="calendar-page-eyebrow">프로젝트 일정 관리</p>
              <h1>캘린더</h1>
            </div>
            <p className="calendar-page-hint">날짜를 누르면 해당 일자에 일정을 바로 추가할 수 있습니다.</p>
          </div>

          <div className="calendar-toolbar">
            <div className="calendar-toolbar-actions">
              <button type="button" className="button button-secondary" onClick={handleToday}>
                오늘
              </button>
              <button type="button" className="icon-button" aria-label="이전 달" onClick={() => handleMonthMove(-1)}>
                <ChevronLeft size={20} />
              </button>
              <button type="button" className="icon-button" aria-label="다음 달" onClick={() => handleMonthMove(1)}>
                <ChevronRight size={20} />
              </button>
            </div>

            <strong className="calendar-current-month">{formatMonthLabel(visibleMonth)}</strong>

            <div className="calendar-view-switch" role="tablist" aria-label="캘린더 보기 모드">
              {viewModes.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  role="tab"
                  aria-selected={viewMode === mode.id}
                  className={cn('calendar-view-button', viewMode === mode.id && 'active')}
                  onClick={() => setViewMode(mode.id)}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          <div className="calendar-weekdays" aria-hidden="true">
            {WEEKDAYS.map((weekday) => (
              <div key={weekday} className={cn('calendar-weekday', weekday === '일' && 'is-sunday')}>
                {weekday}
              </div>
            ))}
          </div>

          <div className={cn('calendar-month-grid', totalCells > 35 && 'is-six-weeks')}>
            {monthCells.map((cellDate) => {
              const dateKey = toDateKey(cellDate)
              const isCurrentMonth = cellDate.getMonth() === visibleMonth.getMonth()
              const isSelected = dateKey === selectedDateKey
              const dayEvents = calendarEvents.filter((item) => item.date === dateKey)
              const isSunday = cellDate.getDay() === 0

              if (!isCurrentMonth) {
                return <div key={dateKey} className="calendar-day-cell is-empty" />
              }

              return (
                <button
                  key={dateKey}
                  type="button"
                  className={cn('calendar-day-cell', isSelected && 'is-selected')}
                  onClick={() => openComposer(dateKey)}
                >
                  <div className="calendar-day-top">
                    <span className={cn('calendar-day-number', isSunday && 'is-sunday', isSelected && 'is-selected')}>
                      {cellDate.getDate()}
                    </span>
                  </div>

                  <div className="calendar-day-events">
                    {dayEvents.slice(0, 2).map((item) => (
                      <span key={item.id} className={cn('calendar-event-pill', `calendar-event-${item.tone}`)}>
                        {item.title}
                      </span>
                    ))}

                    {dayEvents.length > 2 ? <span className="calendar-more-events">+{dayEvents.length - 2}개 더보기</span> : null}
                  </div>
                </button>
              )
            })}
          </div>

          <div className="calendar-selection-summary">
            <div>
              <strong>{formatFullDate(selectedDateKey)}</strong>
              <p>
                {selectedDateEvents.length > 0
                  ? `${selectedDateEvents.length}개의 일정이 등록되어 있습니다. 날짜를 다시 누르면 추가 입력 창이 열립니다.`
                  : '아직 등록된 일정이 없습니다. 날짜를 눌러 새 일정을 추가해보세요.'}
              </p>
            </div>
            <button type="button" className="button button-primary" onClick={() => openComposer(selectedDateKey)}>
              <Plus size={18} />
              일정 추가
            </button>
          </div>
        </section>
      </div>

      {isComposerOpen ? (
        <div className="calendar-modal-backdrop" onClick={() => setIsComposerOpen(false)}>
          <div
            className="calendar-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="calendar-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="calendar-modal-header">
              <div>
                <h2 id="calendar-modal-title">일정 추가하기</h2>
                <p>{formatFullDate(composerDateKey)} 일정</p>
              </div>
              <button type="button" className="icon-button" aria-label="닫기" onClick={() => setIsComposerOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="calendar-modal-existing">
              <strong>기존 일정</strong>
              {composerDateEvents.length > 0 ? (
                <div className="calendar-modal-existing-list">
                  {composerDateEvents.map((item) => (
                    <div key={item.id} className="calendar-modal-existing-item">
                      <span className={cn('calendar-event-dot', `calendar-event-${item.tone}`)} />
                      <div>
                        <strong>{item.title}</strong>
                        <p>{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="calendar-modal-empty">등록된 일정이 없습니다. 아래에서 새 일정을 추가해보세요.</p>
              )}
            </div>

            <form className="calendar-modal-form" onSubmit={handleAddEvent}>
              <label className="calendar-field">
                <span>일정 제목</span>
                <input
                  type="text"
                  value={draft.title}
                  onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
                  placeholder="예: 회의 준비, 화면 검토, 배포 체크"
                />
              </label>

              <label className="calendar-field">
                <span>시간</span>
                <input
                  type="text"
                  value={draft.time}
                  onChange={(event) => setDraft((current) => ({ ...current, time: event.target.value }))}
                  placeholder="예: 오후 2:00 - 3:00"
                />
              </label>

              <div className="calendar-field">
                <span>라벨 색상</span>
                <div className="calendar-tone-list">
                  {(['violet', 'orange', 'green'] as CalendarEventTone[]).map((tone) => (
                    <button
                      key={tone}
                      type="button"
                      className={cn('calendar-tone-button', draft.tone === tone && 'active')}
                      onClick={() => setDraft((current) => ({ ...current, tone }))}
                    >
                      <span className={cn('calendar-event-dot', `calendar-event-${tone}`)} />
                      {tone === 'violet' ? '기본' : tone === 'orange' ? '리뷰' : '완료'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="calendar-modal-actions">
                <button type="button" className="button button-secondary" onClick={() => setIsComposerOpen(false)}>
                  취소
                </button>
                <button type="submit" className="button button-primary">
                  일정 저장
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  )
}
