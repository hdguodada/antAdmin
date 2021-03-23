import { useState, useCallback } from 'react';
import { queryCustArea as query, queryCustAreaTree as queryTree } from '@/services/Bas';

export default () => {
  const [list, setList] = useState<BAS.CustArea[]>([]);
  const [tree, setTreeList] = useState<BAS.CustArea[]>([]);
  const [treeDataSimpleMode, setTreeDataSimpleMode] = useState<TreeData>([]);
  const queryCustArea = useCallback(async (options) => {
    const response = await query(options);
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
  const queryCustAreaTree = useCallback(async (options) => {
    const response = await queryTree(options);
    setTreeList(response.data.rows);
    return response;
  }, []);

  return {
    list,
    queryCustArea,
    treeDataSimpleMode,
    queryCustAreaTree,
    tree,
  };
};
