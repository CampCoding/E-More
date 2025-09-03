import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import homeSlider1 from "../../../assets/COVER 1_page-0001.jpg";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "./banner2.css";

// import required modules
import { Autoplay, Navigation, Pagination } from "swiper/modules";

export default function BannerSwiper() {
  return (
    <>
      <Swiper
        slidesPerView={1}
        grabCursor={true}
        loop={true}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 6500,
          disableOnInteraction: false
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        <SwiperSlide>
          <img
            src={require("../../../assets/COVER 1_page-0001.jpg")}
            alt="logo"
          />
        </SwiperSlide>
        {}
      </Swiper>
    </>
  );
}
