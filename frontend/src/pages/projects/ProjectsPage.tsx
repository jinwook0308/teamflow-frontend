import { BellRing, CalendarDays, CheckCircle2, CircleHelp, ClipboardList, Download, FolderKanban, Hourglass } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { PageHeader } from '../../components/common'
import { boardColumns, type BoardTask } from '../../data/task-board-data'
import { teamFlowSeed, useTeamFlowStore } from '../../stores/useTeamFlowStore'
import { formatDate } from '../../utils/format'

type StatusChartItem = {
  id: 'todo' | 'progress' | 'review' | 'done'
  label: string
  value: number
  color: string
}

type PieSliceLabelProps = {
  cx?: number
  cy?: number
  midAngle?: number
  innerRadius?: number
  outerRadius?: number
  percent?: number
}

const projectTaskIdsByProjectId: Record<string, string[]> = {
  'project-shopping': [
    'task-login-ui',
    'task-signup-api',
    'task-product-list',
    'task-search-filter',
    'task-banner-copy',
    'task-footer-links',
    'task-db-design',
    'task-jwt',
    'task-cart',
    'task-payment-state',
    'task-payment',
    'task-admin-page',
    'task-api-docs',
    'task-qa-sheet',
    'task-review-notes',
    'task-deploy-check',
    'task-test-code',
    'task-ui-draft',
    'task-requirements',
    'task-wireframe',
  ],
  'project-docs': [
    'task-api-docs',
    'task-review-notes',
    'task-qa-sheet',
    'task-requirements',
    'task-wireframe',
    'task-banner-copy',
    'task-db-design',
    'task-test-code',
  ],
  'project-ui': [
    'task-login-ui',
    'task-product-list',
    'task-search-filter',
    'task-footer-links',
    'task-ui-draft',
    'task-cart',
    'task-admin-page',
    'task-payment-state',
  ],
}

const rangeOptions = [
  '2024.06.01 ~ 2024.06.30',
  '2024.05.01 ~ 2024.05.31',
  '2024.04.01 ~ 2024.04.30',
]

const RADIAN = Math.PI / 180

const statusPalette: Record<StatusChartItem['id'], string> = {
  progress: '#4a59ff',
  done: '#3b82f6',
  review: '#98a2b3',
  todo: '#667085',
}

function renderPieLabel({ percent }: { percent?: number }) {
  return `${Math.round((percent ?? 0) * 100)}%`
}

function renderPieSliceLabel({
  cx = 0,
  cy = 0,
  midAngle = 0,
  innerRadius = 0,
  outerRadius = 0,
  percent = 0,
}: PieSliceLabelProps) {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.58
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text x={x} y={y} fill="#ffffff" textAnchor="middle" dominantBaseline="central" fontSize={16} fontWeight={700}>
      {renderPieLabel({ percent })}
    </text>
  )
}

function buildTasksByProject(allTasks: BoardTask[]) {
  const taskMap = new Map(allTasks.map((task) => [task.id, task]))
  const fallbackTasks = allTasks.slice(0, 8)

  return teamFlowSeed.projects.reduce<Record<string, BoardTask[]>>((accumulator, project) => {
    const taskIds = projectTaskIdsByProjectId[project.id] ?? fallbackTasks.map((task) => task.id)
    const matchedTasks = taskIds
      .map((taskId) => taskMap.get(taskId))
      .filter((task): task is BoardTask => Boolean(task))

    accumulator[project.id] = matchedTasks.length > 0 ? matchedTasks : fallbackTasks
    return accumulator
  }, {})
}

