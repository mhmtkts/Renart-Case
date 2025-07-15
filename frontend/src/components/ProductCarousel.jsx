import React, { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import ProductCard from "./ProductCard";

// Import slick-carousel styles
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <button
      className={`${className} custom-arrow prev-arrow`}
      style={{ ...style }}
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-10"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>
  );
};

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <button
      className={`${className} custom-arrow next-arrow`}
      style={{ ...style }}
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-10"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </button>
  );
};

const ProductCarousel = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);
  const progressRef = useRef(null);

  const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/api/products"
    : "/api/products";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        if (data.success) {
          setProducts(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const getSlidesToShow = () => {
    const width = window.innerWidth;
    if (width >= 1280) return 4;
    if (width >= 1024) return 3;
    if (width >= 768) return 2;
    return 1;
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1, // Changed for smoother sliding
    initialSlide: 0,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    afterChange: (current) => {
      setCurrentSlide(current);
    },
    responsive: [
      {
        breakpoint: 1280, // < 1280px
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 1024, // < 1024px
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 767, // < 767px
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  useEffect(() => {
    const updateSliderProgress = () => {
      if (sliderRef.current && progressRef.current) {
        const totalSlides = products.length;
        const slidesToShow = getSlidesToShow();
        const maxScroll = totalSlides - slidesToShow;
        if (maxScroll > 0) {
          const progress = (currentSlide / maxScroll) * 100;
          progressRef.current.value = progress;
        }
      }
    };
    updateSliderProgress();
  }, [currentSlide, products.length]);

  const handleSliderChange = (e) => {
    const progress = e.target.value;
    if (sliderRef.current) {
      const totalSlides = products.length;
      const slidesToShow = getSlidesToShow();
      const maxScroll = totalSlides - slidesToShow;
      const newSlide = Math.round((progress / 100) * maxScroll);
      sliderRef.current.slickGoTo(newSlide);
    }
  };

  if (loading) {
    return <div className="text-center p-10">Loading products...</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-8 lg:px-20 py-8 relative">
      <Slider {...settings} ref={sliderRef}>
        {products.map((product) => (
          <div key={product.id} className="px-3">
            <ProductCard product={product} />
          </div>
        ))}
      </Slider>
      <div className="w-full sm:w-10/12 lg:w-11/12 mt-4">
        <input
          ref={progressRef}
          type="range"
          min="0"
          max="100"
          defaultValue="0"
          onChange={handleSliderChange}
          className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer slider-thumb"
        />
      </div>
    </div>
  );
};

export default ProductCarousel;
