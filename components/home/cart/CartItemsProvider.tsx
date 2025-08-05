'use client';

import {
  decreaseCartItemQty,
  deleteCartItemAct,
  deleteManyCartItemsAct,
  increaseCartItemQty,
  setCartItemQtyAct,
} from '@/actions/products';
import { calDiscountPrice } from '@/lib/helpers';
import { UserCartWithPayload } from '@/types/products';
import { createContext, useContext, useState } from 'react';
import { toast } from 'sonner';
import { createStore, StoreApi, useStore } from 'zustand';

interface CartItemsStore {
  isPending: boolean;
  cartItems: UserCartWithPayload['cartItems'];
  cartTotal: number;
  setQty: (id: string, quantity: number) => void;
  setCartTotal: (ids: string[]) => void;
  increaseQty: (id: string) => void;
  decreaseQty: (id: string) => void;
  deleteCartItem: (id: string) => void;
  setIsPending: (isPending: boolean) => void;
  deleteManyCartItems: (ids: string[]) => void;
}

interface CartItemsProviderProps {
  children: React.ReactNode;
  cartItems: UserCartWithPayload['cartItems'];
}

const CartItemsContext = createContext<StoreApi<CartItemsStore> | undefined>(undefined);

const CartItemsProvider = ({ children, cartItems }: CartItemsProviderProps) => {
  const [store] = useState(() =>
    createStore<CartItemsStore>((set, get) => ({
      isPending: false,
      cartItems,
      cartTotal: 0,
      setIsPending: (isPending: boolean) => set({ isPending }),
      setQty: async (id: string, quantity: number) => {
        if (quantity < 1) {
          return get().deleteCartItem(id);
        }
        set({ isPending: true });
        const initialCartItems = get().cartItems;
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.id === id ? { ...item, quantity: Math.min(quantity, item.productVariant.stock) } : item
          ),
        }));
        await setCartItemQtyAct(id, quantity).then((res) => {
          if (res?.error) {
            set(() => ({
              cartItems: initialCartItems,
            }));
            toast.error(res.error);
          }
        });
        set({ isPending: false });
      },
      increaseQty: async (id: string) => {
        set({ isPending: true });
        let initialCartItems = get().cartItems;
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.id === id ? { ...item, quantity: Math.min(item.quantity + 1, item.productVariant.stock) } : item
          ),
        }));
        await increaseCartItemQty(id).then((res) => {
          if (res?.error) {
            set(() => ({
              cartItems: initialCartItems,
            }));
            toast.error(res.error);
          }
        });
        set({ isPending: false });
      },
      decreaseQty: async (id: string) => {
        set({ isPending: true });
        let initialCartItems = get().cartItems;
        set((state) => {
          const cartItem = state.cartItems.find((item) => item.id === id);
          if (cartItem?.quantity === 1) {
            return {
              cartItems: state.cartItems.filter((item) => item.id !== id),
            };
          }
          return {
            cartItems: state.cartItems.map((item) =>
              item.id === id ? { ...item, quantity: item.quantity - 1 } : item
            ),
          };
        });
        await decreaseCartItemQty(id).then((res) => {
          if (res?.error) {
            set(() => ({
              cartItems: initialCartItems,
            }));
            toast.error(res.error);
          }
        });
        set({ isPending: false });
      },
      deleteCartItem: async (id: string) => {
        set({ isPending: true });
        const initialCartItems = get().cartItems;
        set((state) => ({
          cartItems: state.cartItems.filter((item) => item.id !== id),
        }));
        await deleteCartItemAct(id).then((res) => {
          if (res?.error) {
            set(() => ({
              cartItems: initialCartItems,
            }));
            toast.error(res.error);
          }
        });
        set({ isPending: false });
      },
      deleteManyCartItems: async (ids: string[]) => {
        set({ isPending: true });
        const initialCartItems = get().cartItems;
        set((state) => ({
          cartItems: state.cartItems.filter((item) => !ids.includes(item.id)),
        }));
        await deleteManyCartItemsAct(ids).then((res) => {
          if (res?.error) {
            set(() => ({
              cartItems: initialCartItems,
            }));
            toast.error(res.error);
          }
        });
        set({ isPending: false });
      },
      setCartTotal: (ids: string[]) =>
        set((state) => ({
          cartTotal: state.cartItems
            .filter((item) => ids.includes(item.id))
            .reduce(
              (total, item) =>
                total +
                calDiscountPrice(item.productVariant.price, item.productVariant.product.discountPercentage) *
                  item.quantity,
              0
            ),
        })),
    }))
  );

  return <CartItemsContext.Provider value={store}>{children}</CartItemsContext.Provider>;
};

export function useCartItemsStore<T>(selector: (state: CartItemsStore) => T) {
  const context = useContext(CartItemsContext);

  if (!context) throw new Error('useCartItemsStore must be used within a CartItemsProvider');

  return useStore(context, selector);
}

export default CartItemsProvider;
