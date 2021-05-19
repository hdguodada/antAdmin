/* eslint-disable no-console */
import React from 'react';
import { BussType, StockType } from '@/pages/Purchase/components';
import { XhForm } from '../components';

export default () => {
  return <XhForm bussType={BussType.销售单} stockType={StockType.出库} dev="xsdj" />;
};
