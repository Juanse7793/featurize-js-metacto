export const QUERY_KEYS = {
  features: {
    all: ['features'] as const,
    list: (filters: object) => ['features', 'list', filters] as const,
    detail: (id: string) => ['features', 'detail', id] as const,
  },
}
