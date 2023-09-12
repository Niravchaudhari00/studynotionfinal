import { createSlice } from "@reduxjs/toolkit";
import { LoaderIcon, toast } from "react-hot-toast";
const initialState = {
     cart: localStorage.getItem("cart")
          ? JSON.parse(localStorage.getItem("cart"))
          : [],
     total: localStorage.getItem("total")
          ? JSON.parse(localStorage.getItem("total"))
          : 0,
     totalItem: localStorage.getItem("totalItem")
          ? JSON.parse(localStorage.getItem("totalItem"))
          : 0,
};
export const cartSlice = createSlice({
     name: "cart",
     initialState: initialState,
     reducers: {
          // add cart
          addCart: (state, actions) => {
               const course = actions.payload;
               const index = state.cart.findIndex(
                    (item) => item._id === course._id
               );

               // if course in cart
               if (index >= 0) {
                    toast.error("course already in cart");
                    return;
               }
               // cart is not available on cart
               state.cart.push(course);
               state.totalItem++;
               state.total += course.price;

               // value store in localstorage
               localStorage.setItem("cart", JSON.stringify(state.cart));
               localStorage.setItem("total", JSON.stringify(state.total));
               localStorage.setItem(
                    "totalItem",
                    JSON.stringify(state.totalItem)
               );

               toast.success("course added to cart");
          },
          // remove cart
          removeCart: (state, actions) => {
               const course_id = actions.payload;
               const index = state.cart.findIndex(
                    (item) => item._id === course_id
               );

               // if course in cart
               if (index >= 0) {
                    state.cart.splice(index, 1);
                    state.totalItem--;
                    state.total -= state.cart[index].price;
                    // value store in localstorage
                    localStorage.setItem("cart", JSON.stringify(state.cart));
                    localStorage.setItem("total", JSON.stringify(state.total));
                    localStorage.setItem(
                         "totalItem",
                         JSON.stringify(state.totalItem)
                    );

                    toast.success("course removed from cart");
               }
          },
          // reset cart
          resetCart: (state) => {
               state.cart = [];
               state.total = 0;
               state.totalItem = 0;

               // remove from localstorage
               localStorage.removeItem("cart");
               localStorage.removeItem("total");
               localStorage.removeItem("totalItem");
          },
     },
});

export const { addCart, removeCart, resetCart } = cartSlice.actions;

export default cartSlice.reducer;
