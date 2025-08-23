import React, { useState } from "react";
import { Button } from "./ui/button";
import { Heart } from "lucide-react";

const LikeButton = () => {
  const [liked, setLiked] = useState(false);
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
  };
  return (
    <Button
      size="sm"
      variant="secondary"
      className="rounded-full p-2 bg-white/90 hover:bg-white"
      onClick={handleLike}
    >
      <Heart
        className={`w-4 h-4 ${
          liked ? "fill-red-500 text-red-500" : "text-gray-700"
        }`}
      />
    </Button>
  );
};

export default LikeButton;
