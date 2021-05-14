import { useState, useCallback } from 'react';
import { queryAccount } from '@/services/Bas/account';

export default () => {
  const [list, setList] = useState<BAS.Account[]>([]);
  const [options, setOptions] = useState<SelectOptions>([]);
  const [valueEnum, setValueEnum] = useState<Map<React.Key, string>>();
  const query = useCallback(async (data = { pageNumer: -1 }, headers = { modId: '92' }) => {
    const response = await queryAccount(data, headers);
    setList(response.data.rows);
    setValueEnum(new Map(response.data.rows.map((i) => [i.accountId, i.accountName])));
    setOptions(response.data.rows.map((i) => ({ label: i.accountName, value: i.accountId })));
    return response;
  }, []);
  return {
    list,
    options,
    query,
    valueEnum,
  };
};
