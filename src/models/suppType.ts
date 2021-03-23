import { useState, useCallback } from 'react';
import { querySuppType, querySuppTypeTree, addSuppType } from '@/services/Bas';

export default () => {
  const [list, setList] = useState<BAS.SuppType[]>([]);
  const [tree, setTree] = useState<BAS.SuppType[]>([]);
  const [options, setOptions] = useState<SelectOptions>([]);
  const [treeDataSimpleMode, setTreeDataSimpleMode] = useState<TreeData>([]);
  const query = useCallback(async (data) => {
    const response = await querySuppType(data);
    console.log(response);
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
  const add = useCallback(
    async (data) => {
      await addSuppType(data);
      await query({ pageNumber: -1 });
    },
    [query],
  );
  const queryTree = useCallback(async () => {
    const response = await querySuppTypeTree();
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
    add,
  };
};
