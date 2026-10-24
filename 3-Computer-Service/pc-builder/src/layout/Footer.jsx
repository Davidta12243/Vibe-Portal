import Link from "next/link";

const Footer = () => {
  return (
    <div className="bg-gray-200 border-t-2 border-primary py-10">
      <div className="main-container grid grid-cols-1 md:grid-cols-4 gap-7 md:gap-3 lg:gap-7 overflow-hidden font-sans">
      {/* 1 */}
      <div>
        <Link href="/" className="underline cursor-pointer">
          <span className="text-gray-950 uppercase text-3xl font-bold">P</span>
          <span className="text-gray-500 text-2xl font-medium">C</span>
          <span className="text-gray-950 uppercase text-3xl font-bold">B</span>
          <span className="text-gray-500 text-xl font-medium">uilder</span>
        </Link>
        <p className="text-gray-800 text-[16px] 3xl:text-[18px] xl:leading-[27px] 3xl:leading-[24px] 5xl:leading-[36px] pt-3">
          Lorem ipsum, or lipsum as it is sometimes kno wn, is dummy text used
          in laying out print, gra phic or web designs.
        </p>
        <form>
          <div className="flex mt-5 w-full">
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              className="w-full h-10 xl:h-10 text-sm 3xl:text-base pl-3 flex flex-1  border sm:text-sm rounded-l-md focus:ri border-primary text-gray-800 bg-white outline-none"
            />
            <button type="submit" className="flex cursor-pointer items-center px-3 pointer-events-none sm:text-sm rounded-r-md uppercase bg-primary text-white text-sm 3xl:text-base">
              subscribe
            </button>
          </div>
        </form>
      </div>
      {/* 2 */}
      <div>
        <h3 className="text-gray-800 text-[17px] 3xl:text-[19px] font-semibold pb-5 uppercase">
          MY ACCOUNT
        </h3>
        <ul className="space-y-2">
          <li className="text-gray-800 text-[16px] 3xl:text-[18px] hover:text-primary cursor-pointer">
            Order
          </li>
          <li className="text-gray-800 text-[16px] 3xl:text-[18px] hover:text-primary cursor-pointer">
            Wish List
          </li>
          <li className="text-gray-800 text-[16px] 3xl:text-[18px] hover:text-primary cursor-pointer">
            Track Order
          </li>
          <li className="text-gray-800 text-[16px] 3xl:text-[18px] hover:text-primary cursor-pointer">
            Manage Account
          </li>
          <li className="text-gray-800 text-[16px] 3xl:text-[18px] hover:text-primary cursor-pointer">
            Return Order
          </li>
        </ul>
      </div>
      {/* 2 */}
      <div>
        <h3 className="text-gray-800 text-[17px] 3xl:text-[19px] font-semibold pb-5 uppercase">
          INFORMATION
        </h3>
        <ul className="space-y-2">
          <li className="text-gray-800 text-[16px] 3xl:text-[18px] hover:text-primary cursor-pointer">
            About us
          </li>
          <li className="text-gray-800 text-[16px] 3xl:text-[18px] hover:text-primary cursor-pointer">
            Privacy Policy
          </li>
          <li className="text-gray-800 text-[16px] 3xl:text-[18px] hover:text-primary cursor-pointer">
            Terms & Conditions
          </li>
          <li className="text-gray-800 text-[16px] 3xl:text-[18px] hover:text-primary cursor-pointer">
            Contact Us
          </li>
          <li className="text-gray-800 text-[16px] 3xl:text-[18px] hover:text-primary cursor-pointer">
            Return Order
          </li>
        </ul>
      </div>
      {/* 2 */}
      <div>
        <h3 className="text-gray-800 text-[17px] 3xl:text-[19px] font-semibold pb-5 uppercase">
          CONTACT
        </h3>
        <ul className="space-y-3">
          <li className="text-gray-800 text-[16px] 3xl:text-[18px]">
            Location: Natore, Bangladesh
          </li>
          <li className="text-gray-800 text-[16px] 3xl:text-[18px]">
            Mobile: +8801796682951
          </li>
          <li className="text-gray-800 text-[16px] 3xl:text-[18px]">
            Email: abdullainfo30@gmail.com
          </li>
        </ul>
      </div>
    </div>
    </div>
  );
};

export default Footer;
