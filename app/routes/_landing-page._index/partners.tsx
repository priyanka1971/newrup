import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";

type Props = {
  partners: any[];
};

export const Partners = ({ partners }: Props) => {
  return (
    <Swiper
      grabCursor={true}
      spaceBetween={30}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      centeredSlides={true}
      slidesPerView={partners.length >= 5 ? 5 : partners.length}
      modules={[Autoplay]}
      loop={true}
      breakpoints={{
        0: {
          slidesPerView: 1,
        },
        400: {
          slidesPerView: 2,
        },
        639: {
          slidesPerView: 4,
        },
      }}
    >
      {partners.map((partner) => (
        <SwiperSlide key={partner.name} className="h-28">
          <img
            src={partner.image}
            alt={partner.name}
            className="block w-full object-cover"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
