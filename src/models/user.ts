import { useState, useCallback } from 'react';
import { queryUsers } from '@/services/Sys';

export default () => {
  const [list, setList] = useState<API.CurrentUser[]>([]);
  const [options, setOptions] = useState<SelectOptions>([]);
  const query = useCallback(
    async (data = { pageNumer: -1, state: 1 }, headers = { modId: '92' }) => {
      const response = await queryUsers(data, headers);
      setList(response.data.rows);
      setOptions(response.data.rows.map((i) => ({ label: i.realName, value: i.userId })));
      return response;
    },
    [],
  );
  return {
    list,
    options,
    query,
  };
};
