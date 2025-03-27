export type User = {
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
  address: string;
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

export type GameItem = {
    id: 'hammer' | 'powerup' | 'upgrade';
    icon: string;
    quantity: number;
}

export enum WalletItem {
  Import = 'Import Wallet',
  ShowPrivateKey = 'Show Private Key',
  ShowSeed = 'Show Seed Phrase',
}