import { create } from 'zustand'
import { dashboardStats, plannedScreens, projects, testAccounts, users, workspaces } from '../data/mock-data'
import type { Role, User } from '../types'

const AUTH_PROFILE_STORAGE_KEY = 'teamflow-auth-user'
const WORKSPACE_STORAGE_KEY = 'teamflow-current-workspace'

interface AuthSessionUser {
  id?: string
  name: string
  email: string
  role: Role
  position: string
}

function getAvatarColor(role: Role) {
  if (role === 'OWNER') {
    return 'avatar-deep'
  }

  if (role === 'ADMIN') {
    return 'avatar-primary'
  }

  if (role === 'MEMBER') {
    return 'avatar-green'
  }

  return 'avatar-sky'
}

function getAvatarLabel(name: string, email: string) {
  return name.trim().charAt(0) || email.trim().charAt(0).toUpperCase() || 'T'
}

function createUserId(email: string) {
  return `user-${email.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
}

function readStoredAuthProfile() {
  if (typeof window === 'undefined') {
    return null
  }

  const rawProfile =
    window.localStorage.getItem(AUTH_PROFILE_STORAGE_KEY) ??
    window.sessionStorage.getItem(AUTH_PROFILE_STORAGE_KEY)

  if (!rawProfile) {
    return null
  }

  try {
    return JSON.parse(rawProfile) as AuthSessionUser
  } catch {
    return null
  }
}

function upsertUserProfile(profile: AuthSessionUser) {
  const existingUser = users.find((item) => item.email === profile.email)

  if (existingUser) {
    existingUser.name = profile.name
    existingUser.position = profile.position
    existingUser.role = profile.role
    existingUser.avatarLabel = getAvatarLabel(profile.name, profile.email)
    existingUser.avatarColor = getAvatarColor(profile.role)
    return existingUser.id
  }

  const createdUser: User = {
    id: profile.id || createUserId(profile.email),
    name: profile.name,
    email: profile.email,
    role: profile.role,
    position: profile.position,
    avatarLabel: getAvatarLabel(profile.name, profile.email),
    avatarColor: getAvatarColor(profile.role),
  }

  users.push(createdUser)
  return createdUser.id
}

function getInitialUserId() {
  const storedProfile = readStoredAuthProfile()

  if (storedProfile) {
    return upsertUserProfile(storedProfile)
  }

  return users[0].id
}

function getInitialWorkspaceId() {
  if (typeof window === 'undefined') {
    return workspaces[0].id
  }

  const storedWorkspaceId = window.localStorage.getItem(WORKSPACE_STORAGE_KEY)

  if (storedWorkspaceId && workspaces.some((workspace) => workspace.id === storedWorkspaceId)) {
    return storedWorkspaceId
  }

  return workspaces[0].id
}

interface TeamFlowStore {
  currentUserId: string
  currentWorkspaceId: string
  currentProjectId: string
  loginAs: (email: string) => void
  loginWithProfile: (profile: AuthSessionUser) => void
  selectWorkspace: (workspaceId: string) => void
  selectProject: (projectId: string) => void
}

export const useTeamFlowStore = create<TeamFlowStore>((set) => ({
  currentUserId: getInitialUserId(),
  currentWorkspaceId: getInitialWorkspaceId(),
  currentProjectId: projects[0].id,
  loginAs: (email) => {
    const user = users.find((item) => item.email === email) ?? users[0]
    set({ currentUserId: user.id })
  },
  loginWithProfile: (profile) => {
    const currentUserId = upsertUserProfile(profile)
    set({ currentUserId })
  },
  selectWorkspace: (workspaceId) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(WORKSPACE_STORAGE_KEY, workspaceId)
    }

    set({
      currentWorkspaceId: workspaceId,
    })
  },
  selectProject: (projectId) => {
    set({ currentProjectId: projectId })
  },
}))

export const teamFlowSeed = {
  users,
  workspaces,
  projects,
  dashboardStats,
  plannedScreens,
  testAccounts,
}
