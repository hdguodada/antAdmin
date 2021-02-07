/** 部门的相关store */
import { useState, useCallback } from 'react';
import { queryUserTypes as query } from '@/services/Sys/user';

export default () => {
  const [userTypeList, setUserTypeList] = useState<API.UserRole[]>([]);
  const queryUserTypes = useCallback(async (options) => {
    const response = (await query(options))
    setUserTypeList(response.data.rows);
    return response
  }, []);

  return {
    userTypeList,
    queryUserTypes,
  };
};
