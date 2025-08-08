// pdf-parser.d.ts
declare module "pdf-parser" {
  function parseBuffer(
    buffer: Buffer,
    callback: (err: any, result: any) => void
  ): void;
}
