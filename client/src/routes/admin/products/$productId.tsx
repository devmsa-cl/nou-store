import { createFileRoute, useParams } from "@tanstack/react-router";
import {
  BoxContainer,
  BoxHeadingText,
  BoxSubText,
} from "../../../components/BoxContainer";
import Button from "../../../components/common/Button";
import { useCreateProduct } from "../../../hooks/useCreateProduct";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { COLORS } from "../../../../../src/config/constant";
import UncontrolledInput from "../../../components/common/UncontrolledInput";
import UncontrolledSelect from "../../../components/common/UncontrolledSelect";
import UncontrolledTextarea from "../../../components/common/UncontrolledTextarea";
import fetchAPI from "../../../utils/fetchAPI";
import { ProductVariants } from "./-ProductVariants";
export const Route = createFileRoute("/admin/products/$productId")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="flex flex-col gap-4">
      <ProductDetailsComponent />
      <ProductVariants />

      <VariantAddFormComponent />
    </section>
  );
}
type ProductType = {
  name: string;
  description: string;
  categories: string[];
  isReadyForSale: boolean;
};
const updateProductDetailFunc = async ({
  productId,
  data,
}: {
  data: ProductType;
  productId: string;
}) => {
  return await fetchAPI.patch(`/api/v1/products/${productId}`, data);
};

function ProductDetailsComponent() {
  const { productId } = useParams({ from: "/admin/products/$productId" });
  const { data } = useCreateProduct(productId);
  const { mutate, isPending } = useMutation({
    mutationFn: updateProductDetailFunc,
    onSuccess: () => {
      toast.success("Product updated successfully");
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        console.log(err);
        toast.error(err.response?.data.msg);
      }
    },
  });
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const data = Object.fromEntries(formData);
    let categories: string[] = [];
    if (typeof data.categories === "string") {
      categories = data.categories.split(",").map((c) => c.trim());
    }
    const productData: ProductType = {
      name: data.name.toString(),
      description: data.description.toString(),
      categories,
      isReadyForSale: data.isReadyForSale === "on",
    };

    mutate({ productId, data: productData });
  };
  return (
    <BoxContainer>
      <BoxHeadingText>Product Details</BoxHeadingText>
      <BoxSubText>Basic information about your product</BoxSubText>
      <div className="product flex gap-4">
        <div className="product-basic-info flex-1">
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <UncontrolledInput
              name="name"
              label="Name"
              type="text"
              placeholder="name"
              defaultValue={data?.name}
            />
            <UncontrolledTextarea
              name="description"
              label="Description"
              className="h-32"
              defaultValue={data?.description}
            />
            <div>
              {data && (
                <input
                  type="checkbox"
                  name="isReadyForSale"
                  id="isReadyForSale"
                  defaultChecked={data?.isReadyForSale === true}
                />
              )}
              <label htmlFor="isReadyForSale">Mark as ready for sale</label>
            </div>
            <UncontrolledInput
              name="categories"
              label="Categories"
              type="text"
              placeholder="shoes,jackets, pant ...."
              defaultValue={data?.categories}
            />
            <div className="pt-4">
              <Button disabled={isPending} type="submit">
                Update
              </Button>
            </div>
          </form>
        </div>

        <GalleryComponent images={data?.images || []} />
      </div>
    </BoxContainer>
  );
}

