/** 部门的相关store */
import { useState, useCallback } from 'react';
import { queryCustLevel as query } from '@/services/Bas';

export default () => {
  const [level, setLevel] = useState<BAS.CustLevel[]>([]);
  const [levelOptions, setLevelOptions] = useState<SelectOptions>([]);
  const queryCustLevel = useCallback(async (options) => {
    const response = await query(options);
    setLevel(response.data.rows);
    setLevelOptions(response.data.rows.map((i) => ({ label: i.levelName, value: i.levelId })));
    return response;
  }, []);
  return {
    level,
    levelOptions,
    queryCustLevel,
  };
};
