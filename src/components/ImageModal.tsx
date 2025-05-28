import { Images } from "../assets/images";

interface TopRowProps {
  ImageType: any;
  count: number;
}

export const TopRow: React.FC<TopRowProps> = ({ ImageType, count }) => (
  <div className="flex items-center justify-center">
    {Array.from({ length: count }).map((_, index) => (
      <img
        key={`${ImageType.toString()}-${index}`}
        src={
          index === 0 ? Images.Lt : index === count - 1 ? Images.Rt : Images.Ht
        }
        width={120}
        height={120}
      />
    ))}
  </div>
);

export const MiddleRow: React.FC = () => (
  <div className="flex items-center justify-between px-[3px]">
    <img
      src={Images.Vl}
      width={120}
      height={120}
      className="translate-x-[1px]"
    />
    <img
      src={Images.Vr}
      width={120}
      height={120}
      className="translate-x-[-1.5px]"
    />
  </div>
);

interface BottomRowProps {
  count: number;
}

export const BottomRow: React.FC<BottomRowProps> = ({ count }) => (
  <div className="flex items-center justify-center">
    {Array.from({ length: count }).map((_, index) => (
      <img
        key={`bottom-${index}`}
        src={
          index === 0 ? Images.Lb : index === count - 1 ? Images.Rb : Images.Hb
        }
        width={120}
        height={120}
      />
    ))}
  </div>
);

interface ImageModalProps {
  ImageType: any;
  count: number;
}

export const ImageModal: React.FC<ImageModalProps> = ({ ImageType, count }) => (
  <div className="flex items-center justify-center">
    <TopRow ImageType={ImageType} count={count} />
    <MiddleRow />
    <BottomRow count={count} />
  </div>
);
