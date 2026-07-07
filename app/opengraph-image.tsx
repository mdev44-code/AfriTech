import { ImageResponse } from "next/og";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const png = fs.readFileSync(path.join(process.cwd(), "public/logo.png"));
  const logoDataUri = `data:image/png;base64,${png.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0A0A0C",
        }}
      >
        {
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={logoDataUri} width={700} height={210} alt="" />
        }
      </div>
    ),
    { ...size }
  );
}
