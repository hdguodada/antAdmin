import {
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormUploadButton,
} from '@ant-design/pro-form';
import React, { useEffect } from 'react';
import { Space, TreeSelectProps } from 'antd';
import { Button, Divider, TreeSelect } from 'antd';
import { useModel } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import DepForm from '@/pages/Sys/dep/form';
import { useState } from 'react';
import { patternMsg } from './validator';
import UserForm from '@/pages/Sys/user/form';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import type { ProFormSelectProps } from '@ant-design/pro-form/lib/components/Select';
import BrandForm from '@/pages/Bas/brand/form';
import ProductTypeForm from '@/pages/Bas/productType/form';
import StoreForm from '@/pages/Bas/store/form';
import CustTypeForm from '@/pages/Bas/custType/form';
import { history } from 'umi';
import type { UploadFile } from 'antd/lib/upload/interface';
import { upload } from '@/services/Sys';

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

interface UserSelectProps extends ProFormSelectProps {
  formRef?: any;
  showNew?: boolean;
  depId?: K;
}
export const UserSelect = (props: UserSelectProps) => {
  const { formRef, showNew, depId, ...rest } = props;
  const { options, queryUsers } = useModel('user', (model) => ({
    options: model.options,
    queryUsers: model.query,
  }));
  const [modalVisit, setModalVisit] = useState(false);

  return (
    <>
      <ProFormSelect
        width="md"
        showSearch
        fieldProps={{
          optionFilterProp: 'label',
          dropdownRender: (menu) => {
            return (
              <div>
                {menu}
                {showNew && (
                  <>
                    <Divider style={{ margin: '4px 0' }} />
                    <Button
                      type="text"
                      block
                      onClick={() => {
                        setModalVisit(true);
                      }}
                    >
                      <PlusOutlined />
                      新建职员
                    </Button>
                  </>
                )}
              </div>
            );
          },
        }}
        options={depId ? options?.filter((i) => i.depId === depId) : options}
        {...rest}
      />
      <UserForm
        action="add"
        setVisible={setModalVisit}
        visible={modalVisit}
        refresh={queryUsers}
        depId={depId}
      />
    </>
  );
};

export const AccountSelect = ({ name, label, disabled }: UserSelectProps) => {
  const { accountEnum, defaultValue } = useModel('account', (model) => ({
    accountEnum: model.valueEnum,
    defaultValue: model.defaultValue,
  }));
  return (
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
      valueEnum={accountEnum}
    />
  );
};

interface MyTreeSelectProps {
  value?: K;
  onChange?: (value: React.Key) => void;
  fieldProps?: TreeSelectProps<any>;
  showNew?: boolean;
  isLeaf?: boolean;
}

