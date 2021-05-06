/** 部门的相关store */
import { useState, useCallback } from 'react';
import { queryOptions as query } from '@/services/Sys';

export default () => {
  const [options, setOptions] = useState<SelectOptions>([]);
  const queryOptions = useCallback(async (data = { pageNumer: -1 }, headers = { modId: '92' }) => {
    const response = await query(data, headers);
    setOptions(response.data.map((i) => ({ label: i.label, value: i.id, type: i.type })));
    return response;
  }, []);
  const typeOption = (type: string): SelectOptions => {
    return options.filter((i) => i.type === type);
  };
  const valueEnum = (type: string) => {
    return new Map(options.filter((i) => i.type === type).map((j) => [j.value, j.label]));
  };
  return {
    options,
    queryOptions,
    typeOption,
    valueEnum,
  };
};
