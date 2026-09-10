import { fetchPublicImage } from "./fetch-public-image";
import { decodeImageData } from "./image-paths";

interface PackedImage {
  data?: string;
  mimeType?: string;
  mediaType?: string;
}

export async function resolveUploadBuffer(input: {
  data?: string;
  imageUrl?: string;
  file?: PackedImage;
  image?: PackedImage;
  buffer?: Buffer;
}): Promise<Buffer> {
  if (input.buffer && input.buffer.length > 0) return input.buffer;
  if (input.imageUrl) return fetchPublicImage(input.imageUrl);
  const packed = input.file?.data ?? input.image?.data ?? input.data;
  if (!packed) {
    throw new Error(
      "Pass imageUrl for a public https photo, or call create_blog_image_upload and PUT the local file bytes."
    );
  }
  return decodeImageData(packed);
}
