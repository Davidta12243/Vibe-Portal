import { buttonVariants } from "./ui/button";
import { HeroCards } from "./HeroCards";
import { Sparkles, ArrowRight, LayoutGrid } from "lucide-react";

export const Hero = () => {
  return (
    <section className="container grid lg:grid-cols-2 place-items-center py-16 md:py-28 gap-10">
      <div className="text-center lg:text-start space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Hệ Sinh Thái Đa Nền Tảng • Vibe Studio</span>
        </div>

        <main className="text-5xl md:text-6xl font-black tracking-tight leading-tight">
          Cổng Kết Nối{" "}
          <span className="inline bg-gradient-to-r from-primary via-purple-600 to-pink-500 text-transparent bg-clip-text">
            Vibe Studio
          </span>{" "}
          & Các Web Con
        </main>

        <p className="text-lg md:text-xl text-muted-foreground md:w-11/12 mx-auto lg:mx-0 leading-relaxed">
          Nền tảng tích hợp trung tâm kết nối liền mạch 6 phân hệ chuyên sâu: Mua sắm (Shopee), Nông sản (Sendo Farm), Ráp PC (Phúc Anh), Du lịch (Traveloka), Khóa học (LMS) và Livestream Studio.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2">
          <a 
            href="#ecosystem" 
            className={`text-base font-semibold px-6 py-5 ${buttonVariants({ variant: "default" })}`}
          >
            <LayoutGrid className="mr-2 w-5 h-5" />
            Khám Phá 6 Phân Hệ
            <ArrowRight className="ml-2 w-4 h-4" />
          </a>

          <a
            href={(import.meta.env.VITE_APP_SHOP_URL as string) || "https://1shop-virid.vercel.app/"}
            target="_blank"
            rel="noreferrer noopener"
            className={`text-base font-semibold px-6 py-5 ${buttonVariants({
              variant: "outline",
            })}`}
          >
            Vào Web 1 (Vibe Shop) ➔
          </a>
        </div>
      </div>

      {/* Hero cards sections */}
      <div className="z-10">
        <HeroCards />
      </div>

      {/* Shadow effect */}
      <div className="shadow"></div>
    </section>
  );
};
