import { todo } from '@/services/todo-list';

export default {
  namespace: 'todo',
  state: {
    todoList: [],
  },
  effects: {
    *getTodoList(_: any, { call, put }: any): any {
      // 请求数据
      const res = yield call(todo.getTodoList);
      // 派发action到reducer
      yield put({
        type: 'setTodoList',
        payload: res,
      });
    },
  },
  reducers: {
    setTodoList(state: any, action: any) {
      return { ...state, todoList: action.payload };
    },
  },
};
