import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";

const PcBuilderCard = ({ category }) => {
  const { products } = useSelector((state) => state.products);
  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="w-10 lg:w-24 h-10 lg:h-24 bg-gray-200 flex items-center justify-center rounded">
          <p className="text-2xl lg:text-5xl text-primary">{category?.icon}</p>
        </div>
        <div>
          <p className="text-base lg:text-2xl">{category?.category}</p>
          <p className="text-xs lg:text-base bg-gray-200 rounded-sm px-1 text-center">
            Required
          </p>
        </div>
        <div className="grow h-2 lg:h-3 bg-gray-200"></div>
        <Link href={`/category/product/${category.category}`}>
          <p className="px-5 py-2 hover:bg-primary hover:text-white border border-primary rounded-sm transition-all duration-200 ease-in-out">
            Choose
          </p>
        </Link>
      </div>
      <div>
        {products?.map(
          (product) =>
            product.category === category.category && (
              <div
                key={product.id}
                className="border my-2 flex flex-col lg:flex-row items-center gap-2 pb-2 px-4"
              >
                <div>
                  <Image
                    src={product?.image}
                    alt={product?.product_name}
                    height={150}
                    width={150}
                  />
                </div>
                <div className="grow space-y-1">
                  <h1 className="text-lg font-semibold">
                    {product?.product_name}
                  </h1>
                  <p>
                    <strong>Rating:</strong> {product?.individual_rating}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className="text-primary">{product?.status}</span>
                  </p>
                  <p>
                    <strong>Category:</strong> {product?.category}
                  </p>
                </div>
                <div className="space-y-2">
                  <p>{product?.price} ৳</p>
                </div>
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default PcBuilderCard;
