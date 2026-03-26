import { useState } from 'react'
import { useUIStore } from '@/store/ui.store'

const STATUS_OPTIONS = [
  { label: 'All', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Planned', value: 'PLANNED' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Done', value: 'DONE' },
]

const SORT_OPTIONS: { label: string; value: 'top' | 'new' }[] = [
  { label: 'Top', value: 'top' },
  { label: 'New', value: 'new' },
]

export default function FilterBar() {
  const { activeStatus, setStatus, activeSort, setSort } = useUIStore()

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        flexWrap: 'wrap',
        gap: 8,
      }}
    >
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {STATUS_OPTIONS.map((opt) => (
          <Pill
            key={opt.value}
            label={opt.label}
            active={activeStatus === opt.value}
            onClick={() => setStatus(opt.value)}
          />
        ))}
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {SORT_OPTIONS.map((opt) => (
          <Pill
            key={opt.value}
            label={opt.label}
            active={activeSort === opt.value}
            onClick={() => setSort(opt.value)}
          />
        ))}
      </div>
    </div>
  )
}

function Pill({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        height: 32,
        padding: '0 12px',
        borderRadius: 8,
        fontSize: 13,
        cursor: 'pointer',
        transition: 'all 150ms ease',
        background: active ? 'rgba(99,102,241,0.15)' : 'transparent',
        border: active
          ? '1px solid rgba(99,102,241,0.4)'
          : hovered
          ? '1px solid rgba(255,255,255,0.2)'
          : '1px solid rgba(255,255,255,0.08)',
        color: active ? '#818cf8' : 'rgba(255,255,255,0.45)',
        fontWeight: active ? 600 : 400,
      }}
    >
      {label}
    </button>
  )
}
