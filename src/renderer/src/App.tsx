// src/renderer/src/App.tsx
import { useEffect, useState } from 'react'
import type React from 'react'

type Comment = {
  id: number
  text: string
  top: number
}

function App(): React.JSX.Element {
  const [comments, setComments] = useState<Comment[]>([])

  // テスト用：2秒ごとにコメントを追加する
  useEffect(() => {
    let count = 0
    const interval = setInterval(() => {
      count++
      const newComment: Comment = {
        id: Date.now(),
        text: `テストコメント ${count} です！`,
        top: Math.random() * 80 // 画面の上から0~80%の位置にランダム配置
      }

      setComments((prev) => [...prev, newComment])

      // 掃除：6秒後にStateから消す（メモリリーク防止）
      setTimeout(() => {
        setComments((prev) => prev.filter((c) => c.id !== newComment.id))
      }, 6000)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ width: '100vw', height: '100vh', pointerEvents: 'none' }}>
      {comments.map((comment) => (
        <div
          key={comment.id}
          style={{
            position: 'absolute',
            top: `${comment.top}%`,
            right: 0, // 初期位置（右端）
            fontSize: '2rem',
            fontWeight: 'bold',
            color: 'white',
            textShadow:
              '2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000', // 強力な縁取り
            whiteSpace: 'nowrap',
            animation: 'flow 5s linear forwards',
            pointerEvents: 'none' // 文字自体もクリック判定を消す
          }}
        >
          {comment.text}
        </div>
      ))}

      <style>{`
        @keyframes flow {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100vw); } /* 画面幅分左へ移動 */
        }
      `}</style>
    </div>
  )
}

export default App
