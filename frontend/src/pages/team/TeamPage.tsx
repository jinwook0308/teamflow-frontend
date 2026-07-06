import { useMemo, useState } from 'react'
import { PageHeader, RoleBadge, SectionCard } from '../../components/common'
import { boardColumns } from '../../data/task-board-data'
import { teamFlowSeed, useTeamFlowStore } from '../../stores/useTeamFlowStore'
import type { Role } from '../../types'
import { cn } from '../../utils/format'

type PresenceLabel = '온라인' | '자리 비움' | '집중 모드' | '오프라인'
type RoleFilter = 'all' | Role
type PresenceFilter = 'all' | PresenceLabel

const presenceByUserId: Record<string, PresenceLabel> = {
  'user-owner': '온라인',
  'user-admin': '온라인',
  'user-member-1': '자리 비움',
  'user-member-2': '온라인',
  'user-member-3': '집중 모드',
  'user-member-4': '오프라인',
}

const roleOptions: Array<{ id: RoleFilter; label: string }> = [
  { id: 'all', label: '전체 역할' },
  { id: 'OWNER', label: 'OWNER' },
  { id: 'ADMIN', label: 'ADMIN' },
  { id: 'MEMBER', label: 'MEMBER' },
  { id: 'VIEWER', label: 'VIEWER' },
]

const presenceOptions: Array<{ id: PresenceFilter; label: string }> = [
  { id: 'all', label: '전체 상태' },
  { id: '온라인', label: '온라인' },
  { id: '자리 비움', label: '자리 비움' },
  { id: '집중 모드', label: '집중 모드' },
  { id: '오프라인', label: '오프라인' },
]

function getPresenceClass(presence: PresenceLabel) {
  if (presence === '온라인') {
    return 'presence-online'
  }

  if (presence === '자리 비움') {
    return 'presence-away'
  }

  if (presence === '집중 모드') {
    return 'presence-focus'
  }

  return 'presence-offline'
}

