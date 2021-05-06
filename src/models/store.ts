import { useState, useCallback } from 'react';
import { queryStore } from '@/services/Bas';

export default () => {
  const [list, setList] = useState<BAS.Store[]>([]);
  const [options, setOptions] = useState<SelectOptions>([]);
  const [valueEnum, setValueEnum] = useState<Map<string, string>>();
  const query = useCallback(async (data = { pageNumer: -1 }, headers = { modId: '92' }) => {
    const response = await queryStore(data, headers);
    setList(response.data.rows);
    setOptions(response.data.rows.map((i) => ({ label: i.storeName, value: i.storeCd })));
    setValueEnum(new Map(response.data.rows.map((i) => [i.storeCd, i.storeName])));
    return response;
  }, []);

  return {
    list,
    options,
    query,
    valueEnum,
  };
};
