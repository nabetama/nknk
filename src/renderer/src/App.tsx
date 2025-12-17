// src/renderer/src/App.tsx
import { useEffect, useState } from 'react'
import type React from 'react'

import { ref, onChildAdded } from 'firebase/database'
import { db } from './firebaseConfig'

type Comment = {
  id: string
  text: string
  top: number
}

function App(): React.JSX.Element {
  const [comments, setComments] = useState<Comment[]>([])

  // テスト用：2秒ごとにコメントを追加する
  useEffect(() => {
    console.log('App component mounted, setting up listener.') // ①リスナー設定開始を確認
    // コメントDBを監視
    const commentsRef = ref(db, 'comments')

    // データが追加されたら発火するコールバック関数を指定
    const unsubscribe = onChildAdded(
      commentsRef,
      (snapshot) => {
        console.log('onChildAdded fired!', snapshot.key, snapshot.val()) // ②データが取得されたか確認
        const val = snapshot.val()
        if (!val) {
          console.log('Snapshot value is null or undefined.')
          return
        }

        const newComment: Comment = {
          id: snapshot.key as string,
          text: val.text,
          top: Math.random() * 80 // 高さランダム
        }
        console.log('New comment created:', newComment) // ③新しいコメントオブジェクトを確認

        setComments((prev) => [...prev, newComment])

        // 6秒で消す(メモリリーク防止)
        setTimeout(() => {
          setComments((prev) => prev.filter((c) => c.id !== newComment.id))
        }, 6000)
      },
      (error) => {
        console.log('Error in onChildAdded listener:', error)
      }
    )

    return () => unsubscribe()
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
