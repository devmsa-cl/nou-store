import UncontrolledInput from "../../../components/common/UncontrolledInput";
type Props = {
  onRequestCancel: () => void;
};
export default function AddressForm({ onRequestCancel }: Props) {
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const inputs = Object.fromEntries(formData);

    console.log(inputs);
  };

  return (
    <div className="p-8 border-2 rounded-2xl border-zinc-400 shadow-lg w-full">
      <h2 className="font-semibold text-zinc-600 -tracking-wider">
        Add Address
      </h2>
      <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
        <div className="pt-4 flex gap-4">
          <div>
            <UncontrolledInput
              name="firstName"
              placeholder="first name"
              label="First name"
            />
          </div>
          <div>
            <UncontrolledInput
              name="lastName"
              placeholder="Last name"
              label="First name"
            />
          </div>
        </div>
        <div>
          <UncontrolledInput
            name="address"
            placeholder="Address"
            label="Address"
          />
        </div>
        <div className="flex gap-2">
          <div>
            <UncontrolledInput name="city" placeholder="city" label="City" />
          </div>
          <div>
            <UncontrolledInput name="state" placeholder="state" label="state" />
          </div>
        </div>
        <div className="w-1/3">
          <div>
            <UncontrolledInput
              name="postalCode"
              placeholder="zip code"
              label="zip code"
            />
          </div>
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-zinc-800 uppercase text-zinc-100 px-8 py-2 rounded-xl tracking-wider cursor-pointer shadow-md"
          >
            Submit
          </button>
          <button
            onClick={onRequestCancel}
            type="button"
            className="bg-rose-400 uppercase text-zinc-100 px-8 py-2 rounded-xl tracking-wider cursor-pointer shadow-md"
          >
            cancel
          </button>
        </div>
      </form>
    </div>
  );
}
