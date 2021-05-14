/* eslint-disable no-console */
import React from 'react';
import { addPurchase, queryPurchaseInfo, updPurchase } from '@/services/Purchase';
import { BussType, StockType } from '@/pages/Purchase/components';
import { XhForm } from '../components';
import GlobalWrapper from '@/components/GlobalWrapper';

export default () => {
  return (
    <GlobalWrapper type="descriptions">
      <XhForm
        queryInfo={queryPurchaseInfo}
        bussType={BussType.销售订单}
        add={addPurchase}
        upd={updPurchase}
        stockType={StockType.入库}
        dev={'xh'}
      />
    </GlobalWrapper>
  );
};
