import { Button } from "./ui/button";
import { Share } from "lucide-react";
import { Pin } from "@/lib/store/slices/pinsSlice";

type ShareButtonProps = {
  pin: Pin;
};

const ShareButton = ({ pin }: { pin: Pin }) => {
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Copy pin URL to clipboard
    const pinUrl = `${window.location.origin}/pin/${pin.id}`;
    navigator.clipboard.writeText(pinUrl);
    // TODO: Show toast notification
  };
  return (
    <Button
      size="sm"
      variant="secondary"
      className="function-buttons"
      onClick={handleShare}
    >
      <Share className="w-4 h-4 text-gray-700" />
    </Button>
  );
};

export default ShareButton;
