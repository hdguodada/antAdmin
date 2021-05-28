import { Tag, Space, Button } from 'antd';
import React from 'react';
import { useModel, SelectLang } from 'umi';
import Avatar from './AvatarDropdown';
import HeaderSearch from '../HeaderSearch';
import styles from './index.less';
import { history } from 'umi';
import { useRequest } from 'umi';

export type SiderTheme = 'light' | 'dark';

const GlobalHeaderRight: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { run, data } = useRequest<RowResponse<{ id: string; name: string; type: number }>>(
    (params) => {
      return {
        url: '/bas/quickGo',
        data: { dev: 'bas' },
        params,
      };
    },
    { manual: true },
  );
  if (!initialState || !initialState.settings) {
    return null;
  }

  const { navTheme, layout } = initialState.settings;
  let className = styles.right;

  if ((navTheme === 'dark' && layout === 'top') || layout === 'mix') {
    className = `${styles.right}  ${styles.dark}`;
  }

  return (
    <Space className={className}>
      <HeaderSearch
        className={`${styles.action} ${styles.search}`}
        placeholder="站内搜索"
        options={data?.rows.map((item) => ({
          label: (
            <Button
              type="link"
              onClick={() => {
                const url =
                  item.type === 1 ? `/bas/customer/${item.id}` : `/bas/supplier/${item.id}`;
                history.push(url);
              }}
            >
              {item.name} -- <Tag>{item.type === 1 ? '客户' : '供应商'}</Tag>
            </Button>
          ),
          value: item.id,
        }))}
        onSearch={async (value) => {
          await run({
            keyword: value,
          });
        }}
      />
      {/* <HeaderDropdown
        overlay={
          <Menu>
            <Menu.Item
              onClick={() => {
                window.open('/~docs');
              }}
            >
              组件文档
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                window.open('https://pro.ant.design/docs/getting-started');
              }}
            >
              Ant Design Pro 文档
            </Menu.Item>
          </Menu>
        }
      >
        <span className={styles.action}>
          <QuestionCircleOutlined />
        </span>
      </HeaderDropdown> */}
      <Avatar />
      <SelectLang className={styles.action} />
    </Space>
  );
};
export default GlobalHeaderRight;
