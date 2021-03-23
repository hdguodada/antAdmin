import { Button, message } from 'antd';
import { Checkbox } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import { queryModules, updRole } from '@/services/Sys';

import ProCard from '@ant-design/pro-card';

type FormProps = {
  initialValues: API.UserRole;
  setRoleId: (id: number) => void;
};
const RoleForm: React.FC<FormProps> = (props) => {
  const actionRef = useRef<ActionType>();
  const { initialValues, setRoleId } = props;
  const [module, setModule] = useState<API.Module[]>();
  const setModSelectedMapWithInitialValues = (i: API.UserRole) => {
    const entries = {};
    i?.funAuth?.forEach((item) => {
      const v = entries[item.modId];
      if (v?.length > 0) {
        v.push(item.funId);
      } else {
        entries[item.modId] = [item.funId];
      }
    });
    console.log(entries);
    return entries;
  };
  const [modSelectedMap, setModSelectedMap] = useState<Record<string, number[]>>({});
  useEffect(() => {
    queryModules({ pageNumber: -1 }).then((res) => {
      setModule(res.data.rows);
    });
  }, []);
  useEffect(() => {
    if (initialValues) {
      setModSelectedMap(setModSelectedMapWithInitialValues(initialValues));
    }
  }, [initialValues]);
  const columns: ProColumns<API.Module>[] = [
    {
      dataIndex: 'memo',
      title: '模块名称',
      render: (_, record) => (
        <a>
          {_}({record.modId})
        </a>
      ),
    },
    {
      title: '可操作模块',
      dataIndex: 'funs',
      render: (_, entity) => {
        const options = entity.funs.map((i) => ({
          label: i.funName,
          value: i.funId,
        }));
        const hasSelectedModId = modSelectedMap[String(entity.modId)];
        return (
          <ProCard ghost>
            <ProCard ghost>
              <Checkbox.Group
                className="table-form"
                options={options}
                value={hasSelectedModId}
                onChange={(v) => {
                  setModSelectedMap({
                    ...modSelectedMap,
                    [String(entity.modId)]: v as number[],
                  });
                }}
              />
            </ProCard>
            <ProCard colSpan={4} ghost layout="center">
              <Checkbox
                checked={options.length === hasSelectedModId?.length}
                onChange={(e) => {
                  if (e.target.checked) {
                    setModSelectedMap({
                      ...modSelectedMap,
                      [String(entity.modId)]: options.map((i) => i.value) as number[],
                    });
                  } else {
                    setModSelectedMap({
                      ...modSelectedMap,
                      [String(entity.modId)]: [],
                    });
                  }
                }}
              >
                全选
              </Checkbox>
            </ProCard>
          </ProCard>
        );
      },
    },
  ];
  return (
    <EditableProTable<API.Module>
      bordered
      actionRef={actionRef}
      value={module}
      columns={columns}
      recordCreatorProps={false}
      rowKey="modId"
      toolBarRender={() => {
        return [
          <Button
            type="primary"
            key="save"
            onClick={async () => {
              const funAuth: API.UserRole['funAuth'] = [];
              // eslint-disable-next-line no-restricted-syntax
              for (const [key, value] of Object.entries(modSelectedMap)) {
                if ((value as number[]).length > 0) {
                  (value as number[]).forEach((item) => {
                    funAuth.push({
                      modId: parseInt(key, 10),
                      funId: item,
                    });
                  });
                }
              }

              const submitForm = {
                ...initialValues,
                funAuth,
              };
              await updRole(submitForm);
              message.success('保存成功');
              setRoleId(+submitForm.roleId);
            }}
          >
            保存数据
          </Button>,
        ];
      }}
    />
  );
};

export default RoleForm;
