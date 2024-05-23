import React from 'react';
import { SliderBox } from "react-native-image-slider-box";

export default EventCarousel = ({event}) => {
  return (
    <SliderBox images={event.images_url}
      dotColor="#FFEE58"
      inactiveDotColor="#90A4AE" dotStyle={{
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 0,
      }} />
  );

}
