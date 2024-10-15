import React, { useState } from "react";
import { Table, Button, Modal, message } from "antd";
import { AdminEvent } from "../services/types";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { fetchEventInfo } from "../services/api"; // 引入 fetchEventInfo

interface EventTableProps {
  events: AdminEvent[];
  loading: boolean;
  onToggleShow: (event_id: number, isShow: number) => void;
  onSortChange: (event_id: number, newSort: number) => void;
  onDelete: (event_id: number) => void;
}

const EventTable: React.FC<EventTableProps> = ({
  events,
  loading,
  onToggleShow,
  onSortChange,
  onDelete,
}) => {
  const [selectedEvent, setSelectedEvent] = useState<AdminEvent | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // 显示详情模态框
  const showEventInfo = async (event_id: number) => {
    try {
      const eventInfo = await fetchEventInfo(event_id);
      setSelectedEvent(eventInfo);
      setIsModalVisible(true);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      message.error("Failed to fetch event info");
    }
  };

  // 关闭模态框
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedEvent(null);
  };

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
            onClick={() => onSortChange(record.id, record.sort_order + 1)}
            style={{ marginRight: 8 }}
          />
          <Button
            icon={<ArrowDownOutlined />}
            onClick={() =>
              onSortChange(record.id, Math.max(0, record.sort_order - 1))
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
            onClick={() => onToggleShow(record.id, record.is_show)}
            style={{ marginRight: 8 }}
          >
            {record.is_show ? "Hide" : "Show"}
          </Button>
          <Button
            onClick={() => showEventInfo(record.id)}
            style={{ marginRight: 8 }}
          >
            View Details
          </Button>
          <Button danger onClick={() => onDelete(record.id)}>
            Delete
          </Button>
        </span>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={events}
        rowKey="id"
        loading={loading}
        pagination={false}
      />

      {/* 详情模态框 */}
      <Modal
        title="Event Details"
        visible={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
      >
        {selectedEvent ? (
          <div>
            <p>
              <strong>Title:</strong> {selectedEvent.event_title}
            </p>
            <p>
              <strong>Description:</strong> {selectedEvent.description}
            </p>
            <p>
              <strong>Live URL:</strong>{" "}
              <a
                href={selectedEvent.live_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {selectedEvent.live_url}
              </a>
            </p>
            <p>
              <strong>Web URL:</strong>{" "}
              <a
                href={selectedEvent.web_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {selectedEvent.web_url}
              </a>
            </p>
            <p>
              <strong>Rank:</strong> {selectedEvent.rank}
            </p>
            <p>
              <strong>Votes:</strong> {selectedEvent.votes}
            </p>
          </div>
        ) : (
          <p>Loading event details...</p>
        )}
      </Modal>
    </>
  );
};

export default EventTable;
