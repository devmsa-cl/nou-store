type SizeProps = {
  sizes: string[];
  selectSize: string;
  onSelect: (size: string) => void;
};
export default function Size(data: SizeProps) {
  return (
    <div className="text-xs">
      <select
        name="size"
        id="size"
        onChange={(e) => {
          const selectedValue = Number(e.target.value);
          if (!selectedValue) return;
          data.onSelect(e.target.value);
        }}
        className="border border-gray-300 rounded-md p-1 cursor-pointer"
      >
        {data.sizes.sort().map((size, index) => (
          <option key={index} value={size} defaultValue={data.selectSize}>
            {size}
          </option>
        ))}
      </select>
    </div>
  );
}
