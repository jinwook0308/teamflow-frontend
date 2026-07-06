import { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { AtSign, SendHorizonal } from 'lucide-react'
import { cn } from '../../utils/format'
import { getTaskDetail } from '../../data/task-board-data'
import { teamFlowSeed, useTeamFlowStore } from '../../stores/useTeamFlowStore'

export function CommentsMentionsPage() {
  const { projectId } = useParams()
  const selectProject = useTeamFlowStore((state) => state.selectProject)

  useEffect(() => {
    if (projectId) {
      selectProject(projectId)
    }
  }, [projectId, selectProject])

  const detail = useMemo(() => getTaskDetail('task-signup-api') ?? getTaskDetail('task-login-ui'), [])

  if (!detail) {
    return (
      <div className="page">
        <div className="comment-screen">
          <strong>댓글 화면을 불러올 수 없습니다.</strong>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="comment-screen">
        <div className="comment-screen-header">
          <h1>댓글 및 멘션</h1>
        </div>

        <section className="comment-thread-card">
          <div className="comment-thread-title-row">
            <h2>댓글 {detail.comments.length}</h2>
          </div>

          <div className="comment-compose-box">
            <div className="comment-compose-input">
              <AtSign size={20} />
              <input type="text" placeholder="댓글을 입력하세요. (@로 멘션)" />
            </div>
            <button type="button" className="comment-submit-button">
              등록
            </button>
          </div>

          <div className="comment-thread-list">
            {detail.comments.map((comment) => {
              const author = teamFlowSeed.users.find((user) => user.id === comment.authorId) ?? teamFlowSeed.users[0]

              return (
                <article key={comment.id} className="comment-thread-item">
                  <div className={cn('avatar', 'comment-thread-avatar', author.avatarColor)}>{author.avatarLabel}</div>

                  <div className="comment-thread-body">
                    <div className="comment-thread-topline">
                      <div className="comment-thread-authorline">
                        <strong>{author.name}</strong>
                        <time>{comment.time}</time>
                      </div>

                      <div className="comment-thread-actions">
                        <button type="button">수정</button>
                        <button type="button">삭제</button>
                      </div>
                    </div>

                    <div className="comment-thread-content">
                      {comment.mention ? <span className="comment-thread-mention">{comment.mention}</span> : null}
                      <p>{comment.content}</p>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          <div className="comment-thread-footer">
            <div className="comment-thread-hint">멘션을 사용할 때는 `@이름` 형태로 입력하면 됩니다.</div>
            <button type="button" className="comment-thread-send">
              <SendHorizonal size={16} />
              빠른 등록
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
