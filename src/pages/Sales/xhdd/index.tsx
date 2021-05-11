import React from 'react';
import OrderTable from '@/pages/Purchase/components/OrderTable';
import { queryPurchase } from '@/services/Purchase';
import { BussType } from '@/pages/Purchase/components';

export default () => {
  const url = '/bas/sales/xhdd';
  const componentUrl = '/sales/xhdd';
  return (
    <OrderTable<PUR.Purchase>
      url={url}
      componentUrl={componentUrl}
      checkUrl={''}
      openCloseFn={() => {}}
      del={async () => {}}
      dev={'bas'}
      queryList={queryPurchase}
      bussType={BussType.销货订单}
    />
  );
};
