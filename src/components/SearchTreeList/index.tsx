import type { TreeProps } from 'antd';
import { Input, Tree } from 'antd';
import type { SearchProps } from 'antd/lib/input/Search';
import React from 'react';

export default function SearchTreeList({ s, t }: { s?: SearchProps; t: TreeProps }) {
  return (
    <div>
      {s && <Input.Search {...s} />}
      <Tree defaultExpandAll showLine showIcon {...t} />
    </div>
  );
}
