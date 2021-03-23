/** 部门的相关store */
import { useState, useCallback } from 'react';
import { queryOptions as query } from '@/services/Sys';

export default () => {
  const [options, setOptions] = useState<SelectOptions>([]);
  const queryOptions = useCallback(async () => {
    const response = await query();
    setOptions(response.data.map((i) => ({ label: i.label, value: i.id, type: i.type })));
    return response;
  }, []);
  const typeOption = (type: string): SelectOptions => {
    return options.filter((i) => i.type === type);
  };
  return {
    options,
    queryOptions,
    typeOption,
  };
};
