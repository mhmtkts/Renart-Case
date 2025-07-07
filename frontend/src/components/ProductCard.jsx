import React, { useState, useEffect } from "react";

const ProductCard = ({ product }) => {
  const imageEntries = product?.images ? Object.entries(product.images) : [];
  const colors = product?.images ? Object.keys(product.images) : [];
  const firstImage = imageEntries.length > 0 ? imageEntries[0][1] : null;
  const firstColor = colors.length > 0 ? colors[0] : null;

  const [selectedImage, setSelectedImage] = useState(firstImage);
  const [selectedColor, setSelectedColor] = useState(firstColor);

  useEffect(() => {
    if (product?.images) {
      const imageEntries = Object.entries(product.images);
      const colors = Object.keys(product.images);
      if (imageEntries.length > 0) {
        setSelectedImage(imageEntries[0][1]);
        setSelectedColor(colors[0]);
      }
    }
  }, [product]);

  if (!product || !product.images || imageEntries.length === 0) {
    return null;
  }

  const { name, price, popularityScore, images } = product;

  const handleColorClick = (image, color) => {
    setSelectedImage(image);
    setSelectedColor(color);
  };

  const rating = popularityScore ? popularityScore * 5 : 0;

  // Helper function to capitalize color names
  const capitalize = (str) => {
    if (typeof str !== "string" || !str) return "";
    // Capitalize the first letter and add the rest of the string.
    // Also, handle "yellow" vs "Yellow Gold" if needed, but for now, just capitalize.
    return str.charAt(0).toUpperCase() + str.slice(1) + " Gold";
  };

  if (!selectedImage) return null;

  return (
    <div className="flex-shrink-0 w-[250px] bg-white text-left">
      <div className="relative w-full h-[250px] bg-gray-100 rounded-lg mb-4">
        <img
          src={selectedImage}
          alt={`${name} - ${selectedColor}`}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      <h3 className="text-custom-15 font-montserrat font-medium text-custom-dark-gray mb-1">
        {name}
      </h3>
      <p className="text-custom-15 font-montserrat font-normal text-custom-dark-gray mb-4 ">
        ${price.toFixed(2)} USD
      </p>

      <div className="flex items-center space-x-2 mb-2">
        {Object.entries(images).map(([color, imageUrl]) => (
          <button
            key={color}
            onClick={() => handleColorClick(imageUrl, color)}
            className={`w-6 h-6 rounded-full flex items-center justify-center transition-all border ${
              selectedColor === color ? "border-black" : "border-transparent"
            }`}
            aria-label={`Select ${color} color`}
          >
            <div
              className="w-4 h-4 rounded-full"
              style={{
                backgroundColor: `var(--color-${color.toLowerCase()}-gold)`,
              }}
            ></div>
          </button>
        ))}
      </div>

      <p className="text-custom-12 font-avenir font-book text-custom-dark-gray mb-3 h-5">
        {capitalize(selectedColor.replace("Gold", ""))}
      </p>

      <div className="flex items-center">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => {
            const starRating = rating;
            const starId = `star-gradient-${product.id}-${i}`;

            // Full star
            if (starRating >= i + 1) {
              return (
                <svg
                  key={i}
                  className="w-4 h-4 text-[#F6D5A8]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.368-2.448a1 1 0 00-1.175 0l-3.368 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
                </svg>
              );
            }

            // Half star
            if (starRating > i) {
              return (
                <svg key={i} className="w-4 h-4" viewBox="0 0 20 20">
                  <defs>
                    <linearGradient id={starId}>
                      <stop offset="50%" stopColor="#F6D5A8" />
                      <stop offset="50%" stopColor="#D1D5DB" />
                    </linearGradient>
                  </defs>
                  <path
                    fill={`url(#${starId})`}
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.368-2.448a1 1 0 00-1.175 0l-3.368 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z"
                  />
                </svg>
              );
            }

            // Empty star
            return (
              <svg
                key={i}
                className="w-4 h-4 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.368-2.448a1 1 0 00-1.175 0l-3.368 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
              </svg>
            );
          })}
        </div>
        <span className="ml-2 text-custom-14 font-avenir font-book text-custom-dark-gray">
          {rating.toFixed(1)}/5
        </span>
      </div>
    </div>
  );
};

export default ProductCard;
