/** 部门的相关store */
import { useState, useCallback } from 'react';
import { queryDepList as query } from '@/services/Sys/dep';

export default () => {
  const [depList, setDepList] = useState<API.Dep[]>([]);
  const queryDepList = useCallback(async (options) => {
    const response = (await query(options))
    setDepList(response.data.rows);
    return response
  }, []);

  return {
    depList,
    queryDepList,
  };
};
