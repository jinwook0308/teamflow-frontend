import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Download,
  FileArchive,
  FileImage,
  FileSpreadsheet,
  FileText,
  Plus,
  UploadCloud,
  X,
} from 'lucide-react'
import { useParams } from 'react-router-dom'
import { cn } from '../../utils/format'
import { useTeamFlowStore } from '../../stores/useTeamFlowStore'

type FileKind = 'pdf' | 'ppt' | 'xls' | 'doc' | 'zip' | 'image'
type SortMode = 'all' | 'uploader' | 'date' | 'size'

type ManagedFile = {
  id: string
  name: string
  uploader: string
  uploadedAt: string
  sizeLabel: string
  sizeValue: number
  kind: FileKind
}

const sortTabs: Array<{ id: SortMode; label: string }> = [
  { id: 'all', label: '전체 파일' },
  { id: 'uploader', label: '업로드한 사람' },
  { id: 'date', label: '업로드 날짜' },
  { id: 'size', label: '크기' },
]

const initialFiles: ManagedFile[] = [
  { id: 'file-1', name: '요구사항 정의서.pdf', uploader: '김태현', uploadedAt: '2024.05.10', sizeLabel: '2.3 MB', sizeValue: 2.3, kind: 'pdf' },
  { id: 'file-2', name: 'DB 설계서.pdf', uploader: '박민수', uploadedAt: '2024.05.12', sizeLabel: '1.8 MB', sizeValue: 1.8, kind: 'pdf' },
  { id: 'file-3', name: 'API 명세서.pdf', uploader: '김영희', uploadedAt: '2024.05.15', sizeLabel: '3.1 MB', sizeValue: 3.1, kind: 'pdf' },
  { id: 'file-4', name: '화면설계서.pdf', uploader: '김태현', uploadedAt: '2024.05.18', sizeLabel: '4.2 MB', sizeValue: 4.2, kind: 'pdf' },
  { id: 'file-5', name: '발표자료.pptx', uploader: '이지은', uploadedAt: '2024.05.20', sizeLabel: '5.6 MB', sizeValue: 5.6, kind: 'ppt' },
  { id: 'file-6', name: '테스트 케이스.xlsx', uploader: '최유진', uploadedAt: '2024.05.21', sizeLabel: '2.9 MB', sizeValue: 2.9, kind: 'xls' },
  { id: 'file-7', name: '사용자 매뉴얼.docx', uploader: '박민수', uploadedAt: '2024.05.22', sizeLabel: '6.7 MB', sizeValue: 6.7, kind: 'doc' },
  { id: 'file-8', name: '디자인 리소스.zip', uploader: '장수빈', uploadedAt: '2024.05.24', sizeLabel: '12.4 MB', sizeValue: 12.4, kind: 'zip' },
  { id: 'file-9', name: 'ERD 설계안.png', uploader: '송다운', uploadedAt: '2024.05.25', sizeLabel: '1.2 MB', sizeValue: 1.2, kind: 'image' },
  { id: 'file-10', name: '회의 결과 공유본.pdf', uploader: '한서준', uploadedAt: '2024.05.26', sizeLabel: '2.7 MB', sizeValue: 2.7, kind: 'pdf' },
  { id: 'file-11', name: '배포 점검표.xlsx', uploader: '김태현', uploadedAt: '2024.05.27', sizeLabel: '1.1 MB', sizeValue: 1.1, kind: 'xls' },
  { id: 'file-12', name: '시연 스크립트.docx', uploader: '이지은', uploadedAt: '2024.05.28', sizeLabel: '3.8 MB', sizeValue: 3.8, kind: 'doc' },
]

function parseDateValue(value: string) {
  const [year, month, day] = value.split('.').map(Number)
  return new Date(year, month - 1, day).getTime()
}

