import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { buttonVariants } from "./ui/button";
import { 
  ShoppingBag, 
  Apple, 
  Cpu, 
  Plane, 
  GraduationCap, 
  Video, 
  ExternalLink,
  Layers
} from "lucide-react";

interface SubAppProps {
  id: string;
  title: string;
  port: number;
  url: string;
  styleRef: string;
  description: string;
  icon: JSX.Element;
  color: string;
  tags: string[];
}

const subApps: SubAppProps[] = [
  {
    id: "shop",
    title: "1. Vibe Shop",
    port: 3001,
    url: (import.meta.env.VITE_APP_SHOP_URL as string) || "http://localhost:3001",
    styleRef: "Shopee Clone",
    description: "Sàn thương mại điện tử đa ngành hàng, Flash Sale giá sốc, voucher giảm giá và thanh toán tiện lợi.",
    icon: <ShoppingBag className="w-8 h-8 text-orange-500" />,
    color: "from-orange-500/10 to-transparent border-orange-500/20",
    tags: ["TMĐT", "Flash Sale", "Giỏ Hàng"]
  },
  {
    id: "food",
    title: "2. Vibe Farm / Food",
    port: 3002,
    url: (import.meta.env.VITE_APP_FOOD_URL as string) || "http://localhost:3002",
    styleRef: "Sendo Farm Clone",
    description: "Đi chợ online thực phẩm tươi sống, nông sản sạch chuẩn VietGAP, rau củ quả giao theo khung giờ.",
    icon: <Apple className="w-8 h-8 text-emerald-500" />,
    color: "from-emerald-500/10 to-transparent border-emerald-500/20",
    tags: ["Thực Phẩm Sạch", "Nông Sản", "Giao Nhanh"]
  },
  {
    id: "pc",
    title: "3. Vibe Tech / PC",
    port: 3003,
    url: (import.meta.env.VITE_APP_PC_URL as string) || "http://localhost:3003",
    styleRef: "Phúc Anh Clone",
    description: "Linh kiện máy tính chính hãng, công cụ tự build cấu hình PC thông minh, kiểm tra tương thích phần cứng.",
    icon: <Cpu className="w-8 h-8 text-blue-500" />,
    color: "from-blue-500/10 to-transparent border-blue-500/20",
    tags: ["Build PC", "Linh Kiện", "Công Nghệ"]
  },
  {
    id: "travel",
    title: "4. Vibe Travel",
    port: 3004,
    url: (import.meta.env.VITE_APP_TRAVEL_URL as string) || "http://localhost:3004",
    styleRef: "Traveloka Clone",
    description: "Đặt vé máy bay nội địa & quốc tế, đặt phòng khách sạn, combo tour du lịch nghỉ dưỡng trọn gói.",
    icon: <Plane className="w-8 h-8 text-sky-500" />,
    color: "from-sky-500/10 to-transparent border-sky-500/20",
    tags: ["Vé Máy Bay", "Khách Sạn", "Tour"]
  },
  {
    id: "edu",
    title: "5. Vibe Edu",
    port: 3005,
    url: (import.meta.env.VITE_APP_EDU_URL as string) || "http://localhost:3005",
    styleRef: "LMS Platform",
    description: "Nền tảng học tập trực tuyến LMS, bài giảng video, bài tập trắc nghiệm và theo dõi tiến độ học.",
    icon: <GraduationCap className="w-8 h-8 text-indigo-500" />,
    color: "from-indigo-500/10 to-transparent border-indigo-500/20",
    tags: ["Khóa Học", "LMS", "Trắc Nghiệm"]
  },
  {
    id: "livestream",
    title: "6. Vibe Live Studio",
    port: 3006,
    url: (import.meta.env.VITE_APP_LIVESTREAM_URL as string) || "http://localhost:3006",
    styleRef: "Livestream Studio",
    description: "Đặt lịch thuê phòng live setup sẵn máy quay, ánh sáng chuẩn studio, hỗ trợ phát trực tiếp WebRTC.",
    icon: <Video className="w-8 h-8 text-rose-500" />,
    color: "from-rose-500/10 to-transparent border-rose-500/20",
    tags: ["Đặt Phòng", "Livestream", "Thiết Bị"]
  }
];

export const Services = () => {
  return (
    <section id="ecosystem" className="container py-20 sm:py-28 space-y-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold bg-primary/10 text-primary">
          <Layers className="w-4 h-4" />
          <span>Hệ Thống Phân Hệ Độc Lập</span>
        </div>

        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
          Hệ Sinh Thái{" "}
          <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 text-transparent bg-clip-text">
            Vibe Studio
          </span>
        </h2>

        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Web Tổng đóng vai trò điều hướng trung tâm. Bấm vào bất kỳ phân hệ nào bên dưới để mở web con tương ứng (đã phân chia cổng độc lập từ 3001 đến 3006):
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subApps.map((app) => (
          <Card 
            key={app.id} 
            className={`flex flex-col justify-between border bg-gradient-to-b ${app.color} hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
          >
            <CardHeader className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-background rounded-2xl shadow-sm border">
                  {app.icon}
                </div>
                <Badge variant={app.url.startsWith("http://localhost") ? "outline" : "default"} className="font-mono text-xs px-2.5 py-1 font-bold">
                  {app.url.startsWith("http://localhost") ? `Port :${app.port}` : "🟢 Live Vercel"}
                </Badge>
              </div>

              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {app.styleRef}
                </div>
                <CardTitle className="text-2xl font-bold mt-1">
                  {app.title}
                </CardTitle>
              </div>

              <CardDescription className="text-sm leading-relaxed text-muted-foreground/90">
                {app.description}
              </CardDescription>

              <div className="flex flex-wrap gap-1.5 pt-2">
                {app.tags.map((t) => (
                  <span key={t} className="text-[11px] px-2 py-0.5 rounded-md bg-background/80 border text-muted-foreground">
                    #{t}
                  </span>
                ))}
              </div>
            </CardHeader>

            <CardContent className="pt-0 pb-6">
              <a
                href={app.url}
                target="_blank"
                rel="noreferrer noopener"
                className={`w-full justify-center group ${buttonVariants({ variant: "default" })}`}
              >
                <span>{app.url.startsWith("http://localhost") ? `Mở phân hệ :${app.port}` : `Mở ${app.title}`}</span>
                <ExternalLink className="ml-2 w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
