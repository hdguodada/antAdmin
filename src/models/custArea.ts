import { useState, useCallback } from 'react';
import { queryCustAreaTree as queryTree } from '@/services/Bas';
import { transformTreeData } from '@/utils/utils';
import type { DataNode } from 'antd/lib/tree';

export default () => {
  const [tree, setTreeList] = useState<BAS.CustArea[]>([]);
  const [treeDataSimpleMode, setTreeDataSimpleMode] = useState<DataNode[]>([]);
  const [leafCanClickTreeData, setLeafCanClickTreeData] = useState<DataNode[]>();

  const queryCustAreaTree = useCallback(
    async (data = { pageNumer: -1 }, headers = { modId: '92' }) => {
      const response = await queryTree(data, headers);
      setTreeDataSimpleMode(transformTreeData(response.data.rows));
      setLeafCanClickTreeData(
        transformTreeData(response.data.rows, 'attrList', undefined, undefined, undefined, true),
      );
      setTreeList(response.data.rows);
      return response;
    },
    [],
  );

  return {
    treeDataSimpleMode,
    queryCustAreaTree,
    leafCanClickTreeData,
    tree,
  };
};
