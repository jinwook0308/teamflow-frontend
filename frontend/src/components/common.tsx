import {
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  FolderKanban,
  FolderOpen,
  History,
  Home,
  Menu,
  MessageSquareText,
  Search,
  Settings,
  Users,
} from 'lucide-react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import teamFlowLogoFull from '../assets/logo/teamflow-logo.png'
import { teamFlowSeed, useTeamFlowStore } from '../stores/useTeamFlowStore'
import type { Project, ProjectStatus, Role, User } from '../types'
import { cn, formatDate } from '../utils/format'

export function Brand() {
  return (
    <Link to="/dashboard" className="brand">
      <img className="logo-full" src={teamFlowLogoFull} alt="TeamFlow" />
    </Link>
  )
}

export function Avatar({ user }: { user: User }) {
  return <div className={cn('avatar', user.avatarColor)}>{user.avatarLabel}</div>
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string
  description: string
  actions?: ReactNode
}) {
  return (
    <div className="page-header">
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {actions ? <div className="page-actions">{actions}</div> : null}
    </div>
  )
}

export function PrimaryButton({
  children,
  type = 'button',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className="button button-primary" type={type} {...props}>
      {children}
    </button>
  )
}

export function SecondaryButton({
  children,
  type = 'button',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className="button button-secondary" type={type} {...props}>
      {children}
    </button>
  )
}

export function SectionCard({
  title,
  description,
  actions,
  className,
  children,
}: {
  title?: string
  description?: string
  actions?: ReactNode
  className?: string
  children: ReactNode
}) {
  return (
    <section className={cn('section-card', className)}>
      {title ? (
        <div className="section-card-header">
          <div>
            <h2>{title}</h2>
            {description ? <p>{description}</p> : null}
          </div>
          {actions ? <div className="section-card-actions">{actions}</div> : null}
        </div>
      ) : null}
      {children}
    </section>
  )
}

export function Sidebar({ currentUser }: { currentUser: User }) {
  const location = useLocation()
  const currentProjectId = useTeamFlowStore((state) => state.currentProjectId)

  const currentProject = teamFlowSeed.projects.find((project) => project.id === currentProjectId) ?? teamFlowSeed.projects[0]
  const projectMembers = teamFlowSeed.users.filter((user) => currentProject.memberIds.includes(user.id))

  const presenceByUserId: Record<string, '온라인' | '자리 비움' | '집중 모드' | '오프라인'> = {
    'user-owner': '온라인',
    'user-admin': '온라인',
    'user-member-1': '자리 비움',
    'user-member-2': '온라인',
    'user-member-3': '집중 모드',
    'user-member-4': '오프라인',
  }

  const items = [
    { key: 'dashboard', to: '/dashboard', label: '대시보드', icon: <Home size={20} /> },
    { key: 'projects', to: '/projects', label: '프로젝트', icon: <FolderKanban size={20} /> },
    { key: 'my-tasks', to: '/my-tasks', label: '내 업무', icon: <CheckCircle2 size={20} /> },
    { key: 'calendar', to: '/calendar', label: '캘린더', icon: <CalendarDays size={20} /> },
    { key: 'meetings', to: `/projects/${currentProjectId}/meetings`, label: '회의록', icon: <Menu size={20} /> },
    { key: 'chat', to: `/projects/${currentProjectId}/chat`, label: '채팅', icon: <MessageSquareText size={20} /> },
    { key: 'files', to: `/projects/${currentProjectId}/files`, label: '파일', icon: <FolderOpen size={20} /> },
    { key: 'tasks', to: `/projects/${currentProjectId}/board`, label: '작업', icon: <ClipboardList size={20} /> },
    { key: 'team', to: '/team', label: '멤버', icon: <Users size={20} /> },
    { key: 'activities', to: `/projects/${currentProjectId}/activities`, label: '활동 기록', icon: <History size={20} /> },
    { key: 'settings', to: `/projects/${currentProjectId}/settings`, label: '설정', icon: <Settings size={20} /> },
  ]

  const activeByKey: Record<string, boolean> = {
    dashboard: location.pathname === '/dashboard',
    projects: location.pathname === '/projects',
    'my-tasks': location.pathname === '/my-tasks',
    calendar: location.pathname === '/calendar',
    meetings: location.pathname === `/projects/${currentProjectId}/meetings`,
    chat: location.pathname === `/projects/${currentProjectId}/chat`,
    files: location.pathname === `/projects/${currentProjectId}/files`,
    tasks:
      location.pathname === `/projects/${currentProjectId}/board` ||
      location.pathname.startsWith(`/projects/${currentProjectId}/tasks/`),
    team: location.pathname === '/team',
    activities: location.pathname === `/projects/${currentProjectId}/activities`,
    settings: location.pathname === `/projects/${currentProjectId}/settings`,
  }

  return (
    <aside className="sidebar">
      <Brand />

      <div className="sidebar-main">
        <nav className="nav-list">
          {items.map((item) => {
            const isActive = activeByKey[item.key] ?? false

            return (
              <Link key={item.key} to={item.to} className={cn('nav-link', isActive && 'active')}>
                {item.icon}
                <span>{item.label}</span>
                {item.key === 'chat' ? <em className="nav-count">3</em> : null}
              </Link>
            )
          })}
        </nav>

        <section className="sidebar-team-panel">
          <div className="sidebar-team-header">
            <strong>팀 멤버</strong>
            <span>{projectMembers.length}</span>
          </div>

          <div className="sidebar-team-list">
            {projectMembers.map((member) => {
              const presence = presenceByUserId[member.id] ?? '오프라인'
              const presenceClass =
                presence === '온라인'
                  ? 'presence-online'
                  : presence === '자리 비움'
                    ? 'presence-away'
                    : presence === '집중 모드'
                      ? 'presence-focus'
                      : 'presence-offline'

              return (
                <div key={member.id} className="sidebar-team-item">
                  <div className="sidebar-team-profile">
                    <div className={cn('mini-avatar sidebar-team-avatar', member.avatarColor)}>{member.avatarLabel}</div>
                    <div className="sidebar-team-copy">
                      <strong>{member.name}</strong>
                      <p>{member.position}</p>
                    </div>
                  </div>
                  <span className={cn('presence-badge sidebar-team-status', presenceClass)}>{presence}</span>
                </div>
              )
            })}
          </div>
        </section>
      </div>

      <div className="sidebar-footer">
        <Avatar user={currentUser} />
        <div>
          <strong>{currentUser.name}</strong>
          <p>{currentUser.position}</p>
        </div>
      </div>
    </aside>
  )
}

