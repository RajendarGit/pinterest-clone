import React from "react";
import { Button } from "./ui/button";
import { MoreHorizontal } from "lucide-react";

type ShareButtonProps = {
  handleOptions: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

const OptionButton = ({ handleOptions }: ShareButtonProps) => {
  return (
    <Button
      size="sm"
      variant="secondary"
      className="rounded-full p-2 bg-white/90 hover:bg-white"
      onClick={handleOptions}
    >
      <MoreHorizontal className="w-4 h-4 text-gray-700" />
    </Button>
  );
};

export default OptionButton;
