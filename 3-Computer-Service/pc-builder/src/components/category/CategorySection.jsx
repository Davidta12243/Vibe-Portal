import CategoryCard from "./CategoryCard";

const CategorySection = ({ products }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-1 lg:gap-5 py-5">
      {products?.map((product) => (
        <CategoryCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default CategorySection;
