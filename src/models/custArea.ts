import { useState, useCallback } from 'react';
import { queryCustArea as query, queryCustAreaTree as queryTree } from '@/services/Bas';

export default () => {
  const [list, setList] = useState<BAS.CustArea[]>([]);
  const [tree, setTreeList] = useState<BAS.CustArea[]>([]);
  const [treeDataSimpleMode, setTreeDataSimpleMode] = useState<TreeData>([]);
  const queryCustArea = useCallback(async (data = { pageNumer: -1 }, headers = { modId: '92' }) => {
    const response = await query(data, headers);
    setList(response.data.rows);
    setTreeDataSimpleMode(
      response.data.rows.map((i) => ({
        id: i.areaId,
        value: i.areaId,
        title: i.areaName,
        pId: i.pareaId,
      })),
    );
    return response;
  }, []);
  const queryCustAreaTree = useCallback(
    async (data = { pageNumer: -1 }, headers = { modId: '92' }) => {
      const response = await queryTree(data, headers);
      setTreeList(response.data.rows);
      return response;
    },
    [],
  );

  return {
    list,
    queryCustArea,
    treeDataSimpleMode,
    queryCustAreaTree,
    tree,
  };
};
