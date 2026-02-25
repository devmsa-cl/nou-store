import { FaStar } from "react-icons/fa";

export default function ItemCardPlaceHolder() {
  return (
    <div className="w-72 h-105">
      <div className="bg-white flex flex-col p-2 rounded-2xl h-full w-full">
        <div className="top-portion basis-4/6 overflow-hidden bg-zinc-200 rounded-2xl min-h-52 animate-pulse"></div>
        <div className="bottom-portion basis-2/6 p-2 py-2 flex flex-col gap-2 relative">
          <div className="rating flex flex-col gap-1">
            <div className="h-8 bg-zinc-200 w-4/5 rounded-2xl"></div>
            <div className="flex">
              <FaStar size={22} className="text-zinc-200 animate-pulse" />
              <FaStar size={22} className="text-zinc-200 animate-pulse" />
              <FaStar size={22} className="text-zinc-200 animate-pulse" />
              <FaStar size={22} className="text-zinc-200 animate-pulse" />
              <FaStar size={22} className="text-zinc-200 animate-pulse" />
            </div>
          </div>
          <div className="price">
            <p className="h-8 bg-zinc-200 w-1/3 rounded-md"></p>
          </div>

          <div className="colors absolute right-2 bottom-24 z-30">
            <div className="h-8 w-12 bg-zinc-200 rounded-md mt-32"></div>
          </div>

          <div className="self-end mt-5">
            <div className="bg-zinc-200 h-12 w-12 rounded-xl animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
