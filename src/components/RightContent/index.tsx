import { Tag, Space, Button, message } from 'antd';
import React from 'react';
import { useModel, SelectLang } from 'umi';
import Avatar from './AvatarDropdown';
import HeaderSearch from '../HeaderSearch';
import styles from './index.less';
import { history } from 'umi';
import { useRequest } from 'umi';
import lodash from 'lodash';

export type SiderTheme = 'light' | 'dark';

const GlobalHeaderRight: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { run, data } = useRequest<InfoResponse<{ id: string; name: string; type: number }[]>>(
    (params) => {
      return {
        url: '/bas/supplier/getContacter',
        data: params,
        method: 'POST',
      };
    },
    {
      manual: true,
      onSuccess: (v) => {
        if (lodash.isEmpty(v)) {
          message.error('无相应内容');
        }
      },
    },
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
        placeholder="请输入关键词或者编号按回车搜索"
        options={data?.map((item) => ({
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
          value: item.name,
        }))}
        onSearch={async (value) => {
          await run({
            keyword: value,
          });
        }}
      />
      <Avatar />
      <SelectLang className={styles.action} />
    </Space>
  );
};
export default GlobalHeaderRight;
