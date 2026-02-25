import { colorMap } from "./ColorConstants";

type Props = {
  colorName: string;
};
export const ColorStatic = ({ colorName }: Props) => {
  return (
    <div
      className={`block cursor-pointer w-2 h-2  text-white rounded-full`}
      style={{
        backgroundColor: colorMap[colorName],
        outline: `2px solid ${colorMap[colorName]}`,
        outlineOffset: "2px",
      }}
    ></div>
  );
};
