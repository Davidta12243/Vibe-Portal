// import Swiper core and required modules
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
  Keyboard,
} from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
// import "swiper/css/navigation";
import "swiper/css/pagination";
// import "swiper/css/scrollbar";
import Image from "next/image";
import { useRef } from "react";
// import bannerImage1 from "/assets/images/bannerImage1.png"

const Herosection = () => {
  const progressCircle = useRef(null);
  const progressContent = useRef(null);
  const onAutoplayTimeLeft = (s, time, progress) => {
    progressCircle.current.style.setProperty("--progress", 1 - progress);
    progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
  };
  return (
    <div className="main-container">
      <Swiper
        // install Swiper modules
        modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay, Keyboard]}
        slidesPerView={1}
        navigation={true}
        loop={true}
        autoplay={{
          delay: 3000,
        }}
        keyboard={{
          enabled: true,
        }}
        pagination={{ clickable: true }}
        onAutoplayTimeLeft={onAutoplayTimeLeft}
        onSwiper={(swiper) => {}}
        onSlideChange={() => {}}
      >
        <SwiperSlide>
          <Image
            src={"/assets/images/bannerImage5.jpg"}
            width={1500}
            height={400}
            className="h-[200px] z-0 lg:h-[600px] pb-8"
            alt="bannerImage1"
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            src="/assets/images/bannerImage4.jpg"
            width={1920}
            height={400}
            className="h-[200px] z-0 lg:h-[600px] pb-8"
            alt="bannerImage1"
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            src="/assets/images/bannerImage3.jpg"
            width={1900}
            height={400}
            className="h-[200px] z-0 lg:h-[600px] pb-8"
            alt="bannerImage1"
          />
        </SwiperSlide>
        <div className="autoplay-progress -pt-10" slot="container-end">
        <svg viewBox="0 0 48 48" ref={progressCircle}>
          <circle cx="24" cy="24" r="20"></circle>
        </svg>
        <span ref={progressContent}></span>
      </div>
      </Swiper>
      
    </div>
  );
};

export default Herosection;
