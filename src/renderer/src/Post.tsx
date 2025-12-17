import type React from 'react'
import { useState } from 'react'
import { ref, push } from 'firebase/database'
import { db } from './firebaseConfig'

export default function Post(): React.JSX.Element {
  const [text, setText] = useState('')

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    if (!text.trim()) return

    // Firebaseに送信！
    push(ref(db, 'comments'), {
      text: text,
      timestamp: Date.now()
    })

    setText('') // 入力欄をクリア
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', background: 'white', height: '100vh' }}>
      <h2>💬 コメント投稿</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="コメントを入力..."
          style={{ flex: 1, padding: '10px', fontSize: '16px' }}
        />
        <button type="submit" style={{ padding: '10px 20px', fontSize: '16px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
          送信
        </button>
      </form>
    </div>
  )
}