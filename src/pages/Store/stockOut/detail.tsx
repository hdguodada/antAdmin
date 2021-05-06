import React from 'react';
import { addPurchase, queryPurchaseInfo, updPurchase } from '@/services/Purchase';
import { BussType, NewOrderForm, StockType } from '@/pages/Purchase/components';

export default () => {
  return (
    <NewOrderForm
      queryInfo={queryPurchaseInfo}
      bussType={BussType.其他出库单}
      add={addPurchase}
      upd={updPurchase}
      stockType={StockType.出库}
      dev={true}
    />
  );
};
