import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ShellLayout } from '../layouts/ShellLayout'
import { ActivitiesPage, CalendarPage, ChatPage, CommentsMentionsPage, DashboardPage, FilesPage, LoginPage, MeetingsPage, MyTasksPage, ProjectSettingsPage, ProjectsPage, SignupPage, TaskDetailPage, TasksPage, TeamPage, WorkspaceOverviewPage, WorkspaceSelectPage } from '../pages'
import { PlannedFeaturePage } from '../pages/shared/PlannedFeaturePage'

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignupPage /> },
  { path: '/workspace-select', element: <WorkspaceSelectPage /> },
  {
    element: <ShellLayout />,
    children: [
      { path: '/workspace', element: <WorkspaceOverviewPage /> },
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/projects', element: <ProjectsPage /> },
      { path: '/projects/:projectId/board', element: <TasksPage /> },
      { path: '/projects/:projectId/tasks/:taskId', element: <TaskDetailPage /> },
      { path: '/projects/:projectId/comments', element: <CommentsMentionsPage /> },
      { path: '/projects/:projectId/chat', element: <ChatPage /> },
      { path: '/calendar', element: <CalendarPage /> },
      { path: '/projects/:projectId/meetings', element: <MeetingsPage /> },
      { path: '/projects/:projectId/files', element: <FilesPage /> },
      { path: '/projects/:projectId/activities', element: <ActivitiesPage /> },
      { path: '/notifications', element: <PlannedFeaturePage screenId="notifications" /> },
      { path: '/team', element: <TeamPage /> },
      { path: '/statistics', element: <PlannedFeaturePage screenId="statistics" /> },
      { path: '/projects/:projectId/settings', element: <ProjectSettingsPage /> },
      { path: '/projects/:projectId/github', element: <PlannedFeaturePage screenId="github" /> },
      { path: '/my-tasks', element: <MyTasksPage /> },
      { path: '/admin/settings', element: <PlannedFeaturePage screenId="admin-settings" /> },
    ],
  },
  { path: '*', element: <Navigate to="/login" replace /> },
])
