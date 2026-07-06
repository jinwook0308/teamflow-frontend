import type { Role } from '../types'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080').replace(/\/$/, '')

export interface AuthUserResponse {
  id?: number | string
  name: string
  email: string
  role: Role
  position: string
  workspaceName?: string
}

export interface SignupRequest {
  name: string
  email: string
  password: string
  position: string
  workspaceName: string
  role: Role
}

export interface SignupResponse {
  success: boolean
  message: string
  user: AuthUserResponse
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  message: string
  accessToken: string
  tokenType?: string
  user: AuthUserResponse
}

interface ApiErrorResponse {
  success?: boolean
  message?: string
}

async function requestJson<T>(path: string, init: RequestInit) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  })

  let payload: T | ApiErrorResponse | null = null

  try {
    payload = (await response.json()) as T | ApiErrorResponse
  } catch {
    payload = null
  }

  if (!response.ok) {
    const message =
      (payload &&
        typeof payload === 'object' &&
        'message' in payload &&
        typeof payload.message === 'string' &&
        payload.message) ||
      '서버 요청 처리 중 오류가 발생했습니다.'

    throw new Error(message)
  }

  if (!payload) {
    throw new Error('서버 응답을 읽지 못했습니다.')
  }

  return payload as T
}

export async function signup(request: SignupRequest) {
  return requestJson<SignupResponse>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(request),
  })
}

export async function login(request: LoginRequest) {
  return requestJson<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(request),
  })
}
