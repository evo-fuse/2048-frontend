import { ThemeFormData } from "../../types";
import { ThemeBasicInfo } from "./ThemeBasicInfo";
import { ThemeNumberDisplay } from "./ThemeNumberDisplay";
import { ThemeTileImages } from "./ThemeTileImages";

interface ManualModeContentProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  visibility: "private" | "public" | "premium";
  setVisibility: (value: "private" | "public" | "premium") => void;
  price: number;
  setPrice: (value: number) => void;
  numberDisplay: ThemeFormData["numberDisplay"];
  setNumberDisplay: (value: ThemeFormData["numberDisplay"]) => void;
  tileImages: ThemeFormData["tileImages"];
  fileInputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  onImageChange: (index: number, file: File) => void;
  onDescriptionChange: (index: number, description: string) => void;
  onImageCancel: (index: number) => void;
}

export const ManualModeContent = ({
  title,
  setTitle,
  description,
  setDescription,
  visibility,
  setVisibility,
  price,
  setPrice,
  numberDisplay,
  setNumberDisplay,
  tileImages,
  fileInputRefs,
  onImageChange,
  onDescriptionChange,
  onImageCancel,
}: ManualModeContentProps) => {
  return (
    <div className="space-y-6">
      <ThemeBasicInfo
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        visibility={visibility}
        setVisibility={setVisibility}
        price={price}
        setPrice={setPrice}
      />
      <ThemeNumberDisplay
        numberDisplay={numberDisplay}
        setNumberDisplay={setNumberDisplay}
      />
      <ThemeTileImages
        tileImages={tileImages}
        fileInputRefs={fileInputRefs}
        onImageChange={onImageChange}
        onDescriptionChange={onDescriptionChange}
        numberDisplay={numberDisplay}
        onImageCancel={onImageCancel}
      />
    </div>
  );
};

