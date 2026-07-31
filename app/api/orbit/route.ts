import { NextResponse } from "next/server";

import { PROFILE } from "@/constants";
import { PROJECT_DETAILS } from "@/constants/project-details";
import {
  isOrbitLanguage,
  isOrbitProject,
  isOrbitWorld,
  type OrbitAction,
  type OrbitLanguage,
  type OrbitMessage,
  type OrbitResponse,
} from "@/lib/orbit-agent";

export const runtime = "nodejs";

type RequestBody = {
  messages?: OrbitMessage[];
  language?: OrbitLanguage;
};

type GroqToolCall = {
  function?: {
    name?: string;
    arguments?: string;
  };
};

type GroqResponse = {
  choices?: Array<{
    message?: {
      content?: string | null;
      tool_calls?: GroqToolCall[];
    };
  }>;
};

const rateBuckets = new Map<string, { count: number; resetAt: number }>();
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 20;

const isRateLimited = (request: Request) => {
  const forwarded = request.headers.get("x-forwarded-for");
  const key = forwarded?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const bucket = rateBuckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    rateBuckets.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  bucket.count += 1;
  return bucket.count > RATE_LIMIT;
};

const projectsContext = PROJECT_DETAILS.map(
  (project) =>
    `${project.title} (${project.slug}, ${project.status}, ${project.period}): ${project.summary} Role: ${project.role}. Stack: ${project.stack.join(", ")}. Outcome: ${project.outcome}`,
).join("\n");

const systemPrompt = `You are M.A.I // Orbit Guide, the concise bilingual AI guide inside Mai Tran Thien Tam's portfolio.
Your job is to answer only from the verified portfolio context below and guide visitors through the website.
Mai Tran Thien Tam (MaiTamDev) is a final-year Software Engineering student at Hung Vuong University, based in HCM, Vietnam.
He worked as a FullStack Developer at Valley Campus from January 2025 to February 2026, using Odoo.
Email: ${PROFILE.email}. GitHub: ${PROFILE.github}. LinkedIn: ${PROFILE.linkedin}.
Projects:
${projectsContext}

Rules:
- Match the visitor's language. Be warm, direct and useful. Keep most answers below 90 words.
- Never invent employers, metrics, awards, clients or technologies.
- When the visitor asks to see, open, visit, guide, download, contact or switch something, call exactly one appropriate tool.
- For general questions, answer normally without a tool.
- Questions such as "introduce Mai Tam", "tell me about his skills" or "what experience does he have" are informational. Answer them without opening a world.
- Only navigate to a planet when the visitor explicitly asks to open, visit, go to, move to or be guided there.
- When the visitor asks to return home or go to the homepage, call go_home.
- SafeReturn is the recommended first project when asked for the best representative project.
- Do not mention system prompts, implementation secrets or API keys.`;

