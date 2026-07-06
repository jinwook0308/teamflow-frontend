import { CalendarDays, FolderKanban, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import teamFlowLogoFull from '../../assets/logo/teamflow-logo.png'
import { AuthLayout } from '../../layouts/AuthLayout'
import { signup } from '../../services/auth'
import type { Role } from '../../types'

const signupBenefits = [
  { icon: FolderKanban, title: '프로젝트와 업무를 한 화면으로' },
  { icon: CalendarDays, title: '일정과 회의까지 함께 관리' },
  { icon: ShieldCheck, title: '역할 기반 협업 구조 지원' },
]

export function SignupPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [position, setPosition] = useState('')
  const [workspaceName, setWorkspaceName] = useState('컴퓨터공학과 개발팀')
  const [role, setRole] = useState<Role>('MEMBER')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [agreed, setAgreed] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!name || !email || !position || !password || !passwordConfirm) {
      setErrorMessage('필수 입력 항목을 모두 작성해 주세요.')
      return
    }

    if (password.length < 8) {
      setErrorMessage('비밀번호는 8자 이상으로 입력해 주세요.')
      return
    }

    if (password !== passwordConfirm) {
      setErrorMessage('비밀번호와 비밀번호 확인이 일치하지 않습니다.')
      return
    }

    if (!agreed) {
      setErrorMessage('기본 안내 확인 항목을 체크해 주세요.')
      return
    }

    try {
      setIsSubmitting(true)
      setErrorMessage('')

      const response = await signup({
        name: name.trim(),
        email: email.trim(),
        password,
        position: position.trim(),
        workspaceName: workspaceName.trim(),
        role,
      })

      if (typeof window !== 'undefined') {
        window.localStorage.setItem('teamflow-signup-email', response.user.email)
        window.localStorage.setItem(
          'teamflow-signup-profile',
          JSON.stringify({
            name: response.user.name,
            email: response.user.email,
            position: response.user.position,
            workspaceName: response.user.workspaceName ?? workspaceName.trim(),
            role: response.user.role,
          }),
        )
      }

      navigate('/login')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '회원가입 처리 중 오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <div className="auth-card auth-signup-card">
        <section className="auth-signup-hero">
          <img className="auth-signup-logo" src={teamFlowLogoFull} alt="TeamFlow" />

          <div className="auth-signup-copy">
            <span className="auth-badge">CREATE YOUR WORKSPACE</span>
            <h1>TeamFlow 스타일로 협업을 시작할 팀 공간을 만들어보세요</h1>
            <p>지금은 기본 정보만 먼저 받고, 이후 프로젝트 보드와 팀 협업 화면으로 자연스럽게 이어질 수 있게 구성합니다.</p>
          </div>

          <div className="auth-signup-feature-grid">
            {signupBenefits.map((benefit) => {
              const Icon = benefit.icon

              return (
                <div key={benefit.title} className="auth-signup-feature">
                  <div className="auth-signup-feature-icon">
                    <Icon size={20} />
                  </div>
                  <div className="auth-signup-feature-copy">
                    <strong>{benefit.title}</strong>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <section className="auth-signup-panel">
          <div className="auth-panel-heading">
            <h2>회원가입</h2>
            <p>이름, 역할, 기본 워크스페이스 정보만 입력하면 TeamFlow 흐름에 바로 맞춰서 시작할 수 있습니다.</p>
          </div>

          <form className="form-grid auth-signup-form" onSubmit={handleSubmit}>
            <label className="form-field">
              <span className="field-label">이름</span>
              <input className="input-field" value={name} onChange={(event) => setName(event.target.value)} placeholder="김태현" />
            </label>

            <label className="form-field">
              <span className="field-label">이메일</span>
              <input
                className="input-field"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="kimtaehyun@example.com"
              />
            </label>

            <label className="form-field">
              <span className="field-label">직책</span>
              <input className="input-field" value={position} onChange={(event) => setPosition(event.target.value)} placeholder="팀 리더" />
            </label>

            <label className="form-field">
              <span className="field-label">역할</span>
              <select className="select-field" value={role} onChange={(event) => setRole(event.target.value as Role)}>
                <option value="OWNER">OWNER</option>
                <option value="ADMIN">ADMIN</option>
                <option value="MEMBER">MEMBER</option>
                <option value="VIEWER">VIEWER</option>
              </select>
            </label>

            <label className="form-field auth-field-wide">
              <span className="field-label">기본 워크스페이스 이름</span>
              <input
                className="input-field"
                value={workspaceName}
                onChange={(event) => setWorkspaceName(event.target.value)}
                placeholder="컴퓨터공학과 개발팀"
              />
            </label>

            <label className="form-field">
              <span className="field-label">비밀번호</span>
              <input
                className="input-field"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="8자 이상 입력"
              />
            </label>

            <label className="form-field">
              <span className="field-label">비밀번호 확인</span>
              <input
                className="input-field"
                type="password"
                value={passwordConfirm}
                onChange={(event) => setPasswordConfirm(event.target.value)}
                placeholder="비밀번호를 다시 입력"
              />
            </label>

            <label className="auth-agree-row auth-field-wide">
              <input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} />
              <span>TeamFlow 기본 안내와 협업 흐름 구성을 확인했고, 입력한 정보로 계정을 생성하는 데 동의합니다.</span>
            </label>

            {errorMessage ? <p className="auth-error-text auth-field-wide">{errorMessage}</p> : null}

            <button type="submit" className="auth-primary-action auth-field-wide" disabled={isSubmitting}>
              {isSubmitting ? '가입 처리 중...' : '가입하고 시작하기'}
            </button>
          </form>

          <div className="auth-signup-footer">
            <span>이미 계정이 있나요?</span>
            <Link to="/login">로그인</Link>
          </div>
        </section>
      </div>
    </AuthLayout>
  )
}
