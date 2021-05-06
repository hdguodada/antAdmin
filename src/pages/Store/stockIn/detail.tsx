import React from 'react';
import { addPurchase, queryPurchaseInfo, updPurchase } from '@/services/Purchase';
import { BussType, NewOrderForm } from '@/pages/Purchase/components';

export default () => {
  const url = '/bis/stockIn';
  const componentUrl = '/store/stockIn';
  return (
    <NewOrderForm
      queryInfo={queryPurchaseInfo}
      bussType={BussType.其他入库单}
      add={addPurchase}
      upd={updPurchase}
      url={url}
      componentUrl={componentUrl}
    />
  );
};
