import { useEffect } from 'react'
import {
  AtSign,
  Code2,
  Headphones,
  LockKeyhole,
  Megaphone,
  MoreVertical,
  Paperclip,
  Search,
  SendHorizonal,
  Smile,
  SquarePen,
  ChevronDown,
} from 'lucide-react'
import { cn } from '../../utils/format'
import { useTeamFlowStore } from '../../stores/useTeamFlowStore'

type ChatParticipant = {
  id: string
  name: string
  avatarLabel: string
  avatarColor: string
}

type ChannelItem = {
  id: string
  name: string
  icon: 'private' | 'design' | 'backend' | 'marketing' | 'support'
  active?: boolean
  unread?: boolean
}

type ChatMessage = {
  id: string
  authorId: string
  time: string
  body: string
}

const chatParticipants: ChatParticipant[] = [
  { id: 'kim-taehyun', name: '김태현', avatarLabel: '김', avatarColor: 'avatar-deep' },
  { id: 'kim-younghee', name: '김영희', avatarLabel: '김', avatarColor: 'avatar-pink' },
  { id: 'park-minsu', name: '박민수', avatarLabel: '박', avatarColor: 'avatar-orange' },
  { id: 'lee-jieun', name: '이지은', avatarLabel: '이', avatarColor: 'avatar-primary' },
  { id: 'choi-yujin', name: '최유진', avatarLabel: '최', avatarColor: 'avatar-sky' },
  { id: 'jeong-subin', name: '정수빈', avatarLabel: '정', avatarColor: 'avatar-green' },
]

const channels: ChannelItem[] = [
  { id: 'shopping-team', name: '쇼핑몰 개발팀', icon: 'private', active: true, unread: true },
  { id: 'design-system', name: '디자인 시스템', icon: 'design' },
  { id: 'backend-dev', name: '백엔드 개발', icon: 'backend' },
  { id: 'marketing-campaign', name: '마케팅 캠페인', icon: 'marketing' },
  { id: 'ops-support', name: '운영 지원', icon: 'support' },
]

const messages: ChatMessage[] = [
  { id: 'message-1', authorId: 'kim-taehyun', time: '14:20', body: '퇴근 전 API 배포하겠습니다.' },
  { id: 'message-2', authorId: 'kim-younghee', time: '14:22', body: '확인해 볼게요!' },
  { id: 'message-3', authorId: 'park-minsu', time: '14:35', body: '상품 API에 옵션이 있는 것 같습니다.' },
  { id: 'message-4', authorId: 'lee-jieun', time: '14:36', body: '제가 확인하고 수정하겠습니다.' },
  { id: 'message-5', authorId: 'choi-yujin', time: '14:37', body: '수정 후 테스트 결과도 공유 부탁드려요!' },
  { id: 'message-6', authorId: 'jeong-subin', time: '14:40', body: '넵, 오후 4시까지 완료하겠습니다.' },
]

function renderChannelIcon(icon: ChannelItem['icon']) {
  if (icon === 'private') {
    return <LockKeyhole size={18} />
  }

  if (icon === 'design') {
    return <SquarePen size={18} />
  }

  if (icon === 'backend') {
    return <Code2 size={18} />
  }

  if (icon === 'marketing') {
    return <Megaphone size={18} />
  }

  return <Headphones size={18} />
}

export function ChatPage() {
  const currentProjectId = useTeamFlowStore((state) => state.currentProjectId)
  const selectProject = useTeamFlowStore((state) => state.selectProject)

  useEffect(() => {
    if (currentProjectId) {
      selectProject(currentProjectId)
    }
  }, [currentProjectId, selectProject])

  return (
    <div className="chat-page">
      <section className="chat-shell">
        <aside className="chat-channel-panel">
          <div className="chat-channel-header">
            <h1>채팅</h1>
            <button type="button" className="chat-channel-create-button" aria-label="새 채널 만들기">
              <SquarePen size={20} />
            </button>
          </div>

          <label className="chat-channel-search">
            <Search size={18} />
            <input type="text" placeholder="채널 검색" />
          </label>

          <div className="chat-channel-list">
            {channels.map((channel) => (
              <button
                key={channel.id}
                type="button"
                className={cn('chat-channel-item', channel.active && 'active')}
              >
                <span className="chat-channel-item-icon">{renderChannelIcon(channel.icon)}</span>
                <strong>{channel.name}</strong>
                {channel.unread ? <span className="chat-channel-unread" /> : null}
              </button>
            ))}
          </div>

          <button type="button" className="chat-channel-add-link">
            + 새 채널 만들기
          </button>
        </aside>

        <div className="chat-room-panel">
          <div className="chat-room-header">
            <div className="chat-room-title">
              <strong>쇼핑몰 개발팀</strong>
              <ChevronDown size={16} />
              <span>멤버 8명</span>
            </div>

            <div className="chat-room-actions">
              <button type="button" className="chat-room-icon-button" aria-label="채팅방 검색">
                <Search size={20} />
              </button>
              <button type="button" className="chat-room-icon-button" aria-label="더 보기">
                <MoreVertical size={20} />
              </button>
            </div>
          </div>

          <div className="chat-message-list">
            {messages.map((message) => {
              const author = chatParticipants.find((participant) => participant.id === message.authorId) ?? chatParticipants[0]

              return (
                <article key={message.id} className="chat-message-item">
                  <div className={cn('avatar', 'chat-message-avatar', author.avatarColor)}>{author.avatarLabel}</div>
                  <div className="chat-message-body">
                    <div className="chat-message-meta">
                      <strong>{author.name}</strong>
                      <span>{message.time}</span>
                    </div>
                    <p>{message.body}</p>
                  </div>
                </article>
              )
            })}
          </div>

          <div className="chat-compose-footer">
            <div className="chat-compose-bar">
              <input type="text" placeholder="메시지를 입력하세요..." />
              <div className="chat-compose-tools">
                <button type="button" aria-label="파일 첨부">
                  <Paperclip size={20} />
                </button>
                <button type="button" aria-label="이모지">
                  <Smile size={20} />
                </button>
                <button type="button" aria-label="멘션">
                  <AtSign size={20} />
                </button>
                <button type="button" className="chat-send-button" aria-label="메시지 전송">
                  <SendHorizonal size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
