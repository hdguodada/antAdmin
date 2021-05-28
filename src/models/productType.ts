import { useState, useCallback } from 'react';
import { queryTreeProductTypes } from '@/services/Bas';
import { transformTreeData } from '@/utils/utils';
import type { DataNode } from 'antd/lib/tree';

export default () => {
  const [tree, setTree] = useState<BAS.ProductType[]>([]);
  const [treeDataSimpleMode, setTreeDataSimpleMode] = useState<DataNode[]>();
  const [leafCanClickTreeData, setLeafCanClickTreeData] = useState<DataNode[]>();
  const query = useCallback(async (data = { pageNumer: -1 }, headers = { modId: '92' }) => {
    const response = await queryTreeProductTypes(data, headers);
    setTreeDataSimpleMode(transformTreeData(response.data, 'attrList'));
    setLeafCanClickTreeData(
      transformTreeData(response.data, 'attrList', undefined, undefined, undefined, true)[0]
        .children,
    );
    setTree(response.data);
    return response;
  }, []);
  return {
    tree,
    treeDataSimpleMode,
    leafCanClickTreeData,
    query,
  };
};
