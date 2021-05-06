import React from 'react';
import OrderTable from '@/pages/Purchase/components/OrderTable';
import { delPurchase, openClosePurchase, queryPurchase } from '../../../services/Purchase';
import { BussType, BussTypeApiUrl, BussTypeComponentUrl } from '../../Purchase/components';

export default () => {
  const url = BussTypeApiUrl.调拨单;
  const componentUrl = BussTypeComponentUrl.调拨单;

  return (
    <OrderTable<PUR.Purchase>
      url={url}
      checkUrl={'/bis/stockIn/check'}
      openCloseFn={openClosePurchase}
      del={delPurchase}
      queryList={queryPurchase}
      componentUrl={componentUrl}
      bussType={BussType.调拨单}
      dev
    />
  );
};
