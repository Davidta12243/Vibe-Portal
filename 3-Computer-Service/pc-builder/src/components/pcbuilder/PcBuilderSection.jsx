import { FiCpu, FiMonitor } from "react-icons/fi";
import { BsMotherboard } from "react-icons/bs";
import { ImPowerCord } from "react-icons/im";
import { MdSdStorage, MdStorage } from "react-icons/md";
import PcBuilderCard from "./PcBuilderCard";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

const PcBuilderSection = () => {
  const {products, total} = useSelector(state=> state.products);
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

  const handlePcBuild = () => {
    Swal.fire("wow pc build", "successfull");
  }
  const isButtonDisabled = products.length !== 6;
  return (
    <div className="main-container lg:w-9/12 mx-auto bg-white my-5 lg:my-10 py-5 px-5">
      <div className="flex gap-5 justify-between">
        <h1 className="text-primary font-bold text-xl grow">PC Builder - Build Your Own Computer</h1>
        <div className="bg-white hidden lg:block px-6 py-1 rounded border border-dashed border-primary  text-center">
          <p>35W</p>
          <p>Estimated Wattage</p>
        </div>
        <div className="bg-primary px-6 py-1 rounded text-white">
          <p>{total.toFixed(2)} ৳</p>
          <p>{products.length} {products.length <= 1  ? "item" : "items"}</p>
        </div>
      </div>
      <div className="bg-gray-300 my-5">
        <p className="text-sm px-2">core components</p>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {categories?.map((category) => (
          <PcBuilderCard key={category.id} category={category} />
        ))}
      </div>
      <div className="bg-primary w-[200px] uppercase ml-auto text-center py-2 rounded text-white mt-10">
        <button onClick={handlePcBuild} disabled={isButtonDisabled}>pc build complete</button>
      </div>
    </div>
  );
};

export default PcBuilderSection;
