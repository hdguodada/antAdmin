import GlobalWrapper from '@/components/GlobalWrapper';
import { BussType } from '@/pages/Purchase/components';
import React from 'react';
import { FundsForm } from '../components';

export default function OriDetail() {
  return (
    <GlobalWrapper type="list">
      <FundsForm bussType={BussType.付款单} />
    </GlobalWrapper>
  );
}
