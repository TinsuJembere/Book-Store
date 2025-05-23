import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import BookCard from "../books/BookCard";
import '../../App.css'
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const TopSeller = () => {
  const [books, setBooks] = useState([]);
  const [category, setCategory] = useState("Choose a genre");

  const dropdown = ["Choose a genre", "Business", "Fiction", "Horror", "Adventure", "Marketing"];

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}/books.json`)
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.error("Error fetching books:", err));
  }, []);

  const filteredBook =
    category === "Choose a genre"
      ? books
      : books.filter((book) => book.category?.toLowerCase() === category.toLowerCase());

  return (
    <div className="py-10">
      <h2 className="text-3xl font-semibold mb-6">Top Sellers</h2>

      <div className="mb-8 flex items-center">
        <select
          onChange={(e) => setCategory(e.target.value)}
          name="category"
          id="category"
          className="border bg-[#EAEAEA] border-gray-300 rounded-md px-4 py-2 focus:outline-none"
        >
          {dropdown.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        navigation={true} 
        breakpoints={{
          640: { slidesPerView: 1, spaceBetween: 20 },
          768: { slidesPerView: 2, spaceBetween: 40 },
          1024: { slidesPerView: 2, spaceBetween: 50 },
          1180: { slidesPerView: 3, spaceBetween: 50 },
        }}
        modules={[Pagination, Navigation]}
        className="mySwiper"
      >
        {filteredBook.length > 0 ? (
          filteredBook.map((book, index) => (
            <SwiperSlide key={index}>
              <BookCard book={book} />
            </SwiperSlide>
          ))
        ) : (
          <p className="text-center text-gray-500">No books found in this category.</p>
        )}
      </Swiper>
    </div>
  );
};

export default TopSeller;
