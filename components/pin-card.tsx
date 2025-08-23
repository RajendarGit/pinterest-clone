"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { SavePinModal } from "./save-pin-modal";
import { PinOptionsModal } from "./pin-options-modal";
import type { Pin } from "@/lib/store/slices/pinsSlice";
import PinButton from "./pin-button";
import LikeButton from "./like-button";
import ShareButton from "./share-button";
import OptionButton from "./option-button";
import PinInfo from "./pin-info";
import PinImage from "./pin-image";

interface PinCardProps {
  pin: Pin;
}

export function PinCard({ pin }: PinCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowSaveModal(true);
  };

  const handleOptions = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowOptionsModal(true);
  };

  return (
    <>
      <Card
        className="group cursor-pointer card-theme p-0"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative">
          <div className="relative overflow-hidden rounded-t-lg">
            <PinImage pin={pin} />
            {/* Overlay with actions */}
            <div
              className={`absolute inset-0 bg-black/20 transition-opacity duration-200 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="absolute top-3 right-3 flex space-x-2">
                <PinButton handleSave={handleSave} />
              </div>

              <div className="absolute bottom-3 right-3 flex space-x-2">
                <LikeButton />
                <ShareButton pin={pin} />
                <OptionButton handleOptions={handleOptions} />
              </div>
            </div>
          </div>

          {/* Pin info */}
          <PinInfo pin={pin} />
        </div>
      </Card>

      <SavePinModal
        pin={pin}
        open={showSaveModal}
        onOpenChange={setShowSaveModal}
      />

      <PinOptionsModal
        pin={pin}
        open={showOptionsModal}
        onOpenChange={setShowOptionsModal}
      />
    </>
  );
}
