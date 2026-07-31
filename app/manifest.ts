import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MaiTamDev Career Universe",
    short_name: "MaiTamDev",
    description:
      "Mai Tran Thien Tam's interactive full-stack developer portfolio.",
    start_url: "/",
    display: "standalone",
    background_color: "#030014",
    theme_color: "#030014",
    icons: [
      { src: "/icon1.png", sizes: "192x192", type: "image/png" },
      { src: "/icon2.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
