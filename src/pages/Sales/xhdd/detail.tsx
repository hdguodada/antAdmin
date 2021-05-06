/* eslint-disable no-console */
import React from 'react';
import { addPurchase, queryPurchaseInfo, updPurchase } from '@/services/Purchase';
import { BussType, NewOrderForm, StockType } from '@/pages/Purchase/components';

export default () => {
  const url = '/bas/sales/xhdd';
  return (
    <NewOrderForm
      queryInfo={queryPurchaseInfo}
      bussType={BussType.销货订单}
      add={addPurchase}
      upd={updPurchase}
      url={url}
      componentUrl={url}
      stockType={StockType.出库}
    />
  );
};
