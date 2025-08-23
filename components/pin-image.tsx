import { Pin } from "@/lib/store/slices/pinsSlice";
import Image from "next/image";
import { FC, useState } from "react";

interface PinInfoProps {
  pin: Pin;
}

const PinImage: FC<PinInfoProps> = ({ pin }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  return (
    <Image
      src={pin.image_url || "/placeholder.svg"}
      alt={pin.alt_text || pin.title || "Pin image"}
      width={pin.width}
      height={pin.height}
      className={`w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105 ${
        imageLoaded ? "opacity-100" : "opacity-0"
      }`}
      onLoad={() => setImageLoaded(true)}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
};

export default PinImage;
