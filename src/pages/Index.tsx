
import React from 'react';
import PaletteGenerator from '@/components/PaletteGenerator';
import { Sparkles } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-gray-light to-white pb-10">
      <div className="container mx-auto px-4 py-12">
        <header className="mb-10 text-center">
          <div className="inline-flex items-center justify-center p-2 bg-white rounded-full shadow-sm mb-4">
            <Sparkles className="text-brand-purple h-6 w-6 mr-2" />
            <span className="font-medium text-brand-charcoal">ColorSpark</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-brand-purple to-brand-purple-dark bg-clip-text text-transparent mb-2">
            Smart Color Palette Generator
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Generate harmonious color combinations with AI-powered color theory.
            Create, customize, and save beautiful palettes for your designs.
          </p>
        </header>

        <main>
          <div className="max-w-5xl mx-auto">
            <PaletteGenerator />
          </div>

          <div className="mt-20 max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-brand-charcoal mb-6 text-center">
              How to Create Great Color Palettes
            </h2>
            
            <div className="grid gap-6 md:grid-cols-3">
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <h3 className="text-lg font-medium mb-2">Start with a Base</h3>
                <p className="text-muted-foreground">
                  Choose a base color that represents the mood or theme of your design. 
                  This will be the foundation for your entire palette.
                </p>
              </div>
              
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <h3 className="text-lg font-medium mb-2">Apply Color Harmony</h3>
                <p className="text-muted-foreground">
                  Use color harmony rules like complementary, analogous, or triadic to create
                  balanced and visually pleasing combinations.
                </p>
              </div>
              
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <h3 className="text-lg font-medium mb-2">Consider Context</h3>
                <p className="text-muted-foreground">
                  Think about where your colors will be used. Different contexts (web, print, UI)
                  may require different approaches to color selection.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      <footer className="mt-10 py-6 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 ColorSpark AI Palette Generator. Made with ❤️ for designers.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
