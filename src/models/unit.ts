import { useState, useCallback } from 'react';
import { queryUnit } from '@/services/Bas';

export default () => {
  const [list, setList] = useState<BAS.Unit[]>([]);
  const [options, setOptions] = useState<SelectOptions>([]);
  const query = useCallback(async (data = { pageNumer: -1 }, headers = { modId: '92' }) => {
    const response = await queryUnit(data, headers);
    setList(response.data.rows);
    setOptions(response.data.rows.map((i) => ({ label: i.unitName, value: i.unitId })));

    return response;
  }, []);
  return {
    list,
    options,
    query,
  };
};
