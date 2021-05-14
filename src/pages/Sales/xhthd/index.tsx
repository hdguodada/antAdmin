import React from 'react';
import OrderTable from '@/pages/Purchase/components/OrderTable';
import { queryPurchase } from '@/services/Purchase';
import { BussType } from '@/pages/Purchase/components';

export default () => {
  const url = '/bas/sales/xhd';
  const componentUrl = '/sales/xhd';
  return (
    <OrderTable<PUR.Purchase>
      url={url}
      componentUrl={componentUrl}
      checkUrl={''}
      openCloseFn={() => {}}
      del={async () => {}}
      bussType={BussType.销售订单}
      dev={'bas'}
      queryList={queryPurchase}
    />
  );
};
