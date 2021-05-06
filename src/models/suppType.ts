import { useState, useCallback } from 'react';
import { querySuppType, querySuppTypeTree } from '@/services/Bas';

export default () => {
  const [list, setList] = useState<BAS.SuppType[]>([]);
  const [tree, setTree] = useState<BAS.SuppType[]>([]);
  const [options, setOptions] = useState<SelectOptions>([]);
  const [treeDataSimpleMode, setTreeDataSimpleMode] = useState<TreeData>([]);
  const query = useCallback(async (data = { pageNumer: -1 }, headers = { modId: '92' }) => {
    const response = await querySuppType(data, headers);
    setList(response.data.rows);
    setOptions(response.data.rows.map((i) => ({ label: i.suppTypeName, value: i.suppTypeId })));
    setTreeDataSimpleMode(
      response.data.rows.map((i) => ({
        id: i.suppTypeId,
        value: i.suppTypeId,
        title: i.suppTypeName,
        pId: i.psuppTypeId,
      })),
    );
    return response;
  }, []);
  const queryTree = useCallback(async (data = { pageNumer: -1 }, headers = { modId: '92' }) => {
    const response = await querySuppTypeTree(data, headers);
    setTree(response.data.rows);
    return response;
  }, []);
  return {
    list,
    tree,
    options,
    treeDataSimpleMode,
    query,
    queryTree,
  };
};
