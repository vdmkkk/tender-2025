export type UserMessage = {
  id: number;
  text: string;
  fromUser: 'user';
};

export type GoodType = {
  name: string;
  price: number;
  image: string;
  rating: number;
  reviewsCount: number;
  icon: Icons;
  reasoning: string;
};

export type BotMessage = {
  id: number;
  text: string;
  items: GoodType[];
  fromUser: 'bot' | 'admin';
};

export enum Icons {
  'wb',
  'ozon',
  'lamoda',
  'ymarket',
}
