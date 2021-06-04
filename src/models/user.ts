import { useState, useCallback } from 'react';
import { queryUsers } from '@/services/Sys';

export default () => {
  const [list, setList] = useState<SYS.CurrentUser[]>([]);
  const [options, setOptions] = useState<SelectOptions>([]);
  const [valueEnum, setValueEnum] = useState<Map<React.Key, string>>();
  const query = useCallback(
    async (data = { pageNumer: -1, state: 1 }, headers = { modId: '92' }) => {
      const response = await queryUsers(data, headers);
      setList(response.data.rows);
      setOptions(response.data.rows.map((i) => ({ label: i.realName, value: i.userId })));
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
