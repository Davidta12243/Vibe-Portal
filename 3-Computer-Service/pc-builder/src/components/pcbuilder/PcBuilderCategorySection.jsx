import React from "react";
import PcBuilderCategoryCard from "./PcBuilderCategoryCard";

const PcBuilderCategorySection = ({ products }) => {
  return (
    <div className="px-1 md:main-container lg:w-10/12 mx-auto bg-white my-10 py-5">
      
      <div>
        {products?.map((product) => (
          <PcBuilderCategoryCard key={product.id} product={product} />
        ))}
      </div>
      
    </div>
  );
};

export default PcBuilderCategorySection;
