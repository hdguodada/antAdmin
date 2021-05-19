/* eslint-disable no-console */
import React from 'react';
import { delPurchase, queryPurchase } from '@/services/Purchase';
import OrderTable from '@/pages/Purchase/components/OrderTable';
import { BussType } from '../components';
import GlobalWrapper from '@/components/GlobalWrapper';

export default () => {
  const url = '/bis/purchase';
  return (
    <GlobalWrapper type="list">
      <OrderTable<PUR.Purchase>
        url={url}
        componentUrl={url}
        checkUrl={`${url}/check`}
        openCloseFn={() => {}}
        del={delPurchase}
        queryList={queryPurchase}
        bussType={BussType.采购单}
      />
    </GlobalWrapper>
  );
};
