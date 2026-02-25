import { create } from "zustand";

interface AddressState {
  addressID: string | null;
  setAddress: (addressID: string) => void;
}

export const useAddressStore = create<AddressState>((set) => ({
  addressID: null,
  setAddress: (addressID: string) => set({ addressID: addressID }),
}));
