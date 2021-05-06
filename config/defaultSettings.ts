import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'dark',
  primaryColor: '#13C2C2',
  layout: 'side',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  title: '全释爱',
  pwa: false,
  iconfontUrl: '',
  menu: {
    locale: true,
  },
  headerHeight: 48,
};

export default Settings;
