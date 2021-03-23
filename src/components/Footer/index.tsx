import React, { useEffect } from 'react';
import { useModel, history } from 'umi';

export default () => {
  const { queryCustArea } = useModel('custArea');
  const { queryProductType } = useModel('productType', (model) => ({
    queryProductType: model.query,
  }));
  const { queryDepList } = useModel('dep', (model) => ({
    queryDepList: model.queryDepList,
  }));
  const { queryBrand } = useModel('brand', (model) => ({
    queryBrand: model.query,
  }));
  const { queryUnit } = useModel('unit', (model) => ({
    queryUnit: model.query,
  }));
  const { queryAttr } = useModel('attr', (model) => ({
    queryAttr: model.query,
  }));
  const { queryOptions } = useModel('options', (model) => ({
    queryOptions: model.queryOptions,
  }));
  const { queryCustLevel } = useModel('custLevel', (model) => ({
    queryCustLevel: model.queryCustLevel,
  }));
  const { setInitialState, initialState } = useModel('@@initialState', (model) => ({
    setInitialState: model.setInitialState,
    initialState: model.initialState,
  }));

  const { queryStore } = useModel('store', (model) => ({
    queryStore: model.query,
  }));
  useEffect(() => {
    if (history.location.pathname !== '/user/login') {
      Promise.all([
        queryCustArea({ pageNumber: -1 }),
        queryBrand({ pageNumber: -1 }),
        queryUnit({ pageNumber: -1 }),
        queryAttr({ pageNumber: -1 }),
        queryProductType({ pageNumber: -1 }),
        queryOptions(),
        queryDepList({ pageNumber: -1 }),
        queryCustLevel({ pageNumber: -1 }),
        queryStore({ pageNumber: -1 }),
      ]).then(() => {
        setInitialState({
          ...initialState,
          globalDataLoaded: true,
        });
      });
    }
  }, [
    queryOptions,
    queryCustArea,
    queryProductType,
    queryBrand,
    queryUnit,
    queryAttr,
    queryCustLevel,
    setInitialState,
    queryDepList,
    initialState,
    queryStore,
  ]);
  return <div />;
};
