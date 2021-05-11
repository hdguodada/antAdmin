/** 部门的相关store */
import { useState, useCallback } from 'react';
import { queryDepTreelist as queryTree } from '@/services/Sys/dep';
import { transformTreeData } from '@/utils/utils';
import type { DataNode } from 'antd/lib/tree';

export default () => {
  const [depTree, setDepTree] = useState<API.Dep[]>([]);
  const [treeDataSimpleMode, setTreeDataSimpleMode] = useState<DataNode[]>([]);
  const queryDepTree = useCallback(
    async (data = { pageNumer: -1, state: 1 }, headers = { modId: '92' }) => {
      const response = await queryTree(data, headers);
      setDepTree(response.data.rows);
      setTreeDataSimpleMode(transformTreeData(response.data.rows, undefined, 'depId', 'depName'));
      return response;
    },
    [],
  );
  return {
    treeDataSimpleMode,
    queryDepTree,
    depTree,
  };
};
