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
  return (
    <NewOrderForm
      queryInfo={queryPurchaseInfo}
      bussType={BussType.其他出库单}
      add={addPurchase}
      upd={updPurchase}
      stockType={StockType.出库}
      url={BussTypeApiUrl.其他出库单}
      componentUrl={BussTypeComponentUrl.其他出库单}
    />
  );
};
