import { FaFacebook } from "react-icons/fa";
import { RxGithubLogo, RxLinkedinLogo } from "react-icons/rx";

export const PROFILE = {
  name: "Mai Tran Thien Tam",
  alias: "MaiTamDev",
  email: "maitamit062005@gmail.com",
  phone: "+84 877 724 374",
  phoneHref: "tel:+84877724374",
  location: "HCM, Vietnam",
  cv: "/Mai-Tran-Thien-Tam-CV.pdf",
  github: "https://github.com/maitamdev",
  linkedin: "https://www.linkedin.com/in/maitam-dev-403220399",
  facebook: "https://www.facebook.com/maitamdvfb",
} as const;

export const SKILL_DATA = [
  { skill_name: "TypeScript", image: "ts.png", width: 80, height: 80 },
  { skill_name: "JavaScript", image: "js.png", width: 65, height: 65 },
  { skill_name: "React", image: "react.png", width: 80, height: 80 },
  { skill_name: "Next.js", image: "next.png", width: 80, height: 80 },
  { skill_name: "Vite", image: "vite.svg", width: 80, height: 80 },
] as const;

export const SOCIALS = [
  {
    name: "GitHub",
    icon: RxGithubLogo,
    link: PROFILE.github,
  },
  {
    name: "LinkedIn",
    icon: RxLinkedinLogo,
    link: PROFILE.linkedin,
  },
  {
    name: "Facebook",
    icon: FaFacebook,
    link: PROFILE.facebook,
  },
] as const;

export const FRONTEND_SKILL = [
  { skill_name: "HTML", image: "html.png", width: 80, height: 80 },
  { skill_name: "CSS", image: "css.png", width: 80, height: 80 },
  {
    skill_name: "Tailwind CSS",
    image: "tailwind.png",
    width: 80,
    height: 80,
  },
] as const;

export const BACKEND_SKILL = [
  { skill_name: "Node.js", image: "node.png", width: 80, height: 80 },
  { skill_name: "Express.js", image: "express.png", width: 80, height: 80 },
  {
    skill_name: "PostgreSQL",
    image: "postgresql.png",
    width: 70,
    height: 70,
  },
  { skill_name: "MongoDB", image: "mongodb.png", width: 48, height: 48 },
  { skill_name: "Supabase", image: "supabase.svg", width: 80, height: 80 },
  { skill_name: "Firebase", image: "firebase.png", width: 55, height: 55 },
] as const;

export const FULLSTACK_SKILL = [
  { skill_name: "Flutter", image: "flutter.svg", width: 80, height: 80 },
  { skill_name: "Dart", image: "dart.svg", width: 80, height: 80 },
  { skill_name: "Python", image: "python.svg", width: 80, height: 80 },
  { skill_name: "FastAPI", image: "fastapi.svg", width: 80, height: 80 },
] as const;

export const OTHER_SKILL = [
  { skill_name: "Docker", image: "docker.png", width: 70, height: 70 },
  { skill_name: "Git", image: "git.svg", width: 80, height: 80 },
  { skill_name: "Vercel", image: "vercel.svg", width: 80, height: 80 },
  { skill_name: "Rust", image: "rust.svg", width: 80, height: 80 },
] as const;

