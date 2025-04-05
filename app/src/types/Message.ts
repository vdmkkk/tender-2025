export type UserMessage = {
  //   id: number;
  text: string;
  image?: string;
  fromUser: true;
  replying?: UserMessage;
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
  //   id: number;
  text: string;
  image?: string;
  items: GoodType[];
  fromUser: false;
};

export enum Icons {
  'wb',
  'ozon',
  'lamoda',
  'ymarket',
}
