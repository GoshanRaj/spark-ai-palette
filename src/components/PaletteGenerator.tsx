
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { RefreshCw, Save, Sparkles } from 'lucide-react';
import ColorCard from './ColorCard';
import { 
  Color, 
  ColorFormat, 
  HarmonyType, 
  createColor, 
  generateHarmony, 
  getRandomColor 
} from '@/utils/colorUtils';
import { toast } from 'sonner';

const colorFormats: { value: ColorFormat; label: string }[] = [
  { value: 'hex', label: 'HEX' },
  { value: 'rgb', label: 'RGB' },
  { value: 'hsl', label: 'HSL' },
];

const harmonyTypes: { value: HarmonyType; label: string }[] = [
  { value: 'analogous', label: 'Analogous' },
  { value: 'complementary', label: 'Complementary' },
  { value: 'triadic', label: 'Triadic' },
  { value: 'tetradic', label: 'Tetradic' },
  { value: 'monochromatic', label: 'Monochromatic' },
  { value: 'random', label: 'Random' },
];

const PaletteGenerator: React.FC = () => {
  const [baseColor, setBaseColor] = useState<Color>(getRandomColor());
  const [colorFormat, setColorFormat] = useState<ColorFormat>('hex');
  const [harmonyType, setHarmonyType] = useState<HarmonyType>('analogous');
  const [colorCount, setColorCount] = useState<number>(5);
  const [palette, setPalette] = useState<Color[]>([]);
  const [savedPalettes, setSavedPalettes] = useState<Color[][]>([]);
  const [inputHex, setInputHex] = useState<string>(baseColor.hex);

  // Generate palette when base color or settings change
  useEffect(() => {
    generatePalette();
  }, [baseColor, harmonyType, colorCount]);

  const generatePalette = () => {
    const newPalette = generateHarmony(baseColor, harmonyType, colorCount);
    setPalette(newPalette);
  };

  const generateRandomPalette = () => {
    const newBaseColor = getRandomColor();
    setBaseColor(newBaseColor);
    setInputHex(newBaseColor.hex);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputHex(value);
    
    try {
      if (value.startsWith('#') && value.length === 7) {
        const newColor = createColor(value);
        setBaseColor(newColor);
      }
    } catch (error) {
      // Invalid color, ignore
    }
  };

  const handleFormatChange = (value: string) => {
    setColorFormat(value as ColorFormat);
  };

  const handleHarmonyChange = (value: string) => {
    setHarmonyType(value as HarmonyType);
  };

  const handleCountChange = (value: number[]) => {
    setColorCount(value[0]);
  };

  const handleSavePalette = () => {
    setSavedPalettes(prev => [...prev, [...palette]]);
    toast.success("Palette saved to your collection!");
  };

  return (
    <div className="w-full space-y-6">
      <Tabs defaultValue="generator" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generator">Generate Palette</TabsTrigger>
          <TabsTrigger value="saved">Saved Palettes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="generator" className="space-y-6">
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="space-y-4">
              <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4 md:items-end">
                <div className="w-full md:w-1/3 space-y-2">
                  <Label htmlFor="baseColor">Base Color</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="baseColor"
                      type="text"
                      value={inputHex}
                      onChange={handleColorChange}
                      placeholder="#RRGGBB"
                      className="font-mono"
                    />
                    <div 
                      className="w-10 h-10 rounded border"
                      style={{ backgroundColor: baseColor.hex }}
                    />
                  </div>
                </div>
                
                <div className="w-full md:w-1/4">
                  <Label>Color Format</Label>
                  <Select onValueChange={handleFormatChange} defaultValue={colorFormat}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Format" />
                    </SelectTrigger>
                    <SelectContent>
                      {colorFormats.map((format) => (
                        <SelectItem key={format.value} value={format.value}>
                          {format.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-full md:w-1/3">
                  <Label>Harmony Type</Label>
                  <Select onValueChange={handleHarmonyChange} defaultValue={harmonyType}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Harmony" />
                    </SelectTrigger>
                    <SelectContent>
                      {harmonyTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  onClick={generateRandomPalette} 
                  variant="outline"
                  className="w-full md:w-auto"
                >
                  <RefreshCw size={16} className="mr-2" />
                  Random
                </Button>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Number of Colors: {colorCount}</Label>
                </div>
                <Slider 
                  defaultValue={[colorCount]} 
                  min={3} 
                  max={8} 
                  step={1} 
                  onValueChange={handleCountChange}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Your Palette</h3>
              <Button onClick={handleSavePalette} variant="outline" size="sm">
                <Save size={16} className="mr-2" />
                Save Palette
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {palette.map((color, index) => (
                <ColorCard 
                  key={`${color.hex}-${index}`} 
                  color={color} 
                  format={colorFormat}
                  index={index}
                />
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="saved" className="space-y-4">
          {savedPalettes.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-10 text-center bg-white rounded-lg shadow-sm">
              <Sparkles size={48} className="text-brand-purple/50 mb-3" />
              <h3 className="text-lg font-medium">No saved palettes yet</h3>
              <p className="text-muted-foreground">
                Generate and save some beautiful color palettes to see them here.
              </p>
            </div>
          ) : (
            savedPalettes.map((savedPalette, paletteIndex) => (
              <div key={paletteIndex} className="p-4 bg-white rounded-lg shadow-sm">
                <h3 className="text-md font-medium mb-3">Palette {paletteIndex + 1}</h3>
                <div className="grid grid-cols-5 gap-2 h-12">
                  {savedPalette.map((color, colorIndex) => (
                    <div
                      key={`${paletteIndex}-${colorIndex}`}
                      className="h-full rounded"
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaletteGenerator;
