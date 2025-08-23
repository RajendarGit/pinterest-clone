import React from "react";
import { Button } from "./ui/button";
import { PinIcon } from "lucide-react";

type PinButtonProps = {
  handleSave: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

const PinButton = ({ handleSave }: PinButtonProps) => {
  return (
    <Button
      size="sm"
      className="function-buttons"
      onClick={handleSave}
    >
      <PinIcon className="w-4 h-4 text-gray-700" />
    </Button>
  );
};

export default PinButton;
