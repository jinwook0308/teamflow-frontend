import { ArrowRight, CalendarDays, FolderKanban, Sparkles, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeader, RoleBadge, SectionCard, StatusBadge } from '../../components/common'
import { teamFlowSeed, useTeamFlowStore } from '../../stores/useTeamFlowStore'
import { cn } from '../../utils/format'

const workspaceMemberIdsById: Record<string, string[]> = {
  'workspace-main': ['user-owner', 'user-admin', 'user-member-1', 'user-member-2', 'user-member-3', 'user-member-4'],
  'workspace-capstone': ['user-owner', 'user-admin', 'user-member-2', 'user-member-4'],
}

const workspaceProjectIdsById: Record<string, string[]> = {
  'workspace-main': ['project-shopping', 'project-docs', 'project-ui'],
  'workspace-capstone': ['project-docs', 'project-ui'],
}

const workspacePresenceByUserId: Record<string, string> = {
  'user-owner': '온라인',
  'user-admin': '온라인',
  'user-member-1': '자리 비움',
  'user-member-2': '온라인',
  'user-member-3': '집중 모드',
  'user-member-4': '오프라인',
}

function getPresenceClass(presence: string) {
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

export function WorkspaceOverviewPage() {
  const currentWorkspaceId = useTeamFlowStore((state) => state.currentWorkspaceId)
  const currentProjectId = useTeamFlowStore((state) => state.currentProjectId)

  const currentWorkspace = teamFlowSeed.workspaces.find((workspace) => workspace.id === currentWorkspaceId) ?? teamFlowSeed.workspaces[0]
  const currentProject = teamFlowSeed.projects.find((project) => project.id === currentProjectId) ?? teamFlowSeed.projects[0]

  const memberIds = workspaceMemberIdsById[currentWorkspace.id] ?? workspaceMemberIdsById['workspace-main']
  const projectIds = workspaceProjectIdsById[currentWorkspace.id] ?? workspaceProjectIdsById['workspace-main']

  const workspaceMembers = memberIds
    .map((memberId) => teamFlowSeed.users.find((user) => user.id === memberId))
    .filter((user): user is (typeof teamFlowSeed.users)[number] => Boolean(user))

  const workspaceProjects = projectIds
    .map((projectId) => teamFlowSeed.projects.find((project) => project.id === projectId))
    .filter((project): project is (typeof teamFlowSeed.projects)[number] => Boolean(project))

  const activeProjects = workspaceProjects.filter((project) => project.status !== 'DONE')
  const averageProgress =
    workspaceProjects.length > 0
      ? Math.round(workspaceProjects.reduce((total, project) => total + project.progress, 0) / workspaceProjects.length)
      : 0

  const quickLinks = [
    {
      icon: FolderKanban,
      title: '프로젝트 보러가기',
      description: '현재 워크스페이스에서 진행 중인 프로젝트 목록으로 이동합니다.',
      to: '/projects',
    },
    {
      icon: Users,
      title: '팀 멤버 확인',
      description: '참여 중인 멤버 역할과 상태를 바로 확인할 수 있습니다.',
      to: '/team',
    },
    {
      icon: CalendarDays,
      title: '일정 및 캘린더',
      description: '워크스페이스 기준 일정을 캘린더 흐름으로 이어서 볼 수 있습니다.',
      to: '/calendar',
    },
  ]

  return (
    <div className="page workspace-page">
      <PageHeader
        title="워크스페이스"
        description="워크스페이스 단위로 팀 소개, 참여 멤버, 포함 프로젝트, 바로가기 흐름을 한눈에 정리한 전용 화면입니다."
        actions={(
          <>
            <Link className="button button-secondary" to="/dashboard">
              대시보드
            </Link>
            <Link className="button button-primary" to="/projects">
              프로젝트 보기
            </Link>
          </>
        )}
      />

      <div className="workspace-overview-grid">
        <SectionCard className="workspace-overview-card workspace-overview-hero">
          <div className="workspace-overview-hero-top">
            <div className="workspace-overview-badge">
              <Sparkles size={16} />
              <span>현재 선택된 워크스페이스</span>
            </div>
            <span className="workspace-overview-subtitle">{currentWorkspace.subtitle}</span>
          </div>

          <div className="workspace-overview-copy">
            <h2>{currentWorkspace.name}</h2>
            <p>{currentWorkspace.description}</p>
          </div>

          <div className="workspace-overview-stats">
            <div className="workspace-overview-stat">
              <span>멤버</span>
              <strong>{workspaceMembers.length}명</strong>
            </div>
            <div className="workspace-overview-stat">
              <span>프로젝트</span>
              <strong>{workspaceProjects.length}개</strong>
            </div>
            <div className="workspace-overview-stat">
              <span>진행 중</span>
              <strong>{activeProjects.length}개</strong>
            </div>
            <div className="workspace-overview-stat">
              <span>평균 진행률</span>
              <strong>{averageProgress}%</strong>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          className="workspace-overview-card workspace-overview-current"
          title="현재 선택 프로젝트"
          description="워크스페이스 안에서 지금 보고 있는 대표 프로젝트를 함께 보여줍니다."
        >
          <div className="workspace-overview-current-header">
            <div>
              <strong>{currentProject.name}</strong>
              <p>{currentProject.summary}</p>
            </div>
            <StatusBadge status={currentProject.status} />
          </div>

          <div className="progress-row">
            <div className="progress-track">
              <div className="progress-bar" style={{ width: `${currentProject.progress}%` }} />
            </div>
            <strong>{currentProject.progress}%</strong>
          </div>

          <div className="workspace-overview-current-links">
            <Link to={`/projects/${currentProject.id}/board`} className="workspace-overview-inline-link">
              업무 보드로 이동
              <ArrowRight size={16} />
            </Link>
            <Link to={`/projects/${currentProject.id}/settings`} className="workspace-overview-inline-link">
              프로젝트 설정 보기
              <ArrowRight size={16} />
            </Link>
          </div>
        </SectionCard>
      </div>

      <div className="page-grid page-grid-2 workspace-overview-body">
        <SectionCard
          className="workspace-overview-card"
          title="포함 프로젝트"
          description="이 워크스페이스에 포함된 프로젝트를 카드형으로 정리했습니다."
        >
          <div className="workspace-project-list">
            {workspaceProjects.map((project) => (
              <Link key={project.id} to={`/projects/${project.id}/board`} className="workspace-project-item">
                <div className="workspace-project-item-head">
                  <strong>{project.name}</strong>
                  <StatusBadge status={project.status} />
                </div>
                <p>{project.summary}</p>
                <div className="workspace-project-item-footer">
                  <span>마감 {project.dueDate.slice(0, 10)}</span>
                  <strong>{project.progress}%</strong>
                </div>
              </Link>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          className="workspace-overview-card"
          title="워크스페이스 멤버"
          description="현재 워크스페이스에 참여 중인 핵심 멤버를 상태와 함께 보여줍니다."
        >
          <div className="workspace-member-list">
            {workspaceMembers.map((member) => {
              const presence = workspacePresenceByUserId[member.id] ?? '오프라인'

              return (
                <div key={member.id} className="workspace-member-row">
                  <div className="workspace-member-profile">
                    <div className={cn('avatar', 'workspace-member-avatar', member.avatarColor)}>{member.avatarLabel}</div>
                    <div className="workspace-member-copy">
                      <strong>{member.name}</strong>
                      <p>{member.position}</p>
                    </div>
                  </div>

                  <div className="workspace-member-side">
                    <RoleBadge role={member.role} />
                    <span className={cn('presence-badge', getPresenceClass(presence))}>{presence}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </SectionCard>
      </div>

      <div className="page-grid page-grid-2 workspace-overview-body">
        <SectionCard
          className="workspace-overview-card"
          title="바로가기"
          description="워크스페이스 화면에서 자주 이동하는 페이지를 바로 연결했습니다."
        >
          <div className="workspace-quick-link-grid">
            {quickLinks.map((item) => {
              const Icon = item.icon

              return (
                <Link key={item.title} to={item.to} className="workspace-quick-link-card">
                  <div className="workspace-quick-link-icon">
                    <Icon size={18} />
                  </div>
                  <div className="workspace-quick-link-copy">
                    <strong>{item.title}</strong>
                    <p>{item.description}</p>
                  </div>
                  <ArrowRight size={18} />
                </Link>
              )
            })}
          </div>
        </SectionCard>

        <SectionCard
          className="workspace-overview-card"
          title="운영 메모"
          description="발표나 시연 때 설명하기 쉬운 흐름 기준으로 정리한 워크스페이스 메모입니다."
        >
          <ul className="info-list">
            <li className="info-item">로그인 후에는 먼저 워크스페이스를 고르고, 이후 이 화면에서 팀 공간 전체를 소개할 수 있습니다.</li>
            <li className="info-item">대시보드보다 먼저 팀 단위 구조를 보여주고 싶을 때 이 화면을 중간 허브처럼 활용할 수 있습니다.</li>
            <li className="info-item">다음 단계에서는 워크스페이스 생성, 수정, 멤버 초대 같은 기능을 이 화면에서 연결하면 자연스럽습니다.</li>
          </ul>
        </SectionCard>
      </div>
    </div>
  )
}
