import { useParams } from "@tanstack/react-router";
import {
  useCreateVariant,
  type Variant,
} from "../../../hooks/useCreateVariant";
import { useMutation } from "@tanstack/react-query";
import {
  BoxContainer,
  BoxHeadingText,
  BoxSubText,
} from "../../../components/BoxContainer";
import { useRef, useState } from "react";
import fetchAI from "../../../utils/fetchAPI";
import { ColorStatic } from "../../../components/card/ColorStatic";
import { IoPencil, IoTrashBin } from "react-icons/io5";
import { convertCentToUSD } from "../../../utils/helper";
import fetchAPI from "../../../utils/fetchAPI";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
const deleteInventoryFunc = async (variantId: string) => {
  return await fetchAI.delete(`/api/v1/products/variants/${variantId}`);
};

type UpdateProp = {
  variantId: string;
  data: {
    quantity: number;
    price: number;
  };
};
const updateVariantFunc = async (prop: UpdateProp) => {
  await fetchAPI.patch(
    `/api/v1/products/variants/${prop.variantId}`,
    prop.data,
  );
};
export function ProductVariants() {
  const { productId } = useParams({ from: "/admin/products/$productId" });
  const { data, refetch } = useCreateVariant(productId);
  const [editID, setEditID] = useState<string | null>(null);
  const { mutate } = useMutation({
    mutationFn: deleteInventoryFunc,
    onSuccess: () => {
      refetch();
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.msg);
      }
    },
  });
  const { mutate: updateInventory } = useMutation({
    mutationFn: updateVariantFunc,
    onSuccess: () => {
      refetch();
      setEditID(null);
      toast.success("Inventory updated successfully");
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.msg);
      }
    },
  });

  return (
    <>
      <BoxContainer>
        <BoxHeadingText>Inventory</BoxHeadingText>
        <BoxSubText>All the available variants</BoxSubText>

        <section>
          <div className="relative overflow-x-auto  border border-zinc-50 rounded-md">
            <table className="w-full text-sm text-left">
              <thead className="text-sm bg-zinc-300 ">
                <tr className="uppercase text-xs font-light">
                  <th scope="col" className="px-6 py-3">
                    size
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Color
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Stock
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data?.map((variant) => {
                  if (editID && editID === variant._id) {
                    return (
                      <ProductItemEdit
                        key={variant._id}
                        variant={variant}
                        onRequestCancel={() => {
                          setEditID("");
                        }}
                        onRequestUpdate={(quantity: number, price: number) => {
                          updateInventory({
                            variantId: variant._id,
                            data: {
                              quantity,
                              price,
                            },
                          });
                        }}
                      />
                    );
                  } else {
                    return (
                      <ProductItem
                        key={variant._id}
                        variant={variant}
                        onRequestEdit={(id) => {
                          setEditID(id);
                        }}
                        onRequestDelete={() => {
                          mutate(variant._id);
                        }}
                      />
                    );
                  }
                })}
              </tbody>
            </table>
          </div>
        </section>
      </BoxContainer>
    </>
  );
}
type ProductItemEditProps = {
  variant: Variant;
  onRequestCancel: () => void;
  onRequestUpdate: (quantity: number, price: number) => void;
};
function ProductItemEdit({
  variant,
  onRequestCancel,
  onRequestUpdate,
}: ProductItemEditProps) {
  const priceRef = useRef<HTMLInputElement>(null);
  const quantityRef = useRef<HTMLInputElement>(null);
  return (
    <tr key={variant._id} className="border-b border-default">
      <th scope="row" className="px-6 py-4">
        {variant.size}
      </th>
      <td className="px-6 py-4 flex gap-2 items-center">
        <ColorStatic colorName={variant.color} />
        <p className="capitalize">{variant.color}</p>
      </td>
      <td className="px-5 py-3">
        <input
          ref={priceRef}
          type="text"
          defaultValue={variant.price}
          className="bg-zinc-200 p-1 focus:outline-0 rounded-md w-fit"
        />
      </td>
      <td className="px-6 py-4">
        <input
          ref={quantityRef}
          type="text"
          defaultValue={variant.quantity}
          className="bg-zinc-200 p-1 focus:outline-0 rounded-md w-fit"
        />
      </td>
      <td>
        <div className="flex gap-3">
          <button
            onClick={() => {
              onRequestUpdate(
                Number(quantityRef.current?.value),
                Number(priceRef.current?.value),
              );
            }}
            className="flex items-center bg-emerald-400 text-white gap-1 py-1 px-2 rounded-md cursor-pointer"
          >
            <IoPencil />
            <span>Update</span>
          </button>
          <button
            onClick={() => onRequestCancel()}
            className="flex items-center bg-rose-500 text-white gap-1 py-1 px-2 rounded-md cursor-pointer"
          >
            <IoPencil />
            <span>Cancel</span>
          </button>
        </div>
      </td>
    </tr>
  );
}
type ProductItemProps = {
  variant: Variant;
  onRequestDelete: () => void;
  onRequestEdit: (id: string) => void;
};
function ProductItem({
  variant,
  onRequestDelete,
  onRequestEdit,
}: ProductItemProps) {
  return (
    <tr key={variant._id} className="border-b border-default">
      <th scope="row" className="px-6 py-4">
        {variant.size}
      </th>
      <td className="px-6 py-4 flex gap-2 items-center">
        <ColorStatic colorName={variant.color} />
        <p className="capitalize">{variant.color}</p>
      </td>
      <td className="px-6 py-4">{convertCentToUSD(variant.price)}</td>
      <td className="px-6 py-4">{variant.quantity}</td>
      <td>
        <div className="flex gap-3">
          <button
            onClick={() => onRequestEdit(variant._id)}
            className="flex items-center bg-emerald-400 text-white gap-1 py-1 px-2 rounded-md cursor-pointer"
          >
            <IoPencil />
            <span>Edit</span>
          </button>

          <button
            onClick={onRequestDelete}
            className="flex items-center bg-rose-400 text-white gap-1 py-1 px-2 rounded-md cursor-pointer"
          >
            <IoTrashBin />
            <span>Trash</span>
          </button>
        </div>
      </td>
    </tr>
  );
}
