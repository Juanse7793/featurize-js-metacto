import type { Feature } from '@/types'

const STATUS_CONFIG: Record<
  Feature['status'],
  { bg: string; color: string; label: string }
> = {
  PENDING: { bg: 'rgba(148,163,184,0.1)', color: '#94a3b8', label: 'Pending' },
  PLANNED: { bg: 'rgba(99,102,241,0.12)', color: '#818cf8', label: 'Planned' },
  IN_PROGRESS: {
    bg: 'rgba(245,158,11,0.12)',
    color: '#fbbf24',
    label: 'In Progress',
  },
  DONE: { bg: 'rgba(16,185,129,0.12)', color: '#34d399', label: 'Done' },
}

export default function StatusBadge({ status }: { status: Feature['status'] }) {
  const config = STATUS_CONFIG[status]
  return (
    <span
      style={{
        background: config.bg,
        color: config.color,
        borderRadius: 6,
        padding: '2px 8px',
        fontSize: 11,
        fontWeight: 500,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: '50%',
          background: config.color,
          flexShrink: 0,
        }}
      />
      {config.label}
    </span>
  )
}
