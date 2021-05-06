import React from 'react';
import { addPurchase, queryPurchaseInfo, updPurchase } from '@/services/Purchase';
import { BussType, NewOrderForm } from '../components';

export default () => {
  const url = '/bis/purchase';
  return (
    <NewOrderForm
      queryInfo={queryPurchaseInfo}
      bussType={BussType.购货单}
      add={addPurchase}
      upd={updPurchase}
      url={url}
      componentUrl={url}
    />
  );
};