export const PROJECTS = [
  {
    title: "SafeReturn / FindBack",
    description:
      "An AI-assisted lost-and-found platform with Solana Devnet escrow, realtime data and evidence review powered by Groq.",
    descriptionVi:
      "Nền tảng tìm đồ thất lạc có AI, ký quỹ Solana Devnet, dữ liệu thời gian thực và Groq hỗ trợ đánh giá bằng chứng.",
    image: "/projects/project-1.png",
    link: "https://safereturn-delta.vercel.app",
    source: "https://github.com/maitamdev/safe-return",
    stack: ["Next.js", "TypeScript", "Supabase", "Solana", "Groq"],
    caseStudy: {
      brief:
        "Make lost-and-found reports easier to verify while creating a transparent reward flow between owners and finders.",
      briefVi:
        "Giúp việc xác minh báo cáo thất lạc dễ dàng hơn và tạo luồng phần thưởng minh bạch giữa người mất và người tìm thấy.",
      contribution:
        "Designed and built the product flow across realtime data, AI-assisted evidence review and Solana Devnet escrow.",
      contributionVi:
        "Thiết kế và xây dựng luồng sản phẩm kết nối dữ liệu thời gian thực, AI đánh giá bằng chứng và ký quỹ Solana Devnet.",
      highlights: [
        "Realtime lost-and-found reports",
        "AI-assisted evidence review",
        "Transparent Devnet escrow flow",
      ],
      highlightsVi: [
        "Báo cáo thất lạc thời gian thực",
        "AI hỗ trợ đánh giá bằng chứng",
        "Luồng ký quỹ Devnet minh bạch",
      ],
    },
  },
  {
    title: "Sora POS V2",
    description:
      "A full-stack retail POS for inventory, role-based access, analytics and AI-assisted restocking decisions.",
    descriptionVi:
      "Hệ thống POS bán lẻ full-stack quản lý kho, phân quyền, phân tích và hỗ trợ quyết định nhập hàng bằng AI.",
    image: "/projects/project-2.png",
    link: "https://sora-pos.vercel.app",
    source: "https://github.com/maitamdev/SORA-POS-V2",
    stack: ["React", "Node.js", "Express", "PostgreSQL", "Groq"],
    caseStudy: {
      brief:
        "Bring daily sales, inventory and operational decisions into one focused retail workspace.",
      briefVi:
        "Đưa bán hàng, tồn kho và quyết định vận hành hằng ngày vào một không gian làm việc bán lẻ tập trung.",
      contribution:
        "Built full-stack workflows for inventory, role-based access, analytics and AI-assisted restocking.",
      contributionVi:
        "Xây dựng các luồng full-stack cho tồn kho, phân quyền, phân tích và hỗ trợ nhập hàng bằng AI.",
      highlights: [
        "Inventory and sales workflows",
        "Role-based access",
        "AI-assisted restocking insights",
      ],
      highlightsVi: [
        "Luồng quản lý bán hàng và tồn kho",
        "Phân quyền người dùng",
        "AI hỗ trợ quyết định nhập hàng",
      ],
    },
  },
  {
    title: "DHV Guiding Light",
    description:
      "A mentorship platform connecting DHV students and advisors through bookings, dashboards and practical guidance tools.",
    descriptionVi:
      "Nền tảng cố vấn kết nối sinh viên DHV với người hướng dẫn qua lịch hẹn, dashboard và công cụ hỗ trợ thực tế.",
    image: "/projects/project-3.png",
    link: "https://dhv-guiding-light.vercel.app",
    source: "https://github.com/maitamdev/DHV-GUIDING-LIGHT",
    stack: ["React", "TypeScript", "Firebase", "Node.js"],
    caseStudy: {
      brief:
        "Create a clearer path for students to find the right mentor and receive one-to-one guidance.",
      briefVi:
        "Tạo con đường rõ ràng để sinh viên tìm đúng người cố vấn và nhận hỗ trợ một-một.",
      contribution:
        "Developed booking, dashboard and guidance experiences for students and advisors as part of Innovation & Startup 2025.",
      contributionVi:
        "Phát triển trải nghiệm đặt lịch, dashboard và hỗ trợ cho sinh viên lẫn cố vấn trong Innovation & Startup 2025.",
      highlights: [
        "One-to-one mentoring",
        "Booking and dashboard flows",
        "Innovation & Startup 2025 project",
      ],
      highlightsVi: [
        "Cố vấn một-một",
        "Luồng đặt lịch và dashboard",
        "Dự án Innovation & Startup 2025",
      ],
    },
  },
  {
    title: "UML Gen",
    description:
      "An AI-powered tool that turns natural-language prompts into editable UML diagrams with multiple export formats.",
    descriptionVi:
      "Công cụ AI chuyển mô tả ngôn ngữ tự nhiên thành sơ đồ UML có thể chỉnh sửa và xuất nhiều định dạng.",
    image: "/projects/project-4.png",
    link: "https://uml-gen-nine.vercel.app",
    source: "https://github.com/maitamdev/uml-gen",
    stack: ["TypeScript", "Vite", "Mermaid", "Groq"],
    caseStudy: {
      brief:
        "Shorten the distance between a software idea and a diagram that a team can review and refine.",
      briefVi:
        "Rút ngắn khoảng cách từ ý tưởng phần mềm đến sơ đồ mà nhóm có thể xem xét và chỉnh sửa.",
      contribution:
        "Built a prompt-to-diagram workflow with editable Mermaid output and practical export options.",
      contributionVi:
        "Xây dựng luồng chuyển prompt thành sơ đồ Mermaid có thể chỉnh sửa và xuất theo nhiều định dạng.",
      highlights: [
        "Natural-language generation",
        "Editable Mermaid diagrams",
        "Multiple export formats",
      ],
      highlightsVi: [
        "Sinh sơ đồ từ ngôn ngữ tự nhiên",
        "Chỉnh sửa sơ đồ Mermaid",
        "Xuất nhiều định dạng",
      ],
    },
  },
  {
    title: "SCS GO",
    description:
      "A smart EV charging platform with station discovery, booking, location analysis, mobile access and AI-assisted recommendations.",
    descriptionVi:
      "Nền tảng sạc xe điện thông minh với tìm trạm, đặt chỗ, phân tích vị trí, ứng dụng mobile và gợi ý bằng AI.",
    image: "/projects/project-5.png",
    link: "https://scs-go.vercel.app",
    source: "https://github.com/maitamdev/s-c-th-ng-minh",
    stack: ["React", "TypeScript", "Flutter", "Supabase"],
    caseStudy: {
      brief:
        "Help EV drivers discover suitable charging stations and make better location-aware charging decisions.",
      briefVi:
        "Giúp người dùng xe điện tìm trạm sạc phù hợp và đưa ra quyết định sạc dựa trên vị trí tốt hơn.",
      contribution:
        "Developed web and mobile product experiences for discovery, booking, location analysis and recommendations.",
      contributionVi:
        "Phát triển trải nghiệm web và mobile cho tìm kiếm, đặt chỗ, phân tích vị trí và gợi ý trạm sạc.",
      highlights: [
        "Web and Flutter mobile experiences",
        "Station discovery and booking",
        "Location-aware recommendations",
      ],
      highlightsVi: [
        "Trải nghiệm web và Flutter mobile",
        "Tìm kiếm và đặt trạm sạc",
        "Gợi ý dựa trên vị trí",
      ],
    },
  },
] as const;

