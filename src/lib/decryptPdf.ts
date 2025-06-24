import createModule from "@neslinesli93/qpdf-wasm";

export async function decryptPdf(file: File): Promise<Blob> {
  const qpdf = await createModule({
    locateFile: () => "wasm/qpdf.wasm", // Use relative path for static hosting compatibility
  });
  const inputPath = "/input.pdf";
  const outputPath = "/output.pdf";
  const buffer = new Uint8Array(await file.arrayBuffer());
  // @ts-expect-error qpdf.FS.writeFile exists at runtime but is missing in types
  qpdf.FS.writeFile(inputPath, buffer);
  qpdf.callMain([inputPath, "--decrypt", outputPath]);
  const out = qpdf.FS.readFile(outputPath);
  return new Blob([out], { type: "application/pdf" });
}
