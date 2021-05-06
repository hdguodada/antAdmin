import type React from 'react';
import { request } from 'umi';

type Check = {
  url: string;
  data: {
    ids: React.Key[];
    checkStatus: number;
  };
  headers: { modId: string };
};
export async function check({ url, data, headers }: Check) {
  return request(url, {
    method: 'POST',
    data,
    headers,
  });
}
