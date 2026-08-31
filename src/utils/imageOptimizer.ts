/**
 * Optimizes and compresses images to ensure they are small enough
 * for fast loading and strictly within Firestore's 1MB document size limit.
 */
export interface ImageOptimizationResult {
  dataUrl: string;
  originalSize: number;
  compressedSize: number;
  width: number;
  height: number;
}

export async function optimizeImageFile(
  file: File,
  maxWidth = 1000,
  maxHeight = 1000,
  quality = 0.75
): Promise<ImageOptimizationResult> {
  return new Promise((resolve, reject) => {
    const originalSize = file.size;
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('파일을 읽는 중 오류가 발생했습니다.'));

    reader.onload = (e) => {
      const src = e.target?.result as string;
      const img = new Image();

      img.onerror = () => reject(new Error('이미지 데이터를 파싱할 수 없습니다.'));

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio-preserving dimensions
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Canvas context를 생성할 수 없습니다.'));
        }

        // Clean background for transparency or JPEG conversion
        ctx.fillStyle = '#060e1f';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Try webp first (smaller size), fallback to jpeg
        let format = 'image/webp';
        let compressedDataUrl = canvas.toDataURL(format, quality);

        // Fallback to jpeg if webp unsupported
        if (!compressedDataUrl.startsWith('data:image/webp')) {
          format = 'image/jpeg';
          compressedDataUrl = canvas.toDataURL(format, quality);
        }

        // Strictly enforce that the resulting base64 string is < 250KB (~340,000 chars)
        // so it NEVER exceeds Firestore's 1MB per-document limit even when combined with other fields!
        const MAX_BASE64_LENGTH = 320 * 1024; // ~240KB
        let currentQuality = quality;
        let currentMaxDim = Math.max(width, height);

        let attempts = 0;
        while (compressedDataUrl.length > MAX_BASE64_LENGTH && attempts < 8) {
          attempts++;
          currentQuality = Math.max(0.3, currentQuality - 0.12);
          currentMaxDim = Math.round(currentMaxDim * 0.75);

          const scaleRatio = currentMaxDim / Math.max(img.width, img.height);
          const sw = Math.max(100, Math.round(img.width * scaleRatio));
          const sh = Math.max(100, Math.round(img.height * scaleRatio));

          const smallCanvas = document.createElement('canvas');
          smallCanvas.width = sw;
          smallCanvas.height = sh;
          const sCtx = smallCanvas.getContext('2d');
          if (sCtx) {
            sCtx.fillStyle = '#060e1f';
            sCtx.fillRect(0, 0, sw, sh);
            sCtx.drawImage(img, 0, 0, sw, sh);
            compressedDataUrl = smallCanvas.toDataURL(format, currentQuality);
            width = sw;
            height = sh;
          }
        }

        // Approximate size in bytes of base64
        const compressedSize = Math.round((compressedDataUrl.length * 3) / 4);

        resolve({
          dataUrl: compressedDataUrl,
          originalSize,
          compressedSize,
          width,
          height,
        });
      };

      img.src = src;
    };

    reader.readAsDataURL(file);
  });
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
