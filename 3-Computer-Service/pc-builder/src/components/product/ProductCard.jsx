import Image from "next/image";
import Link from "next/link";
import { FiStar } from "react-icons/fi";

const ProductCard = ({ product }) => {
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
    <Link href={`/product/${id}`} className="hover:shadow-md">
      <div className="bg-white p-3 rounded">
        <div className="p-2 border rounded-lg">
          <Image width={400} height={350} alt={product_name} src={image} />
        </div>
        <h2 className="hover:text-secondary hover:underline mt-3">
          {product_name}
        </h2>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-1">
            <FiStar className="w-4 h-4 text-yellow-500 inline-block" />
            <p>({round})</p>
          </div>
          <p className="text-center text-orange-500 font-bold text-xl">
            {price}৳
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
