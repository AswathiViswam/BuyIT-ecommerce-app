import { useState } from "react";

interface ImageZoomProps {
  images: string[];
  alt: string;
}

export function ImageZoom({ images, alt }: ImageZoomProps) {
  const [selectedImage, setSelectedImage] = useState(images[0] || "");
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  const imageList = images.length > 0 ? images : [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80"
  ];

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 items-start">
      {/* Thumbnail Bar */}
      {imageList.length > 1 && (
        <div className="flex md:flex-col gap-3 overflow-x-auto pb-2 md:pb-0">
          {imageList.map((img, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setSelectedImage(img)}
              className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition flex-shrink-0 bg-gray-50 ${
                (selectedImage || imageList[0]) === img
                  ? "border-indigo-600 shadow-md ring-2 ring-indigo-600/20"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <img src={img} alt={`${alt} ${index + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Main Showcase with Zoom */}
      <div
        className="relative flex-grow w-full aspect-square bg-gray-50 dark:bg-gray-800 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-700 cursor-crosshair group"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <img
          src={selectedImage || imageList[0]}
          alt={alt}
          className={`w-full h-full object-contain p-4 transition-transform duration-200 ${
            isZoomed ? "opacity-0" : "opacity-100"
          }`}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80";
          }}
        />

        {/* High Magnification Layer */}
        {isZoomed && (
          <div
            className="absolute inset-0 bg-no-repeat pointer-events-none"
            style={{
              backgroundImage: `url(${selectedImage || imageList[0]})`,
              backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
              backgroundSize: "220%",
            }}
          />
        )}

        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-medium px-3 py-1 rounded-full flex items-center gap-1.5 pointer-events-none">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
          </svg>
          Hover to Zoom
        </div>
      </div>
    </div>
  );
}

export default ImageZoom;
