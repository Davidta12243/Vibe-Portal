import CategorySection from "@/components/category/CategorySection";
import RootLayout from "@/layout/RootLayout";

const CategoriesPage = ({ products }) => {
  return (
    <div className="px-1 md:main-container">
      <CategorySection products={products} />
    </div>
  );
};

export default CategoriesPage;
CategoriesPage.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export const getServerSideProps = async (context) => {
  const { params } = context;
  const res = await fetch(
    `https://pc-builder-ashen.vercel.app/api/db?category=${params.category}`
  );
  const data = await res.json();
  return {
    props: {
      products: data.products,
    },
  };
};