export function TeamPage() {
  const currentWorkspaceId = useTeamFlowStore((state) => state.currentWorkspaceId)
  const currentProjectId = useTeamFlowStore((state) => state.currentProjectId)
  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all')
  const [presenceFilter, setPresenceFilter] = useState<PresenceFilter>('all')

  const currentWorkspace = teamFlowSeed.workspaces.find((workspace) => workspace.id === currentWorkspaceId) ?? teamFlowSeed.workspaces[0]
  const currentProject = teamFlowSeed.projects.find((project) => project.id === currentProjectId) ?? teamFlowSeed.projects[0]

  const taskStatsByUserId = useMemo(() => {
    const allTasks = boardColumns.flatMap((column) => column.tasks)

    return allTasks.reduce<Record<string, { total: number; active: number; done: number }>>((accumulator, task) => {
      const current = accumulator[task.assigneeId] ?? { total: 0, active: 0, done: 0 }
      current.total += 1

      if (task.status === '완료') {
        current.done += 1
      } else {
        current.active += 1
      }

      accumulator[task.assigneeId] = current
      return accumulator
    }, {})
  }, [])

  const memberRows = useMemo(() => {
    return teamFlowSeed.users.map((member) => {
      const presence = presenceByUserId[member.id] ?? '오프라인'
      const joinedProjects = teamFlowSeed.projects.filter((project) => project.memberIds.includes(member.id))
      const taskStats = taskStatsByUserId[member.id] ?? { total: 0, active: 0, done: 0 }

      return {
        ...member,
        presence,
        joinedProjects,
        taskStats,
        isCurrentProjectMember: currentProject.memberIds.includes(member.id),
      }
    })
  }, [currentProject.memberIds, taskStatsByUserId])

  const visibleMembers = useMemo(() => {
    const normalized = query.trim().toLowerCase()

    return memberRows.filter((member) => {
      const matchesQuery =
        normalized.length === 0 ||
        member.name.toLowerCase().includes(normalized) ||
        member.position.toLowerCase().includes(normalized) ||
        member.email.toLowerCase().includes(normalized)
      const matchesRole = roleFilter === 'all' || member.role === roleFilter
      const matchesPresence = presenceFilter === 'all' || member.presence === presenceFilter

      return matchesQuery && matchesRole && matchesPresence
    })
  }, [memberRows, presenceFilter, query, roleFilter])

  const summaryItems = useMemo(
    () => [
      {
        id: 'workspace-members',
        label: '워크스페이스 멤버',
        value: teamFlowSeed.users.length,
        caption: `${currentWorkspace.name} 기준 전체 인원`,
      },
      {
        id: 'project-members',
        label: '현재 프로젝트 참여',
        value: currentProject.memberIds.length,
        caption: `${currentProject.name} 참여 인원`,
      },
      {
        id: 'online-members',
        label: '온라인 / 집중',
        value: memberRows.filter((member) => member.presence === '온라인' || member.presence === '집중 모드').length,
        caption: '바로 협업 가능한 멤버 수',
      },
      {
        id: 'active-owners',
        label: '진행 업무 담당',
        value: memberRows.filter((member) => member.taskStats.active > 0).length,
        caption: '현재 열린 업무를 맡고 있는 멤버 수',
      },
    ],
    [currentProject.memberIds.length, currentProject.name, currentWorkspace.name, memberRows],
  )

  return (
    <div className="page team-page">
      <PageHeader
        title="멤버"
        description={`${currentWorkspace.name}의 전체 멤버를 기준으로, 역할/상태/참여 프로젝트/담당 업무를 한 번에 볼 수 있게 정리했습니다.`}
      />

      <div className="stats-grid team-summary-grid">
        {summaryItems.map((item) => (
          <article key={item.id} className="stat-card">
            <strong>{item.value}</strong>
            <span>{item.label}</span>
            <p>{item.caption}</p>
          </article>
        ))}
      </div>

      <SectionCard title="멤버 검색 및 필터" description="이름, 역할, 현재 상태 기준으로 빠르게 멤버를 찾을 수 있습니다.">
        <div className="team-filter-grid">
          <label className="form-field">
            <span className="field-label">이름 또는 직무 검색</span>
            <input
              className="input-field"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="예: 김태현, 백엔드 개발자"
            />
          </label>

          <label className="form-field">
            <span className="field-label">역할 필터</span>
            <select className="select-field" value={roleFilter} onChange={(event) => setRoleFilter(event.target.value as RoleFilter)}>
              {roleOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="form-field">
            <span className="field-label">상태 필터</span>
            <select className="select-field" value={presenceFilter} onChange={(event) => setPresenceFilter(event.target.value as PresenceFilter)}>
              {presenceOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </SectionCard>

      <SectionCard
        title="팀 멤버 목록"
        description={`현재 ${visibleMembers.length}명의 멤버가 표시되고 있습니다. 현재 선택 프로젝트는 ${currentProject.name}입니다.`}
      >
        <div className="team-member-grid">
          {visibleMembers.map((member) => (
            <article key={member.id} className="team-member-card">
              <div className="team-member-top">
                <div className="team-member-identity">
                  <div className={cn('avatar', 'team-member-avatar', member.avatarColor)}>{member.avatarLabel}</div>
                  <div className="team-member-copy">
                    <strong>{member.name}</strong>
                    <p>{member.position}</p>
                  </div>
                </div>

                <span className={cn('presence-badge', getPresenceClass(member.presence))}>{member.presence}</span>
              </div>

              <div className="team-member-meta">
                <RoleBadge role={member.role} />
                {member.isCurrentProjectMember ? <span className="team-project-badge">현재 프로젝트 참여</span> : null}
              </div>

              <p className="team-member-email">{member.email}</p>

              <div className="team-member-stats">
                <div className="team-member-stat">
                  <span>참여 프로젝트</span>
                  <strong>{member.joinedProjects.length}개</strong>
                </div>
                <div className="team-member-stat">
                  <span>담당 업무</span>
                  <strong>{member.taskStats.total}개</strong>
                </div>
                <div className="team-member-stat">
                  <span>진행 업무</span>
                  <strong>{member.taskStats.active}개</strong>
                </div>
              </div>

              <div className="team-member-projects">
                {member.joinedProjects.map((project) => (
                  <span key={project.id} className="team-member-project-chip">
                    {project.name}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        {visibleMembers.length === 0 ? (
          <div className="team-empty-state">
            <strong>조건에 맞는 멤버가 없습니다.</strong>
            <p>검색어를 지우거나 역할/상태 필터를 다시 선택해보세요.</p>
          </div>
        ) : null}
      </SectionCard>
    </div>
  )
}
