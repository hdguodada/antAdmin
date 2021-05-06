import React from 'react';
import { addPurchase, queryPurchaseInfo, updPurchase } from '@/services/Purchase';
import {
  BussType,
  BussTypeApiUrl,
  BussTypeComponentUrl,
  NewOrderForm,
  StockType,
} from '@/pages/Purchase/components';

export default () => {
  const url = BussTypeApiUrl.调拨单;
  const componentUrl = BussTypeComponentUrl.调拨单;
  return (
    <NewOrderForm
      queryInfo={queryPurchaseInfo}
      bussType={BussType.调拨单}
      add={addPurchase}
      upd={updPurchase}
      url={url}
      componentUrl={componentUrl}
      stockType={StockType.出库}
    />
  );
};
