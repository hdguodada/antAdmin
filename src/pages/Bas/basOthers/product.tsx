import React from 'react';
import ProCard from '@ant-design/pro-card';
import Type from '@/pages/Bas/productType';
import Attr from '@/pages/Bas/attr';
import Brand from '@/pages/Bas/brand';
import Unit from '@/pages/Bas/unit';

export default () => {
  return (
    <ProCard direction="column">
      <ProCard split={'vertical'}>
        <ProCard colSpan={12}>
          <Brand />
        </ProCard>
        <ProCard colSpan={12}>
          <Type />
        </ProCard>
      </ProCard>
      <ProCard split={'vertical'}>
        <ProCard colSpan={8}>
          <Unit />
        </ProCard>
        <ProCard colSpan={16}>
          <Attr />
        </ProCard>
      </ProCard>
    </ProCard>
  );
};
