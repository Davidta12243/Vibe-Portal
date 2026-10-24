import { FiCpu, FiMonitor } from "react-icons/fi";
import { BsMotherboard } from "react-icons/bs";
import { ImPowerCord } from "react-icons/im";
import { MdSdStorage, MdStorage } from "react-icons/md";
import FeatureCard from "./FeatureCard";

const FeatureSection = () => {
  const cpu = <FiCpu />;
  const mothreboard = <BsMotherboard />;
  const powerSupply = <ImPowerCord />;
  const storage = <MdSdStorage />;
  const ram = <MdStorage />;
  const monitor = <FiMonitor />;
  const categories = [
    {
      id: 1,
      icon: cpu,
      category: "processors",
    },
    {
      id: 2,
      icon: mothreboard,
      category: "motherboard",
    },
    {
      id: 3,
      icon: powerSupply,
      category: "power supply",
    },
    {
      id: 4,
      icon: ram,
      category: "ram",
    },
    {
      id: 5,
      icon: storage,
      category: "storage",
    },
    {
      id: 6,
      icon: monitor,
      category: "monitor",
    },
  ];
  return (
    <div className="px-1 md:main-container py-10">
      <div className="mb-3 lg:mb-10">
        <h1 className="text-center font-bold text-lg lg:text-2xl">
          Featured Category
        </h1>
        <p className="text-center text-xs lg:text-base font-extralight text-gray-600">
          Get Your Desired Product from Featured Category!
        </p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-1 lg:gap-5">
        {categories?.map((category) => (
          <FeatureCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
};

export default FeatureSection;
