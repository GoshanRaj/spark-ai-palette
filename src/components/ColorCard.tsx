
import React from 'react';
import { Copy, Check } from 'lucide-react';
import { Color, formatColorValue, ColorFormat, isColorLight } from '@/utils/colorUtils';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ColorCardProps {
  color: Color;
  format?: ColorFormat;
  index: number;
}

const ColorCard: React.FC<ColorCardProps> = ({ color, format = 'hex', index }) => {
  const [copied, setCopied] = React.useState(false);
  const colorValue = formatColorValue(color, format);
  const isLight = isColorLight(color);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(colorValue);
    setCopied(true);
    toast.success("Color copied to clipboard!");
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div 
      className={cn(
        "color-card animate-fade-in",
        { "animate-slide-up": true }
      )}
      style={{ 
        backgroundColor: color.hex,
        animationDelay: `${index * 0.1}s`,
      }}
    >
      <div className={cn(
        "absolute bottom-0 left-0 right-0 p-3 flex justify-between items-center", 
        isLight ? "text-gray-800" : "text-white"
      )}>
        <div className="font-mono text-sm">
          {colorValue}
        </div>
        <button 
          onClick={copyToClipboard}
          className={cn(
            "p-1 rounded-full transition-colors",
            isLight 
              ? "hover:bg-black/10" 
              : "hover:bg-white/20"
          )}
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
        </button>
      </div>
    </div>
  );
};

export default ColorCard;
