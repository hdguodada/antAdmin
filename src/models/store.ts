import { useState, useCallback } from 'react';
import { queryStore } from '@/services/Bas';

export default () => {
  const [list, setList] = useState<BAS.Store[]>([]);
  const [options, setOptions] = useState<SelectOptions>([]);
  const query = useCallback(async (data) => {
    const response = await queryStore(data);
    setList(response.data.rows);
    setOptions(response.data.rows.map((i) => ({ label: i.storeName, value: i.storeCd })));
    return response;
  }, []);

  return {
    list,
    options,
    query,
  };
};
