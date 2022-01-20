import { request } from 'umi';

// 获取todoList
export async function getTodoList() {
  return request('/api/list');
}

// 添加todo
export async function addTodo(data: any) {
  return request('/api/addTodo', {
    method: 'POST',
    data,
  });
}
// 更改todo
export async function updateTodo(data: any) {
  return request('/api/updateTodo', {
    method: 'PUT',
    data,
  });
}
