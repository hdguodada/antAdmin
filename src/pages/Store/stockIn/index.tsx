import React from 'react';
import { delPurchase, openClosePurchase, queryPurchase } from '@/services/Purchase';
import OrderTable from '@/pages/Purchase/components/OrderTable';
import { BussType } from '@/pages/Purchase/components';

export default () => {
  const url = '/bis/stockIn';
  const componentUrl = '/store/stockIn';
  return (
    <OrderTable<PUR.Purchase>
      url={url}
      checkUrl={'/bis/stockIn/check'}
      openCloseFn={openClosePurchase}
      del={delPurchase}
      queryList={queryPurchase}
      componentUrl={componentUrl}
      initSearch={{ bussType: [BussType.其他入库单, BussType.盘盈] }}
      bussType={BussType.其他入库单}
    />
  );
};