export function Topbar({
  workspaceName,
  currentUser,
}: {
  workspaceName: string
  currentUser: User
}) {
  return (
    <header className="topbar">
      <Link to="/workspace" className="workspace-chip">
        <div className="workspace-chip-icon">
          <Users size={18} />
        </div>
        <strong>{workspaceName}</strong>
        <ChevronDown size={16} />
      </Link>

      <label className="search-box">
        <Search size={18} />
        <input placeholder="검색 (프로젝트, 업무, 멤버, 파일)" />
      </label>

      <div className="topbar-actions">
        <button type="button" className="icon-button notification-button" aria-label="알림">
          <Bell size={19} />
          <span className="notification-badge">8</span>
        </button>

        <div className="profile-chip">
          <Avatar user={currentUser} />
          <div>
            <strong>{currentUser.name}</strong>
            <p>{currentUser.position}</p>
          </div>
          <ChevronDown size={16} />
        </div>
      </div>
    </header>
  )
}

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const label = status === 'ACTIVE' ? '진행 중' : status === 'READY' ? '준비 중' : '완료'
  const className = status === 'ACTIVE' ? 'badge-primary' : status === 'READY' ? 'badge-warning' : 'badge-success'
  return <span className={cn('badge', className)}>{label}</span>
}

export function RoleBadge({ role }: { role: Role }) {
  const className =
    role === 'OWNER'
      ? 'badge-primary'
      : role === 'ADMIN'
        ? 'badge-success'
        : role === 'MEMBER'
          ? 'badge-warning'
          : 'badge-neutral'

  return <span className={cn('badge', className)}>{role}</span>
}

export function StatsGrid() {
  return (
    <div className="stats-grid">
      {teamFlowSeed.dashboardStats.map((stat) => (
        <div key={stat.id} className="stat-card">
          <p>{stat.label}</p>
          <strong>{stat.value}</strong>
          <span>{stat.caption}</span>
        </div>
      ))}
    </div>
  )
}

export function ProjectCard({
  project,
  members,
}: {
  project: Project
  members: User[]
}) {
  const selectProject = useTeamFlowStore((state) => state.selectProject)

  return (
    <Link
      to={`/projects/${project.id}/board`}
      className={cn('project-card', project.accentClass)}
      onClick={() => selectProject(project.id)}
    >
      <div className="project-card-header">
        <div>
          <h3>{project.name}</h3>
          <p>{project.summary}</p>
        </div>
        <StatusBadge status={project.status} />
      </div>

      <div className="progress-row">
        <div className="progress-track">
          <div className="progress-bar" style={{ width: `${project.progress}%` }} />
        </div>
        <strong>{project.progress}%</strong>
      </div>

      <div className="project-card-footer">
        <span>마감 {formatDate(project.dueDate)}</span>
        <div className="member-stack">
          {members.map((member) => (
            <div key={member.id} className={cn('mini-avatar', member.avatarColor)} title={member.name}>
              {member.avatarLabel}
            </div>
          ))}
        </div>
      </div>
    </Link>
  )
}
