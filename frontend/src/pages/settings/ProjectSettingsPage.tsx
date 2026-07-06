import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { PageHeader, RoleBadge, SectionCard, StatusBadge } from '../../components/common'
import { teamFlowSeed, useTeamFlowStore } from '../../stores/useTeamFlowStore'
import type { ProjectStatus } from '../../types'
import { cn, formatDate } from '../../utils/format'

type SeedProject = (typeof teamFlowSeed.projects)[number]
type SeedUser = (typeof teamFlowSeed.users)[number]

type SettingsDraft = {
  name: string
  summary: string
  status: ProjectStatus
  dueDate: string
  progress: string
  repositoryUrl: string
  stagingUrl: string
  productionUrl: string
  docsUrl: string
  reviewAlerts: boolean
  deadlineAlerts: boolean
  dailyDigest: boolean
  fileUploadNotice: boolean
}

type AccountDraft = {
  name: string
  email: string
  position: string
  phone: string
  bio: string
  password: string
  passwordConfirm: string
}

type ProjectSettingsEditorProps = {
  project: SeedProject
  projectMembers: SeedUser[]
  currentUser: SeedUser
}

function toInputDate(value: string) {
  return value.slice(0, 10)
}

function createProjectDraft(project: SeedProject): SettingsDraft {
  return {
    name: project.name,
    summary: project.summary,
    status: project.status,
    dueDate: toInputDate(project.dueDate),
    progress: String(project.progress),
    repositoryUrl: `https://github.com/teamflow/${project.id}`,
    stagingUrl: `https://staging.teamflow.app/${project.id}`,
    productionUrl: `https://app.teamflow.kr/${project.id}`,
    docsUrl: `https://docs.teamflow.kr/${project.id}`,
    reviewAlerts: true,
    deadlineAlerts: true,
    dailyDigest: false,
    fileUploadNotice: true,
  }
}

function createAccountDraft(user: SeedUser): AccountDraft {
  return {
    name: user.name,
    email: user.email,
    position: user.position,
    phone: '010-1234-5678',
    bio: `${user.position} 역할로 TeamFlow 프로젝트 협업을 담당하고 있습니다.`,
    password: '',
    passwordConfirm: '',
  }
}

const notificationOptions: Array<{
  key: keyof Pick<SettingsDraft, 'reviewAlerts' | 'deadlineAlerts' | 'dailyDigest' | 'fileUploadNotice'>
  title: string
  description: string
}> = [
  {
    key: 'reviewAlerts',
    title: '검토 요청 알림',
    description: '업무 상태가 검토 중으로 바뀌면 담당자와 리뷰어에게 바로 알려줍니다.',
  },
  {
    key: 'deadlineAlerts',
    title: '마감 임박 알림',
    description: '마감 3일 전과 하루 전에 프로젝트 멤버에게 자동으로 알림을 보냅니다.',
  },
  {
    key: 'dailyDigest',
    title: '일일 요약 메일',
    description: '하루 동안 바뀐 업무, 파일, 회의록을 저녁 시간에 요약해서 전달합니다.',
  },
  {
    key: 'fileUploadNotice',
    title: '파일 업로드 알림',
    description: '새 파일이 올라오면 채팅과 활동 기록에도 연결해서 보여줍니다.',
  },
]

