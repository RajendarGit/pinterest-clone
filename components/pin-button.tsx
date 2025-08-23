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
      className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-4"
      onClick={handleSave}
    >
      <PinIcon className="w-4 h-4" />
    </Button>
  );
};

export default PinButton;