function inferKindFromName(name: string): FileKind {
  const lower = name.toLowerCase()
  if (lower.endsWith('.ppt') || lower.endsWith('.pptx')) {
    return 'ppt'
  }
  if (lower.endsWith('.xls') || lower.endsWith('.xlsx')) {
    return 'xls'
  }
  if (lower.endsWith('.doc') || lower.endsWith('.docx')) {
    return 'doc'
  }
  if (lower.endsWith('.zip')) {
    return 'zip'
  }
  if (lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.svg')) {
    return 'image'
  }
  return 'pdf'
}

function renderFileIcon(kind: FileKind) {
  if (kind === 'xls') {
    return <FileSpreadsheet size={20} />
  }
  if (kind === 'doc') {
    return <FileText size={20} />
  }
  if (kind === 'zip') {
    return <FileArchive size={20} />
  }
  if (kind === 'image') {
    return <FileImage size={20} />
  }
  return <FileText size={20} />
}

function createDownloadPayload(file: ManagedFile) {
  return `파일명: ${file.name}\n업로드한 사람: ${file.uploader}\n업로드 날짜: ${file.uploadedAt}\n크기: ${file.sizeLabel}\n`
}

export function FilesPage() {
  const { projectId } = useParams()
  const selectProject = useTeamFlowStore((state) => state.selectProject)
  const [sortMode, setSortMode] = useState<SortMode>('all')
  const [files, setFiles] = useState<ManagedFile[]>(initialFiles)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(8)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [selectedFileName, setSelectedFileName] = useState('')
  const [selectedFileSize, setSelectedFileSize] = useState('')
  const [uploaderName, setUploaderName] = useState('김태현')
  const [uploadDate, setUploadDate] = useState('2024.05.29')
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (projectId) {
      selectProject(projectId)
    }
  }, [projectId, selectProject])

  const sortedFiles = useMemo(() => {
    const next = [...files]

    if (sortMode === 'uploader') {
      next.sort((left, right) => left.uploader.localeCompare(right.uploader, 'ko-KR'))
      return next
    }

    if (sortMode === 'date') {
      next.sort((left, right) => parseDateValue(right.uploadedAt) - parseDateValue(left.uploadedAt))
      return next
    }

    if (sortMode === 'size') {
      next.sort((left, right) => right.sizeValue - left.sizeValue)
      return next
    }

    return next
  }, [files, sortMode])

  const totalPages = Math.max(1, Math.ceil(sortedFiles.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const visibleFiles = sortedFiles.slice((safePage - 1) * pageSize, safePage * pageSize)
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1)

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages))
  }, [totalPages])

  const handleDownload = (file: ManagedFile) => {
    const blob = new Blob([createDownloadPayload(file)], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `${file.name}.txt`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const resetUploadDraft = () => {
    setSelectedFileName('')
    setSelectedFileSize('')
    setUploaderName('김태현')
    setUploadDate('2024.05.29')
  }

  const handleFilePick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    setSelectedFileName(file.name)
    const sizeInMb = file.size / (1024 * 1024)
    setSelectedFileSize(`${sizeInMb.toFixed(1)} MB`)
  }

  const handleUploadSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const name = selectedFileName.trim()
    if (!name) {
      return
    }

    setFiles((current) => [
      {
        id: `file-${Date.now()}`,
        name,
        uploader: uploaderName.trim() || '담당자 미정',
        uploadedAt: uploadDate.trim() || '날짜 미정',
        sizeLabel: selectedFileSize.trim() || '용량 미정',
        sizeValue: Number.parseFloat(selectedFileSize) || 0,
        kind: inferKindFromName(name),
      },
      ...current,
    ])
    setSortMode('all')
    setPage(1)
    setIsUploadOpen(false)
    resetUploadDraft()
  }

  return (
    <>
      <div className="files-page">
        <section className="files-shell">
          <div className="files-header">
            <div>
              <h1>파일 관리</h1>
            </div>
            <button type="button" className="button button-primary files-upload-button" onClick={() => setIsUploadOpen(true)}>
              <Plus size={18} />
              파일 업로드
            </button>
          </div>

          <div className="files-sort-tabs" role="tablist" aria-label="파일 정렬 기준">
            {sortTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={sortMode === tab.id}
                className={cn('files-sort-tab', sortMode === tab.id && 'active')}
                onClick={() => setSortMode(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="files-table-card">
            <div className="files-table-head">
              <span>파일명</span>
              <span>업로드한 사람</span>
              <button type="button" className="files-head-sort" onClick={() => setSortMode('date')}>
                업로드 날짜
                <ArrowDown size={16} />
              </button>
              <span>크기</span>
              <span className="files-head-action" aria-hidden="true" />
            </div>

            <div className="files-table-body">
              {visibleFiles.map((file) => (
                <div key={file.id} className="files-row">
                  <div className="files-name-cell">
                    <div className={cn('files-type-icon', `files-type-${file.kind}`)}>{renderFileIcon(file.kind)}</div>
                    <strong>{file.name}</strong>
                  </div>
                  <span>{file.uploader}</span>
                  <span>{file.uploadedAt}</span>
                  <span>{file.sizeLabel}</span>
                  <button type="button" className="files-download-button" aria-label={`${file.name} 다운로드`} onClick={() => handleDownload(file)}>
                    <Download size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="files-footer">
            <div className="files-pagination">
              <button type="button" className="icon-button" aria-label="이전 페이지" onClick={() => setPage((current) => Math.max(1, current - 1))}>
                <ChevronLeft size={18} />
              </button>

              {pageNumbers.map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  className={cn('files-page-number', pageNumber === safePage && 'active')}
                  onClick={() => setPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              ))}

              <button type="button" className="icon-button" aria-label="다음 페이지" onClick={() => setPage((current) => Math.min(totalPages, current + 1))}>
                <ChevronRight size={18} />
              </button>
            </div>

            <label className="files-page-size">
              <select
                value={pageSize}
                onChange={(event) => {
                  setPageSize(Number(event.target.value))
                  setPage(1)
                }}
              >
                <option value={8}>8개씩 보기</option>
                <option value={10}>10개씩 보기</option>
                <option value={20}>20개씩 보기</option>
              </select>
            </label>
          </div>
        </section>
      </div>

      {isUploadOpen ? (
        <div className="files-upload-backdrop" onClick={() => setIsUploadOpen(false)}>
          <div
            className="files-upload-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="files-upload-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="files-upload-header">
              <div>
                <h2 id="files-upload-title">파일 업로드</h2>
                <p>파일을 선택하면 목록에 바로 추가됩니다. 지금은 프론트 화면 기준의 업로드 동작입니다.</p>
              </div>
              <button
                type="button"
                className="icon-button"
                aria-label="닫기"
                onClick={() => {
                  setIsUploadOpen(false)
                  resetUploadDraft()
                }}
              >
                <X size={18} />
              </button>
            </div>

            <form className="files-upload-form" onSubmit={handleUploadSubmit}>
              <input ref={fileInputRef} type="file" hidden onChange={handleFileChange} />

              <button type="button" className="files-dropzone" onClick={handleFilePick}>
                <UploadCloud size={28} />
                <strong>{selectedFileName || '업로드할 파일을 선택하세요'}</strong>
                <span>{selectedFileSize || '점선 박스 전체를 눌러 파일을 고를 수 있습니다.'}</span>
              </button>

              <div className="files-upload-grid">
                <label className="files-field">
                  <span>업로드한 사람</span>
                  <input value={uploaderName} onChange={(event) => setUploaderName(event.target.value)} placeholder="예: 김태현" />
                </label>
                <label className="files-field">
                  <span>업로드 날짜</span>
                  <input value={uploadDate} onChange={(event) => setUploadDate(event.target.value)} placeholder="예: 2024.05.29" />
                </label>
              </div>

              <div className="files-upload-actions">
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() => {
                    setIsUploadOpen(false)
                    resetUploadDraft()
                  }}
                >
                  취소
                </button>
                <button type="submit" className="button button-primary">
                  파일 추가
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  )
}
