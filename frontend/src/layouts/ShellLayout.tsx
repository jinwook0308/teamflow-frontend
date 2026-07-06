import { Outlet } from 'react-router-dom'
import { Sidebar, Topbar } from '../components/common'
import { teamFlowSeed, useTeamFlowStore } from '../stores/useTeamFlowStore'

export function ShellLayout() {
  const currentUserId = useTeamFlowStore((state) => state.currentUserId)
  const currentWorkspaceId = useTeamFlowStore((state) => state.currentWorkspaceId)

  const currentUser = teamFlowSeed.users.find((user) => user.id === currentUserId) ?? teamFlowSeed.users[0]
  const currentWorkspace = teamFlowSeed.workspaces.find((workspace) => workspace.id === currentWorkspaceId) ?? teamFlowSeed.workspaces[0]

  return (
    <div className="app-shell">
      <Sidebar currentUser={currentUser} />
      <main className="content-shell">
        <Topbar workspaceName={currentWorkspace.name} currentUser={currentUser} />
        <div className="content-body">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
