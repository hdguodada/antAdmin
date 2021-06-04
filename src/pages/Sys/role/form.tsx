import { Button } from 'antd';
import { Checkbox } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { queryModules, updRole } from '@/services/Sys';

import ProCard from '@ant-design/pro-card';

type FormProps = {
  initialValues: SYS.UserRole;
  setRoleId: () => void;
};
const RoleForm: React.FC<FormProps> = (props) => {
  const actionRef = useRef<ActionType>();
  const { initialValues, setRoleId } = props;
  const [module, setModule] = useState<SYS.Module[]>();
  const setModSelectedMapWithInitialValues = (i: SYS.UserRole) => {
    const entries = {};
    i?.funAuth?.forEach((item) => {
      const v = entries[item.modId];
      if (v?.length > 0) {
        v.push(item.funId);
      } else {
        entries[item.modId] = [item.funId];
      }
    });
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
  const columns: ProColumns<SYS.Module>[] = [
    {
      dataIndex: 'memo',
      title: '模块名称',
      search: false,
      render: (_, record) => (
        <a>
          {_}({record.modId})
        </a>
      ),
    },
    {
      title: '可操作模块',
      dataIndex: 'funs',
      search: false,
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
    <ProTable<SYS.Module>
      actionRef={actionRef}
      dataSource={module}
      columns={columns}
      options={false}
      pagination={false}
      rowKey="modId"
      search={{
        optionRender: () => [
          <Button
            type="primary"
            key="save"
            onClick={async () => {
              const funAuth: SYS.UserRole['funAuth'] = [];
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
              setRoleId();
            }}
          >
            保存数据
          </Button>,
        ],
      }}
    />
  );
};

export default RoleForm;
