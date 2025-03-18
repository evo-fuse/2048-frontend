export type User = {
  clerkId: string;
  email: string;
  username: string;
  uuid: string;
  rows: number;
  cols: number;
  maxMoves: number;
  maxCount: number;
  maxScore: number;
  maxTile: number;
  hammer: number;
  upgrade: number;
  powerup: number;
  walletAddress: string;
};

export type TToken = {
  name: string;
  icon: React.ReactNode;
  unit: string;
  balance: (address: string) => Promise<string>;
};

export type TileImg = {
  sm: string;
  lg: string;
  title: string;
  description: string;
  pl: string;
  pd: string;
};

export type Theme = {
  uuid: string;
  title: string;
  description: string;
  2: TileImg;
  4: TileImg;
  8: TileImg;
  16: TileImg;
  32: TileImg;
  64: TileImg;
  128: TileImg;
  256: TileImg;
  512: TileImg;
  1024: TileImg;
  2048: TileImg;
  4096: TileImg;
  8192: TileImg;
  owned: boolean;
};
