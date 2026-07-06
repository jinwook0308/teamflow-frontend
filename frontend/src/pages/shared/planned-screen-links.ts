import type { PlannedScreen } from '../../types'

export function buildPlannedScreenPath(screenId: PlannedScreen['id'], projectId: string) {
  switch (screenId) {
    case 'board':
      return `/projects/${projectId}/board`
    case 'task-detail':
      return `/projects/${projectId}/tasks/sample-task`
    case 'comments':
      return `/projects/${projectId}/comments`
    case 'chat':
      return `/projects/${projectId}/chat`
    case 'calendar':
      return '/calendar'
    case 'meetings':
      return `/projects/${projectId}/meetings`
    case 'files':
      return `/projects/${projectId}/files`
    case 'activities':
      return `/projects/${projectId}/activities`
    case 'notifications':
      return '/notifications'
    case 'team':
      return '/team'
    case 'statistics':
      return '/statistics'
    case 'settings':
      return `/projects/${projectId}/settings`
    case 'github':
      return `/projects/${projectId}/github`
    case 'my-tasks':
      return '/my-tasks'
    case 'admin-settings':
      return '/admin/settings'
    default:
      return '/projects'
  }
}