export function ProductTypeTreeSelect({ fieldProps, showNew, isLeaf, ...rest }: MyTreeSelectProps) {
  const { treeDataSimpleMode, leafCanClickTreeData } = useModel('productType', (model) => ({
    treeDataSimpleMode: model.treeDataSimpleMode,
    leafCanClickTreeData: model.leafCanClickTreeData,
  }));
  const [modalVisit, setModalVisit] = useState(false);
  return (
    <>
      <TreeSelect
        showSearch
        treeNodeFilterProp="title"
        allowClear
        treeDefaultExpandAll
        treeData={isLeaf ? leafCanClickTreeData : treeDataSimpleMode}
        dropdownRender={(menu) => {
          return (
            <div>
              {menu}
              {showNew && (
                <>
                  <Divider style={{ margin: '4px 0' }} />
                  <Button
                    type="text"
                    block
                    onClick={() => {
                      setModalVisit(true);
                    }}
                  >
                    <PlusOutlined />
                    新建产品类别
                  </Button>
                </>
              )}
            </div>
          );
        }}
        {...rest}
        {...fieldProps}
      />
      <ProductTypeForm action={'add'} visible={modalVisit} setVisible={setModalVisit} />
    </>
  );
}
export function SuppTreeSelect({ fieldProps, showNew, isLeaf, ...rest }: MyTreeSelectProps) {
  const { treeDataSimpleMode, leafCanClickTreeData } = useModel('suppType', (model) => ({
    treeDataSimpleMode: model.treeDataSimpleMode,
    leafCanClickTreeData: model.leafCanClickTreeData,
  }));
  const [modalVisit, setModalVisit] = useState(false);
  return (
    <>
      <TreeSelect
        showSearch
        placeholder="请选择"
        allowClear
        treeDefaultExpandAll
        treeData={isLeaf ? leafCanClickTreeData : treeDataSimpleMode}
        treeNodeFilterProp="title"
        dropdownRender={(menu) => (
          <div>
            {menu}
            {showNew && (
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
                  新建供应商类别
                </Button>
              </>
            )}
          </div>
        )}
        {...fieldProps}
        {...rest}
      />
      <ProductTypeForm action={'add'} visible={modalVisit} setVisible={setModalVisit} />
    </>
  );
}
export function CustTypeSelect({ fieldProps, showNew, isLeaf, ...rest }: MyTreeSelectProps) {
  const { treeDataSimpleMode, leafCanClickTreeData } = useModel('custType', (model) => ({
    treeDataSimpleMode: model.treeDataSimpleMode,
    leafCanClickTreeData: model.leafCanClickTreeData,
  }));
  const [modalVisit, setModalVisit] = useState(false);
  return (
    <>
      <TreeSelect
        showSearch
        placeholder="请选择"
        allowClear
        treeDefaultExpandAll
        treeData={isLeaf ? leafCanClickTreeData : treeDataSimpleMode}
        treeNodeFilterProp="title"
        dropdownRender={(menu) => (
          <div>
            {menu}
            {showNew && (
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
                  新建客户类别
                </Button>
              </>
            )}
          </div>
        )}
        {...rest}
        {...fieldProps}
      />
      {showNew && <CustTypeForm action={'add'} visible={modalVisit} setVisible={setModalVisit} />}
    </>
  );
}
export function CustAreaSelect({ fieldProps, showNew, isLeaf, ...rest }: MyTreeSelectProps) {
  const { treeDataSimpleMode, leafTreeData } = useModel('custArea', (model) => ({
    treeDataSimpleMode: model.treeDataSimpleMode,
    leafTreeData: model.leafCanClickTreeData,
  }));
  const [modalVisit, setModalVisit] = useState(false);
  return (
    <>
      <TreeSelect
        showSearch
        placeholder="请选择"
        allowClear
        treeDefaultExpandAll
        treeData={isLeaf ? leafTreeData : treeDataSimpleMode}
        treeNodeFilterProp="title"
        dropdownRender={(menu) => (
          <div>
            {menu}
            {showNew && (
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
                  新建客户区域
                </Button>
              </>
            )}
          </div>
        )}
        {...rest}
        {...fieldProps}
      />
      {showNew && <CustTypeForm action={'add'} visible={modalVisit} setVisible={setModalVisit} />}
    </>
  );
}

export const ProFormCheckBoxZeroAndOne: React.FC<{
  value?: number;
  onChange?: (value: number) => void;
}> = ({ value, onChange }) => {
  return (
    <Checkbox
      onChange={(e) => {
        onChange?.(e.target.checked ? 1 : 0);
      }}
      checked={value === 1}
    />
  );
};

interface MySelectProps extends ProFormSelectProps {
  showNew?: boolean; // 是否开启新建功能
}
export const ProductBrandSelect = (p: MySelectProps) => {
  const [visible, setVisible] = useState<boolean>(false);
  return (
    <>
      <ProFormSelect
        fieldProps={{
          optionFilterProp: 'label',
          dropdownRender: (menu) => {
            return (
              <div>
                {menu}
                {p.showNew && (
                  <>
                    <Divider style={{ margin: '4px 0' }} />
                    <Button
                      type="text"
                      block
                      onClick={() => {
                        setVisible(true);
                      }}
                    >
                      <PlusOutlined />
                      新建品牌
                    </Button>
                  </>
                )}
              </div>
            );
          },
        }}
        {...p}
      />
      <BrandForm visible={visible} action={'add'} setVisible={setVisible} />
    </>
  );
};
export const StoreSelect = (p: MySelectProps) => {
  const [visible, setVisible] = useState<boolean>(false);
  return (
    <>
      <ProFormSelect
        fieldProps={{
          optionFilterProp: 'label',
          dropdownRender: (menu) => {
            return (
              <div>
                {menu}
                {p.showNew && (
                  <>
                    <Divider style={{ margin: '4px 0' }} />
                    <Button
                      type="text"
                      block
                      onClick={() => {
                        setVisible(true);
                      }}
                    >
                      <PlusOutlined />
                      新建仓库
                    </Button>
                  </>
                )}
              </div>
            );
          },
        }}
        {...p}
      />
      <StoreForm visible={visible} action={'add'} setVisible={setVisible} />
    </>
  );
};

