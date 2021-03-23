import { useState, useCallback } from 'react';
import { queryAttr } from '@/services/Bas';

export default () => {
  const [list, setList] = useState<BAS.Attr[]>([]);
  const [options, setOptions] = useState<SelectOptions>([]);
  const query = useCallback(async (data) => {
    const response = await queryAttr(data);
    setList(response.data);
    setOptions(response.data.map((i) => ({ label: i.attrName, value: i.attrId })));
    return response;
  }, []);
  return {
    list,
    options,
    query,
  };
};
