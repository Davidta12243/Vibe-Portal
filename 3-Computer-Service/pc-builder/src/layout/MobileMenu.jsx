import Link from "next/link";

const MobileMenu = () => {
  return (
    <div className="main-container bg-white shadow">
      <ul className="sticky">
        <li className="group py-3 border-b">
          CPU / Processor
          <ul className="hidden bg-white border-gray-300 group-hover:block">
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
        <li className="group py-3 border-b">
          Motherboard
          <ul className="hidden bg-white border-gray-300 group-hover:block">
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
        <li className="group py-3 border-b">
          Ram
          <ul className="hidden bg-white border-gray-300 group-hover:block">
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
        <li className="group py-3 border-b">
          Power supply unit
          <ul className="hidden bg-white border-gray-300 group-hover:block">
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
        <li className="group py-3 border-b">
          Storage device
          <ul className="hidden bg-white border-gray-300 group-hover:block">
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
        <li className="group py-3 border-b">
          Monitor
          <ul className="hidden bg-white border-gray-300 group-hover:block">
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
  );
};

export default MobileMenu;
