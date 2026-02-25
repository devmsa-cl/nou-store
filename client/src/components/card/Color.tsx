import { colorMap } from "./ColorConstants";

type Props = {
  currentColor: string | null | undefined;
  colorName: string;
  onUpdateColor: (newColor: string) => void;
};
export const Color = ({ currentColor, colorName, onUpdateColor }: Props) => {
  return (
    <div className="w-3 h-3">
      <input
        type="checkbox"
        name="color"
        className="hidden"
        value={colorName}
        checked={colorName === currentColor}
        onChange={() => onUpdateColor(colorName)}
      />
      <label
        onClick={() => onUpdateColor(colorName)}
        htmlFor="color"
        className={`block cursor-pointer min-w-3 min-h-3  text-white rounded-full`}
        style={{
          backgroundColor: colorMap[colorName],
          outline:
            colorName == currentColor
              ? `2px solid ${colorMap[colorName]}`
              : `2px solid transparent`,
          outlineOffset: "2px",
        }}
      ></label>
    </div>
  );
};
