
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  embedUrl?: string;
  title?: string;
}

const TrailerModal: React.FC<TrailerModalProps> = ({ isOpen, onClose, embedUrl, title }) => {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] bg-cyber-background border-cyber-accent/30">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-cyber-accent font-orbitron">
            {title || "Anime Trailer"}
          </DialogTitle>
          
        </DialogHeader>
        {embedUrl ? (
          <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-md">
            <iframe 
              src={embedUrl}
              className="absolute top-0 left-0 w-full h-full"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-gray-400">Trailer tidak tersedia untuk anime ini.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TrailerModal;
