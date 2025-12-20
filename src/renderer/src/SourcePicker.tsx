import { useEffect, useState } from 'react'
import type React from 'react'
import { useNavigate } from 'react-router-dom'
import type { SourceInfo } from '../../preload/index.d'

export default function SourcePicker(): React.JSX.Element {
  const [sources, setSources] = useState<SourceInfo[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchSources = async (): Promise<void> => {
      try {
        const result = await window.api.getSources()
        setSources(result)
      } catch (error) {
        console.error('Failed to get sources:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSources()
  }, [])

  const handleSelect = (source: SourceInfo): void => {
    navigate(
      `/viewer?sourceId=${encodeURIComponent(source.id)}&sourceName=${encodeURIComponent(source.name)}`
    )
  }

  if (loading) {
    return (
      <div style={styles.container}>
        <p>読み込み中...</p>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>共有するウィンドウを選択</h1>
      <p style={styles.subtitle}>選択したウィンドウ上にコメントがオーバーレイ表示されます</p>
      <div style={styles.grid}>
        {sources.map((source) => (
          <button
            key={source.id}
            onClick={() => handleSelect(source)}
            style={styles.sourceButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#007bff'
              e.currentTarget.style.transform = 'scale(1.02)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#ddd'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            <img src={source.thumbnail} alt={source.name} style={styles.thumbnail} />
            <span style={styles.sourceName}>{source.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '20px',
    maxWidth: '900px',
    margin: '0 auto',
    fontFamily: 'system-ui, sans-serif'
  },
  title: {
    fontSize: '1.5rem',
    marginBottom: '8px',
    color: '#333'
  },
  subtitle: {
    fontSize: '0.9rem',
    color: '#666',
    marginBottom: '24px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '16px'
  },
  sourceButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '12px',
    border: '2px solid #ddd',
    borderRadius: '8px',
    background: '#fff',
    cursor: 'pointer',
    transition: 'border-color 0.2s, transform 0.2s'
  },
  thumbnail: {
    width: '100%',
    height: 'auto',
    borderRadius: '4px',
    marginBottom: '8px'
  },
  sourceName: {
    fontSize: '0.85rem',
    color: '#333',
    textAlign: 'center',
    wordBreak: 'break-word',
    lineHeight: '1.3'
  }
}
