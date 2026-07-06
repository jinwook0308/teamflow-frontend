import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PageHeader, SectionCard, StatusBadge } from '../../components/common'
import { teamFlowSeed, useTeamFlowStore } from '../../stores/useTeamFlowStore'
import type { PlannedScreen } from '../../types'
import { buildPlannedScreenPath } from './planned-screen-links'

export function PlannedFeaturePage({
  screenId,
}: {
  screenId: PlannedScreen['id']
}) {
  const { projectId } = useParams()
  const selectProject = useTeamFlowStore((state) => state.selectProject)
  const currentWorkspaceId = useTeamFlowStore((state) => state.currentWorkspaceId)

  const screen = teamFlowSeed.plannedScreens.find((item) => item.id === screenId) ?? teamFlowSeed.plannedScreens[0]
  const project = teamFlowSeed.projects.find((item) => item.id === projectId) ?? teamFlowSeed.projects[0]
  const workspace = teamFlowSeed.workspaces.find((item) => item.id === currentWorkspaceId) ?? teamFlowSeed.workspaces[0]

  useEffect(() => {
    if (screen.scope === 'PROJECT') {
      selectProject(project.id)
    }
  }, [project.id, screen.scope, selectProject])

  const relatedScreens = teamFlowSeed.plannedScreens.filter((item) => item.id !== screen.id).slice(0, 3)

  return (
    <div className="page">
      <PageHeader
        title={`${screen.title} 화면 자리`}
        description="이 화면은 지금은 기초 뼈대 상태이며, 다음 단계에서 보내준 계획서와 UI 시안에 맞춰 실제 기능을 붙일 예정입니다."
        actions={(
          <>
            <Link className="button button-secondary" to="/projects">프로젝트 목록</Link>
            <Link className="button button-primary" to="/dashboard">대시보드</Link>
          </>
        )}
      />

      <div className="page-grid page-grid-2">
        <SectionCard title="현재 연결 정보" description="화면이 어떤 기준과 연결되는지 먼저 보여줍니다.">
          <div className="summary-list">
            <div className="summary-item">
              <span>화면 범위</span>
              <strong>{screen.scope === 'PROJECT' ? '프로젝트 단위 화면' : '워크스페이스 공통 화면'}</strong>
            </div>
            <div className="summary-item">
              <span>기준 워크스페이스</span>
              <strong>{workspace.name}</strong>
            </div>
            <div className="summary-item">
              <span>기준 프로젝트</span>
              <strong>{project.name}</strong>
            </div>
            <div className="summary-item">
              <span>프로젝트 상태</span>
              <StatusBadge status={project.status} />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="이 화면에서 들어갈 내용" description="계획서 흐름을 먼저 글로 정리해 둔 자리입니다.">
          <ul className="info-list">
            <li className="info-item">{screen.description}</li>
            <li className="info-item">{screen.nextStep}</li>
            <li className="info-item">세부 배치와 시각 구성은 보내준 UI 이미지 기준으로 맞춥니다.</li>
          </ul>
        </SectionCard>
      </div>

      <SectionCard
        title="왜 지금은 자리만 만들어 두는지"
        description="초보자 기준으로는 먼저 화면 이동과 공통 구조가 안정적으로 잡혀 있어야 이후 수정이 쉬워집니다."
      >
        <ul className="info-list">
          <li className="info-item">지금은 라우팅과 공통 레이아웃, 샘플 데이터 연결을 먼저 끝내는 단계입니다.</li>
          <li className="info-item">다음 단계부터 각 화면에 실제 카드, 표, 댓글, 파일, 채팅 기능을 붙입니다.</li>
          <li className="info-item">이렇게 하면 VS Code에서 파일 역할을 이해하면서 작업하기 훨씬 편해집니다.</li>
        </ul>
      </SectionCard>

      <SectionCard title="다음으로 이어질 화면" description="바로 옆 기능 화면도 여기서 이동해 볼 수 있게 연결했습니다.">
        <div className="screen-grid">
          {relatedScreens.map((item) => (
            <Link
              key={item.id}
              className="screen-card"
              to={buildPlannedScreenPath(item.id, project.id)}
            >
              <div className="screen-card-header">
                <strong>{item.title}</strong>
                <span className={item.scope === 'PROJECT' ? 'scope-badge scope-project' : 'scope-badge scope-workspace'}>
                  {item.scope === 'PROJECT' ? '프로젝트 화면' : '공통 화면'}
                </span>
              </div>
              <p>{item.description}</p>
              <span>{item.nextStep}</span>
            </Link>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}
