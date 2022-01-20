import { useState, useEffect } from 'react';
import { todo } from '@/services/todo-list';
export default function useTodo() {
  const [todoList, setTodoList] = useState([]);
  useEffect(() => {
    async function fetchListData() {
      const data = await todo.getTodoList();
      setTodoList(data);
    }
    fetchListData();
  }, []);
  return { todoList, setTodoList };
}
