import Link from "next/link";

const Menubar = () => {
  return (
    <div className="bg-white shadow-lg hidden md:block sticky top-0 z-50">
      <div className="main-container">
        <ul className="flex gap-5 sticky">
          <li className="group py-3">
            CPU / Processor
            <ul className="hidden z-50 absolute top-10 bg-white border border-gray-300 rounded shadow group-hover:block border-t-4 border-t-secondary">
              <li className="px-4 py-2 hover:bg-gray-100">
                <Link href="#">Option 1</Link>
              </li>
              <li className="px-4 py-2 hover:bg-gray-100">
                <Link href="#">Option 2</Link>
              </li>
              <li className="px-4 py-2 hover:bg-gray-100">
                <Link href="#">Option 3</Link>
              </li>
            </ul>
          </li>
          <li className="group py-3">
            Motherboard
            <ul className="hidden z-50 absolute top-10 bg-white border border-gray-300 rounded shadow group-hover:block border-t-4 border-t-secondary">
              <li className="px-4 py-2 hover:bg-gray-100">
                <Link href="#">Option 1</Link>
              </li>
              <li className="px-4 py-2 hover:bg-gray-100">
                <Link href="#">Option 2</Link>
              </li>
              <li className="px-4 py-2 hover:bg-gray-100">
                <Link href="#">Option 3</Link>
              </li>
            </ul>
          </li>
          <li className="group py-3">
            Ram
            <ul className="hidden z-50 absolute top-10 bg-white border border-gray-300 rounded shadow group-hover:block border-t-4 border-t-secondary">
              <li className="px-4 py-2 hover:bg-gray-100">
                <Link href="#">Option 1</Link>
              </li>
              <li className="px-4 py-2 hover:bg-gray-100">
                <Link href="#">Option 2</Link>
              </li>
              <li className="px-4 py-2 hover:bg-gray-100">
                <Link href="#">Option 3</Link>
              </li>
            </ul>
          </li>
          <li className="group py-3">
            Power supply unit
            <ul className="hidden z-50 absolute top-10 bg-white border border-gray-300 rounded shadow group-hover:block border-t-4 border-t-secondary">
              <li className="px-4 py-2 hover:bg-gray-100">
                <Link href="#">Option 1</Link>
              </li>
              <li className="px-4 py-2 hover:bg-gray-100">
                <Link href="#">Option 2</Link>
              </li>
              <li className="px-4 py-2 hover:bg-gray-100">
                <Link href="#">Option 3</Link>
              </li>
            </ul>
          </li>
          <li className="group py-3">
            Storage device
            <ul className="hidden z-50 absolute top-10 bg-white border border-gray-300 rounded shadow group-hover:block border-t-4 border-t-secondary">
              <li className="px-4 py-2 hover:bg-gray-100">
                <Link href="#">Option 1</Link>
              </li>
              <li className="px-4 py-2 hover:bg-gray-100">
                <Link href="#">Option 2</Link>
              </li>
              <li className="px-4 py-2 hover:bg-gray-100">
                <Link href="#">Option 3</Link>
              </li>
            </ul>
          </li>
          <li className="group py-3">
            Monitor
            <ul className="hidden z-50 absolute top-10 bg-white border border-gray-300 rounded shadow group-hover:block border-t-4 border-t-secondary">
              <li className="px-4 py-2 hover:bg-gray-100">
                <Link href="#">Option 1</Link>
              </li>
              <li className="px-4 py-2 hover:bg-gray-100">
                <Link href="#">Option 2</Link>
              </li>
              <li className="px-4 py-2 hover:bg-gray-100">
                <Link href="#">Option 3</Link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Menubar;