interface OptionSelectProps extends MySelectProps {
  option: string;
}
export const OptionSelect = (p: OptionSelectProps) => {
  const { typeOption } = useModel('options', (module) => ({ typeOption: module.typeOption }));
  return (
    <>
      <ProFormSelect
        options={typeOption(p.option)}
        tooltip="数据字典"
        fieldProps={{
          optionFilterProp: 'label',
          dropdownRender: (menu) => {
            return (
              <div>
                {menu}
                {p.showNew && (
                  <>
                    <Divider style={{ margin: '4px 0' }} />
                    <Button
                      type="text"
                      block
                      onClick={() => {
                        history.push('/init/dictDef');
                      }}
                    >
                      <PlusOutlined />
                      新建字典
                    </Button>
                  </>
                )}
              </div>
            );
          },
        }}
        {...p}
      />
    </>
  );
};

export const DepSelect = ({ fieldProps, showNew, isLeaf, ...rest }: MyTreeSelectProps) => {
  const { treeDataSimpleMode, queryDepTree, treeData } = useModel('dep', (model) => ({
    treeDataSimpleMode: model.treeDataSimpleMode,
    queryDepTree: model.queryDepTree,
    treeData: model.leafCanClickTreeData,
  }));
  const [modalVisit, setModalVisit] = useState(false);
  return (
    <>
      <TreeSelect
        showSearch
        placeholder="请选择"
        allowClear
        treeDefaultExpandAll
        treeNodeFilterProp="title"
        treeData={isLeaf ? treeData : treeDataSimpleMode}
        dropdownRender={(menu) => {
          return (
            <div>
              {menu}
              {showNew && (
                <>
                  <Divider style={{ margin: '4px 0' }} />
                  <Button
                    type="text"
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
        {...rest}
        {...fieldProps}
      />
      {showNew && (
        <DepForm
          action="add"
          setVisible={setModalVisit}
          visible={modalVisit}
          refresh={queryDepTree}
        />
      )}
    </>
  );
};
type MyProFormUploadProps = {
  value?: UploadFile[];
  onChange?: (value: MyProFormUploadProps['value']) => void;
};
export function MyProFormUpload(props: MyProFormUploadProps) {
  const { value, onChange } = props;
  useEffect(() => {
    console.log(value);
  }, [value]);
  return (
    <Space align="start">
      <ProFormUploadButton
        action={`${BASE_URL}/sys/upload/upload?type=logo`}
        fieldProps={{
          onChange: (info) => {
            if (info.file.status === 'done') {
              const t = info.fileList.map((file) => {
                if (file.response) {
                  return {
                    ...file,
                    url: file.response.data.path,
                    thumbUrl: BASE_URL + file.response.data.path,
                  };
                }
                return file;
              });
              props.onChange?.(value?.concat(...t));
            }
          },
          fileList: value,
        }}
      />
      <ProFormText
        width="md"
        placeholder="请在此处粘贴上传"
        fieldProps={{
          onPaste: async (e) => {
            const data = e.clipboardData;
            const blob = data.items[0].getAsFile();
            if (blob?.type.startsWith('image')) {
              const formData = new FormData();
              formData.append(blob.name, blob);
              const res = await upload('logo', formData);
              const t = (value || []).concat({
                ...res.data,
                url: res.data.path,
                name: res.data.newFileName,
                thumbUrl: BASE_URL + res.data.path,
                uid: +(Math.random() * 1000000).toFixed(0),
              });
              onChange?.(t);
            }
          },
        }}
      />
    </Space>
  );
}
