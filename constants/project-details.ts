export type ProjectStatus = "Live" | "In development" | "Archived";

export type ProjectDetail = {
  slug: string;
  title: string;
  image: string;
  live: string;
  source: string;
  status: ProjectStatus;
  role: string;
  roleVi: string;
  period: string;
  summary: string;
  summaryVi: string;
  problem: string;
  problemVi: string;
  challenge: string;
  challengeVi: string;
  solution: string;
  solutionVi: string;
  outcome: string;
  outcomeVi: string;
  stack: readonly string[];
  architecture: readonly string[];
  architectureVi: readonly string[];
  features: readonly string[];
  featuresVi: readonly string[];
  metrics: readonly { value: string; label: string; labelVi: string }[];
};

export const PROJECT_DETAILS: readonly ProjectDetail[] = [
  {
    slug: "safe-return",
    title: "SafeReturn / FindBack",
    image: "/projects/project-1.png",
    live: "https://safereturn-delta.vercel.app",
    source: "https://github.com/maitamdev/safe-return",
    status: "Live",
    role: "Full-stack product developer",
    roleVi: "Lập trình viên sản phẩm full-stack",
    period: "2025",
    summary:
      "AI-assisted lost-and-found with realtime reports and a transparent reward flow.",
    summaryVi:
      "Nền tảng tìm đồ thất lạc có AI, báo cáo thời gian thực và luồng phần thưởng minh bạch.",
    problem:
      "Lost-and-found reports are difficult to verify, while rewards between owners and finders often depend on trust alone.",
    problemVi:
      "Báo cáo thất lạc khó xác minh, còn phần thưởng giữa người mất và người tìm thấy thường chỉ phụ thuộc vào niềm tin.",
    challenge:
      "Realtime state, evidence review and blockchain escrow needed to feel like one simple product instead of three disconnected systems.",
    challengeVi:
      "Dữ liệu thời gian thực, đánh giá bằng chứng và ký quỹ blockchain phải hoạt động như một sản phẩm thống nhất.",
    solution:
      "A guided report-and-claim flow connects Supabase realtime data, Groq-assisted evidence review and Solana Devnet escrow.",
    solutionVi:
      "Luồng báo cáo–xác nhận kết nối dữ liệu Supabase thời gian thực, Groq đánh giá bằng chứng và ký quỹ Solana Devnet.",
    outcome:
      "A working end-to-end product demonstrating reports, claims, evidence review and transparent Devnet rewards.",
    outcomeVi:
      "Sản phẩm end-to-end hoạt động với báo cáo, xác nhận, đánh giá bằng chứng và phần thưởng Devnet minh bạch.",
    stack: ["Next.js", "TypeScript", "Supabase", "Solana", "Groq"],
    architecture: ["Next.js UI", "Supabase realtime", "Groq review", "Solana escrow"],
    architectureVi: ["Giao diện Next.js", "Supabase realtime", "Groq đánh giá", "Solana ký quỹ"],
    features: ["Realtime reports", "Evidence review", "Devnet escrow", "Claim workflow"],
    featuresVi: ["Báo cáo realtime", "Đánh giá bằng chứng", "Ký quỹ Devnet", "Luồng xác nhận"],
    metrics: [
      { value: "4", label: "Core product flows", labelVi: "Luồng sản phẩm chính" },
      { value: "5", label: "Core technologies", labelVi: "Công nghệ cốt lõi" },
    ],
  },
  {
    slug: "sora-pos-v2",
    title: "Sora POS V2",
    image: "/projects/project-2.png",
    live: "https://sora-pos.vercel.app",
    source: "https://github.com/maitamdev/SORA-POS-V2",
    status: "Live",
    role: "Full-stack developer",
    roleVi: "Lập trình viên full-stack",
    period: "2025",
    summary:
      "Retail operations workspace for sales, inventory, permissions and assisted decisions.",
    summaryVi:
      "Không gian vận hành bán lẻ cho bán hàng, tồn kho, phân quyền và hỗ trợ quyết định.",
    problem:
      "Retail teams need sales and inventory data in one place without losing access control or operational visibility.",
    problemVi:
      "Đội ngũ bán lẻ cần dữ liệu bán hàng và tồn kho tập trung nhưng vẫn phải đảm bảo phân quyền và khả năng quan sát.",
    challenge:
      "Inventory mutations, permissions and analytics must stay consistent while keeping checkout interactions fast.",
    challengeVi:
      "Biến động tồn kho, phân quyền và phân tích phải nhất quán trong khi thao tác thanh toán vẫn nhanh.",
    solution:
      "A role-aware React interface connects Express services and PostgreSQL data, with Groq supporting restocking insights.",
    solutionVi:
      "Giao diện React theo vai trò kết nối dịch vụ Express và PostgreSQL, kết hợp Groq hỗ trợ gợi ý nhập hàng.",
    outcome:
      "A deployable POS covering daily retail workflows from inventory management to analytics.",
    outcomeVi:
      "Hệ thống POS có thể triển khai, bao phủ vận hành bán lẻ từ quản lý tồn kho đến phân tích.",
    stack: ["React", "Node.js", "Express", "PostgreSQL", "Groq"],
    architecture: ["React dashboard", "Express API", "PostgreSQL", "Groq insights"],
    architectureVi: ["Dashboard React", "API Express", "PostgreSQL", "Groq phân tích"],
    features: ["Sales workflow", "Inventory", "Role access", "Analytics"],
    featuresVi: ["Luồng bán hàng", "Tồn kho", "Phân quyền", "Phân tích"],
    metrics: [
      { value: "4", label: "Operational modules", labelVi: "Phân hệ vận hành" },
      { value: "3", label: "Application layers", labelVi: "Lớp ứng dụng" },
    ],
  },
  {
    slug: "dhv-guiding-light",
    title: "DHV Guiding Light",
    image: "/projects/project-3.png",
    live: "https://dhv-guiding-light.vercel.app",
    source: "https://github.com/maitamdev/DHV-GUIDING-LIGHT",
    status: "Live",
    role: "Developer - Innovation & Startup 2025",
    roleVi: "Lập trình viên - Innovation & Startup 2025",
    period: "2024 - present",
    summary:
      "One-to-one mentoring platform connecting Hung Vuong University students and advisors.",
    summaryVi:
      "Nền tảng cố vấn một-một kết nối sinh viên Hung Vuong University và người hướng dẫn.",
    problem:
      "Students need a clearer way to discover suitable mentors, arrange sessions and continue practical guidance.",
    problemVi:
      "Sinh viên cần cách rõ ràng hơn để tìm người cố vấn phù hợp, đặt lịch và tiếp tục nhận hỗ trợ thực tế.",
    challenge:
      "Student and advisor journeys require different information while sharing the same booking lifecycle.",
    challengeVi:
      "Sinh viên và cố vấn cần thông tin khác nhau nhưng cùng dùng chung vòng đời đặt lịch.",
    solution:
      "Role-specific dashboards organize mentor discovery, bookings and guidance into a shared Firebase-backed workflow.",
    solutionVi:
      "Dashboard theo vai trò tổ chức việc tìm cố vấn, đặt lịch và hỗ trợ trong một luồng dùng Firebase.",
    outcome:
      "A working mentoring experience prepared for the Innovation & Startup 2025 program.",
    outcomeVi:
      "Trải nghiệm cố vấn hoạt động hoàn chỉnh phục vụ chương trình Innovation & Startup 2025.",
    stack: ["React", "TypeScript", "Firebase", "Node.js"],
    architecture: ["React clients", "Role dashboards", "Node.js services", "Firebase"],
    architectureVi: ["Ứng dụng React", "Dashboard vai trò", "Dịch vụ Node.js", "Firebase"],
    features: ["Mentor discovery", "Bookings", "Student dashboard", "Advisor dashboard"],
    featuresVi: ["Tìm cố vấn", "Đặt lịch", "Dashboard sinh viên", "Dashboard cố vấn"],
    metrics: [
      { value: "2", label: "User journeys", labelVi: "Hành trình người dùng" },
      { value: "1:1", label: "Mentoring model", labelVi: "Mô hình cố vấn" },
    ],
  },
  {
    slug: "uml-gen",
    title: "UML Gen",
    image: "/projects/project-4.png",
    live: "https://uml-gen-nine.vercel.app",
    source: "https://github.com/maitamdev/uml-gen",
    status: "Live",
    role: "Product developer",
    roleVi: "Lập trình viên sản phẩm",
    period: "2025",
    summary:
      "Prompt-to-UML workspace with editable Mermaid diagrams and practical exports.",
    summaryVi:
      "Không gian chuyển prompt thành UML với sơ đồ Mermaid chỉnh sửa được và nhiều định dạng xuất.",
    problem:
      "Turning early software ideas into reviewable diagrams is repetitive and slows technical discussion.",
    problemVi:
      "Chuyển ý tưởng phần mềm ban đầu thành sơ đồ để review thường lặp lại và làm chậm trao đổi kỹ thuật.",
    challenge:
      "Generated diagrams must remain syntactically valid, editable and useful after the first AI response.",
    challengeVi:
      "Sơ đồ được sinh phải đúng cú pháp, chỉnh sửa được và tiếp tục hữu ích sau phản hồi AI đầu tiên.",
    solution:
      "Groq transforms prompts into Mermaid definitions inside an editor that supports refinement and export.",
    solutionVi:
      "Groq chuyển prompt thành định nghĩa Mermaid trong trình chỉnh sửa hỗ trợ tinh chỉnh và xuất file.",
    outcome:
      "A live developer tool shortening the path from natural language to a shareable UML artifact.",
    outcomeVi:
      "Công cụ developer đang hoạt động, rút ngắn quá trình từ ngôn ngữ tự nhiên đến UML có thể chia sẻ.",
    stack: ["TypeScript", "Vite", "Mermaid", "Groq"],
    architecture: ["Prompt editor", "Groq generation", "Mermaid renderer", "Export pipeline"],
    architectureVi: ["Trình nhập prompt", "Groq sinh nội dung", "Mermaid render", "Luồng xuất file"],
    features: ["Prompt generation", "Live editing", "Diagram preview", "Multi-format export"],
    featuresVi: ["Sinh từ prompt", "Chỉnh sửa trực tiếp", "Xem trước sơ đồ", "Xuất nhiều định dạng"],
    metrics: [
      { value: "4", label: "Workflow stages", labelVi: "Giai đoạn xử lý" },
      { value: "1", label: "Editable source", labelVi: "Nguồn chỉnh sửa thống nhất" },
    ],
  },
  {
    slug: "scs-go",
    title: "SCS GO",
    image: "/projects/project-5.png",
    live: "https://scs-go.vercel.app",
    source: "https://github.com/maitamdev/s-c-th-ng-minh",
    status: "Live",
    role: "Web and mobile developer",
    roleVi: "Lập trình viên web và mobile",
    period: "2025",
    summary:
      "EV charging discovery and booking across web, mobile and operator experiences.",
    summaryVi:
      "Tìm kiếm và đặt trạm sạc xe điện trên web, mobile và giao diện vận hành.",
    problem:
      "EV drivers need to find suitable charging stations with enough location context to make confident decisions.",
    problemVi:
      "Người dùng xe điện cần tìm trạm phù hợp với đủ thông tin vị trí để đưa ra quyết định tin cậy.",
    challenge:
      "Web, Flutter mobile, mapping, authentication and recommendation flows must share consistent station data.",
    challengeVi:
      "Web, Flutter mobile, bản đồ, xác thực và luồng gợi ý phải dùng dữ liệu trạm nhất quán.",
    solution:
      "A Supabase-backed platform connects React web, Flutter mobile, Leaflet maps and location-aware recommendations.",
    solutionVi:
      "Nền tảng dùng Supabase kết nối React web, Flutter mobile, bản đồ Leaflet và gợi ý theo vị trí.",
    outcome:
      "A live multi-surface product covering station discovery, booking and operator visibility.",
    outcomeVi:
      "Sản phẩm đa nền tảng đang hoạt động, bao phủ tìm trạm, đặt chỗ và khả năng quan sát vận hành.",
    stack: ["React", "TypeScript", "Flutter", "Supabase", "Leaflet"],
    architecture: ["React web", "Flutter mobile", "Supabase", "Leaflet map", "Recommendation engine"],
    architectureVi: ["React web", "Flutter mobile", "Supabase", "Bản đồ Leaflet", "Bộ máy gợi ý"],
    features: ["Station discovery", "Booking", "Map analysis", "Operator dashboard"],
    featuresVi: ["Tìm trạm", "Đặt chỗ", "Phân tích bản đồ", "Dashboard vận hành"],
    metrics: [
      { value: "3", label: "Product surfaces", labelVi: "Bề mặt sản phẩm" },
      { value: "5", label: "Core platform parts", labelVi: "Thành phần nền tảng" },
    ],
  },
] as const;

export const getProjectBySlug = (slug: string) =>
  PROJECT_DETAILS.find((project) => project.slug === slug);
