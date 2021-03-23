/** 部门的相关store */
import { useState, useCallback } from 'react';
import { queryUserRoles as query } from '@/services/Sys/user';

export default () => {
  const [userRoleList, setUserRoleList] = useState<API.UserRole[]>([]);
  const [userRoleOptions, setUserRoleOptions] = useState<SelectOptions>([]);
  const queryUserRoles = useCallback(async (options) => {
    const response = await query(options);
    setUserRoleList(response.data.rows);
    setUserRoleOptions(response.data.rows.map((i) => ({ label: i.roleName, value: i.roleId })));
    return response;
  }, []);

  return {
    userRoleOptions,
    userRoleList,
    queryUserRoles,
  };
};
