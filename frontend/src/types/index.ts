export type Role = 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER'
export type ProjectStatus = 'ACTIVE' | 'READY' | 'DONE'
export type ScreenScope = 'PROJECT' | 'WORKSPACE'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  position: string
  avatarLabel: string
  avatarColor: string
}

export interface Workspace {
  id: string
  name: string
  subtitle: string
  description: string
  memberCount: number
  projectCount: number
}

export interface Project {
  id: string
  name: string
  summary: string
  status: ProjectStatus
  progress: number
  dueDate: string
  memberIds: string[]
  accentClass: string
}

export interface DashboardStat {
  id: string
  label: string
  value: number
  caption: string
}

export interface PlannedScreen {
  id: string
  title: string
  description: string
  nextStep: string
  scope: ScreenScope
}
