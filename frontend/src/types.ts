export interface ChannelType {
  id: string;
  channelTitle: string;
  avgLikes: string;
  avgComments: string;
}

export interface VideoType {
  id: string;
  title: string;
  likes: number;
  channelTitle?: string;
}

export interface UserInfo {
  username: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface Creative {
  ChannelId: string;
  ChannelTitle: string;
  AvgLikes: number;
  AvgComments: number;
  Category: string;
  NumTrending: number;
  ChannelRank: number;
}

export interface CategoryFrequency {
  name: string;
  count: number;
}

