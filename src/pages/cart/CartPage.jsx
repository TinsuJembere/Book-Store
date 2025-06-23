import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import getImg from "../../utils/getImg";
import { clearCart, removeFromCart } from "../../redux/features/cart/cartSlice";

const CartPage = () => {
  const reduxCartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const [serverCart, setServerCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:3000/api/auth/cart", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.cart) {
            setServerCart(data.cart);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const cartItems = serverCart
    ? serverCart.map((item) => ({ ...item.book, quantity: item.quantity }))
    : reduxCartItems;
  const totalPrice = cartItems.reduce((acc, book) => acc + (book.newPrice * (book.quantity || 1)), 0);

  const handleRemove = (book) => {
    const token = localStorage.getItem("token");
    if (serverCart && token) {
      fetch("http://localhost:3000/api/auth/cart", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookId: book._id }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.cart) setServerCart(data.cart);
        });
    } else {
      dispatch(removeFromCart(book));
    }
  };
  const handleClearCart = () => {
    const token = localStorage.getItem("token");
    if (serverCart && token) {
      fetch("http://localhost:3000/api/auth/cart/all", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.cart) setServerCart(data.cart);
        });
    } else {
      dispatch(clearCart());
    }
  };

  if (loading) return <div className="text-center py-10">Loading cart...</div>;

  return (
    <>
      <div className="flex mt-12 h-full flex-col overflow-hidden bg-white shadow-xl">
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          <div className="flex items-start justify-between">
            <div className="text-lg font-medium text-gray-900">
              Shopping cart
            </div>
            <div className="ml-3 flex h-7 items-center ">
              <button
                type="button"
                onClick={() => handleClearCart()}
                className="relative -m-2 py-1 px-2 cursor-pointer bg-red-500 text-white rounded-md hover:bg-secondary transition-all duration-200"
              >
                <span>Clear Cart</span>
              </button>
            </div>
          </div>

          <div className="mt-8">
            <div className="flow-root">
              <ul role="list" className="-my-6 divide-y divide-gray-200">
                {cartItems.length > 0 ? (
                  cartItems.map((book, idx) => (
                    <li key={book._id || book.id || idx} className="flex py-6">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <img
                          alt={book.title || "Book cover"}
                          src={`${getImg(book?.coverImage)}`}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>

                      <div className="ml-4 flex flex-1 flex-col">
                        <div>
                          <div className="flex flex-wrap justify-between text-base font-medium text-gray-900">
                            <h3>
                              <Link to="/">{book.title}</Link>
                            </h3>
                            <p className="sm:ml-4">${book.newPrice.toFixed(2)}</p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500 capitalize">
                            <strong>Category:</strong> {book.category}
                          </p>
                        </div>
                        <div className="flex flex-1 flex-wrap items-end justify-between space-y-2 text-sm">
                          <p className="text-gray-500">
                            <strong>Quantity: </strong>{book.quantity || 1}
                          </p>

                          <div className="flex">
                            <button
                              onClick={() => handleRemove(book)}
                              type="button"
                              className="font-medium cursor-pointer text-indigo-600 hover:text-indigo-500"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No books in your cart!</p>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
          <div className="flex justify-between text-base font-medium text-gray-900">
            <p>Subtotal</p>
            <p>${totalPrice.toFixed(2)}</p>
          </div>
          <p className="mt-0.5 text-sm text-gray-500">
            Shipping and taxes calculated at checkout.
          </p>
          <div className="mt-6">
            <Link
              to="/checkout"
              className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
            >
              Checkout
            </Link>
          </div>
          <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
            <Link
              to="/"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Continue Shopping <span aria-hidden="true"> &rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;
