import { Link } from "@tanstack/react-router";

export default function Hero() {
  return (
    <div className="hero w-full h-150 object-cover relative overflow-hidden">
      <img
        src="/hero-1.jpg"
        alt="hero image"
        height={"100%"}
        className=" w-full object-cover"
      />
      <div className="absolute z-50 top-2/3 left-1/2 -translate-x-1/2">
        <Link
          to="/products"
          className="cursor-pointer cta bg-primary text-white px-4 py-3 tracking-wider rounded-md font-light text-xl shadow-md shadow-zinc-700/30"
        >
          Our products
        </Link>
      </div>
    </div>
  );
}
