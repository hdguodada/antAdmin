import React from 'react';
import { BussType } from '@/pages/Purchase/components';
import { StoreForm } from '../components';
import GlobalWrapper from '@/components/GlobalWrapper';
import { PageContainer } from '@ant-design/pro-layout';
import { useLocation, useParams } from 'react-router';

export default () => {
  const { id } = useParams<{ id: string }>();
  // @ts-ignore
  const { query } = useLocation();
  return (
    <GlobalWrapper type="descriptions">
      <PageContainer content={<StoreForm id={id} query={query} bussType={BussType.其他入库单} />} />
    </GlobalWrapper>
  );
};
