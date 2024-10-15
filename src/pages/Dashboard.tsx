import { useEffect, useState } from "react";
import { Layout, Menu, message } from "antd";
import {
  fetchEventList,
  toggleEventShow,
  deleteEvent,
  setEventSort,
} from "../services/api";

import styles from "./Dashboard.module.scss";
import { AdminEvent } from "../services/types";
import EventTable from "../components/EventTable";

const { Header, Content, Sider } = Layout;

const Dashboard = () => {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // 获取事件列表
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchEventList();
        if (isMounted) {
          setEvents(data);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        message.error("Error fetching event list");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  // 切换显示状态
  const handleToggleShow = async (id: number, isShow: number) => {
    try {
      await toggleEventShow(id, isShow === 1 ? 0 : 1);
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === id ? { ...event, is_show: isShow === 1 ? 0 : 1 } : event
        )
      );
      message.success("Event visibility updated");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      message.error("Error toggling event visibility");
    }
  };

  // 删除事件
  const handleDelete = async (id: number) => {
    try {
      await deleteEvent(id);
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
      message.success("Event deleted");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      message.error("Error deleting event");
    }
  };

  // 修改排序
  const handleSortChange = async (id: number, newSort: number) => {
    try {
      await setEventSort(id, newSort);
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === id ? { ...event, sort_order: newSort } : event
        )
      );
      message.success("Event sort order updated");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      message.error("Error setting event sort order");
    }
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider width={200} className="site-layout-background">
        <Menu
          mode="inline"
          defaultSelectedKeys={["1"]}
          style={{
            height: "100%",
            borderRight: 0,
            background: "#4d4d4d",
          }}
        >
          <Menu.Item
            key="1"
            style={{
              color: "#ddd",
            }}
          >
            Dashboard
          </Menu.Item>
          {/* <Menu.Item
            key="2"
            style={{
              color: "#ddd",
            }}
          >
            Other Page
          </Menu.Item> */}
        </Menu>
      </Sider>
      <Layout>
        <Header className={styles.header}>Admin Dashboard</Header>
        <Content
          style={{ padding: 24, margin: 0, minHeight: 280, background: "#fff" }}
        >
          <EventTable
            events={events}
            loading={loading}
            onToggleShow={handleToggleShow}
            onDelete={handleDelete}
            onSortChange={handleSortChange}
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
