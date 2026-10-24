import Footer from "./Footer";
import Menubar from "./Menubar";
import Navbar from "./Navber";

 
export default function RootLayout({ children }) {
  return (
    <>
      <Navbar />
      <Menubar />
      <main>{children}</main>
      <Footer />
    </>
  )
}