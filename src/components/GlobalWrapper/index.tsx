import React from 'react';
import { useModel } from 'umi';

export default (): React.ReactNode => {
  const { globalDataLoaded } = useModel('@@initialState', (model) => ({
    globalDataLoaded: model.initialState?.globalDataLoaded,
  }));
  return globalDataLoaded && <div />;
};
