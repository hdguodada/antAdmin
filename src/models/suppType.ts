import { useState, useCallback } from 'react';
import { querySuppType, querySuppTypeTree } from '@/services/Bas';
import { transformTreeData } from '@/utils/utils';
import type { DataNode } from 'antd/lib/tree';

export default () => {
  const [list, setList] = useState<BAS.SuppType[]>([]);
  const [tree, setTree] = useState<BAS.SuppType[]>([]);
  const [options, setOptions] = useState<SelectOptions>([]);
  const [valueEnum, setValueEnum] = useState<Map<K, string>>();

  const [treeDataSimpleMode, setTreeDataSimpleMode] = useState<DataNode[]>([]);
  const [leafCanClickTreeData, setLeafCanClickTreeData] = useState<DataNode[]>();

  const query = useCallback(async (data = { pageNumer: -1 }, headers = { modId: '92' }) => {
    const response = await querySuppType(data, headers);
    setList(response.data.rows);
    setValueEnum(new Map(response.data.rows.map((i) => [i.suppTypeId, i.suppTypeName])));
    setOptions(response.data.rows.map((i) => ({ label: i.suppTypeName, value: i.suppTypeId })));
    return response;
  }, []);
  const queryTree = useCallback(async (data = { pageNumer: -1 }, headers = { modId: '92' }) => {
    const response = await querySuppTypeTree(data, headers);
    setTree(response.data.rows);

    setTreeDataSimpleMode(transformTreeData(response.data.rows));
    setLeafCanClickTreeData(
      transformTreeData(response.data.rows, undefined, undefined, undefined, undefined, true),
    );
    return response;
  }, []);
  return {
    list,
    tree,
    options,
    treeDataSimpleMode,
    query,
    queryTree,
    valueEnum,
    leafCanClickTreeData,
  };
};
