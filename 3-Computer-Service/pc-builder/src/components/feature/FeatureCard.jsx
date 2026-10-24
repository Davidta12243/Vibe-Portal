import Link from "next/link";

const FeatureCard = ({ category }) => {
  return (
    <Link href={`/category/${category.category}`}>
      <div className="group hover:shadow-lg flex rounded-sm lg:rounded-md shadow cursor-pointer px-1 lg:px-0 lg:flex-col items-center gap-2 lg:gap-5 bg-white py-4 lg:py-6 lg:justify-between">
        <p className="lg:text-4xl">{category?.icon}</p>
        <p className="group-hover:text-primary lg:text-2xl">
          {category?.category}
        </p>
      </div>
    </Link>
  );
};

export default FeatureCard;
