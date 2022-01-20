import React, { useCallback, useEffect } from 'react';
import {
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
  IssuesCloseOutlined,
} from '@ant-design/icons';
import { Avatar, Menu, Spin, Badge } from 'antd';
import { history, useModel } from 'umi';
import { stringify } from 'querystring';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import { outLogin } from '@/services/ant-design-pro/api';
import type { MenuInfo } from 'rc-menu/lib/interface';
import { connect } from 'dva';

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

/**
 * 退出登录，并且将当前的 url 保存
 */
const loginOut = async () => {
  await outLogin();
  const { query = {}, search, pathname } = history.location;
  const { redirect } = query;
  // Note: There may be security issues, please note
  if (window.location.pathname !== '/user/login' && !redirect) {
    history.replace({
      pathname: '/user/login',
      search: stringify({
        redirect: pathname + search,
      }),
    });
  }
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = (props) => {
  const { menu, todo, dispatch }: any = props;
  const { initialState, setInitialState } = useModel('@@initialState');
  // 方式三： 使用dva
  useEffect(() => {
    dispatch({
      type: 'todo/getTodoList',
      payload: null,
    });
  }, [dispatch]);
  const count = todo.todoList?.filter((item: any) => item.status === 2).length;

  // 方式二(未成功实现)：使用全局状态useModel，适合一个状态多个组件共享
  // 获取全部列表
  // const { todoList }: any = useModel<any, any>('useTodo', (useTodo) => ({
  //   todoList: useTodo.todoList,
  // }));
  // 筛选出待办事项（status等于2为待办）
  // const count = todoList.filter((item: any) => item.status === 2).length;

  //  方式一：传统做法，适合只在仅一个组件内使用的状态
  // const [todoCount, setTodoCount] = useState(0);
  // useEffect(() => {
  //   async function getTodoCount() {
  //     // 获取全部列表
  //     const data = await todo.getList();
  //     // 筛选出待办事项（status等于2为待办）
  //     const count = data.filter((item: any) => item.status === 2).length;
  //     setTodoCount(count);
  //   }
  //   getTodoCount();
  // });
  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      // 进入待办页面
      if (key === 'todo') {
        history.push('/todo');
        return;
      }

      // 退出登录
      if (key === 'logout') {
        setInitialState((s) => ({ ...s, currentUser: undefined }));
        loginOut();
        return;
      }
      history.push(`/account/${key}`);
    },
    [setInitialState],
  );

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser.name) {
    return loading;
  }

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      {menu && (
        <Menu.Item key="center">
          <UserOutlined />
          个人中心
        </Menu.Item>
      )}
      {menu && (
        <Menu.Item key="settings">
          <SettingOutlined />
          个人设置
        </Menu.Item>
      )}
      {menu && <Menu.Divider />}

      <Menu.Item key="todo">
        <Badge count={count} offset={[8, 0]} size="small">
          <IssuesCloseOutlined />
          待办事项
        </Badge>
      </Menu.Item>
      <Menu.Item key="logout">
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  );
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar size="small" className={styles.avatar} src={currentUser.avatar} alt="avatar" />
        <Badge count={count} dot>
          <span className={`${styles.name} anticon`}>{currentUser.name}</span>
        </Badge>
      </span>
    </HeaderDropdown>
  );
};

export default connect(({ todo }: any) => ({ todo }))(AvatarDropdown);