function VariantAddFormComponent() {
  const client = useQueryClient();
  const { productId } = useParams({ from: "/admin/products/$productId" });
  const formRef = useRef<HTMLFormElement>(null);

  const handleVariantSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(formRef.current!);
    const data = Object.fromEntries(formData);

    try {
      const res = await fetchAPI.post(
        `/api/v1/products/${productId}/variants`,
        data,
      );

      if (res.status === 200) {
        if (formRef.current) {
          const quantityInput = formRef.current.querySelector(
            "input[name=quantity]",
          ) as HTMLInputElement;
          const sizeInput = formRef.current.querySelector(
            "input[name=size]",
          ) as HTMLInputElement;
          if (quantityInput) {
            quantityInput.value = "";
          }
          if (sizeInput) {
            sizeInput.value = "";
          }
        }
        toast.success("Variant added successfully");
        client.invalidateQueries({
          queryKey: ["products", "variants", productId],
        });
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.msg);
      }
    }
  };
  return (
    <BoxContainer>
      <BoxHeadingText>Create Variant</BoxHeadingText>
      <BoxSubText>Add new variant to the product.</BoxSubText>
      <section className="w-2/3">
        <div className="add-item">
          <form onSubmit={handleVariantSubmit} ref={formRef}>
            <div className="variant-item flex flex-col gap-2">
              <div className="inline-group flex gap-2">
                <UncontrolledInput
                  name="size"
                  label="size"
                  placeholder="8, XL etc..."
                />
                <UncontrolledSelect
                  name="color"
                  label="color"
                  options={COLORS}
                />
              </div>

              <UncontrolledInput name="price" label="price" type="number" />
              <UncontrolledInput
                name="quantity"
                label="quantity"
                type="number"
              />
            </div>
            <div className="input-group flex flex-col  gap-1">
              <label
                className="text-xs text-zinc-600 capitalize"
                htmlFor="file"
              >
                Upload images
              </label>
              <input type="file" placeholder="eg.24" id="file" hidden />
              <div className="image-box w-full h-20 bg-zinc-50 border-2 border-dashed border-zinc-200"></div>
            </div>
            <Button type="submit">Add</Button>
          </form>
        </div>
      </section>
    </BoxContainer>
  );
}

type UseUploadParam = {
  onUploadSuccess?: (path: string) => void;
  onUploadError?: (error: string) => void;
};
function useUploadImage(p?: UseUploadParam) {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const uploadFn = async (data: FormData, productId: string) => {
    const xhr = new XMLHttpRequest();

    const url = `/api/v1/uploads?productId=${productId}`;

    xhr.open("POST", url, true);

    xhr.onprogress = () => {
      setUploading(false);
      setProgress(0);
    };
    xhr.onloadstart = () => {
      setUploading(true);
    };

    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        setUploading(false);
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          p?.onUploadSuccess?.(response.url);
          toast.success("Image uploaded successfully");
        } else {
          p?.onUploadError?.("Image upload failed");
        }
      }
    };

    xhr.upload.onprogress = (e) => {
      const total = e.total;
      const loaded = e.loaded;
      const percentComplete = Math.round((loaded / total) * 100);
      setProgress(percentComplete);
    };
    xhr.send(data);
  };

  return { uploadFn, progress, isLoading: uploading };
}
function UploadImageComponent({
  onUploadSuccess,
}: {
  onUploadSuccess: (path: string) => void;
}) {
  const { uploadFn, progress, isLoading } = useUploadImage({
    onUploadSuccess: onUploadSuccess,
  });
  const { productId } = useParams({ from: "/admin/products/$productId" });
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const formData = new FormData();
    formData.append("file", e.target.files![0]);
    uploadFn(formData, productId);
  };

  return (
    <div className="upload relative">
      <label
        htmlFor="file"
        className="w-full h-6 border-2 border-dashed border-zinc-100 grid place-items-center rounded-2xl cursor-pointer font-bold text-zinc-300 text-xs z-30 relative"
      >
        {isLoading ? "Uploading..." : "Select file"}
      </label>
      <div
        className="progress-bar bg-primary h-6 absolute top-0 z-20 rounded-2xl 
        "
        style={{ width: progress + "%" }}
      ></div>
      <input
        onChange={handleUpload}
        type="file"
        id="file"
        name="file"
        typeof="multiple-part/form-data"
        hidden
      />
    </div>
  );
}
function GalleryComponent({ images: originalImages }: { images: string[] }) {
  const [images, setImages] = useState<string[]>(originalImages);
  useEffect(() => {
    setImages(originalImages);
  }, [originalImages]);
  return (
    <div className="gallery flex-1">
      <h2 className="text-lg">Gallery</h2>
      <UploadImageComponent
        onUploadSuccess={(path: string) => {
          setImages((prev) => [...prev, path]);
        }}
      />
      <div className="gallery-items p-4 flex flex-wrap gap-4">
        {images.map((image) => (
          <div
            key={image}
            className="item w-20 h-20 rounded-2xl overflow-hidden"
          >
            <img
              className="h-full w-full object-cover"
              src={import.meta.env.VITE_S3_BUCKET_PUBLIC_URL + image}
              alt=""
            />
          </div>
        ))}
      </div>
    </div>
  );
}
