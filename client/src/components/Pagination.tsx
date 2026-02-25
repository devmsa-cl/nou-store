import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

type Props = {
  page: number;
  numberOfPages?: number;
  totalPages: number;
  setPage: (page: number) => void;
};
export default function Pagination({
  page,
  totalPages,
  setPage,
  numberOfPages = 5,
}: Props) {
  if (totalPages <= 1) return null;
  return (
    <ul className="flex gap-2 m-2">
      <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className="cursor-pointer bg-zinc-300 px-4 rounded-2xl hover:bg-zinc-300/75 transition-all"
      >
        <IoIosArrowBack />
      </button>
      {Array.from({ length: page }, (_, i) => i)
        .slice(page <= numberOfPages ? 1 : page - numberOfPages)
        .map((p) => (
          <li
            key={p}
            className={`inline-block px-3 py-1 rounded-full cursor-pointer bg-zinc-300
            }`}
            onClick={() => {
              setPage(p);
            }}
          >
            {p}
          </li>
        ))}
      <li
        className={`inline-block px-3 py-1 rounded-full cursor-pointer  bg-rose-500 text-white bg-zinc-300"
        }`}
      >
        {page}
      </li>

      {Array.from(
        { length: Math.min(numberOfPages, totalPages - page) },
        (_, i) => i + 1,
      ).map((p) => (
        <li
          key={p}
          className={`inline-block px-3 py-1 rounded-full cursor-pointer bg-zinc-300
          `}
          onClick={() => {
            setPage(page + p);
          }}
        >
          {page + p}
        </li>
      ))}

      <button
        disabled={page === totalPages}
        className="cursor-pointer bg-zinc-300 px-4 rounded-2xl hover:bg-zinc-300/75 transition-all"
        onClick={() => {
          setPage(page + 1);
        }}
      >
        <IoIosArrowForward />
      </button>
    </ul>
  );
}
