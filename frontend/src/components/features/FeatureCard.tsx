import { formatDistanceToNow } from 'date-fns'
import type { Feature } from '@/types'
import { useAuthStore } from '@/store/auth.store'
import VoteButton from './VoteButton'
import StatusBadge from './StatusBadge'

export default function FeatureCard({ feature }: { feature: Feature }) {
  const { isAuthenticated } = useAuthStore()

  return (
    <div
      style={{
        background: '#0f0f1a',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 16,
        padding: 20,
        cursor: 'pointer',
        transition: 'all 200ms ease',
        display: 'flex',
        flexDirection: 'row',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget
        el.style.borderColor = 'rgba(99,102,241,0.3)'
        el.style.transform = 'translateY(-2px)'
        el.style.boxShadow = '0 8px 30px rgba(99,102,241,0.08)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget
        el.style.borderColor = 'rgba(255,255,255,0.06)'
        el.style.transform = 'translateY(0)'
        el.style.boxShadow = 'none'
      }}
    >
      {/* Left: vote column */}
      <div
        style={{
          width: 72,
          flexShrink: 0,
          borderRight: '1px solid rgba(255,255,255,0.06)',
          paddingRight: 16,
          marginRight: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <VoteButton
          featureId={feature.id}
          voteCount={feature.voteCount}
          hasVoted={feature.hasVoted}
          isAuthenticated={isAuthenticated}
        />
      </div>

      {/* Right: content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          className="line-clamp-1"
          style={{
            color: 'white',
            fontSize: 15,
            fontWeight: 600,
            marginBottom: 4,
          }}
        >
          {feature.title}
        </div>
        <div
          className="line-clamp-2"
          style={{
            color: 'rgba(255,255,255,0.45)',
            fontSize: 13,
            lineHeight: 1.5,
            marginBottom: 12,
          }}
        >
          {feature.description}
        </div>

        {/* Bottom row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: 'rgba(99,102,241,0.2)',
              border: '1px solid rgba(99,102,241,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 10,
              color: '#818cf8',
              flexShrink: 0,
            }}
          >
            {feature.authorName.charAt(0).toUpperCase()}
          </div>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
            {feature.authorName}
          </span>
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>·</span>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
            {formatDistanceToNow(new Date(feature.createdAt), { addSuffix: true })}
          </span>
          <div style={{ marginLeft: 'auto' }}>
            <StatusBadge status={feature.status} />
          </div>
        </div>
      </div>
    </div>
  )
}
