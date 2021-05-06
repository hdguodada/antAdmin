import type { SnapshotQtyProps } from '@/pages/Sales/components';
import { mapModId } from '@/utils/utils';
import { request } from 'umi';

export * from './purchase';

export async function getSnapshotQty(
  data: SnapshotQtyProps,
  headers = { modId: mapModId.store },
): Promise<InfoResponse<number>> {
  return request('/bas/store/entory/searchSnapshotQty', {
    data: {
      ...data,
      dev: true,
    },
    headers,
  });
}
