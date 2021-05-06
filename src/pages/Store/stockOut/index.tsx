import React from 'react';
import { delPurchase, openClosePurchase, queryPurchase } from '@/services/Purchase';
import OrderTable from '@/pages/Purchase/components/OrderTable';
import { BussType, BussTypeApiUrl, BussTypeComponentUrl } from '@/pages/Purchase/components';

export default () => {
  const url = BussTypeApiUrl.其他出库单;
  const componentUrl = BussTypeComponentUrl.其他出库单;
  return (
    <OrderTable<PUR.Purchase>
      url={url}
      checkUrl={'/bis/stockOut/check'}
      openCloseFn={openClosePurchase}
      del={delPurchase}
      queryList={queryPurchase}
      componentUrl={componentUrl}
      bussType={BussType.其他出库单}
      dev
    />
  );
};
