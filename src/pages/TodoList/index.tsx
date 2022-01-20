import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Button, Alert, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { useState } from 'react';
import { todo } from '@/services/todo-list';

// status： 0 取消， 1 完成， 2 待办
const statusList = [
  <Alert key="1" message="已取消" type="error" showIcon />,
  <Alert key="2" message="已完成" type="success" showIcon />,
  <Alert key="3" message="待办" type="warning" showIcon />,
];

const TodoList = (props: any) => {
  // 1. 请求数据渲染表格方式一：传统做法，页面加载请求数据然后保存后传给dataSource
  // const [dataSource, setDataSource] = useState([]);
  // useEffect(() => {
  //   async function fetchData() {
  //     const data = await todo.getList();
  //     setDataSource(data);
  //   }
  //   fetchData();
  // });

  // 请求数据渲染表格方式二：使用proTable提供的request（对于简易数据来说建议使用，比如只在当前组件使用到的数据）

  // (未成功实现)请求数据渲染表格方式三：适合某个状态在多个组件里共享
  // const { todoList, setTodoList }: any = useModel<any>('useTodo');

  // （本次使用）请求数据渲染表格方式四： dva

  const { todoList } = props.todo;

  // 2. control Modal add todo
  const [isModalVisible, setIsModalVisible] = useState(false);

  // 3. 添加todo且是在表单验证通过后
  const addTodo = async (val: any) => {
    // 执行添加数据请求
    const res = await todo.addTodo(val);
    if (res.code === 0) {
      // 重新获取数据，刷新list
      props.dispatch({
        type: 'todo/getTodoList',
        payload: null,
      });
      message.success(res.message);
      setIsModalVisible(false);
    } else {
      message.error('操作失败');
    }
  };

  // 4. 点击更改todo状态
  const handleChange = async (status: number, id: number) => {
    // status: 点谁todo的状态就变为谁
    const res = await todo.updateTodo({ status, id });
    if (res.code === 0) {
      props.dispatch({
        type: 'todo/getTodoList',
        payload: null,
      });
      message.success(res.message);
    } else {
      message.error('操作失败');
    }
  };
  const columns = [
    {
      title: 'ID',
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
      render: (_: any, record: any) => {
        // console.log(`record`, record);
        const { status, id } = record;
        const renderOperLink = [];
        if (status !== 0) {
          renderOperLink.push(
            <a key={3} onClick={() => handleChange(0, id)}>
              取消{' '}
            </a>,
          );
        }
        if (status !== 1) {
          renderOperLink.push(
            <a key={2} onClick={() => handleChange(1, id)}>
              完成{' '}
            </a>,
          );
        }
        if (status !== 2) {
          renderOperLink.push(
            <a key={1} onClick={() => handleChange(2, id)}>
              待办{' '}
            </a>,
          );
        }
        return renderOperLink;
        // return [<a key={1}>待办 </a>, <a key={2}>完成 </a>, <a key={3}>取消 </a>];
      },
    },
  ];

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
          <Button type="primary" key="primary" onClick={() => setIsModalVisible(true)}>
            <PlusOutlined />
            添加
          </Button>,
        ]}
      />
      <Modal
        title="添加待办"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <ProForm onFinish={addTodo}>
          <ProFormText
            width="md"
            name="todo"
            label="名称"
            tooltip="最长为 24 位"
            placeholder="请输入名称"
            rules={[{ required: true, message: '名称不能为空' }]}
          />
        </ProForm>
      </Modal>
    </PageContainer>
  );
};

export default connect(({ todo: todoInModel }: any) => ({ todo: todoInModel }))(TodoList);
