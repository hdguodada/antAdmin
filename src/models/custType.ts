/** 部门的相关store */
import { useState, useCallback } from 'react';
import { queryCusttypes, queryCustTypeTree as queryTree } from '@/services/Bas';

export default () => {
  const [custType, setCustType] = useState<BAS.CustType[]>([]);
  const [custTypeTree, setCustTypeTree] = useState<BAS.CustType[]>([]);
  const [custTypeOptions, setCustTypeOptions] = useState<SelectOptions>([]);
  const [treeDataSimpleMode, setTreeDataSimpleMode] = useState<TreeData>([]);
  const queryCustType = useCallback(async (options) => {
    const response = await queryCusttypes(options);
    setCustType(response.data.rows);
    setCustTypeOptions(
      response.data.rows.map((i) => ({ label: i.custTypeName, value: i.custTypeId })),
    );
    setTreeDataSimpleMode(
      response.data.rows.map((i) => ({
        id: i.custTypeId,
        value: i.custTypeId,
        title: i.custTypeName,
        pId: i.pcustTypeId,
      })),
    );
    return response;
  }, []);
  const queryCustTypeTree = useCallback(async () => {
    const response = await queryTree();
    setCustTypeTree(response.data.rows);
    return response;
  }, []);
  return {
    custType,
    custTypeOptions,
    queryCustType,
    treeDataSimpleMode,
    queryCustTypeTree,
    custTypeTree,
  };
};
