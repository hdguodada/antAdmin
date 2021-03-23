import { useState, useCallback } from 'react';
import { queryUnit } from '@/services/Bas';

export default () => {
  const [list, setList] = useState<BAS.Unit[]>([]);
  const [options, setOptions] = useState<SelectOptions>([]);
  const query = useCallback(async (data) => {
    const response = await queryUnit(data);
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
