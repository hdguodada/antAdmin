import ProForm, { ProFormRadio, ProFormSelect } from '@ant-design/pro-form';
import React from 'react';
import { Button, Divider, TreeSelect } from 'antd';
import { useModel } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import DepForm from '@/pages/Sys/dep/form';
import { useState } from 'react';
import { patternMsg } from './validator';
import { queryUsers } from '@/services/Sys';
import type { NamePath } from 'antd/lib/form/interface';
import { useRequest } from '@@/plugin-request/request';

export const StateForm = (
  <ProFormRadio.Group
    width="md"
    name="state"
    label="状态"
    options={[
      {
        label: '禁用',
        value: 0,
      },
      {
        label: '正常',
        value: 1,
      },
    ]}
  />
);

export const DepSelect = (props: {
  name: NamePath;
  label: string;
  showNew: boolean;
  disabled?: boolean;
}) => {
  const { treeDataSimpleMode, queryDepTree } = useModel('dep', (model) => ({
    treeDataSimpleMode: model.treeDataSimpleMode,
    queryDepTree: model.queryDepTree,
  }));
  const [modalVisit, setModalVisit] = useState(false);
  return (
    <>
      <ProForm.Item
        name={props.name}
        label={props.label}
        style={{ width: '328px' }}
        rules={patternMsg.select('')}
      >
        <TreeSelect
          showSearch
          placeholder="请选择"
          allowClear
          disabled={props.disabled}
          treeDefaultExpandAll
          treeData={treeDataSimpleMode}
          dropdownRender={(menu) => {
            return (
              <div>
                {menu}
                {props.showNew && (
                  <>
                    <Divider style={{ margin: '4px 0' }} />
                    <Button
                      style={{ margin: '4px 0' }}
                      type="ghost"
                      block
                      onClick={() => {
                        setModalVisit(true);
                      }}
                    >
                      <PlusOutlined />
                      新建部门
                    </Button>
                  </>
                )}
              </div>
            );
          }}
        />
      </ProForm.Item>
      <DepForm
        action="add"
        setVisible={setModalVisit}
        visible={modalVisit}
        refresh={queryDepTree}
      />
    </>
  );
};

type UserSelectProps = {
  name: string;
  label: string;
  disabled?: boolean;
  formRef?: any;
};
export const UserSelect = ({ name, label, disabled }: UserSelectProps) => {
  return (
    <ProFormSelect
      width="md"
      showSearch
      fieldProps={{
        optionFilterProp: 'label',
      }}
      disabled={disabled}
      name={name}
      label={label}
      request={async () => {
        const res = await queryUsers({ pageNumber: -1 });
        return res.data.rows.map((i) => ({
          label: i.realName,
          value: i.userId,
        }));
      }}
    />
  );
};

export const AccountSelect = ({ name, label, disabled }: UserSelectProps) => {
  const { query } = useModel('account', (model) => ({
    query: model.query,
  }));
  const [defaultValue, setDefaultValue] = useState<React.Key>();
  const { data, loading } = useRequest(async () => {
    const res = (await query()).data.rows;
    const options = res.map((item) => {
      if (item.isDeafult === 1) {
        setDefaultValue(item.accountId);
      }
      return {
        label: item.accountName,
        value: item.accountId,
      };
    });
    return {
      data: options,
      success: true,
    };
  });
  return !loading ? (
    <ProFormSelect
      width="md"
      showSearch
      fieldProps={{
        optionFilterProp: 'label',
      }}
      initialValue={defaultValue}
      disabled={disabled}
      name={name}
      rules={patternMsg.select('')}
      label={label}
      options={data}
    />
  ) : (
    <div />
  );
};

export const ProductTypeTreeSelect: React.FC<{
  value?: React.Key;
  onChange?: (value: React.Key) => void;
}> = ({ value, onChange }) => {
  const { treeDataSimpleMode } = useModel('productType', (model) => ({
    treeDataSimpleMode: model.treeDataSimpleMode,
  }));
  const [v, sv] = useState(value);
  return (
    <TreeSelect
      showSearch
      value={v}
      onChange={(e) => {
        sv(e);
        onChange?.(e);
      }}
      allowClear
      treeDefaultExpandAll
      treeData={treeDataSimpleMode}
    />
  );
};