import { queryUserInfo, updUser } from '@/services/Sys/user';
import ProCard from '@ant-design/pro-card';
import ProForm, {
  ProFormText,
  ProFormGroup,
  ProFormSelect,
  ProFormRadio,
} from '@ant-design/pro-form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams, useModel } from 'umi';
import { PageLoading } from '@ant-design/pro-layout';
import { queryDepInfo, updDep } from '@/services/Sys/dep';

const Dep: React.FC = () => {
  const params = useParams<{ id: string | 'new' }>();
  const [data, setData] = useState<{
    loading: boolean;
    title: string;
    initialValues: API.Dep;
  }>({
    loading: true,
    title: '',
    initialValues: {
      DepName: '',
      Phone: '',
      Leader: '',
      DepId: -1,
      PDepId: -1,
      PDepName: '',
      SortNum: 0,
      Memo: '',
      State: 0,
    },
  });
  useEffect(() => {
    const { id } = params;
    if (id === 'new') {
      setData((d) => ({
        ...d,
        loading: false,
        title: '新建部门',
      }));
    } else {
      queryDepInfo(id).then((res) => {
        setData(() => ({
          title: `修改部门(${res.data.DepName})`,
          loading: false,
          initialValues: res.data,
        }));
      });
    }
  }, [params]);
  return data.loading ? (
    <PageLoading />
  ) : (
    <PageHeaderWrapper title={data.title}>
      <ProCard>
        <ProForm<API.Dep>
          initialValues={data.initialValues}
          onFinish={async (values) => {
            const submitForm = { ...data.initialValues, ...values };
            await updDep(submitForm);
            message.success('修改数据成功。');
          }}
        >
          <ProFormGroup>
            <ProFormText width="md" name="DepName" label="部门名称" />
            <ProFormText width="md" name="Leader" label="部门负责人" />
            <ProFormText width="md" name="Phone" label="手机号码" />
          </ProFormGroup>
          <ProFormRadio.Group
            width="md"
            name="State"
            label="状态"
            options={[
              {
                label: '正常',
                value: 0,
              },
              {
                label: '禁用',
                value: 1,
              },
            ]}
          />
        </ProForm>
      </ProCard>
    </PageHeaderWrapper>
  );
};

export default Dep;
