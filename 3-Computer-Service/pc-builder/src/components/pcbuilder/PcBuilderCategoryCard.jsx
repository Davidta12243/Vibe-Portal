import { addProduct } from "@/redux/features/products/productSlice";
import Image from "next/image";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";

const PcBuilderCategoryCard = ({ product }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { product_name, image, price, status, individual_rating, category } =
    product;

  const handleAddProduct = () => {
    dispatch(addProduct(product));
    router.push("/pcbuilder");
  };
  return (
    <div className="border my-2 flex flex-col lg:flex-row items-center gap-2 pb-2 px-4">
      <div>
        <Image src={image} alt={product_name} height={150} width={150} />
      </div>
      <div className="grow space-y-1">
        <h1 className="text-lg font-semibold">{product_name}</h1>
        <p>
          <strong>Rating:</strong> {individual_rating}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span className="text-primary">{status}</span>
        </p>
        <p>
          <strong>Category:</strong> {category}
        </p>
      </div>
      <div className="space-y-2">
        <p>{price} ৳</p>
        <button
          onClick={handleAddProduct}
          className="bg-primary px-4 py-1 rounded-sm text-white"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default PcBuilderCategoryCard;
