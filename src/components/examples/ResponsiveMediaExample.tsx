
import React from 'react';
import { AdaptiveMedia } from '@/components/ui/adaptive-media';
import { ResponsiveImage } from '@/components/ui/responsive-image';
import { ResponsiveVideo } from '@/components/ui/responsive-video';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const ResponsiveMediaExample = () => {
  return (
    <div className="space-y-8 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Images Responsives avec Formats Modernes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Image avec support WebP/AVIF */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Image avec formats modernes</h3>
            <ResponsiveImage
              src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600"
              webpSrc="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fm=webp"
              avifSrc="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fm=avif"
              alt="Person using MacBook Pro"
              aspectRatio="16/9"
              objectFit="cover"
              className="rounded-lg shadow-lg"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          {/* Image carrée */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Image carrée</h3>
            <ResponsiveImage
              src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400"
              alt="Circuit board macro photography"
              aspectRatio="square"
              objectFit="cover"
              className="rounded-lg shadow-lg max-w-md"
            />
          </div>

          {/* Image 4:3 */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Image 4:3</h3>
            <ResponsiveImage
              src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600"
              alt="Java programming on monitor"
              aspectRatio="4/3"
              objectFit="cover"
              className="rounded-lg shadow-lg"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vidéos Responsives</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Vidéo 16:9 */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Vidéo responsive 16:9</h3>
            <ResponsiveVideo
              aspectRatio="16/9"
              objectFit="cover"
              controls={true}
              muted={true}
              className="rounded-lg shadow-lg"
              poster="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=450"
              sources={[
                {
                  src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                  type: "video/mp4",
                },
              ]}
            />
          </div>

          {/* Vidéo carrée */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Vidéo carrée</h3>
            <div className="max-w-md">
              <ResponsiveVideo
                aspectRatio="square"
                objectFit="cover"
                controls={true}
                muted={true}
                className="rounded-lg shadow-lg"
                sources={[
                  {
                    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
                    type: "video/mp4",
                  },
                ]}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Composant AdaptiveMedia</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Utilisation du composant unifié */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AdaptiveMedia
              type="image"
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400"
              alt="Woman using laptop"
              aspectRatio="3/2"
              objectFit="cover"
              className="rounded-lg shadow-lg"
              webpSrc="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fm=webp"
            />
            
            <AdaptiveMedia
              type="video"
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
              aspectRatio="3/2"
              objectFit="cover"
              className="rounded-lg shadow-lg"
              controls={true}
              muted={true}
              poster="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=600&h=400"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
