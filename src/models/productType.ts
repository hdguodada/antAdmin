import { useState, useCallback } from 'react';
import { queryTreeProductTypes } from '@/services/Bas';
import { transformTreeData } from '@/utils/utils';

export default () => {
  const [tree, setTree] = useState<BAS.ProductType[]>([]);
  const [treeDataSimpleMode, setTreeDataSimpleMode] = useState<any[]>();
  const query = useCallback(async (data) => {
    const response = await queryTreeProductTypes(data);
    setTreeDataSimpleMode(transformTreeData(response.data, 'attrList'));
    setTree(response.data);
    return response;
  }, []);
  return {
    tree,
    treeDataSimpleMode,
    query,
  };
};
