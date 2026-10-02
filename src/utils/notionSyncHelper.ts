import { CompetitionReviewItem } from '../types';

export interface NotionSyncResponse {
  success: boolean;
  review?: CompetitionReviewItem;
  blockCount?: number;
  syncedAt?: string;
  version?: number;
  error?: string;
}

export async function syncNotionReviewFromServer(): Promise<NotionSyncResponse> {
  try {
    const res = await fetch('/api/notion/sync-review', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`Sync request failed with status: ${res.status}`);
    }

    const data: NotionSyncResponse = await res.json();
    return data;
  } catch (err: any) {
    console.warn('[NotionSync] Server sync failed, returning error:', err);
    return {
      success: false,
      error: err?.message || 'Failed to sync with Notion server endpoint',
    };
  }
}
