export type Spacing =
  | 's0'
  | 's1'
  | 's2'
  | 's3'
  | 's4'
  | 's5'
  | 's6'
  | 's7'
  | 's8'
  | 's9'
  | 's10';

export type Color =
  | 'transparent'
  | 'black'
  | 'white'
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'foreground'
  | 'background'
  | 'backdrop'
  | 'tile2'
  | 'tile4'
  | 'tile8'
  | 'tile16'
  | 'tile32'
  | 'tile64'
  | 'tile128'
  | 'tile256'
  | 'tile512'
  | 'tile1024'
  | 'tile2048';

export type Palette = Record<Color, string>;

export interface Theme {
  borderRadius: string;
  palette: Palette;
}

export type ThemeName = 'default' | 'dark';

export type TileImg = {
  sm: string;
  lg: string;
  title: string;
  description: string;
};

export type ImageTheme = {
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
  16384?: TileImg;
  32768?: TileImg;
  65536?: TileImg;
  visibility: "public" | "private" | "premium";
  price?: number;
  numberDisplay: boolean;
  position:
    | "center"
    | "top-left"
    | "bottom-right"
    | "top-right"
    | "bottom-left";
  numberColor: string;
  numberSize: number;
  owned: boolean;
  creator_id: string;
};