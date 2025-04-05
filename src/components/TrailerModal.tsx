
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  embedUrl?: string;
  title?: string;
}

const TrailerModal: React.FC<TrailerModalProps> = ({ isOpen, onClose, embedUrl, title }) => {
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);

  // Reset iframe loaded state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsIframeLoaded(false);
    }
  }, [isOpen]);

  // We only load the iframe when the modal is open to save resources
  const handleIframeLoad = () => {
    setIsIframeLoaded(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] bg-cyber-background border-cyber-accent/30">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-cyber-accent font-orbitron">
            {title || "Anime Trailer"}
          </DialogTitle>
          <X 
            className="h-4 w-4 cursor-pointer text-gray-400 hover:text-white trailer-close-btn" 
            onClick={onClose}
          />
        </DialogHeader>
        <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-md">
          {embedUrl ? (
            <>
              {!isIframeLoaded && (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black">
                  <p className="text-cyber-accent">Loading trailer...</p>
                </div>
              )}
              <iframe 
                src={embedUrl}
                className="absolute top-0 left-0 w-full h-full"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                loading="lazy"
                title={`${title || "Anime"} trailer`}
                onLoad={handleIframeLoad}
                style={{ opacity: isIframeLoaded ? 1 : 0 }}
              />
            </>
          ) : (
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black">
              <p className="text-gray-400">Trailer tidak tersedia untuk anime ini.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrailerModal;
