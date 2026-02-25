import { createFileRoute, Link } from "@tanstack/react-router";
import { BoxContainer } from "../../../components/BoxContainer";
import fetchAPI from "../../../utils/fetchAPI";
import { IoIosAdd } from "react-icons/io";

import { useAllProduct } from "../../../hooks/useAllProduct";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
export const Route = createFileRoute("/admin/products/")({
  component: RouteComponent,
});

const newProductTemplates = {
  name: "New product",
  description: "new product description",
};

function RouteComponent() {
  const { data } = useAllProduct();

  const createProduct = async () => {
    try {
      const r = await fetchAPI.post("/api/v1/products", {
        product: newProductTemplates,
      });

      if (r.status === 201) {
        window.location.href = `/admin/products/${r.data._id}`;
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.msg);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <section id="product">
      <BoxContainer className="relative">
        <h2 className="text-2xl leading-relaxed">Products</h2>
        <p>List of all sale products.</p>
        <div className="absolute top-4 right-4">
          <button
            onClick={createProduct}
            className="px-6 py-2 bg-primary rounded-2xl cursor-pointer text-white flex items-center gap-2"
          >
            <IoIosAdd size={24} className="font-bold" /> New
          </button>
        </div>

        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right text-body">
            <thead className="text-sm text-body bg-neutral-secondary-medium">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 rounded-s-base font-medium"
                >
                  Image
                </th>
                <th scope="col" className="px-6 py-3 font-medium">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 font-medium">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 font-medium">
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 rounded-e-base font-medium"
                >
                  Rating
                </th>
              </tr>
            </thead>
            <tbody>
              {data &&
                data.length > 0 &&
                data.map((item) => (
                  <tr
                    key={item._id}
                    className="bg-neutral-primary odd:bg-zinc-50"
                  >
                    <td
                      scope="row"
                      className="px-6 py-4 font-medium text-heading whitespace-nowrap"
                    >
                      <img
                        className="w-20 h-20 object-cover rounded-2xl overflow-hidden"
                        src={
                          item.images[0]
                            ? import.meta.env.VITE_S3_BUCKET_PUBLIC_URL +
                              item.images[0]
                            : "/default-product-image.png"
                        }
                        alt=""
                      />
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/admin/products/$productId`}
                        params={{ productId: item._id }}
                        className="text-primary hover:underline"
                      >
                        {item.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4">{item.categories.join(",")}</td>
                    <td className={`px-6 py-4`}>
                      <span
                        className={` p-2 px-4 rounded-full text-xs text-white ${item.isReadyForSale ? "bg-emerald-500 " : "bg-amber-500"}`}
                      >
                        {item.isReadyForSale ? "Ready" : "Not ready"}
                      </span>
                    </td>
                    <td className="px-6 py-4">4.5</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </BoxContainer>
    </section>
  );
}