function ProjectSettingsEditor({
  project,
  projectMembers,
  currentUser,
}: ProjectSettingsEditorProps) {
  const [draft, setDraft] = useState<SettingsDraft>(() => createProjectDraft(project))
  const [accountDraft, setAccountDraft] = useState<AccountDraft>(() => createAccountDraft(currentUser))
  const [savedMessage, setSavedMessage] = useState('')
  const [accountSavedMessage, setAccountSavedMessage] = useState('')

  const owner = projectMembers.find((member) => member.role === 'OWNER') ?? projectMembers[0] ?? teamFlowSeed.users[0]

  const summaryItems = [
    { label: '프로젝트 상태', value: <StatusBadge status={draft.status} /> },
    { label: '현재 진행률', value: <strong>{draft.progress}%</strong> },
    { label: '마감일', value: <strong>{formatDate(draft.dueDate)}</strong> },
    { label: '참여 멤버', value: <strong>{projectMembers.length}명</strong> },
  ]

  const handleProjectSave = () => {
    const now = new Intl.DateTimeFormat('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date())

    setSavedMessage(`${now} 기준으로 프로젝트 설정 변경사항을 저장했습니다.`)
  }

  const handleProjectReset = () => {
    setDraft(createProjectDraft(project))
    setSavedMessage('프로젝트 설정 입력값을 다시 불러왔습니다.')
  }

  const handleAccountSave = () => {
    if (accountDraft.password !== accountDraft.passwordConfirm) {
      setAccountSavedMessage('비밀번호 확인이 일치하지 않습니다.')
      return
    }

    setAccountSavedMessage('개인정보 변경 내용을 저장했습니다.')
  }

  const handleAccountReset = () => {
    setAccountDraft(createAccountDraft(currentUser))
    setAccountSavedMessage('내 정보 입력값을 다시 불러왔습니다.')
  }

  return (
    <div className="page settings-page">
      <PageHeader
        title="설정"
        description={`${project.name} 프로젝트의 기본 정보, 연동 주소, 알림 옵션을 한 화면에서 정리할 수 있습니다.`}
        actions={(
          <>
            <button type="button" className="button button-secondary" onClick={handleProjectReset}>
              초기화
            </button>
            <button type="button" className="button button-primary" onClick={handleProjectSave}>
              설정 저장
            </button>
          </>
        )}
      />

      {savedMessage ? <div className="settings-banner">{savedMessage}</div> : null}

      <SectionCard
        title="내 정보"
        description="프로필, 연락처, 비밀번호를 프로젝트 설정과 분리해서 바로 수정할 수 있게 구성했습니다."
        className="settings-account-card"
      >
        <div className="settings-account-layout">
          <div className="settings-account-profile">
            <div className={cn('avatar', currentUser.avatarColor, 'settings-account-avatar')}>{currentUser.avatarLabel}</div>
            <div className="settings-account-copy">
              <strong>{accountDraft.name}</strong>
              <p>{accountDraft.position}</p>
              <span>{accountDraft.email}</span>
            </div>
          </div>

          <div className="form-grid settings-form-grid settings-account-grid">
            <label className="form-field">
              <span className="field-label">이름</span>
              <input
                className="input-field"
                value={accountDraft.name}
                onChange={(event) => setAccountDraft((current) => ({ ...current, name: event.target.value }))}
              />
            </label>

            <label className="form-field">
              <span className="field-label">이메일</span>
              <input
                className="input-field"
                type="email"
                value={accountDraft.email}
                onChange={(event) => setAccountDraft((current) => ({ ...current, email: event.target.value }))}
              />
            </label>

            <label className="form-field">
              <span className="field-label">직책</span>
              <input
                className="input-field"
                value={accountDraft.position}
                onChange={(event) => setAccountDraft((current) => ({ ...current, position: event.target.value }))}
              />
            </label>

            <label className="form-field">
              <span className="field-label">연락처</span>
              <input
                className="input-field"
                value={accountDraft.phone}
                onChange={(event) => setAccountDraft((current) => ({ ...current, phone: event.target.value }))}
              />
            </label>

            <label className="form-field settings-field-wide">
              <span className="field-label">한 줄 소개</span>
              <textarea
                className="textarea-field"
                value={accountDraft.bio}
                onChange={(event) => setAccountDraft((current) => ({ ...current, bio: event.target.value }))}
              />
            </label>

            <label className="form-field">
              <span className="field-label">새 비밀번호</span>
              <input
                className="input-field"
                type="password"
                value={accountDraft.password}
                onChange={(event) => setAccountDraft((current) => ({ ...current, password: event.target.value }))}
                placeholder="변경할 때만 입력"
              />
            </label>

            <label className="form-field">
              <span className="field-label">비밀번호 확인</span>
              <input
                className="input-field"
                type="password"
                value={accountDraft.passwordConfirm}
                onChange={(event) => setAccountDraft((current) => ({ ...current, passwordConfirm: event.target.value }))}
                placeholder="비밀번호를 다시 입력"
              />
            </label>
          </div>
        </div>

        <div className="settings-account-actions">
          <p className="settings-account-hint">개인정보는 프로젝트 설정 저장과 분리해서 따로 관리할 수 있도록 구성했습니다.</p>
          <div className="section-card-actions">
            <button type="button" className="button button-secondary" onClick={handleAccountReset}>
              내 정보 초기화
            </button>
            <button type="button" className="button button-primary" onClick={handleAccountSave}>
              내 정보 저장
            </button>
          </div>
        </div>

        {accountSavedMessage ? <div className="settings-account-message">{accountSavedMessage}</div> : null}
      </SectionCard>

      <div className="page-grid page-grid-2 settings-layout">
        <div className="settings-main-column">
          <SectionCard title="기본 정보" description="프로젝트명, 설명, 상태, 마감일, 진행률을 관리합니다.">
            <div className="form-grid settings-form-grid">
              <label className="form-field">
                <span className="field-label">프로젝트명</span>
                <input className="input-field" value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} />
              </label>

              <label className="form-field settings-field-wide">
                <span className="field-label">프로젝트 설명</span>
                <textarea
                  className="textarea-field"
                  value={draft.summary}
                  onChange={(event) => setDraft((current) => ({ ...current, summary: event.target.value }))}
                />
              </label>

              <label className="form-field">
                <span className="field-label">상태</span>
                <select className="select-field" value={draft.status} onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value as ProjectStatus }))}>
                  <option value="ACTIVE">진행 중</option>
                  <option value="READY">준비 중</option>
                  <option value="DONE">완료</option>
                </select>
              </label>

              <label className="form-field">
                <span className="field-label">마감일</span>
                <input className="input-field" type="date" value={draft.dueDate} onChange={(event) => setDraft((current) => ({ ...current, dueDate: event.target.value }))} />
              </label>

              <label className="form-field">
                <span className="field-label">진행률 (%)</span>
                <input
                  className="input-field"
                  type="number"
                  min="0"
                  max="100"
                  value={draft.progress}
                  onChange={(event) => setDraft((current) => ({ ...current, progress: event.target.value }))}
                />
              </label>
            </div>
          </SectionCard>

          <SectionCard title="연동 정보" description="GitHub, 배포, 문서 링크를 함께 관리할 수 있게 정리했습니다.">
            <div className="form-grid settings-form-grid">
              <label className="form-field settings-field-wide">
                <span className="field-label">GitHub 저장소 주소</span>
                <input
                  className="input-field"
                  value={draft.repositoryUrl}
                  onChange={(event) => setDraft((current) => ({ ...current, repositoryUrl: event.target.value }))}
                  placeholder="https://github.com/..."
                />
              </label>

              <label className="form-field">
                <span className="field-label">스테이징 주소</span>
                <input
                  className="input-field"
                  value={draft.stagingUrl}
                  onChange={(event) => setDraft((current) => ({ ...current, stagingUrl: event.target.value }))}
                  placeholder="https://staging..."
                />
              </label>

              <label className="form-field">
                <span className="field-label">운영 배포 주소</span>
                <input
                  className="input-field"
                  value={draft.productionUrl}
                  onChange={(event) => setDraft((current) => ({ ...current, productionUrl: event.target.value }))}
                  placeholder="https://app..."
                />
              </label>

              <label className="form-field settings-field-wide">
                <span className="field-label">문서/위키 주소</span>
                <input
                  className="input-field"
                  value={draft.docsUrl}
                  onChange={(event) => setDraft((current) => ({ ...current, docsUrl: event.target.value }))}
                  placeholder="https://docs..."
                />
              </label>
            </div>
          </SectionCard>

          <SectionCard title="알림 및 운영 옵션" description="작업 흐름에 맞는 기본 알림 정책을 켜고 끌 수 있습니다.">
            <div className="settings-option-list">
              {notificationOptions.map((option) => (
                <label key={option.key} className="settings-option-row">
                  <div className="settings-option-copy">
                    <strong>{option.title}</strong>
                    <p>{option.description}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={draft[option.key]}
                    onChange={(event) => setDraft((current) => ({ ...current, [option.key]: event.target.checked }))}
                  />
                </label>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="settings-side-column">
          <SectionCard title="프로젝트 요약" description="현재 설정 기준으로 핵심 항목만 오른쪽에서 빠르게 확인할 수 있습니다.">
            <div className="settings-summary-card">
              <div className="project-card-header">
                <div>
                  <h3>{draft.name}</h3>
                  <p>{draft.summary}</p>
                </div>
                <StatusBadge status={draft.status} />
              </div>

              <div className="progress-row">
                <div className="progress-track">
                  <div className="progress-bar" style={{ width: `${Math.max(0, Math.min(100, Number(draft.progress) || 0))}%` }} />
                </div>
                <strong>{draft.progress}%</strong>
              </div>

              <div className="settings-summary-list">
                {summaryItems.map((item) => (
                  <div key={item.label} className="summary-item">
                    <span>{item.label}</span>
                    <div>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>

          <SectionCard title="프로젝트 리더 및 참여 멤버" description="현재 프로젝트에 연결된 멤버와 역할을 같이 확인할 수 있습니다.">
            <div className="settings-owner-card">
              <div className={cn('avatar', owner.avatarColor, 'settings-owner-avatar')}>{owner.avatarLabel}</div>
              <div>
                <strong>{owner.name}</strong>
                <p>{owner.position}</p>
              </div>
              <RoleBadge role={owner.role} />
            </div>

            <div className="settings-member-list">
              {projectMembers.map((member) => (
                <div key={member.id} className="settings-member-row">
                  <div className="member-left">
                    <div className={cn('mini-avatar', 'member-avatar-large', member.avatarColor)}>{member.avatarLabel}</div>
                    <div>
                      <strong>{member.name}</strong>
                      <p>{member.position}</p>
                    </div>
                  </div>
                  <RoleBadge role={member.role} />
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="운영 메모" description="시연과 발표 때 바로 설명할 수 있도록 현재 설정 화면의 핵심 포인트를 정리했습니다.">
            <ul className="info-list">
              <li className="info-item">상단에 내 정보 영역을 추가해서 프로젝트 설정과 계정 정보가 한 화면에서 구분되도록 구성했습니다.</li>
              <li className="info-item">설정 저장은 아직 프론트 시연용 상태이며, 다음 단계에서 백엔드 API와 연결하면 실제 저장 흐름으로 이어질 수 있습니다.</li>
              <li className="info-item">GitHub, 배포 주소, 문서 링크는 이후 다른 화면과 연결할 때 재사용하기 좋도록 유지했습니다.</li>
            </ul>
          </SectionCard>
        </div>
      </div>
    </div>
  )
}

export function ProjectSettingsPage() {
  const { projectId } = useParams()
  const selectProject = useTeamFlowStore((state) => state.selectProject)
  const currentProjectId = useTeamFlowStore((state) => state.currentProjectId)
  const currentUserId = useTeamFlowStore((state) => state.currentUserId)

  useEffect(() => {
    if (projectId) {
      selectProject(projectId)
    }
  }, [projectId, selectProject])

  const currentProject = teamFlowSeed.projects.find((item) => item.id === currentProjectId) ?? teamFlowSeed.projects[0]
  const currentUser = teamFlowSeed.users.find((item) => item.id === currentUserId) ?? teamFlowSeed.users[0]
  const projectMembers = useMemo(
    () => teamFlowSeed.users.filter((user) => currentProject.memberIds.includes(user.id)),
    [currentProject.memberIds],
  )

  return (
    <ProjectSettingsEditor
      key={`${currentProject.id}-${currentUser.id}`}
      project={currentProject}
      projectMembers={projectMembers}
      currentUser={currentUser}
    />
  )
}
