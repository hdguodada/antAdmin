import React from 'react';
import { queryPurchase } from '@/services/Purchase';
import OrderTable from '@/pages/Purchase/components/OrderTable';
import { BussType, BussTypeApiUrl, BussTypeComponentUrl } from '@/pages/Purchase/components';
import GlobalWrapper from '@/components/GlobalWrapper';

export default () => {
  const url = BussTypeApiUrl.采购退货单;
  const componentUrl = BussTypeComponentUrl.采购退货单;

  return (
    <GlobalWrapper type="list">
      <OrderTable<PUR.Purchase>
        url={url}
        componentUrl={componentUrl}
        checkUrl={`${url}/check`}
        openCloseFn={() => {}}
        del={async () => {}}
        queryList={queryPurchase}
        bussType={BussType.采购退货单}
      />
    </GlobalWrapper>
  );
};
