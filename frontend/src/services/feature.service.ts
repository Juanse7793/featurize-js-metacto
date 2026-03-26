import api from "@/lib/axios";
import type { Feature, PaginatedResponse } from "@/types";

export interface FeaturesFilters {
  status?: string;
  sort?: "top" | "new";
  page?: number;
  page_size?: number;
}

export const featureService = {
  async getFeatures(
    filters: FeaturesFilters = {},
  ): Promise<PaginatedResponse<Feature>> {
    const { data } = await api.get<PaginatedResponse<Feature>>("/features/", {
      params: filters,
    });
    return data;
  },

  async createFeature(title: string, description: string): Promise<Feature> {
    const { data } = await api.post<Feature>("/features/", {
      title,
      description,
    });
    return data;
  },

  async toggleVote(
    featureId: string,
  ): Promise<{ voted: boolean; vote_count: number }> {
    const { data } = await api.post<{ voted: boolean; vote_count: number }>(
      `/features/${featureId}/vote`,
    );
    return data;
  },

  async updateStatus(featureId: string, status: string): Promise<Feature> {
    const { data } = await api.patch<Feature>(`/features/${featureId}/status`, {
      status,
    });
    return data;
  },
};
