export interface ThemeFormData {
  title: string;
  description: string;
  visibility: "private" | "public" | "premium";
  price?: number;
  tileImages: {
    value: number;
    image: File | null;
    description: string;
  }[];
  numberDisplay: {
    show: boolean;
    position: "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
    color: string;
    size: number;
  };
}