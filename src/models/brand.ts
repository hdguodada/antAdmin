import { useState, useCallback } from 'react';
import { queryBrands } from '@/services/Bas';

export default () => {
  const [list, setList] = useState<BAS.Brand[]>([]);
  const [options, setOptions] = useState<SelectOptions>([]);
  const query = useCallback(async (data) => {
    const response = await queryBrands(data);
    setList(response.data.rows);
    setOptions(response.data.rows.map((i) => ({ label: i.brandName, value: i.brandId })));

    return response;
  }, []);
  return {
    list,
    options,
    query,
  };
};
