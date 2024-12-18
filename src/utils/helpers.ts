export const imageUploadSetting = ({
    name,
    file,
    width,
    height,
    fit,
    format = "webp",
  }: {
    name: string;
    file: File;
    width?: string;
    height?: string;
    fit?: "cover" | "contain" | "fill" | "inside" | "outside";
    format?: "webp" | "jpg" | "png";
  }) => {
    const formData = new FormData();
    formData.set("name", name);
    formData.set("file", file);
    formData.set("format", format);
    if (width) {
      formData.set("width", width);
    }
    if (height) {
      formData.set("height", height);
    }
    if (fit) {
      formData.set("fit", fit);
    }
    return formData;
  };
  
  export const isImage = (file: File) => file["type"].includes("image");
  
  export function convertRGBAToHexA({ r, g, b, a }: any) {
    const red = r.toString(16).padStart(2, "0");
    const green = g.toString(16).padStart(2, "0");
    const blue = b.toString(16).padStart(2, "0");
    const alpha = Math.round(a * 255)
      .toString(16)
      .padStart(2, "0");
    return `#${red}${green}${blue}${alpha}`;
  }
  