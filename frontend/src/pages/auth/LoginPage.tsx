import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import teamFlowLogoFull from '../../assets/logo/teamflow-logo.png'
import { AuthLayout } from '../../layouts/AuthLayout'
import { login } from '../../services/auth'
import { useTeamFlowStore } from '../../stores/useTeamFlowStore'

const AUTH_PROFILE_STORAGE_KEY = 'teamflow-auth-user'
const ACCESS_TOKEN_STORAGE_KEY = 'teamflow-access-token'

function persistAuthSession(payload: { accessToken: string; user: { id?: number | string; name: string; email: string; role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER'; position: string } }, rememberLogin: boolean) {
  if (typeof window === 'undefined') {
    return
  }

  const serializedUser = JSON.stringify({
    id: payload.user.id ? String(payload.user.id) : undefined,
    name: payload.user.name,
    email: payload.user.email,
    role: payload.user.role,
    position: payload.user.position,
  })

  const targetStorage = rememberLogin ? window.localStorage : window.sessionStorage
  const otherStorage = rememberLogin ? window.sessionStorage : window.localStorage

  targetStorage.setItem(AUTH_PROFILE_STORAGE_KEY, serializedUser)
  targetStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, payload.accessToken)
  targetStorage.setItem('teamflow-remember-login', rememberLogin ? 'true' : 'false')

  otherStorage.removeItem(AUTH_PROFILE_STORAGE_KEY)
  otherStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY)

  window.localStorage.setItem('teamflow-last-email', payload.user.email)
}

export function LoginPage() {
  const navigate = useNavigate()
  const loginWithProfile = useTeamFlowStore((state) => state.loginWithProfile)
  const [email, setEmail] = useState(() => {
    if (typeof window === 'undefined') {
      return 'owner@teamflow.com'
    }

    return (
      window.localStorage.getItem('teamflow-signup-email') ??
      window.localStorage.getItem('teamflow-last-email') ??
      'owner@teamflow.com'
    )
  })
  const [password, setPassword] = useState('12345678')
  const [rememberLogin, setRememberLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!email.trim() || !password.trim()) {
      setErrorMessage('이메일과 비밀번호를 모두 입력해 주세요.')
      return
    }

    try {
      setIsSubmitting(true)
      setErrorMessage('')

      const response = await login({
        email: email.trim(),
        password,
      })

      persistAuthSession(
        {
          accessToken: response.accessToken,
          user: response.user,
        },
        rememberLogin,
      )

      loginWithProfile({
        id: response.user.id ? String(response.user.id) : undefined,
        name: response.user.name,
        email: response.user.email,
        role: response.user.role,
        position: response.user.position,
      })

      navigate('/workspace-select')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '로그인 처리 중 오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <div className="auth-card auth-login-card">
        <section className="auth-login-hero">
          <img className="auth-login-logo" src={teamFlowLogoFull} alt="TeamFlow" />

          <div className="auth-login-copy">
            <h1>
              팀 프로젝트 관리,
              <br />
              한 곳에서
            </h1>
            <p>
              업무 관리, 일정, 파일, 채팅, 문서를
              <br />
              한 흐름 안에서 효율적으로 관리하세요.
            </p>
          </div>
        </section>

        <section className="auth-login-panel">
          <div className="auth-panel-heading">
            <h2>로그인</h2>
          </div>

          <form className="auth-form-stack auth-login-form" onSubmit={handleSubmit}>
            <label className="auth-input-group">
              <span className="field-label auth-field-label-lg">이메일</span>
              <input
                className="input-field auth-login-input"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="owner@teamflow.com"
              />
            </label>

            <label className="auth-input-group">
              <span className="field-label auth-field-label-lg">비밀번호</span>
              <div className="auth-input-wrap">
                <input
                  className="input-field auth-login-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="비밀번호를 입력해 주세요"
                />
                <button
                  type="button"
                  className="auth-visibility-button"
                  aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                  onClick={() => setShowPassword((current) => !current)}
                >
                  {showPassword ? <EyeOff size={28} /> : <Eye size={28} />}
                </button>
              </div>
            </label>

            <label className="auth-checkbox-row">
              <input
                type="checkbox"
                checked={rememberLogin}
                onChange={(event) => setRememberLogin(event.target.checked)}
              />
              <span>로그인 상태 유지</span>
            </label>

            {errorMessage ? <p className="auth-error-text">{errorMessage}</p> : null}

            <button type="submit" className="auth-primary-action auth-login-submit" disabled={isSubmitting}>
              {isSubmitting ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <div className="auth-link-row">
            <button type="button" className="auth-text-link">
              비밀번호 찾기
            </button>
            <span className="auth-link-divider" />
            <Link className="auth-text-link" to="/signup">
              회원가입
            </Link>
          </div>
        </section>
      </div>
    </AuthLayout>
  )
}
