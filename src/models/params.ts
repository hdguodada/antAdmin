/** 系统参数 */
import { useState, useCallback } from 'react';
import { queryParams } from '@/services/Sys';

export default () => {
  const [sysParams, setSysParams] = useState<SYS.SysParams>();
  const query = useCallback(async (data = { pageNumer: -1 }, headers = { modId: '92' }) => {
    const response = await queryParams(data, headers);
    setSysParams(response.data);
    return response;
  }, []);

  return {
    query,
    sysParams,
  };
};
