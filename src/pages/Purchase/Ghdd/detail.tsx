/* eslint-disable no-console */
import React from 'react';
import { addPurchase, queryPurchaseInfo, updPurchase } from '@/services/Purchase';
import { BussType, NewOrderForm } from '../components';

export default () => {
  const url = '/bis/purcOrder';
  return (
    <NewOrderForm
      queryInfo={queryPurchaseInfo}
      bussType={BussType.采购订单}
      add={addPurchase}
      upd={updPurchase}
      url={url}
      componentUrl={url}
    />
  );
};
