import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { featureService, type FeaturesFilters } from '@/services/feature.service'
import { QUERY_KEYS } from '@/lib/queryKeys'
import type { Feature, PaginatedResponse } from '@/types'

export function useFeaturesList(filters: FeaturesFilters = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.features.list(filters),
    queryFn: () => featureService.getFeatures(filters),
  })
}

export function useCreateFeature() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ title, description }: { title: string; description: string }) =>
      featureService.createFeature(title, description),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.features.all })
      toast.success('Feature submitted!')
    },
    onError: () => {
      toast.error('Failed to submit feature.')
    },
  })
}

export function useVote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (featureId: string) => featureService.toggleVote(featureId),

    onMutate: async (featureId: string) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.features.all })

      // Snapshot all list caches
      const snapshots = queryClient
        .getQueriesData<PaginatedResponse<Feature>>({
          queryKey: QUERY_KEYS.features.all,
        })

      // Optimistically update each cached page
      queryClient.setQueriesData<PaginatedResponse<Feature>>(
        { queryKey: QUERY_KEYS.features.all },
        (old) => {
          if (!old) return old
          return {
            ...old,
            items: old.items.map((f) => {
              if (f.id !== featureId) return f
              const voted = !f.hasVoted
              return {
                ...f,
                hasVoted: voted,
                voteCount: f.voteCount + (voted ? 1 : -1),
              }
            }),
          }
        },
      )

      return { snapshots }
    },

    onError: (_err, _featureId, context) => {
      // Roll back
      if (context?.snapshots) {
        for (const [queryKey, data] of context.snapshots) {
          queryClient.setQueryData(queryKey, data)
        }
      }
      toast.error('Vote failed. Please try again.')
    },

    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.features.all })
    },
  })
}

// Re-export so consumers can import from one place
export { type FeaturesFilters }
