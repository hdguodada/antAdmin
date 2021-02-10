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

const User: React.FC = () => {
  const params = useParams<{ id: string | 'new' }>();
  const { depList, queryDepList } = useModel('dep');
  const { userTypeList, queryUserTypes } = useModel('userType');
  useEffect(() => {
    queryDepList({});
    queryUserTypes({});
  }, [queryDepList, queryUserTypes]);
  const [data, setData] = useState<{
    loading: boolean;
    title: string;
    initialValues: API.CurrentUser;
  }>({
    loading: true,
    title: '',
    initialValues: {
      UserName: '',
      RealName: '',
      PassWord: '',
      Mobile: '',
      Email: '',
    },
  });
  useEffect(() => {
    const { id } = params;
    if (id === 'new') {
      setData((d) => ({
        ...d,
        loading: false,
        title: '新建用户',
      }));
    } else {
      queryUserInfo(id).then((res) => {
        setData(() => ({
          title: `修改用户(${res.data.RealName})`,
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
        <ProForm<API.CurrentUser>
          initialValues={data.initialValues}
          onFinish={async (values) => {
            const submitForm = { ...data.initialValues, ...values };
            await updUser(submitForm);
            message.success('修改数据成功。');
          }}
          omitNil={false}
        >
          <ProFormGroup>
            <ProFormText width="md" name="UserName" label="账号名称" />
            <ProFormText width="md" name="RealName" label="真实姓名" />
            <ProFormText width="md" name="Mobile" label="手机号码" />
          </ProFormGroup>
          {params.id === 'new' ? (
            <ProFormGroup>
              <ProFormText.Password width="md" name="PassWord" label="密码" />
              <ProFormText.Password width="md" name="CheckPassWord" label="确认密码" />
            </ProFormGroup>
          ) : (
            <></>
          )}
          <ProFormGroup>
            <ProFormSelect
              showSearch
              params={{}}
              width="md"
              name="DepId"
              label="所属部门"
              fieldProps={{
                optionFilterProp: 'label',
                filterOption(input, option: any) {
                  return option?.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                },
              }}
              request={async () =>
                depList.map((item) => ({
                  label: item.DepName,
                  value: item.DepId,
                }))
              }
            />
            <ProFormSelect
              showSearch
              params={{}}
              width="md"
              name="UserTypeId"
              label="用户角色"
              fieldProps={{
                optionFilterProp: 'label',
                filterOption(input, option: any) {
                  return option?.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                },
              }}
              request={async () =>
                userTypeList.map((item) => ({
                  label: item.RoleName,
                  value: item.RoleId,
                }))
              }
            />
          </ProFormGroup>
          <ProFormText width="md" name="Email" label="邮箱" />
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

export default User;
