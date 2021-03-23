/** 部门的相关store */
import { useState, useCallback } from 'react';
import { queryDepList as query } from '@/services/Sys/dep';

export default () => {
  const [depList, setDepList] = useState<API.Dep[]>([]);
  const [treeDataSimpleMode, setTreeDataSimpleMode] = useState<TreeData>([]);
  const queryDepList = useCallback(async (options) => {
    const response = await query(options);
    setDepList(response.data.rows);
    setTreeDataSimpleMode(
      response.data.rows.map((i) => ({
        id: i.depId,
        value: i.depId,
        title: i.depName,
        pId: i.pDepId,
        disabled: options.disabled?.indexOf(String(i.depId)) > -1,
      })),
    );
    return response;
  }, []);

  return {
    depList,
    queryDepList,
    treeDataSimpleMode,
  };
};
