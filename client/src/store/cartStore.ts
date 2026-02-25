import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Item = {
  productId: string;
  variantId: string;
  price: number;
  size: string;
  color: string;
  imageUrl: string;
  quantity: number;
  productName: string;
  productDescription: string;
};
type Cart = {
  // store item array
  cartItem: Item[];
  // add item to cart method
  addItem: (item: Item) => void;
  // update item quantity method
  updateQuantity: (item: Item) => void;
  // clear cart method
  clearCart: () => void;
};

export const useCartStore = create<Cart>()(
  persist(
    (set, get) => ({
      cartItem: [],
      clearCart: () => set({ cartItem: [] }),
      addItem: (item: Item) => {
        const data = get().cartItem;

        const findItemIndex = data.findIndex((cart) => {
          return (
            cart.productId == item.productId &&
            cart.color == item.color &&
            cart.size == item.size
          );
        });

        // add new item
        if (findItemIndex == -1) {
          data.push({
            productId: item.productId,
            variantId: item.variantId,
            price: item.price,
            color: item.color,
            size: item.size,
            imageUrl: item.imageUrl,
            quantity: item.quantity,
            productName: item.productName,
            productDescription: item.productDescription,
          });
        } else {
          data[findItemIndex].quantity++;
        }

        set({ cartItem: [...data] });
      },

      updateQuantity: (item: Item) => {
        const findItemIndex = get().cartItem.findIndex((cart) => {
          return (
            cart.productId == item.productId &&
            cart.color == item.color &&
            cart.size == item.size
          );
        });

        if (findItemIndex !== -1) {
          const data = get().cartItem;
          data[findItemIndex].quantity = item.quantity;

          // remove item when quantity is 0
          if (data[findItemIndex].quantity == 0) {
            data.splice(findItemIndex, 1);
          }

          set({ cartItem: [...data] });
        }
      },
    }),
    {
      name: "cart-item",
    }
  )
);
