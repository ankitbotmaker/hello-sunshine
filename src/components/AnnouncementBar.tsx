import { X } from "lucide-react";
import { useState } from "react";

const AnnouncementBar = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-announcement text-announcement-foreground py-2.5 px-4 text-center text-sm relative">
      <span>
        Only for Today <span className="font-bold text-primary">33.00%</span> Discount on All Order . Use Code :<span className="font-bold text-primary">SAVE33</span>
      </span>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-announcement-foreground/70 hover:text-announcement-foreground transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default AnnouncementBar;
