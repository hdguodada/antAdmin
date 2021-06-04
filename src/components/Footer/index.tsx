import React from 'react';
import { useModel, history, useRequest } from 'umi';

export default () => {
  const { queryCustAreaTree } = useModel('custArea', (models) => ({
    queryCustAreaTree: models.queryCustAreaTree,
  }));
  const { queryParams } = useModel('params', (model) => ({ queryParams: model.query }));
  const { queryProductType } = useModel('productType', (model) => ({
    queryProductType: model.query,
  }));
  const { queryDepTree } = useModel('dep', (model) => ({
    queryDepTree: model.queryDepTree,
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
  const { querySupp, queryTreeSupp } = useModel('suppType', (model) => ({
    querySupp: model.query,
    queryTreeSupp: model.queryTree,
  }));
  const { queryCustTypeTree } = useModel('custType', (model) => ({
    queryCustTypeTree: model.queryCustTypeTree,
  }));
  const { queryUserRoles } = useModel('userRole', (model) => ({
    queryUserRoles: model.queryUserRoles,
  }));
  const { queryStore } = useModel('store', (model) => ({
    queryStore: model.query,
  }));
  const { queryUsers } = useModel('user', (model) => ({
    queryUsers: model.query,
  }));
  const { queryAccount } = useModel('account', (model) => ({
    queryAccount: model.query,
  }));
  useRequest(
    async () => {
      if (history.location.pathname !== '/user/login') {
        await Promise.all([
          queryParams(),
          queryUserRoles(),
          queryOptions(),
          queryDepTree(),
          queryBrand(),
          queryUnit(),
          queryAttr(),
          queryUsers(),
        ]);
        await Promise.all([
          queryTreeSupp(),
          queryCustAreaTree(),
          queryCustTypeTree(),
          queryProductType(),
          queryCustLevel(),
          querySupp(),
          queryStore(),
          queryAccount(),
        ]);
      }
      return {
        data: undefined,
        success: true,
      };
    },
    {
      onSuccess() {
        setInitialState({
          ...initialState,
          globalDataLoaded: true,
        });
      },
    },
  );
  // useEffect(() => {
  //   if (history.location.pathname !== '/user/login') {
  //     Promise.all([
  //       queryBrand(),
  //       queryUnit(),
  //       queryAttr(),
  //       queryProductType(),
  //       queryOptions(),
  //       queryDepTree(),
  //       queryCustLevel(),
  //       querySupp(),
  //     ]).then(() => {
  //       Promise.all([
  //         queryTreeSupp(),
  //         queryCustAreaTree(),
  //         queryCustArea(),
  //         queryCustTypeTree(),
  //         queryCustType(),
  //       ]).then(() => {
  //         setInitialState({
  //           ...initialState,
  //           globalDataLoaded: true,
  //         });
  //       });
  //     });
  //   }
  // }, []);
  return <div />;
};
