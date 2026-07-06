import {
  ArrowRight,
  BellRing,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Code2,
  FileText,
  FolderKanban,
  GraduationCap,
  Megaphone,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  ShoppingCart,
  SlidersHorizontal,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import teamFlowLogoFull from '../../assets/logo/teamflow-logo.png'
import { teamFlowSeed, useTeamFlowStore } from '../../stores/useTeamFlowStore'
import { cn } from '../../utils/format'

type WorkspaceTone = 'blue' | 'violet' | 'green' | 'orange'
type WorkspaceRoleLabel = '관리자' | '멤버' | '조회 전용'
type WorkspaceSortKey = 'default' | 'name' | 'members' | 'projects'

interface WorkspacePreviewMember {
  id: string
  name: string
  role: string
  avatarLabel: string
  avatarColor: string
  badge?: string
}

interface WorkspaceProjectPreview {
  id: string
  name: string
  progress: number
  icon: LucideIcon
  tone: WorkspaceTone
}

interface WorkspaceActivityPreview {
  id: string
  title: string
  time: string
  icon: LucideIcon
  tone: WorkspaceTone
}

interface WorkspaceNoticePreview {
  id: string
  title: string
  date: string
}

interface WorkspaceSelectProfile {
  id: string
  name: string
  subtitle: string
  description: string
  roleLabel: WorkspaceRoleLabel
  memberCount: number
  projectCount: number
  alertCount: number
  tone: WorkspaceTone
  icon: LucideIcon
  myTaskCount: number
  activeTaskCount: number
  deadlineCount: number
  members: WorkspacePreviewMember[]
  overflowMemberCount: number
  recentProjects: WorkspaceProjectPreview[]
  recentActivities: WorkspaceActivityPreview[]
  notices: WorkspaceNoticePreview[]
}

const sortOptions: Array<{ key: WorkspaceSortKey; label: string }> = [
  { key: 'default', label: '최근 선택 순' },
  { key: 'name', label: '이름순' },
  { key: 'members', label: '멤버 많은 순' },
  { key: 'projects', label: '프로젝트 많은 순' },
]

const initialWorkspaceProfiles: WorkspaceSelectProfile[] = [
  {
    id: 'workspace-main',
    name: '컴퓨터공학과 개발팀',
    subtitle: '팀 프로젝트, 과제, 파일, 회의록, 알림을 한 흐름으로 관리하는 메인 워크스페이스입니다.',
    description: '팀 프로젝트, 과제, 파일, 회의록, 알림을 한 흐름으로 관리하는 메인 워크스페이스입니다.',
    roleLabel: '관리자',
    memberCount: 6,
    projectCount: 3,
    alertCount: 3,
    tone: 'blue',
    icon: Code2,
    myTaskCount: 7,
    activeTaskCount: 12,
    deadlineCount: 2,
    members: [
      { id: 'member-kim', name: '김태현', role: '관리자', avatarLabel: '김', avatarColor: 'avatar-deep', badge: '관리자' },
      { id: 'member-park', name: '박민수', role: '프론트엔드', avatarLabel: '박', avatarColor: 'avatar-orange' },
      { id: 'member-lee', name: '이지은', role: '백엔드', avatarLabel: '이', avatarColor: 'avatar-primary' },
      { id: 'member-choi', name: '최서연', role: 'UI/UX', avatarLabel: '최', avatarColor: 'avatar-pink' },
      { id: 'member-jung', name: '정우진', role: 'DevOps', avatarLabel: '정', avatarColor: 'avatar-green' },
    ],
    overflowMemberCount: 1,
    recentProjects: [
      { id: 'project-shopping', name: '온라인 쇼핑몰 개발', progress: 68, icon: ShoppingCart, tone: 'blue' },
      { id: 'project-library', name: '도서 대여 시스템', progress: 45, icon: BookOpen, tone: 'green' },
      { id: 'project-campus', name: '학과 홈페이지', progress: 20, icon: Code2, tone: 'orange' },
    ],
    recentActivities: [
      { id: 'activity-1', title: '김태현님이 로그인 UI 업무를 완료했습니다.', time: '10분 전', icon: CheckCircle2, tone: 'green' },
      { id: 'activity-2', title: '박민수님이 DB 설계 업무를 업데이트했습니다.', time: '1시간 전', icon: ClipboardList, tone: 'blue' },
      { id: 'activity-3', title: '회의록이 업로드되었습니다.', time: '3시간 전', icon: FileText, tone: 'violet' },
      { id: 'activity-4', title: '배포 테스트 일정이 등록되었습니다.', time: '1일 전', icon: CalendarDays, tone: 'orange' },
    ],
    notices: [
      { id: 'notice-1', title: '5월 31일 주간 회의는 오전 10시, 회의실 A에서 진행됩니다.', date: '2024.05.24' },
      { id: 'notice-2', title: '배포 테스트는 6월 5일(수) 예정입니다. 일정 확인 부탁드립니다.', date: '2024.05.22' },
    ],
  },
  {
    id: 'workspace-capstone',
    name: '캡스톤 발표 준비 TF',
    subtitle: '계획서, 발표 자료, UI 시안, 시연 시나리오를 따로 정리하는 제출용 워크스페이스입니다.',
    description: '계획서, 발표 자료, UI 시안, 시연 시나리오를 따로 정리하는 제출용 워크스페이스입니다.',
    roleLabel: '멤버',
    memberCount: 4,
    projectCount: 2,
    alertCount: 0,
    tone: 'violet',
    icon: GraduationCap,
    myTaskCount: 5,
    activeTaskCount: 8,
    deadlineCount: 1,
    members: [
      { id: 'member-kim', name: '김태현', role: '발표 총괄', avatarLabel: '김', avatarColor: 'avatar-deep', badge: '팀 리드' },
      { id: 'member-lee', name: '이지은', role: '자료 정리', avatarLabel: '이', avatarColor: 'avatar-primary' },
      { id: 'member-choi', name: '최서연', role: '시안 보완', avatarLabel: '최', avatarColor: 'avatar-pink' },
      { id: 'member-han', name: '한서준', role: '시연 QA', avatarLabel: '한', avatarColor: 'avatar-sky' },
    ],
    overflowMemberCount: 0,
    recentProjects: [
      { id: 'project-plan', name: '프로젝트 계획서 정리', progress: 72, icon: FileText, tone: 'blue' },
      { id: 'project-script', name: '발표 시나리오 정리', progress: 54, icon: ClipboardList, tone: 'violet' },
      { id: 'project-demo', name: '최종 시연 리허설', progress: 35, icon: CalendarDays, tone: 'orange' },
    ],
    recentActivities: [
      { id: 'activity-5', title: '최서연님이 발표 시안 표지를 수정했습니다.', time: '24분 전', icon: FileText, tone: 'violet' },
      { id: 'activity-6', title: '리허설 일정이 공유되었습니다.', time: '2시간 전', icon: CalendarDays, tone: 'orange' },
      { id: 'activity-7', title: '한서준님이 발표 체크리스트를 등록했습니다.', time: '5시간 전', icon: ClipboardList, tone: 'blue' },
      { id: 'activity-8', title: '시연 파일 검수 요청이 올라왔습니다.', time: '어제', icon: BellRing, tone: 'green' },
    ],
    notices: [
      { id: 'notice-3', title: '발표 자료 1차 버전은 금요일 오후 6시까지 업로드해 주세요.', date: '2024.05.28' },
      { id: 'notice-4', title: '시연 동선 체크는 수요일 점심 이후 실습실에서 진행합니다.', date: '2024.05.27' },
    ],
  },
  {
    id: 'workspace-commerce',
    name: '온라인 쇼핑몰 운영팀',
    subtitle: '운영 이슈, 공지, 판매 흐름, 파일 공유를 묶어서 관리하는 실무형 워크스페이스입니다.',
    description: '운영 이슈, 공지, 판매 흐름, 파일 공유를 묶어서 관리하는 실무형 워크스페이스입니다.',
    roleLabel: '조회 전용',
    memberCount: 5,
    projectCount: 3,
    alertCount: 1,
    tone: 'green',
    icon: ShoppingCart,
    myTaskCount: 3,
    activeTaskCount: 9,
    deadlineCount: 2,
    members: [
      { id: 'member-kim', name: '김태현', role: '운영 총괄', avatarLabel: '김', avatarColor: 'avatar-deep', badge: '조회 전용' },
      { id: 'member-song', name: '송다은', role: '배포 운영', avatarLabel: '송', avatarColor: 'avatar-green' },
      { id: 'member-park', name: '박민수', role: '프론트 점검', avatarLabel: '박', avatarColor: 'avatar-orange' },
      { id: 'member-lee', name: '이지은', role: '백엔드 대응', avatarLabel: '이', avatarColor: 'avatar-primary' },
      { id: 'member-choi', name: '최서연', role: '배너 검수', avatarLabel: '최', avatarColor: 'avatar-pink' },
    ],
    overflowMemberCount: 0,
    recentProjects: [
      { id: 'project-ops-1', name: '주문 상태 모니터링', progress: 62, icon: ShoppingCart, tone: 'green' },
      { id: 'project-ops-2', name: '배너 운영 캘린더', progress: 39, icon: CalendarDays, tone: 'blue' },
      { id: 'project-ops-3', name: '리뷰 정책 공지', progress: 18, icon: FileText, tone: 'orange' },
    ],
    recentActivities: [
      { id: 'activity-9', title: '운영 공지 초안이 등록되었습니다.', time: '13분 전', icon: Megaphone, tone: 'blue' },
      { id: 'activity-10', title: '송다은님이 배포 점검 체크를 완료했습니다.', time: '48분 전', icon: CheckCircle2, tone: 'green' },
      { id: 'activity-11', title: '이지은님이 주문 API 이슈를 메모에 남겼습니다.', time: '3시간 전', icon: ClipboardList, tone: 'violet' },
      { id: 'activity-12', title: '이번 주 운영 일정이 갱신되었습니다.', time: '어제', icon: CalendarDays, tone: 'orange' },
    ],
    notices: [
      { id: 'notice-5', title: '정기 점검 시간은 매주 목요일 오전 7시입니다.', date: '2024.05.30' },
      { id: 'notice-6', title: '운영팀 공유 폴더 구조가 새로 정리되었습니다.', date: '2024.05.25' },
    ],
  },
  {
    id: 'workspace-library',
    name: '도서 대여 시스템팀',
    subtitle: '대여 시스템 개선 작업과 일정, 파일, 회의 내용을 통합 관리하는 워크스페이스입니다.',
    description: '대여 시스템 개선 작업과 일정, 파일, 회의 내용을 통합 관리하는 워크스페이스입니다.',
    roleLabel: '멤버',
    memberCount: 5,
    projectCount: 2,
    alertCount: 0,
    tone: 'orange',
    icon: BookOpen,
    myTaskCount: 4,
    activeTaskCount: 6,
    deadlineCount: 1,
    members: [
      { id: 'member-han', name: '한서준', role: '기획 및 QA', avatarLabel: '한', avatarColor: 'avatar-sky', badge: '멤버' },
      { id: 'member-lee', name: '이지은', role: '백엔드', avatarLabel: '이', avatarColor: 'avatar-primary' },
      { id: 'member-park', name: '박민수', role: '프론트엔드', avatarLabel: '박', avatarColor: 'avatar-orange' },
      { id: 'member-song', name: '송다은', role: '배포', avatarLabel: '송', avatarColor: 'avatar-green' },
      { id: 'member-choi', name: '최서연', role: '디자인', avatarLabel: '최', avatarColor: 'avatar-pink' },
    ],
    overflowMemberCount: 0,
    recentProjects: [
      { id: 'project-book-1', name: '대여 이력 화면 개선', progress: 52, icon: BookOpen, tone: 'orange' },
      { id: 'project-book-2', name: '반납 일정 알림', progress: 41, icon: BellRing, tone: 'green' },
      { id: 'project-book-3', name: '회원 권한 정리', progress: 26, icon: Users, tone: 'blue' },
    ],
    recentActivities: [
      { id: 'activity-13', title: '대여 내역 파일이 최신 버전으로 교체되었습니다.', time: '22분 전', icon: FileText, tone: 'orange' },
      { id: 'activity-14', title: '한서준님이 QA 체크리스트를 업데이트했습니다.', time: '1시간 전', icon: ClipboardList, tone: 'blue' },
      { id: 'activity-15', title: '알림 발송 정책이 리뷰 요청 상태로 변경되었습니다.', time: '4시간 전', icon: BellRing, tone: 'green' },
      { id: 'activity-16', title: '다음 주 회의 일정이 확정되었습니다.', time: '어제', icon: CalendarDays, tone: 'violet' },
    ],
    notices: [
      { id: 'notice-7', title: '도서 대여 시스템 베타 점검은 금요일 오후 4시에 진행됩니다.', date: '2024.05.29' },
      { id: 'notice-8', title: '테스트 계정 목록이 공유 드라이브에 정리되었습니다.', date: '2024.05.26' },
    ],
  },
]

function createWorkspaceId(name: string) {
  return `workspace-${name
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, '-')
    .replace(/^-+|-+$/g, '')}-${Date.now().toString().slice(-5)}`
}

export function WorkspaceSelectPage() {
  const navigate = useNavigate()
  const currentWorkspaceId = useTeamFlowStore((state) => state.currentWorkspaceId)
  const currentProjectId = useTeamFlowStore((state) => state.currentProjectId)
  const selectWorkspace = useTeamFlowStore((state) => state.selectWorkspace)

  const [workspaceQuery, setWorkspaceQuery] = useState('')
  const [sortKey, setSortKey] = useState<WorkspaceSortKey>('default')
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(
    () => initialWorkspaceProfiles.find((workspace) => workspace.id === currentWorkspaceId)?.id ?? initialWorkspaceProfiles[0].id,
  )
  const [workspaceProfiles, setWorkspaceProfiles] = useState(initialWorkspaceProfiles)
  const [createDraft, setCreateDraft] = useState({
    name: '',
    subtitle: '새 워크스페이스',
    description: '',
    memberCount: '4',
    projectCount: '1',
    roleLabel: '멤버' as WorkspaceRoleLabel,
    tone: 'blue' as WorkspaceTone,
  })

  const filteredWorkspaces = workspaceProfiles
    .filter((workspace) => {
      const normalizedQuery = workspaceQuery.trim().toLowerCase()

      if (!normalizedQuery) {
        return true
      }

      return [workspace.name, workspace.subtitle, workspace.roleLabel]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery)
    })
    .sort((left, right) => {
      if (sortKey === 'name') {
        return left.name.localeCompare(right.name, 'ko')
      }

      if (sortKey === 'members') {
        return right.memberCount - left.memberCount
      }

      if (sortKey === 'projects') {
        return right.projectCount - left.projectCount
      }

      return 0
    })

  const activeWorkspace =
    filteredWorkspaces.find((workspace) => workspace.id === selectedWorkspaceId) ??
    filteredWorkspaces[0] ??
    workspaceProfiles.find((workspace) => workspace.id === selectedWorkspaceId) ??
    workspaceProfiles[0]

  const summaryCards = [
    { id: 'projects', label: '프로젝트', value: `${activeWorkspace.projectCount}개`, icon: FolderKanban, tone: 'blue' as WorkspaceTone },
    { id: 'my-tasks', label: '내 업무', value: `${activeWorkspace.myTaskCount}개`, icon: ClipboardList, tone: 'green' as WorkspaceTone },
    { id: 'active', label: '진행 중', value: `${activeWorkspace.activeTaskCount}개`, icon: Clock3, tone: 'violet' as WorkspaceTone },
    { id: 'deadline', label: '마감 임박', value: `${activeWorkspace.deadlineCount}개`, icon: BellRing, tone: 'orange' as WorkspaceTone },
  ]
  const ActiveWorkspaceIcon = activeWorkspace.icon

  const syncWorkspaceSelection = (workspace: WorkspaceSelectProfile) => {
    if (!teamFlowSeed.workspaces.some((item) => item.id === workspace.id)) {
      teamFlowSeed.workspaces.push({
        id: workspace.id,
        name: workspace.name,
        subtitle: workspace.roleLabel,
        description: workspace.description,
        memberCount: workspace.memberCount,
        projectCount: workspace.projectCount,
      })
    }

    selectWorkspace(workspace.id)
  }

  const handleCreateWorkspace = () => {
    const name = createDraft.name.trim()

    if (!name) {
      return
    }

    const workspaceId = createWorkspaceId(name)
    const workspaceIcon = createDraft.tone === 'violet' ? GraduationCap : createDraft.tone === 'green' ? ShoppingCart : createDraft.tone === 'orange' ? BookOpen : Code2
    const createdWorkspace: WorkspaceSelectProfile = {
      id: workspaceId,
      name,
      subtitle: createDraft.description.trim() || `${name} 전용 협업 흐름을 정리하는 새로운 워크스페이스입니다.`,
      description: createDraft.description.trim() || `${name} 전용 협업 흐름을 정리하는 새로운 워크스페이스입니다.`,
      roleLabel: createDraft.roleLabel,
      memberCount: Number(createDraft.memberCount) || 1,
      projectCount: Number(createDraft.projectCount) || 1,
      alertCount: 0,
      tone: createDraft.tone,
      icon: workspaceIcon,
      myTaskCount: Math.max(1, Number(createDraft.projectCount) * 2),
      activeTaskCount: Math.max(2, Number(createDraft.projectCount) * 3),
      deadlineCount: 1,
      members: [
        { id: 'member-kim', name: '김태현', role: createDraft.roleLabel, avatarLabel: '김', avatarColor: 'avatar-deep', badge: createDraft.roleLabel },
        { id: 'member-lee', name: '이지은', role: '백엔드', avatarLabel: '이', avatarColor: 'avatar-primary' },
        { id: 'member-park', name: '박민수', role: '프론트엔드', avatarLabel: '박', avatarColor: 'avatar-orange' },
      ],
      overflowMemberCount: Math.max(0, (Number(createDraft.memberCount) || 1) - 3),
      recentProjects: [
        { id: `${workspaceId}-project-1`, name: `${name} 시작 준비`, progress: 24, icon: FolderKanban, tone: createDraft.tone },
        { id: `${workspaceId}-project-2`, name: `업무 보드 세팅`, progress: 12, icon: ClipboardList, tone: 'blue' },
      ],
      recentActivities: [
        { id: `${workspaceId}-activity-1`, title: `${name} 워크스페이스가 생성되었습니다.`, time: '방금 전', icon: CheckCircle2, tone: createDraft.tone },
        { id: `${workspaceId}-activity-2`, title: '기본 협업 설정과 멤버 구성을 이어서 진행해 보세요.', time: '방금 전', icon: Settings, tone: 'violet' },
      ],
      notices: [
        { id: `${workspaceId}-notice-1`, title: '워크스페이스 생성 직후에는 멤버 초대와 기본 권한 설정을 먼저 권장합니다.', date: '지금' },
      ],
    }

    teamFlowSeed.workspaces.push({
      id: createdWorkspace.id,
      name: createdWorkspace.name,
      subtitle: createDraft.subtitle.trim() || createdWorkspace.roleLabel,
      description: createdWorkspace.description,
      memberCount: createdWorkspace.memberCount,
      projectCount: createdWorkspace.projectCount,
    })

    setWorkspaceProfiles((previous) => [createdWorkspace, ...previous])
    setSelectedWorkspaceId(createdWorkspace.id)
    setCreateDraft({
      name: '',
      subtitle: '새 워크스페이스',
      description: '',
      memberCount: '4',
      projectCount: '1',
      roleLabel: '멤버',
      tone: 'blue',
    })
    setIsCreateModalOpen(false)
  }

  const handleNavigateWithWorkspace = (target: string) => {
    syncWorkspaceSelection(activeWorkspace)
    navigate(target)
  }

  return (
    <div className="standalone-shell workspace-select-shell">
      <div className="standalone-panel workspace-select-panel workspace-select-panel-redesign">
        <header className="workspace-select-topbar">
          <div className="workspace-select-brand-lockup">
            <img src={teamFlowLogoFull} alt="TeamFlow" className="workspace-select-logo" />
          </div>

          <button type="button" className="button button-primary workspace-select-create-top-button" onClick={() => setIsCreateModalOpen(true)}>
            <Plus size={18} />
            워크스페이스 생성
          </button>
        </header>

        <div className="workspace-select-body">
          <section className="workspace-select-page-heading">
            <h1>워크스페이스 선택</h1>
            <p>참여 중인 워크스페이스를 선택하고 바로 프로젝트 현황을 확인하세요.</p>
          </section>

          <div className="workspace-select-layout">
            <aside className="workspace-select-sidebar-card">
              <div className="workspace-select-filter-row">
                <label className="workspace-select-search">
                  <Search size={18} />
                  <input
                    type="text"
                    value={workspaceQuery}
                    onChange={(event) => setWorkspaceQuery(event.target.value)}
                    placeholder="워크스페이스 검색"
                  />
                </label>

                <div className="workspace-select-sort">
                  <button
                    type="button"
                    className="button button-secondary workspace-select-sort-button"
                    onClick={() => setIsSortMenuOpen((previous) => !previous)}
                  >
                    <SlidersHorizontal size={16} />
                    정렬
                  </button>

                  {isSortMenuOpen ? (
                    <div className="workspace-select-sort-menu">
                      {sortOptions.map((option) => (
                        <button
                          key={option.key}
                          type="button"
                          className={cn('workspace-select-sort-option', sortKey === option.key && 'active')}
                          onClick={() => {
                            setSortKey(option.key)
                            setIsSortMenuOpen(false)
                          }}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="workspace-select-list">
                {filteredWorkspaces.length ? (
                  filteredWorkspaces.map((workspace) => {
                    const WorkspaceIcon = workspace.icon
                    const isActive = workspace.id === activeWorkspace.id

                    return (
                      <button
                        key={workspace.id}
                        type="button"
                        className={cn('workspace-select-list-card', isActive && 'active')}
                        onClick={() => setSelectedWorkspaceId(workspace.id)}
                      >
                        <div className={cn('workspace-select-list-icon', `tone-${workspace.tone}`)}>
                          <WorkspaceIcon size={28} />
                        </div>

                        <div className="workspace-select-list-copy">
                          <strong>{workspace.name}</strong>
                          <div className="workspace-select-list-meta">
                            <span>{workspace.roleLabel}</span>
                            <span>멤버 {workspace.memberCount}명</span>
                          </div>
                        </div>

                        {workspace.alertCount ? (
                          <span className="workspace-select-list-alert">
                            <BellRing size={14} />
                            알림 {workspace.alertCount}
                          </span>
                        ) : null}
                      </button>
                    )
                  })
                ) : (
                  <div className="workspace-select-empty-state">
                    <strong>검색 결과가 없습니다.</strong>
                    <p>다른 이름으로 다시 검색하거나 새 워크스페이스를 만들어 보세요.</p>
                  </div>
                )}
              </div>

              <button type="button" className="button button-secondary workspace-select-create-bottom-button" onClick={() => setIsCreateModalOpen(true)}>
                <Plus size={18} /> 워크스페이스 생성
              </button>
            </aside>

            <section className="workspace-select-detail-card">
              <div className="workspace-select-detail-header">
                <div className="workspace-select-detail-identity">
                  <div className={cn('workspace-select-detail-icon', `tone-${activeWorkspace.tone}`)}>
                    <ActiveWorkspaceIcon size={34} />
                  </div>

                  <div className="workspace-select-detail-copy">
                    <h2>{activeWorkspace.name}</h2>
                    <p>{activeWorkspace.description}</p>
                  </div>
                </div>

                <button type="button" className="icon-button workspace-select-more-button" aria-label="워크스페이스 더보기">
                  <MoreHorizontal size={18} />
                </button>
              </div>

              <div className="workspace-select-summary-grid">
                {summaryCards.map((item) => {
                  const SummaryIcon = item.icon

                  return (
                    <article key={item.id} className="workspace-select-summary-card">
                      <div className={cn('workspace-select-summary-icon', `tone-${item.tone}`)}>
                        <SummaryIcon size={22} />
                      </div>
                      <div className="workspace-select-summary-copy">
                        <span>{item.label}</span>
                        <strong>{item.value}</strong>
                      </div>
                    </article>
                  )
                })}
              </div>

              <div className="workspace-select-content-grid">
                <article className="workspace-select-content-card">
                  <div className="workspace-select-section-head">
                    <strong>멤버</strong>
                    <button type="button" className="workspace-select-inline-link" onClick={() => handleNavigateWithWorkspace('/team')}>
                      전체 멤버 보기
                    </button>
                  </div>

                  <div className="workspace-select-member-row">
                    {activeWorkspace.members.map((member) => (
                      <div key={member.id} className="workspace-select-member-item">
                        <div className={cn('workspace-select-member-avatar', member.avatarColor)}>{member.avatarLabel}</div>
                        <strong>{member.name}</strong>
                        <span>{member.role}</span>
                        {member.badge ? <em className="workspace-select-member-badge">{member.badge}</em> : null}
                      </div>
                    ))}

                    {activeWorkspace.overflowMemberCount ? (
                      <div className="workspace-select-member-item workspace-select-member-item-more">
                        <div className="workspace-select-member-avatar workspace-select-member-avatar-more">+{activeWorkspace.overflowMemberCount}</div>
                        <strong>외 {activeWorkspace.overflowMemberCount}명</strong>
                        <span>추가 멤버</span>
                      </div>
                    ) : null}
                  </div>
                </article>

                <article className="workspace-select-content-card">
                  <div className="workspace-select-section-head">
                    <strong>최근 프로젝트</strong>
                    <button type="button" className="workspace-select-inline-link" onClick={() => handleNavigateWithWorkspace('/projects')}>
                      모든 프로젝트 보기
                    </button>
                  </div>

                  <div className="workspace-select-project-list">
                    {activeWorkspace.recentProjects.map((project) => {
                      const ProjectIcon = project.icon

                      return (
                        <div key={project.id} className="workspace-select-project-item">
                          <div className="workspace-select-project-head">
                            <div className="workspace-select-project-title">
                              <div className={cn('workspace-select-project-icon', `tone-${project.tone}`)}>
                                <ProjectIcon size={18} />
                              </div>
                              <strong>{project.name}</strong>
                            </div>
                            <span>{project.progress}%</span>
                          </div>

                          <div className="progress-track workspace-select-project-progress">
                            <div className={cn('progress-bar', `workspace-progress-${project.tone}`)} style={{ width: `${project.progress}%` }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </article>

                <article className="workspace-select-content-card">
                  <div className="workspace-select-section-head">
                    <strong>최근 활동</strong>
                    <button
                      type="button"
                      className="workspace-select-inline-link"
                      onClick={() => handleNavigateWithWorkspace(`/projects/${currentProjectId}/activities`)}
                    >
                      모든 활동 보기
                    </button>
                  </div>

                  <div className="workspace-select-activity-list">
                    {activeWorkspace.recentActivities.map((activity) => {
                      const ActivityIcon = activity.icon

                      return (
                        <div key={activity.id} className="workspace-select-activity-item">
                          <div className={cn('workspace-select-activity-icon', `tone-${activity.tone}`)}>
                            <ActivityIcon size={16} />
                          </div>
                          <p>{activity.title}</p>
                          <span>{activity.time}</span>
                        </div>
                      )
                    })}
                  </div>
                </article>

                <article className="workspace-select-content-card">
                  <div className="workspace-select-section-head">
                    <strong>공지</strong>
                    <button type="button" className="workspace-select-inline-link" onClick={() => handleNavigateWithWorkspace('/notifications')}>
                      모두 보기
                    </button>
                  </div>

                  <div className="workspace-select-notice-list">
                    {activeWorkspace.notices.map((notice) => (
                      <div key={notice.id} className="workspace-select-notice-item">
                        <div className="workspace-select-notice-copy">
                          <div className="workspace-select-notice-icon">
                            <Megaphone size={16} />
                          </div>
                          <p>{notice.title}</p>
                        </div>
                        <span>{notice.date}</span>
                      </div>
                    ))}
                  </div>
                </article>
              </div>

              <div className="workspace-select-footer-actions">
                <button
                  type="button"
                  className="button button-secondary workspace-select-footer-button"
                  onClick={() => handleNavigateWithWorkspace(`/projects/${currentProjectId}/settings`)}
                >
                  <Settings size={18} />
                  설정 보기
                </button>

                <button type="button" className="button button-primary workspace-select-footer-button workspace-select-enter-button" onClick={() => handleNavigateWithWorkspace('/workspace')}>
                  <ArrowRight size={18} />
                  워크스페이스 입장
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>

      {isCreateModalOpen ? (
        <div className="workspace-select-modal-backdrop" role="presentation" onClick={() => setIsCreateModalOpen(false)}>
          <div className="workspace-select-modal" role="dialog" aria-modal="true" aria-labelledby="workspace-create-title" onClick={(event) => event.stopPropagation()}>
            <div className="workspace-select-modal-head">
              <div>
                <h2 id="workspace-create-title">워크스페이스 생성</h2>
                <p>기본 정보만 먼저 입력하고, 상세 설정은 입장 후 계속 다듬을 수 있습니다.</p>
              </div>

              <button type="button" className="icon-button workspace-select-more-button" aria-label="닫기" onClick={() => setIsCreateModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="workspace-select-modal-form">
              <label className="field-row">
                <span>워크스페이스 이름</span>
                <input
                  className="input-field"
                  value={createDraft.name}
                  onChange={(event) => setCreateDraft((previous) => ({ ...previous, name: event.target.value }))}
                  placeholder="예: 지역 협업 TF"
                />
              </label>

              <div className="workspace-select-modal-grid">
                <label className="field-row">
                  <span>권한 역할</span>
                  <select
                    className="select-field"
                    value={createDraft.roleLabel}
                    onChange={(event) => setCreateDraft((previous) => ({ ...previous, roleLabel: event.target.value as WorkspaceRoleLabel }))}
                  >
                    <option value="관리자">관리자</option>
                    <option value="멤버">멤버</option>
                    <option value="조회 전용">조회 전용</option>
                  </select>
                </label>

                <label className="field-row">
                  <span>아이콘 톤</span>
                  <select
                    className="select-field"
                    value={createDraft.tone}
                    onChange={(event) => setCreateDraft((previous) => ({ ...previous, tone: event.target.value as WorkspaceTone }))}
                  >
                    <option value="blue">블루</option>
                    <option value="violet">바이올렛</option>
                    <option value="green">그린</option>
                    <option value="orange">오렌지</option>
                  </select>
                </label>
              </div>

              <label className="field-row">
                <span>설명</span>
                <textarea
                  className="textarea-field"
                  value={createDraft.description}
                  onChange={(event) => setCreateDraft((previous) => ({ ...previous, description: event.target.value }))}
                  placeholder="이 워크스페이스에서 어떤 흐름을 다룰지 적어 주세요."
                />
              </label>

              <div className="workspace-select-modal-grid">
                <label className="field-row">
                  <span>멤버 수</span>
                  <input
                    className="input-field"
                    type="number"
                    min="1"
                    max="30"
                    value={createDraft.memberCount}
                    onChange={(event) => setCreateDraft((previous) => ({ ...previous, memberCount: event.target.value }))}
                  />
                </label>

                <label className="field-row">
                  <span>프로젝트 수</span>
                  <input
                    className="input-field"
                    type="number"
                    min="1"
                    max="20"
                    value={createDraft.projectCount}
                    onChange={(event) => setCreateDraft((previous) => ({ ...previous, projectCount: event.target.value }))}
                  />
                </label>
              </div>
            </div>

            <div className="workspace-select-modal-actions">
              <button type="button" className="button button-secondary" onClick={() => setIsCreateModalOpen(false)}>
                취소
              </button>
              <button type="button" className="button button-primary" onClick={handleCreateWorkspace}>
                생성하기
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
