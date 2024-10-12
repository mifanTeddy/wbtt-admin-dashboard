// 定义 AdminEvent 接口，代表事件数据
export interface AdminEvent {
  id: number;
  event_title: string;
  description: string;
  icon_url: string;
  live_url: string;
  web_url: string;
  is_voted: boolean;
  twitter_url: string;
  votes: number;
  rank: number;
  is_show: number;
  sort_order: number;
}
