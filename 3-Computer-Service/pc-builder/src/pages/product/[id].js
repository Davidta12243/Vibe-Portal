import RootLayout from "@/layout/RootLayout";
import Image from "next/image";
import { useState } from "react";

const ProductDetailsPage = ({ product }) => {
  const [select, setSelect] = useState(false);
  const [text, setText] = useState("");

  const { product_name, image, price, status, id, key_features, reviews } =
    product;
  const { brand, model, port, specification, voltage } = key_features;
  const handleSelect = () => {
    setSelect((previous) => !previous);
  };
  return (
    <div className="main-container py-5">
      <div className="bg-white py-5 grid grid-cols-1 md:grid-cols-2 gap-5 items-center rounded-md">
        <div className="border rounded-lg ml-2 p-2">
          <Image src={image} height={400} width={600} alt={product_name} />
        </div>
        <div className="space-y-3">
          <h1 className="text-primary text-2xl font-semibold">
            {product_name}
          </h1>
          <div className="flex flex-col lg:flex-row gap-2 lg:gap-5 items-center">
            <p className=" text-gray-900 px-5 rounded-full bg-gray-200">
              <strong>Price:</strong> {price}৳
            </p>
            <p className=" text-gray-900 px-5 rounded-full bg-gray-200">
              <strong>Status:</strong> {status}
            </p>
            <p className=" text-gray-900 px-5 rounded-full bg-gray-200">
              <strong>Product code:</strong> {id}
            </p>
          </div>
          <p>Key Features</p>
          <div>
            <p className="p-2">
              <strong>Brand: </strong>
              {brand}
            </p>
            <p className="p-2">
              <strong>Specification: </strong>
              {specification}
            </p>
            <p className="p-2">
              <strong>Port: </strong>
              {port}
            </p>
            <p className="p-2">
              <strong>Model: </strong>
              {model}
            </p>
            <p className="p-2">
              <strong>Voltage: </strong>
              {voltage}
            </p>
          </div>
          <a
            className="text-primary underline py-3 inline-block"
            href="#specification"
          >
            View more Details
          </a>
          <div>
            <p>Payment Options</p>
            <div
              id="radio"
              onClick={handleSelect}
              className={`group flex gap-2 items-center p-3 border-2 w-[220px] ${
                select && "border-primary"
              }`}
            >
              <input type="radio" name="radio" checked={select} id="radio" />
              <div>
                <p>{price} ৳</p>
                <p className="text-xs">online / cash payment</p>
              </div>
            </div>
          </div>
          <div className="flex">
            <button className="border hover:bg-gray-200 text-lg w-10 h-10 flex items-center justify-center bg-white">
              -
            </button>
            <p className="border text-lg w-10 h-10 flex items-center justify-center bg-white">
              5
            </p>
            <button className="border hover:bg-gray-200 text-lg w-10 h-10 flex items-center justify-center bg-white">
              +
            </button>
          </div>
          <button className="relative inline-flex items-center justify-center p-4 px-5 py-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out rounded-md shadow-xl group hover:ring-1 hover:ring-purple-500">
            <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-700"></span>
            <span className="absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition duration-500 origin-bottom-left transform rotate-45 translate-x-24 bg-pink-500 rounded-full opacity-30 group-hover:rotate-90 ease"></span>
            <span className="relative text-white lg:uppercase">buy now</span>
          </button>
        </div>
      </div>
      <div id="specification" className="mt-10">
        <div className="flex gap-4">
          <button
            onClick={() => setText("specification")}
            className={`shadow p-2 text-lg rounded ${
              text === "specification" ? "bg-primary" : "bg-white"
            }`}
          >
            Specification
          </button>
          <a
            href="#reviews"
            onClick={() => setText("reviews")}
            className={`shadow p-2 text-lg rounded ${
              text === "reviews" ? "bg-primary" : "bg-white"
            }`}
          >
            Reviews
          </a>
        </div>
        <div>
          <h2 className="text-2xl my-2">Specification: </h2>
          <div className="bg-white p-3">
            <p className=" p-2 border-b border-b-gray-300 bg-gray-100">
              <strong>Brand: </strong>
              {brand}
            </p>
            <p className=" p-2 border-b border-b-gray-300 bg-gray-100">
              <strong>Specification: </strong>
              {specification}
            </p>
            <p className=" p-2 border-b border-b-gray-300 bg-gray-100">
              <strong>Port: </strong>
              {port}
            </p>
            <p className=" p-2 border-b border-b-gray-300 bg-gray-100">
              <strong>Model: </strong>
              {model}
            </p>
            <p className=" p-2 border-b border-b-gray-300 bg-gray-100">
              <strong>Voltage: </strong>
              {voltage}
            </p>
          </div>
          <div id="reviews" className="mt-5">
            <h2 className="text-2xl my-2">Reviews: ({reviews.length}) </h2>
            <div className="bg-white">
              {reviews?.map((review, i) => (
                <div className="p-5 border-b" key={i}>
                  <div className="my-3">
                    <div className="flex gap-3 items-center">
                      <Image
                        alt="hello"
                        height={50}
                        width={50}
                        className="w-12 h-12 rounded-full ri ri dark:bg-gray-500 ri ri"
                        src="https://source.unsplash.com/40x40/?portrait?1"
                      />
                      <h2>{review.username}</h2>
                    </div>
                    <p>{review.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;

ProductDetailsPage.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export async function getServerSideProps(context) {
  const { params } = context;
  const res = await fetch(
    `https://pc-builder-ashen.vercel.app/api/db?productId=${params.id}`
  );
  const data = await res.json();
  return {
    props: {
      product: data.product,
    },
  };
}
