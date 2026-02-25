import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaPlus } from "react-icons/fa";
import { BoxContainer } from "../../../components/BoxContainer";
import cn from "../../../utils/cn";
import fetchAPI from "../../../utils/fetchAPI";
import { useAddressStore } from "../_useAddressStore";
import AddressForm from "./AddressForm";
type shippingAddress = {
  firstName: string;
  lastName: string;
  line1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  primary: boolean;
  _id: string;
};
const fetchAvailableAddress = async () => {
  const res = await fetchAPI("/api/v1/auth/addresses");
  if (res.status !== 200) throw new Error(res.data.msg);
  return res.data;
};

export default function ShippingAddress() {
  const { data, isLoading } = useQuery<shippingAddress[]>({
    queryFn: fetchAvailableAddress,
    queryKey: ["user", "addresses"],
    refetchOnWindowFocus: false,
  });
  const { addressID, setAddress } = useAddressStore();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const updateSelectAddress = () => {
      if (data && data.length > 0) {
        setAddress(data[0]._id);
      }
    };

    updateSelectAddress();
  }, [data]);

  return (
    <BoxContainer className="row-start-2 col-span-9">
      <div className="flex items-center mb-8">
        <FaMapMarkerAlt className="h-7 w-7 mr-3 text-gray-700 flex-shrink-0" />
        <h1 className="text-xl sm:text-2xl text-gray-800">Shipping Address</h1>
      </div>
      <div className="flex justify-between flex-wrap mt-6 gap-10 items-start">
        <div className="address basis-full lg:basis-1/2">
          {isLoading ? (
            <>
              <ShippingAddressPlaceHolder />
              <ShippingAddressPlaceHolder />
            </>
          ) : (
            <>
              <div className=" p-4">
                <div className="space-y-4 mb-8">
                  {data &&
                    data.map((address) => (
                      <div
                        onClick={() => setAddress(address._id)}
                        key={address._id}
                        className={cn(
                          "cursor-pointer bg-white rounded-2xl shadow-lg border-2  p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5",
                          addressID === address._id
                            ? "border-primary"
                            : "border-gray-200",
                        )}
                      >
                        <div className="flex items-start justify-between mb-3 relative">
                          <h2 className="text-xl font-semibold text-gray-900">
                            {address.firstName} {address.lastName}
                          </h2>
                          <div className="flex flex-col gap-2 absolute top-1 right-1">
                            {address.primary && (
                              <>
                                <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                                  PRIMARY
                                </span>
                              </>
                            )}
                            {addressID === address._id && (
                              <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-3 py-1 rounded-full text-center">
                                SELECT
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                          {address.line1}
                          <br />
                          {address.city}, {address.state}, {address.postalCode}{" "}
                          {address.country}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex-1">
          {showForm ? (
            <AddressForm onRequestCancel={() => setShowForm(false)} />
          ) : (
            <>
              <button
                className=" cursor-pointer w-fit bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-4 px-6 rounded-2xl shadow-lg flex items-center justify-center transition-all duration-200 hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
                onClick={() => setShowForm(true)}
              >
                <span className="text-md">Add New Address</span>
                <FaPlus className="h-6 w-6 ml-3 flex-shrink-0" />
              </button>
            </>
          )}
        </div>
      </div>
    </BoxContainer>
  );
}

function ShippingAddressPlaceHolder() {
  return (
    <div
      className={cn(
        "cursor-pointer bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-6 hover:shadow-md animate-pulse mb-3",
      )}
    >
      <div className="flex items-start justify-between mb-3 relative">
        <h2 className="text-xl font-semibold rounded-lg text-transparent bg-zinc-200">
          John Doe
        </h2>
        <div className="flex flex-col gap-2 absolute top-1 right-1">
          <span className=" text-xs font-medium px-3 py-1  text-center rounded-lg text-transparent bg-zinc-200">
            SELECT
          </span>
        </div>
      </div>
      <div className="text-gray-600 leading-relaxed">
        <p className="rounded-lg text-transparent bg-zinc-200 w-fit">
          123 Main Street
        </p>
        <p className="rounded-lg text-transparent bg-zinc-200 w-fit mt-2">
          New York, New York, 85845 USA
        </p>
      </div>
    </div>
  );
}
