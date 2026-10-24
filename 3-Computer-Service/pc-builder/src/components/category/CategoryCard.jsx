import Image from "next/image";
import Link from "next/link";
import { FiStar } from "react-icons/fi";

const CategoryCard = ({ product }) => {
  const {
    product_name,
    image,
    price,
    status,
    individual_rating,
    id,
    category,
  } = product;
  const round = Math.round(individual_rating);
  return (
    <Link href={`/product/${id}`}>
      <div className="bg-white p-3 rounded">
        <div className="border border-gray-200 p-2">
          <Image width={400} height={350} alt={product_name} src={image} />
        </div>
        <h2 className="hover:text-secondary hover:underline">
          {product_name}{" "}
        </h2>
        <p>{price}৳</p>
        <p>Category: {category}</p>
        <p>Status: {status}</p>
        <div className="flex items-center gap-1">
          {Array(round)
            .fill()
            ?.map((_, i) => (
              <FiStar
                key={i}
                className="w-4 h-4  text-yellow-500 inline-block"
              />
            ))}
          <p>{round}</p>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
