import React from 'react';
import { BussType } from '@/pages/Purchase/components';
import { StoreForm } from '../components';
import GlobalWrapper from '@/components/GlobalWrapper';
import { useParams, useLocation } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';

export default () => {
  const { id } = useParams<{ id: string }>();
  // @ts-ignore
  const { query } = useLocation();
  return (
    <GlobalWrapper type="descriptions">
      <PageContainer
        title={false}
        content={<StoreForm id={id} query={query} bussType={BussType.其他出库单} />}
      />
    </GlobalWrapper>
  );
};
