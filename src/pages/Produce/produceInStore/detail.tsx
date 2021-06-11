import React from 'react';
import { BussType } from '@/pages/Purchase/components';
import { ProduceForm } from '../components';
import GlobalWrapper from '@/components/GlobalWrapper';
import { PageContainer } from '@ant-design/pro-layout';
import { useParams } from 'react-router';

export default () => {
  const { id } = useParams<{ id: string }>();
  return (
    <GlobalWrapper type="descriptions">
      <PageContainer content={<ProduceForm id={id} bussType={BussType.生产入库} />} />
    </GlobalWrapper>
  );
};
