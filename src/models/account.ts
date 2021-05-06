import { useState, useCallback } from 'react';
import { queryAccount } from '@/services/Bas/account';

export default () => {
  const [list, setList] = useState<BAS.Account[]>([]);
  const [options, setOptions] = useState<SelectOptions>([]);
  const query = useCallback(async (data = { pageNumer: -1 }, headers = { modId: '92' }) => {
    const response = await queryAccount(data, headers);
    setList(response.data.rows);
    setOptions(response.data.rows.map((i) => ({ label: i.accountName, value: i.accountId })));
    return response;
  }, []);
  return {
    list,
    options,
    query,
  };
};
