import { useEffect, useState, useRef } from 'react'
import type React from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { ref, onChildAdded } from 'firebase/database'
import { db } from './firebaseConfig'

type Comment = {
  id: string
  text: string
  top: number
}

export default function Viewer(): React.JSX.Element {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const sourceId = searchParams.get('sourceId')
  const sourceName = searchParams.get('sourceName')

  const videoRef = useRef<HTMLVideoElement>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [error, setError] = useState<string | null>(null)

  // キャプチャ開始
  useEffect(() => {
    if (!sourceId) {
      navigate('/')
      return
    }

    const startCapture = async (): Promise<void> => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            // @ts-expect-error - Electron拡張のmandatory制約
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: sourceId
            }
          }
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (err) {
        console.error('Failed to start capture:', err)
        setError('キャプチャの開始に失敗しました')
      }
    }

    startCapture()

    return () => {
      // クリーンアップ: ストリームを停止
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [sourceId, navigate])

  // コメント受信（App.tsxから移植）
  useEffect(() => {
    const commentsRef = ref(db, 'comments')

    const unsubscribe = onChildAdded(
      commentsRef,
      (snapshot) => {
        const val = snapshot.val()
        if (!val) return

        const newComment: Comment = {
          id: snapshot.key as string,
          text: val.text,
          top: Math.random() * 80
        }

        setComments((prev) => [...prev, newComment])

        // 6秒で消す
        setTimeout(() => {
          setComments((prev) => prev.filter((c) => c.id !== newComment.id))
        }, 6000)
      },
      (error) => {
        console.error('Error in onChildAdded listener:', error)
      }
    )

    return () => unsubscribe()
  }, [])

  const handleBack = (): void => {
    navigate('/')
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <p>{error}</p>
        <button onClick={handleBack} style={styles.backButton}>
          戻る
        </button>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      {/* ヘッダー */}
      <div style={styles.header}>
        <button onClick={handleBack} style={styles.backButton}>
          ← 戻る
        </button>
        <span style={styles.sourceName}>{sourceName || 'キャプチャ中'}</span>
      </div>

      {/* キャプチャ映像 + コメントオーバーレイ */}
      <div style={styles.videoContainer}>
        <video ref={videoRef} autoPlay style={styles.video} />

        {/* コメントオーバーレイ */}
        <div style={styles.commentOverlay}>
          {comments.map((comment) => (
            <div
              key={comment.id}
              style={{
                position: 'absolute',
                top: `${comment.top}%`,
                right: 0,
                fontSize: '2rem',
                fontWeight: 'bold',
                color: 'white',
                textShadow:
                  '2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
                whiteSpace: 'nowrap',
                animation: 'flow 5s linear forwards',
                pointerEvents: 'none'
              }}
            >
              {comment.text}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes flow {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100vw); }
        }
      `}</style>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    background: '#000'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 12px',
    background: '#222',
    color: '#fff'
  },
  backButton: {
    padding: '6px 12px',
    fontSize: '0.9rem',
    background: '#444',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  sourceName: {
    fontSize: '0.9rem',
    color: '#ccc'
  },
  videoContainer: {
    position: 'relative',
    flex: 1,
    overflow: 'hidden'
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    background: '#000'
  },
  commentOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    overflow: 'hidden'
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    gap: '16px'
  }
}
