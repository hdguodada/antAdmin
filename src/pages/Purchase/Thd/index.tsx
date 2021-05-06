import React from 'react';
import { queryPurchase } from '@/services/Purchase';
import OrderTable from '@/pages/Purchase/components/OrderTable';
import { BussType, BussTypeApiUrl, BussTypeComponentUrl } from '@/pages/Purchase/components';

export default () => {
  const url = BussTypeApiUrl.购货退货单;
  const componentUrl = BussTypeComponentUrl.购货退货单;

  return (
    <OrderTable<PUR.Purchase>
      url={url}
      componentUrl={componentUrl}
      checkUrl={`${url}/check`}
      openCloseFn={() => {}}
      del={async () => {}}
      queryList={queryPurchase}
      bussType={BussType.购货退货单}
    />
  );
};
