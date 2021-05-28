import { useState, useCallback } from 'react';
import { queryCustTypeTree as queryTree } from '@/services/Bas';
import { transformTreeData } from '@/utils/utils';
import type { DataNode } from 'antd/lib/tree';

export default () => {
  const [custTypeTree, setCustTypeTree] = useState<BAS.CustType[]>([]);
  const [treeDataSimpleMode, setTreeDataSimpleMode] = useState<DataNode[]>([]);
  const [leafCanClickTreeData, setLeafCanClickTreeData] = useState<DataNode[]>();

  const queryCustTypeTree = useCallback(
    async (data = { pageNumer: -1 }, headers = { modId: '92' }) => {
      const response = await queryTree(data, headers);
      setTreeDataSimpleMode(transformTreeData(response.data.rows));
      setLeafCanClickTreeData(
        transformTreeData(response.data.rows, 'attrList', undefined, undefined, undefined, true),
      );
      setCustTypeTree(response.data.rows);
      return response;
    },
    [],
  );
  return {
    treeDataSimpleMode,
    queryCustTypeTree,
    custTypeTree,
    leafCanClickTreeData,
  };
};
