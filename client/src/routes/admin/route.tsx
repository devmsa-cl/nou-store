import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { CiCircleList } from "react-icons/ci";
import { IoCartOutline } from "react-icons/io5";
import AdminOnly from "../../components/AdminOnly";

export const Route = createFileRoute("/admin")({
  component: () => (
    <AdminOnly>
      <RouteComponent />
    </AdminOnly>
  ),
});

function RouteComponent() {
  return (
    <div className="container mx-auto">
      <div className="flex flex-col gap-2 md:grid md:grid-cols-12">
        <div className="side-panel md:col-start-1 md:col-span-3 justify-end">
          <div className="flex justify-end">
            <ul className="flex flex-col flex-wrap gap-2 text-center pt-4">
              <li className="bg-white py-2 rounded-xl px-8">
                <Link to="/admin/products" className="flex justify-end gap-4">
                  <p>Products</p>
                  <span>
                    <CiCircleList size={24} />
                  </span>
                </Link>
              </li>
              <li className="bg-white py-2 rounded-xl px-8">
                <Link to="/admin/orders" className="flex justify-end gap-4">
                  <p>Orders</p>
                  <span>
                    <IoCartOutline size={24} />
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto p-4 md:col-start-4 md:col-span-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
