import { Logo } from "./common/Logo";
import { Link } from "@tanstack/react-router";
export default function Footer() {
  return (
    <footer className="h-60 bg-white page-footer">
      <div className="container mx-auto p-8">
        <div className="flex gap-20">
          <div className="brand inline-flex flex-col w-auto items-center">
            <Logo />
            <h3 className="text-xl text-primary font-bold">Nou shoe</h3>
          </div>
          <div className="footer-nav mt-6">
            <ul className=" flex gap-12">
              <li>
                <h3 className="text-2xl text-zinc-700 pb-4">Navigation</h3>
                <ul className="flex flex-col gap-4">
                  <li>
                    <Link to={"/"}>Home</Link>
                  </li>
                  <li>
                    <Link to={"/products"}>Product</Link>
                  </li>
                  <li>
                    <Link to={"/about"}>About us</Link>
                  </li>
                </ul>
              </li>
              <li>
                <h3 className="text-2xl text-zinc-700 pb-4">
                  Business Address
                </h3>
                <p>Jl. Jend. Sudirman No. 1</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
