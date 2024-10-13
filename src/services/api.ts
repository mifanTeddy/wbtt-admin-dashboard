import axios from "axios";
import { AdminEvent } from "./types";

const API_BASE_URL = "https://venture.hzchainup.com/v1/event/admin";

const instance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization:
      localStorage.getItem("token") ||
      "GpohjHpJxudTW1WgfK4kgUml35itZaDo5qu39z6",
  },
});

// 登陆
export const apiLogin = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}): Promise<{ token: string }> => {
  const response = await instance.post("/login", { username, password });
  const token = response.data.data.token;

  localStorage.setItem("token", token);

  return { token };
};

// 获取事件列表
export const fetchEventList = async (): Promise<AdminEvent[]> => {
  const response = await instance.get("/list");
  return response.data.data.events;
};

// 切换显示状态
export const toggleEventShow = async (
  event_id: number,
  isShow: number
): Promise<void> => {
  await instance.post("/set-show", { event_id, is_show: isShow });
};

// 删除事件
export const deleteEvent = async (event_id: number): Promise<void> => {
  await instance.post("/delete", { event_id });
};

// 设置事件排序
export const setEventSort = async (
  event_id: number,
  sort: number
): Promise<void> => {
  await instance.post("/set-sort", { event_id, sort });
};

// 获取事件详情
export const fetchEventInfo = async (event_id: number): Promise<AdminEvent> => {
  const response = await instance.get(`/info`, {
    params: { event_id },
  });
  return response.data.data;
};
