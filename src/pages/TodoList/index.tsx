import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Button, Alert } from 'antd';
import { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { todo } from '@/services/todo-list';
import { useModel } from 'umi';

// status： 0 取消， 1 完成， 2 待办
const statusList = [
  <Alert key="1" message="已取消" type="error" showIcon />,
  <Alert key="2" message="已完成" type="success" showIcon />,
  <Alert key="3" message="待办" type="warning" showIcon />,
];

const columns = [
  {
    title: '序号',
    dataIndex: 'id',
  },
  {
    title: '名称',
    dataIndex: 'title',
  },
  {
    title: '状态',
    dataIndex: 'status',
    // 可以根据status用if来判断，但更简洁的做法是如下定义成数组下标来实现
    render: (_: any, record: any) => statusList[record.status],
  },
  {
    title: '更改状态',
    render: () => [<a key={1}>待办 </a>, <a key={2}>完成 </a>, <a key={3}>取消 </a>],
  },
];

const TodoList = () => {
  // 请求数据渲染表格方式一：传统做法，页面加载请求数据然后保存后传给dataSource
  // const [dataSource, setDataSource] = useState([]);
  // useEffect(() => {
  //   async function fetchData() {
  //     const data = await todo.getList();
  //     setDataSource(data);
  //   }
  //   fetchData();
  // });

  // 请求数据渲染表格方式二：使用proTable提供的request（对于简易数据来说建议使用，比如只在当前组件使用到的数据）

  // 请求数据渲染表格方式三：适合某个状态在多个组件里共享
  const { todoList }: any = useModel<any, any>('useTodo', (useTodo) => ({
    todoList: useTodo.todoList,
  }));
  return (
    <PageContainer>
      <ProTable
        columns={columns}
        // dataSource={dataSource}
        // request={async () => ({ data: await todo.getList() })}
        dataSource={todoList}
        rowKey="id"
        pagination={{
          showQuickJumper: true,
        }}
        search={false}
        dateFormatter="string"
        headerTitle="待办事项"
        toolBarRender={() => [
          <Button type="primary" key="primary">
            <PlusOutlined />
            添加
          </Button>,
        ]}
      />
    </PageContainer>
  );
};

export default TodoList;
