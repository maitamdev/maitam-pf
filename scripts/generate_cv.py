from pathlib import Path

from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "Mai-Tran-Thien-Tam-CV.pdf"
PUBLIC_OUTPUT = ROOT / "public" / "Mai-Tran-Thien-Tam-CV.pdf"
PORTRAIT = ROOT / "public" / "avatar.png"

PAGE_W, PAGE_H = A4
SIDEBAR_W = 174
NAVY = HexColor("#07111F")
INK = HexColor("#101828")
MUTED = HexColor("#596579")
CYAN = HexColor("#18A8BF")
PALE = HexColor("#E9F5F7")
LINE = HexColor("#D8E1E8")


def wrap_text(c, text, font, size, max_width):
    words = text.split()
    lines = []
    current = ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if c.stringWidth(candidate, font, size) <= max_width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def draw_wrapped(c, text, x, y, max_width, font="Helvetica", size=8.8,
                 leading=12, color=INK):
    c.setFont(font, size)
    c.setFillColor(color)
    for line in wrap_text(c, text, font, size, max_width):
        c.drawString(x, y, line)
        y -= leading
    return y


def section_title(c, title, x, y, width):
    c.setFillColor(CYAN)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(x, y, title.upper())
    c.setStrokeColor(LINE)
    c.setLineWidth(0.7)
    c.line(x, y - 6, x + width, y - 6)
    return y - 20


def sidebar_title(c, title, y):
    c.setFillColor(CYAN)
    c.setFont("Helvetica-Bold", 9.5)
    c.drawString(22, y, title.upper())
    c.setStrokeColor(HexColor("#294054"))
    c.line(22, y - 6, SIDEBAR_W - 22, y - 6)
    return y - 20


