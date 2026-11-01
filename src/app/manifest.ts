import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SS23's workshop",
    short_name: "SS23",
    description: "Aplikasi yang sangat keren untuk kelas SS23",
    start_url: "/",
    icons: [
      {
        src: "assets/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "assets/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    background_color: "#26254a",
    display: "standalone",
  };
}
