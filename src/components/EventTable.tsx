import React from "react";
import { Table, Button } from "antd";
import { AdminEvent } from "../services/types";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

interface EventTableProps {
  events: AdminEvent[];
  loading: boolean;
  onToggleShow: (event_id: number, isShow: number) => void;
  //   onDelete: (event_id: number) => void;
  onSortChange: (event_id: number, newSort: number) => void;
}

const EventTable: React.FC<EventTableProps> = ({
  events,
  loading,
  onToggleShow,
  //   onDelete,
  onSortChange,
}) => {
  const columns = [
    {
      title: "Event Title",
      dataIndex: "event_title",
      key: "event_title",
    },
    {
      title: "Rank",
      dataIndex: "rank",
      key: "rank",
      render: (_text: number, record: AdminEvent) => (
        <span>
          Rank: {record.rank}, Sort Order: {record.sort_order}, Votes:{" "}
          {record.votes}
        </span>
      ),
    },
    {
      title: "Sort Order",
      dataIndex: "sort_order",
      key: "sort_order",
      render: (_text: number, record: AdminEvent) => (
        <span>
          <Button
            icon={<ArrowUpOutlined />}
            onClick={() => onSortChange(record.id, record.sort_order + 1)} // 使用 event_id 传递给 onSortChange
            style={{ marginRight: 8 }}
          />
          <Button
            icon={<ArrowDownOutlined />}
            onClick={
              () => onSortChange(record.id, Math.max(0, record.sort_order - 1)) // 使用 event_id 传递给 onSortChange
            }
          />
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_text: string, record: AdminEvent) => (
        <span>
          <Button
            type={record.is_show ? "primary" : "default"}
            onClick={() => onToggleShow(record.id, record.is_show)} // 使用 event_id 传递给 onToggleShow
            style={{ marginRight: 8 }}
          >
            {record.is_show ? "Hide" : "Show"}
          </Button>
          {/* <Button danger onClick={() => onDelete(record.id)}>
            Delete
          </Button> */}
        </span>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={events}
      rowKey="id"
      loading={loading}
      pagination={false}
    />
  );
};

export default EventTable;