def draw_cv():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUTPUT), pagesize=A4)
    c.setTitle("Mai Tran Thien Tam - FullStack Developer CV")
    c.setAuthor("Mai Tran Thien Tam")

    c.setFillColor(white)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    c.setFillColor(NAVY)
    c.rect(0, 0, SIDEBAR_W, PAGE_H, fill=1, stroke=0)

    portrait = ImageReader(str(PORTRAIT))
    c.drawImage(portrait, 37, PAGE_H - 154, 100, 100, preserveAspectRatio=True,
                anchor="c", mask="auto")

    sy = PAGE_H - 182
    sy = sidebar_title(c, "Contact", sy)
    contact = [
        ("EMAIL", "maitamit062005@gmail.com"),
        ("PHONE", "+84 877 724 374"),
        ("LOCATION", "HCM, Vietnam"),
        ("GITHUB", "github.com/maitamdev"),
        ("LINKEDIN", "linkedin.com/in/maitam-dev-403220399"),
    ]
    for label, value in contact:
        c.setFillColor(HexColor("#7F93A5"))
        c.setFont("Helvetica-Bold", 6.5)
        c.drawString(22, sy, label)
        sy -= 11
        sy = draw_wrapped(c, value, 22, sy, SIDEBAR_W - 42, size=7.5,
                          leading=10, color=white) - 9

    sy = sidebar_title(c, "Core skills", sy)
    for item in [
        "React / TypeScript",
        "HTML / CSS / Responsive UI",
        "Node.js / Express",
        "REST APIs / CRUD",
        "Odoo",
        "Supabase / Firebase",
        "Flutter / Dart",
        "Git / Docker / Vercel",
    ]:
        c.setFillColor(CYAN)
        c.circle(24, sy + 2, 1.4, fill=1, stroke=0)
        c.setFillColor(white)
        c.setFont("Helvetica", 7.8)
        c.drawString(31, sy, item)
        sy -= 15

    sy = sidebar_title(c, "Strengths", sy - 3)
    sy = draw_wrapped(
        c,
        "Teamwork, product thinking, AI-assisted drafting, debugging, "
        "refactoring and documentation with manual review and testing.",
        22,
        sy,
        SIDEBAR_W - 42,
        size=7.6,
        leading=10.5,
        color=white,
    )

    x = SIDEBAR_W + 30
    width = PAGE_W - x - 31
    y = PAGE_H - 60
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 25)
    c.drawString(x, y, "MAI TRAN THIEN TAM")
    y -= 25
    c.setFillColor(CYAN)
    c.setFont("Helvetica-Bold", 12)
    c.drawString(x, y, "FULLSTACK DEVELOPER  |  MAITAMDEV")
    y -= 27

    y = section_title(c, "Profile", x, y, width)
    y = draw_wrapped(
        c,
        "Final-year Software Engineering student at Hung Vuong University "
        "with hands-on full-stack experience. I build practical web, mobile "
        "and AI-powered products and care about reliable, maintainable delivery.",
        x,
        y,
        width,
        size=8.7,
        leading=12,
        color=MUTED,
    ) - 11

    y = section_title(c, "Experience", x, y, width)
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(x, y, "FullStack Developer")
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 8.2)
    c.drawRightString(x + width, y, "Jan 2025 - Feb 2026")
    y -= 15
    c.setFillColor(CYAN)
    c.setFont("Helvetica-Bold", 8.5)
    c.drawString(x, y, "Valley Campus  |  Odoo")
    y -= 15
    y = draw_wrapped(
        c,
        "Built, tested and fixed issues for an Odoo-based e-commerce website "
        "serving health-protection and cosmetics products.",
        x,
        y,
        width,
        size=8.7,
        leading=12,
        color=MUTED,
    ) - 12

    y = section_title(c, "Education", x, y, width)
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 10.5)
    c.drawString(x, y, "Hung Vuong University")
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 8.2)
    c.drawRightString(x + width, y, "2023 - 2027")
    y -= 15
    c.setFillColor(CYAN)
    c.setFont("Helvetica-Bold", 8.5)
    c.drawString(x, y, "Software Engineering  |  Final-year student")
    y -= 24

    y = section_title(c, "Selected Projects", x, y, width)
    projects = [
        (
            "SCS GO",
            "Smart EV charging platform for station discovery, booking, "
            "location analysis, mobile access and AI recommendations.",
            "React, TypeScript, Flutter, Supabase",
        ),
        (
            "DHV Guiding Light",
            "One-to-one mentoring platform connecting university students "
            "with advisors through bookings and practical guidance tools.",
            "React, TypeScript, Firebase, Node.js",
        ),
        (
            "SafeReturn / FindBack",
            "AI-assisted lost-and-found platform with realtime data, evidence "
            "review and Solana Devnet escrow.",
            "Next.js, TypeScript, Supabase, Solana, Groq",
        ),
        (
            "Sora POS V2",
            "Retail POS for inventory, role-based access, analytics and "
            "AI-assisted restocking decisions.",
            "React, Node.js, Express, PostgreSQL, Groq",
        ),
    ]
    for title, description, stack in projects:
        c.setFillColor(INK)
        c.setFont("Helvetica-Bold", 9.3)
        c.drawString(x, y, title)
        c.setFillColor(CYAN)
        c.setFont("Helvetica", 7.4)
        c.drawRightString(x + width, y, stack)
        y -= 13
        y = draw_wrapped(c, description, x, y, width, size=8.1,
                         leading=10.5, color=MUTED) - 8

    y = section_title(c, "Activities", x, y - 1, width)
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(x, y, "Innovation & Startup 2025")
    y -= 13
    draw_wrapped(
        c,
        "Developer for DHV Guiding Light and SCS GO, turning real community "
        "and mobility ideas into working software products.",
        x,
        y,
        width,
        size=8.2,
        leading=10.5,
        color=MUTED,
    )

    c.setFillColor(PALE)
    c.rect(SIDEBAR_W, 0, PAGE_W - SIDEBAR_W, 22, fill=1, stroke=0)
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 6.8)
    c.drawCentredString(
        SIDEBAR_W + (PAGE_W - SIDEBAR_W) / 2,
        8,
        "Portfolio: github.com/maitamdev/maitam-pf",
    )
    c.save()
    PUBLIC_OUTPUT.write_bytes(OUTPUT.read_bytes())


if __name__ == "__main__":
    draw_cv()
