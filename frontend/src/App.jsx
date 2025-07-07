import React from "react";
import ProductCarousel from "./components/ProductCarousel";

function App() {
  return (
    <div className="bg-white font-sans min-h-screen">
      <header className="py-10">
        <h1 className="text-custom-45 font-book text-custom-dark-gray text-center">
          Product List
        </h1>
      </header>
      <main>
        <ProductCarousel />
      </main>
    </div>
  );
}

export default App;
