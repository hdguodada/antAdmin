import { useState, useCallback } from 'react';
import { queryUsers } from '@/services/Sys';
import type { SelectProps } from 'antd/lib/select';

export default () => {
  const [list, setList] = useState<SYS.CurrentUser[]>([]);
  const [options, setOptions] = useState<SelectProps<any>['options']>([]);
  const [valueEnum, setValueEnum] = useState<Map<React.Key, string>>();
  const query = useCallback(
    async (data = { pageNumer: -1, state: 1 }, headers = { modId: '92' }) => {
      const response = await queryUsers(data, headers);
      setList(response.data.rows);
      setOptions(
        response.data.rows.map((i) => ({ label: i.realName, value: i.userId, depId: i.depId })),
      );
      setValueEnum(new Map(response.data.rows.map((i) => [i.userId, i.realName])));
      return response;
    },
    [],
  );
  return {
    list,
    options,
    query,
    valueEnum,
  };
};
