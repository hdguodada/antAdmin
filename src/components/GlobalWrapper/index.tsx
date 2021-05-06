import React from 'react';
import { useModel } from 'umi';
import Skeleton from '@ant-design/pro-skeleton';

const GlobalWrapper: React.FC<{ type: 'list' | 'result' | 'descriptions' }> = ({
  children,
  type,
}) => {
  const { globalDataLoaded } = useModel('@@initialState', (model) => ({
    globalDataLoaded: model.initialState?.globalDataLoaded,
  }));
  return globalDataLoaded ? <div>{children}</div> : <Skeleton type={type} />;
};

export default GlobalWrapper;