export function ProjectsPage() {
  const currentProjectId = useTeamFlowStore((state) => state.currentProjectId)
  const selectProject = useTeamFlowStore((state) => state.selectProject)
  const [selectedRange, setSelectedRange] = useState(rangeOptions[0])
  const [downloadNotice, setDownloadNotice] = useState('')

  const allTasks = useMemo(() => boardColumns.flatMap((column) => column.tasks), [])
  const tasksByProjectId = useMemo(() => buildTasksByProject(allTasks), [allTasks])

  const selectedProject = teamFlowSeed.projects.find((project) => project.id === currentProjectId) ?? teamFlowSeed.projects[0]
  const selectedMembers = teamFlowSeed.users.filter((user) => selectedProject.memberIds.includes(user.id))
  const selectedTasks = tasksByProjectId[selectedProject.id] ?? allTasks

  const totalTasks = selectedTasks.length
  const doneTasks = selectedTasks.filter((task) => task.status === '완료').length
  const progressTasks = selectedTasks.filter((task) => task.status === '진행 중').length
  const reviewTasks = selectedTasks.filter((task) => task.status === '검토 중').length
  const todoTasks = selectedTasks.filter((task) => task.status === '할 일').length
  const activeTasks = totalTasks - doneTasks
  const urgentTasks = selectedTasks.filter((task) => task.status !== '완료' && task.priority === '높음').length

  const topMetrics = [
    {
      id: 'active',
      label: '진행 업무',
      value: activeTasks,
      ratio: totalTasks > 0 ? Math.round((activeTasks / totalTasks) * 100) : 0,
      icon: ClipboardList,
      toneClass: 'project-stats-metric-primary',
      iconClass: 'project-stats-metric-icon-primary',
    },
    {
      id: 'done',
      label: '완료 업무',
      value: doneTasks,
      ratio: totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0,
      icon: CheckCircle2,
      toneClass: 'project-stats-metric-success',
      iconClass: 'project-stats-metric-icon-success',
    },
    {
      id: 'progress',
      label: '진행 중 업무',
      value: progressTasks,
      ratio: totalTasks > 0 ? Math.round((progressTasks / totalTasks) * 100) : 0,
      icon: Hourglass,
      toneClass: 'project-stats-metric-violet',
      iconClass: 'project-stats-metric-icon-violet',
    },
    {
      id: 'urgent',
      label: '마감 임박',
      value: urgentTasks,
      ratio: totalTasks > 0 ? Math.round((urgentTasks / totalTasks) * 100) : 0,
      icon: BellRing,
      toneClass: 'project-stats-metric-warning',
      iconClass: 'project-stats-metric-icon-warning',
    },
  ]

  const statusChartData = useMemo<StatusChartItem[]>(
    () => {
      const items: StatusChartItem[] = [
        { id: 'progress', label: '진행 중', value: progressTasks, color: statusPalette.progress },
        { id: 'done', label: '완료', value: doneTasks, color: statusPalette.done },
        { id: 'review', label: '검토 중', value: reviewTasks, color: statusPalette.review },
        { id: 'todo', label: '할 일', value: todoTasks, color: statusPalette.todo },
      ]

      return items.filter((item) => item.value > 0)
    },
    [doneTasks, progressTasks, reviewTasks, todoTasks],
  )

  const weeklyTrendData = useMemo(() => {
    const trendMax = doneTasks + reviewTasks + Math.max(1, Math.round(activeTasks / 4))
    const weights = [0.14, 0.29, 0.43, 0.79, 1]
    let previous = 0

    return weights.map((weight, index) => {
      const value = Math.max(previous + (index === 0 ? 1 : 0), Math.round(trendMax * weight))
      previous = Math.min(trendMax, value)

      return {
        label: `${index + 1}주차`,
        value: previous,
      }
    })
  }, [activeTasks, doneTasks, reviewTasks])

  const memberCompletionData = selectedMembers
    .map((member) => {
      const completedCount = selectedTasks.filter((task) => task.assigneeId === member.id && task.status === '완료').length

      return {
        name: member.name,
        value: completedCount,
      }
    })
    .sort((left, right) => right.value - left.value)
    .slice(0, 5)

  const selectedProjectSummary = tasksByProjectId[selectedProject.id] ?? []
  const previousCompleted = Math.max(1, doneTasks - Math.max(1, Math.round(doneTasks * 0.2)))
  const increaseCount = Math.max(0, doneTasks - previousCompleted)
  const increaseRate = previousCompleted > 0 ? Math.round((increaseCount / previousCompleted) * 100) : 0
  const averageMemberCompleted =
    memberCompletionData.length > 0
      ? Math.round((memberCompletionData.reduce((sum, item) => sum + item.value, 0) / memberCompletionData.length) * 10) / 10
      : 0

  return (
    <div className="page project-stats-page">
      <PageHeader
        title="통계 대시보드"
        description={`${selectedProject.name} 프로젝트의 업무 현황과 성과를 한눈에 확인하세요.`}
        actions={(
          <div className="project-stats-toolbar">
            <label className="project-stats-select-control">
              <FolderKanban size={18} />
              <select
                value={selectedProject.id}
                onChange={(event) => {
                  selectProject(event.target.value)
                  setDownloadNotice('')
                }}
              >
                {teamFlowSeed.projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="project-stats-select-control">
              <CalendarDays size={18} />
              <select
                value={selectedRange}
                onChange={(event) => {
                  setSelectedRange(event.target.value)
                  setDownloadNotice('')
                }}
              >
                {rangeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option.replace('~', ' ~ ')}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              className="project-stats-download-button"
              onClick={() => setDownloadNotice(`${selectedProject.name} · ${selectedRange} 기준 리포트 다운로드를 준비했습니다.`)}
            >
              <Download size={18} />
              리포트 다운로드
            </button>
          </div>
        )}
      />

      {downloadNotice ? <div className="project-stats-notice">{downloadNotice}</div> : null}

      <div className="project-stats-metric-grid">
        {topMetrics.map((metric) => {
          const Icon = metric.icon

          return (
            <article key={metric.id} className={`project-stats-metric-card ${metric.toneClass}`}>
              <div className={`project-stats-metric-icon ${metric.iconClass}`}>
                <Icon size={24} />
              </div>
              <div className="project-stats-metric-copy">
                <strong>{metric.label}</strong>
                <span>{metric.value}</span>
                <p>전체 업무 중 {metric.ratio}%</p>
              </div>
            </article>
          )
        })}
      </div>

      <div className="project-stats-chart-grid">
        <section className="project-stats-chart-card">
          <div className="project-stats-chart-head">
            <div>
              <h2>상태별 업무 분포</h2>
              <p>{selectedProjectSummary.length}개 업무 기준</p>
            </div>
            <CircleHelp size={18} />
          </div>

          <div className="project-stats-pie-area">
            <div className="project-stats-pie-wrap">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={statusChartData}
                    dataKey="value"
                    nameKey="label"
                    innerRadius={0}
                    outerRadius={104}
                    paddingAngle={1}
                    stroke="none"
                    labelLine={false}
                    label={renderPieSliceLabel}
                  >
                    {statusChartData.map((item) => (
                      <Cell key={item.id} fill={item.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="project-stats-legend">
              {statusChartData.map((item) => {
                const ratio = totalTasks > 0 ? Math.round((item.value / totalTasks) * 100) : 0

                return (
                  <div key={item.id} className="project-stats-legend-row">
                    <div className="project-stats-legend-left">
                      <span className="project-stats-legend-dot" style={{ background: item.color }} />
                      <strong>{item.label}</strong>
                    </div>
                    <span>
                      {ratio}% ({item.value})
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="project-stats-summary-box project-stats-summary-box-muted">
            <span>전체 {totalTasks}개 업무</span>
            <strong>{formatDate(selectedProject.dueDate)} 마감</strong>
          </div>
        </section>

        <section className="project-stats-chart-card">
          <div className="project-stats-chart-head">
            <div>
              <h2>주간 완료 추이</h2>
              <p>최근 5주 누적 완료 흐름</p>
            </div>
            <CircleHelp size={18} />
          </div>

          <div className="project-stats-line-wrap">
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={weeklyTrendData} margin={{ top: 12, right: 16, left: 4, bottom: 0 }}>
                <CartesianGrid stroke="#edf2ff" vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={10} />
                <YAxis tickLine={false} axisLine={false} width={28} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#4a59ff" strokeWidth={3} dot={{ r: 5, strokeWidth: 2, fill: '#4a59ff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="project-stats-summary-box">
            <div>
              <span>이번 구간 총 완료 업무</span>
              <strong>{weeklyTrendData[weeklyTrendData.length - 1]?.value ?? 0}개</strong>
            </div>
            <p>
              이전 구간 대비 <em>▲ {increaseRate}%</em> ({increaseCount}개 증가)
            </p>
          </div>
        </section>

        <section className="project-stats-chart-card">
          <div className="project-stats-chart-head">
            <div>
              <h2>팀원별 완료 업무 수</h2>
              <p>현재 프로젝트 주요 멤버 기준</p>
            </div>
            <CircleHelp size={18} />
          </div>

          <div className="project-stats-bar-wrap">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={memberCompletionData} margin={{ top: 12, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#edf2ff" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={10} />
                <YAxis tickLine={false} axisLine={false} width={28} />
                <Tooltip />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#4a59ff">
                  {memberCompletionData.map((item, index) => (
                    <Cell key={`${item.name}-${index}`} fill={`url(#projectBarGradient-${index})`} />
                  ))}
                </Bar>
                <defs>
                  {memberCompletionData.map((item, index) => (
                    <linearGradient key={`${item.name}-gradient`} id={`projectBarGradient-${index}`} x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#6874ff" />
                      <stop offset="100%" stopColor="#404cff" />
                    </linearGradient>
                  ))}
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="project-stats-summary-box">
            <div>
              <span>팀 평균 완료 업무 수</span>
              <strong>{averageMemberCompleted}개</strong>
            </div>
            <p>전체 팀원 {memberCompletionData.length}명 기준</p>
          </div>
        </section>
      </div>
    </div>
  )
}
