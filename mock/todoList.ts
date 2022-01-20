let todoList = [
  {
    id: 1,
    title: 'todo-1',
    status: 0,
  },
  {
    id: 2,
    title: 'todo-2',
    status: 1,
  },
  {
    id: 3,
    title: 'todo-3',
    status: 2,
  },
  {
    id: 4,
    title: 'todo-4',
    status: 1,
  },
  {
    id: 5,
    title: 'todo-5',
    status: 2,
  },
  {
    id: 6,
    title: 'todo-6',
    status: 0,
  },
];
// TODO: mock数据
export default {
  // 获取todoList
  'GET /api/list': todoList,
  // 添加todo
  'POST /api/addTodo': (req: any, res: any) => {
    const item = {
      id: todoList.length + 1,
      title: req.body.todo,
      status: 2, //新增为待办
    };
    todoList.unshift(item);
    res.send({
      message: '添加成功！',
      code: 0,
    });
  },
  // 更改todo
  'PUT /api/updateTodo': (req: any, res: any) => {
    const { status, id } = req.body;
    // // 方式一：
    // const newList = todoList.map((item) => {
    //   if (item.id === id) {
    //     item.status = status;
    //   }
    //   return item;
    // });
    // todoList = newList;
    // 方式二：
    todoList.forEach((item, index) => {
      if (item.id === id) {
        todoList[index].status = status;
      }
    });
    res.send({
      code: 0,
      message: '修改成功',
    });
  },
};