export const FOOTER_DATA = [
  {
    title: "Find me",
    data: [
      {
        name: "GitHub",
        icon: RxGithubLogo,
        link: PROFILE.github,
      },
      {
        name: "LinkedIn",
        icon: RxLinkedinLogo,
        link: PROFILE.linkedin,
      },
      {
        name: "Portfolio source",
        icon: null,
        link: "https://github.com/maitamdev/maitam-pf",
      },
    ],
  },
  {
    title: "Social",
    data: [
      {
        name: "Facebook",
        icon: FaFacebook,
        link: PROFILE.facebook,
      },
    ],
  },
  {
    title: "Contact",
    data: [
      {
        name: PROFILE.email,
        icon: null,
        link: `mailto:${PROFILE.email}`,
      },
      {
        name: PROFILE.phone,
        icon: null,
        link: PROFILE.phoneHref,
      },
      {
        name: "HCM, Vietnam",
        icon: null,
        link: "https://www.google.com/maps/search/?api=1&query=Ho+Chi+Minh+City%2C+Vietnam",
      },
      {
        name: "Explore all projects",
        icon: null,
        link: "https://github.com/maitamdev?tab=repositories",
      },
    ],
  },
] as const;

export const NAV_LINKS = [
  { title: "About me", link: "#about-me" },
  { title: "Skills", link: "#skills" },
  { title: "Experience", link: "#experience" },
  { title: "Projects", link: "#projects" },
] as const;

export const LINKS = {
  github: PROFILE.github,
  email: `mailto:${PROFILE.email}`,
  phone: PROFILE.phoneHref,
  cv: PROFILE.cv,
  linkedin: PROFILE.linkedin,
} as const;