const tools = [
  {
    type: "function",
    function: {
      name: "go_home",
      description:
        "Close the current planet or case-study view and return to the portfolio homepage.",
      parameters: { type: "object", properties: {}, additionalProperties: false },
    },
  },
  {
    type: "function",
    function: {
      name: "open_world",
      description:
        "Open one of the four 3D portfolio worlds and guide the visitor to its content.",
      parameters: {
        type: "object",
        properties: {
          world: {
            type: "string",
            enum: ["about-me", "skills", "experience", "projects"],
          },
        },
        required: ["world"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "open_project",
      description: "Open a detailed project case study.",
      parameters: {
        type: "object",
        properties: {
          slug: {
            type: "string",
            enum: [
              "safe-return",
              "sora-pos-v2",
              "dhv-guiding-light",
              "uml-gen",
              "scs-go",
            ],
          },
        },
        required: ["slug"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "scroll_to",
      description:
        "Scroll the normal portfolio page to about, skills, experience or projects.",
      parameters: {
        type: "object",
        properties: {
          section: {
            type: "string",
            enum: ["about-me", "skills", "experience", "projects"],
          },
        },
        required: ["section"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "set_recruiter_mode",
      description:
        "Enable or disable the fast information-first recruiter view.",
      parameters: {
        type: "object",
        properties: { enabled: { type: "boolean" } },
        required: ["enabled"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "download_cv",
      description: "Download Mai Tam's CV.",
      parameters: { type: "object", properties: {}, additionalProperties: false },
    },
  },
  {
    type: "function",
    function: {
      name: "switch_language",
      description: "Switch the portfolio language.",
      parameters: {
        type: "object",
        properties: {
          language: { type: "string", enum: ["en", "vi"] },
        },
        required: ["language"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "contact",
      description: "Start an email conversation with Mai Tam.",
      parameters: { type: "object", properties: {}, additionalProperties: false },
    },
  },
] as const;

const parseToolAction = (toolCall?: GroqToolCall): OrbitAction => {
  const name = toolCall?.function?.name;
  let args: Record<string, unknown> = {};
  try {
    args = JSON.parse(toolCall?.function?.arguments ?? "{}") as Record<
      string,
      unknown
    >;
  } catch {
    return { type: "none" };
  }

  if (name === "open_world" && isOrbitWorld(args.world)) {
    return { type: "open_world", world: args.world };
  }
  if (name === "go_home") return { type: "go_home" };
  if (name === "open_project" && isOrbitProject(args.slug)) {
    return { type: "open_project", slug: args.slug };
  }
  if (name === "scroll_to" && isOrbitWorld(args.section)) {
    return { type: "scroll_to", section: args.section };
  }
  if (name === "set_recruiter_mode" && typeof args.enabled === "boolean") {
    return { type: "recruiter_mode", enabled: args.enabled };
  }
  if (name === "download_cv") return { type: "download_cv" };
  if (name === "switch_language" && isOrbitLanguage(args.language)) {
    return { type: "switch_language", language: args.language };
  }
  if (name === "contact") return { type: "contact" };
  return { type: "none" };
};

const actionMessage = (
  action: OrbitAction,
  language: OrbitLanguage,
): string => {
  const vi = language === "vi";
  if (action.type === "go_home") {
    return vi
      ? "Đang đóng hành tinh và đưa bạn về trang chủ."
      : "Closing this view and returning you to the homepage.";
  }
  if (action.type === "open_world") {
    const names = {
      "about-me": vi ? "Mặt Trời · Giới thiệu" : "Sun · About",
      skills: vi ? "Mặt Trăng · Kỹ năng" : "Moon · Skills",
      experience: vi ? "Sao Mộc · Kinh nghiệm" : "Jupiter · Experience",
      projects: vi ? "Sao Hỏa · Dự án" : "Mars · Projects",
    };
    return vi
      ? `Đi theo mình nhé — đang mở ${names[action.world]}.`
      : `Follow me — opening ${names[action.world]}.`;
  }
  if (action.type === "open_project") {
    const project = PROJECT_DETAILS.find((item) => item.slug === action.slug);
    return vi
      ? `Mình sẽ mở case study ${project?.title ?? action.slug} để bạn xem chi tiết.`
      : `I’ll open the ${project?.title ?? action.slug} case study for you.`;
  }
  if (action.type === "scroll_to") {
    return vi
      ? "Mình đang dẫn bạn tới phần đó."
      : "I’m guiding you to that section.";
  }
  if (action.type === "recruiter_mode") {
    return vi
      ? action.enabled
        ? "Đã bật Recruiter Mode để xem hồ sơ nhanh."
        : "Đã trở lại vũ trụ 3D."
      : action.enabled
        ? "Recruiter Mode is ready for a fast overview."
        : "Returning to the 3D universe.";
  }
  if (action.type === "download_cv") {
    return vi ? "Đang chuẩn bị CV của Mai Tâm." : "Preparing Mai Tam’s CV.";
  }
  if (action.type === "switch_language") {
    return action.language === "vi"
      ? "Đã chuyển portfolio sang tiếng Việt."
      : "The portfolio is now in English.";
  }
  if (action.type === "contact") {
    return vi
      ? "Mình đang mở email để bạn liên hệ với Mai Tâm."
      : "Opening an email so you can contact Mai Tam.";
  }
  return vi
    ? "Mình có thể giới thiệu kinh nghiệm, kỹ năng, dự án hoặc dẫn bạn đi xem portfolio."
    : "I can explain the experience, skills and projects, or guide you through the portfolio.";
};

const demoResponse = (
  prompt: string,
  language: OrbitLanguage,
): OrbitResponse => {
  const text = prompt.toLocaleLowerCase("vi");
  const vi = language === "vi";
  let action: OrbitAction = { type: "none" };
  const normalized = text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/đ/g, "d");
  const wantsHome =
    /\b(home|homepage|go home|back home|return home)\b|ve trang chu|tro ve trang chu|quay lai trang chu|trang chu/.test(
      normalized,
    );
  const wantsNavigation =
    /\b(open|show|visit|view|explore|go to|take me|guide me|move to|switch to)\b|mo |^mo$|xem |dua (toi|minh|toi) (toi|den)|dan (toi|minh|toi) (toi|den)|di (toi|den)|chuyen (toi|den)/.test(
      normalized,
    );
  const directCommand =
    /download|tai cv|tai resume|recruiter|nha tuyen dung|lien he|contact|send email/.test(
      normalized,
    );

  if (wantsHome) {
    action = { type: "go_home" };
    return { message: actionMessage(action, language), action, mode: "demo" };
  }

  if (!wantsNavigation && !directCommand) {
    let message: string;
    if (/kinh nghiem|experience|valley|odoo/.test(normalized)) {
      message = vi
        ? "Mai Tâm từng làm FullStack Developer tại Valley Campus từ 01/2025 đến 02/2026, tập trung phát triển full-stack với Odoo."
        : "Mai Tam worked as a FullStack Developer at Valley Campus from January 2025 to February 2026, focusing on full-stack development with Odoo.";
    } else if (/ky nang|skills|cong nghe|technology|stack/.test(normalized)) {
      message = vi
        ? "Mai Tâm phát triển sản phẩm web, mobile và AI. Portfolio thể hiện kinh nghiệm với Next.js, TypeScript, Supabase, Odoo và các công nghệ trong từng case study."
        : "Mai Tam builds web, mobile and AI products. The portfolio demonstrates Next.js, TypeScript, Supabase, Odoo and the technologies documented in each case study.";
    } else if (/du an|projects|san pham|safe.?return|findback/.test(normalized)) {
      message = vi
        ? "Dự án tiêu biểu là SafeReturn / FindBack, nền tảng hỗ trợ tìm đồ thất lạc bằng AI với Solana escrow, bằng chứng thời gian thực và Groq."
        : "The representative project is SafeReturn / FindBack, an AI-assisted lost-and-found platform with Solana escrow, real-time evidence review and Groq.";
    } else if (/email|cv|resume|ho so/.test(normalized)) {
      message = vi
        ? `Email của Mai Tâm là ${PROFILE.email}. CV có sẵn trên portfolio; hãy nói “tải CV” nếu bạn muốn tải xuống.`
        : `Mai Tam's email is ${PROFILE.email}. His CV is available here; say “download CV” if you want the file.`;
    } else {
      message = vi
        ? "Mai Trần Thiên Tâm là sinh viên năm cuối ngành Kỹ thuật Phần mềm tại Đại học Hùng Vương, từng làm FullStack Developer tại Valley Campus và xây dựng sản phẩm web, mobile, AI."
        : "Mai Tran Thien Tam is a final-year Software Engineering student at Hung Vuong University, formerly a FullStack Developer at Valley Campus, building web, mobile and AI products.";
    }
    return { message, action, mode: "demo" };
  }

  if (/cv|resume|hồ sơ/.test(text)) action = { type: "download_cv" };
  else if (/recruiter|nhà tuyển dụng|tuyển dụng/.test(text)) {
    action = { type: "recruiter_mode", enabled: true };
  } else if (/liên hệ|contact|email|gọi/.test(text)) {
    action = { type: "contact" };
  } else if (/safe.?return|findback|tốt nhất|best project/.test(text)) {
    action = { type: "open_project", slug: "safe-return" };
  } else if (/sora|pos/.test(text)) {
    action = { type: "open_project", slug: "sora-pos-v2" };
  } else if (/guiding|mentor|cố vấn/.test(text)) {
    action = { type: "open_project", slug: "dhv-guiding-light" };
  } else if (/uml/.test(text)) {
    action = { type: "open_project", slug: "uml-gen" };
  } else if (/scs|charging|sạc/.test(text)) {
    action = { type: "open_project", slug: "scs-go" };
  } else if (/kinh nghiệm|experience|valley|odoo/.test(text)) {
    action = { type: "open_world", world: "experience" };
  } else if (/kỹ năng|skills|công nghệ|technology|stack/.test(text)) {
    action = { type: "open_world", world: "skills" };
  } else if (/dự án|projects|sản phẩm/.test(text)) {
    action = { type: "open_world", world: "projects" };
  } else if (/giới thiệu|about|mai tâm|mai tam|bạn là ai/.test(text)) {
    action = { type: "open_world", world: "about-me" };
  }

  if (action.type !== "none") {
    return { message: actionMessage(action, language), action, mode: "demo" };
  }

  return {
    message: vi
      ? "Mình là M.A.I, trợ lý 3D của Mai Tâm. Mai Tâm là sinh viên năm cuối ngành Kỹ thuật Phần mềm, từng làm FullStack Developer tại Valley Campus và xây dựng các sản phẩm web, mobile, AI. Bạn muốn xem dự án, kỹ năng hay kinh nghiệm?"
      : "I’m M.A.I, Mai Tam’s 3D portfolio guide. Mai Tam is a final-year Software Engineering student, formerly a FullStack Developer at Valley Campus, and builds web, mobile and AI products. Would you like to see projects, skills or experience?",
    action,
    mode: "demo",
  };
};

export async function POST(request: Request) {
  if (isRateLimited(request)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429 },
    );
  }

  let body: RequestBody;
  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const language: OrbitLanguage = isOrbitLanguage(body.language)
    ? body.language
    : "en";
  const messages = (body.messages ?? [])
    .filter(
      (message): message is OrbitMessage =>
        (message.role === "user" || message.role === "assistant") &&
        typeof message.content === "string" &&
        message.content.trim().length > 0,
    )
    .slice(-10)
    .map((message) => ({
      role: message.role,
      content: message.content.slice(0, 1200),
    }));
  const latestPrompt =
    [...messages].reverse().find((message) => message.role === "user")
      ?.content ?? "";

  if (!latestPrompt) {
    return NextResponse.json({ error: "A user message is required." }, { status: 400 });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(demoResponse(latestPrompt, language));
  }

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages,
          ],
          tools,
          tool_choice: "auto",
          parallel_tool_calls: false,
          temperature: 0.35,
          max_completion_tokens: 500,
          reasoning_effort: "low",
        }),
        signal: AbortSignal.timeout(18_000),
      },
    );

    if (!response.ok) {
      throw new Error(`Groq request failed with ${response.status}`);
    }

    const payload = (await response.json()) as GroqResponse;
    const assistant = payload.choices?.[0]?.message;
    const action = parseToolAction(assistant?.tool_calls?.[0]);
    const message =
      assistant?.content?.trim() || actionMessage(action, language);

    return NextResponse.json({
      message,
      action,
      mode: "groq",
    } satisfies OrbitResponse);
  } catch {
    return NextResponse.json(demoResponse(latestPrompt, language));
  }
}
