import React from 'react';
import { addPurchase, queryPurchaseInfo, updPurchase } from '@/services/Purchase';
import {
  BussType,
  BussTypeApiUrl,
  BussTypeComponentUrl,
  PurchaseForm,
  StockType,
} from '../components';

export default () => {
  return (
    <PurchaseForm
      queryInfo={queryPurchaseInfo}
      bussType={BussType.采购退货单}
      url={BussTypeApiUrl.采购退货单}
      componentUrl={BussTypeComponentUrl.采购退货单}
      add={addPurchase}
      upd={updPurchase}
      stockType={StockType.出库}
    />
  );
};
