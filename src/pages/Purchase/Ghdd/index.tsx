import React from 'react';
import { delPurchase, openClosePurchase, queryPurchase } from '@/services/Purchase';

import OrderTable from '@/pages/Purchase/components/OrderTable';
import { BussType } from '../components';
import GlobalWrapper from '@/components/GlobalWrapper';

export default () => {
  const url = '/bis/purcOrder';
  return (
    <GlobalWrapper type="list">
      <OrderTable<PUR.Purchase>
        url={url}
        checkUrl={`${url}/check`}
        componentUrl={url}
        openCloseFn={openClosePurchase}
        del={delPurchase}
        queryList={queryPurchase}
        bussType={BussType.采购订单}
      />
    </GlobalWrapper>
  );
};
