/** 部门的相关store */
import { useState, useCallback } from 'react';
import { queryCustLevel as query } from '@/services/Bas';

export default () => {
  const [level, setLevel] = useState<BAS.CustLevel[]>([]);
  const [levelOptions, setLevelOptions] = useState<SelectOptions>([]);
  const queryCustLevel = useCallback(
    async (data = { pageNumer: -1 }, headers = { modId: '92' }) => {
      const response = await query(data, headers);
      setLevel(response.data.rows);
      setLevelOptions(response.data.rows.map((i) => ({ label: i.levelName, value: i.levelId })));
      return response;
    },
    [],
  );
  return {
    level,
    levelFilter: ({ state = 1 }= {}) => level.filter((item) => item.state === state),
    levelOptions,
    queryCustLevel,
  };
};
