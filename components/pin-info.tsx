import React from "react";
import Image from "next/image";
import type { Pin } from "@/lib/store/slices/pinsSlice";

interface PinInfoProps {
  pin: Pin;
}

const PinInfo: React.FC<PinInfoProps> = ({ pin }) => {
  return (
    <div className="p-4">
      {pin.title && (
        <h3 className="font-medium text-sm text-foreground line-clamp-2 mb-4">
          {pin.title}
        </h3>
      )}

      {pin.user && (
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-muted overflow-hidden">
            {pin.user.avatar_url ? (
              <Image
                src={pin.user.avatar_url || "/placeholder.svg"}
                alt={pin.user.display_name || pin.user.username}
                width={24}
                height={24}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                <span className="text-xs font-medium text-primary">
                  {(pin.user.display_name || pin.user.username)
                    .charAt(0)
                    .toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <span className="text-sm text-muted-foreground truncate">
            {pin.user.display_name || pin.user.username}
          </span>
        </div>
      )}
    </div>
  );
};

export default PinInfo;