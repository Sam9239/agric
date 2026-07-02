import { useCallback, useEffect, useState } from 'react';
import Cropper, { type Area } from 'react-easy-crop';
import { X, ZoomIn, ZoomOut, RotateCw, Check } from 'lucide-react';

type ImageEditorProps = {
  /** Object URL or remote URL of the image being edited. */
  src: string | null;
  /** Fixed crop aspect ratio, e.g. 1 for products, 16/10 for tips. */
  aspect: number;
  aspectLabel: string;
  busy?: boolean;
  onCancel: () => void;
  onConfirm: (blob: Blob) => void;
};

/** Longest output edge — plenty for the card/detail layouts. */
const MAX_OUTPUT_EDGE = 1600;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not load image'));
    img.src = src;
  });
}

async function cropToBlob(src: string, area: Area, rotation: number): Promise<Blob> {
  const image = await loadImage(src);

  // Draw the rotated source onto an intermediate canvas large enough to
  // contain it, then cut the crop area out of that.
  const radians = (rotation * Math.PI) / 180;
  const sin = Math.abs(Math.sin(radians));
  const cos = Math.abs(Math.cos(radians));
  const boundsWidth = image.width * cos + image.height * sin;
  const boundsHeight = image.width * sin + image.height * cos;

  const stage = document.createElement('canvas');
  stage.width = boundsWidth;
  stage.height = boundsHeight;
  const stageCtx = stage.getContext('2d');
  if (!stageCtx) throw new Error('Canvas not supported');
  stageCtx.translate(boundsWidth / 2, boundsHeight / 2);
  stageCtx.rotate(radians);
  stageCtx.drawImage(image, -image.width / 2, -image.height / 2);

  const scale = Math.min(1, MAX_OUTPUT_EDGE / Math.max(area.width, area.height));
  const out = document.createElement('canvas');
  out.width = Math.round(area.width * scale);
  out.height = Math.round(area.height * scale);
  const outCtx = out.getContext('2d');
  if (!outCtx) throw new Error('Canvas not supported');
  outCtx.drawImage(
    stage,
    area.x,
    area.y,
    area.width,
    area.height,
    0,
    0,
    out.width,
    out.height,
  );

  return new Promise((resolve, reject) => {
    out.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Could not export image'))),
      'image/webp',
      0.88,
    );
  });
}

export default function ImageEditor({
  src,
  aspect,
  aspectLabel,
  busy = false,
  onCancel,
  onConfirm,
}: ImageEditorProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [exporting, setExporting] = useState(false);

  // Reset controls whenever a new image comes in.
  useEffect(() => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setCroppedArea(null);
  }, [src]);

  const onCropComplete = useCallback((_: Area, areaPixels: Area) => {
    setCroppedArea(areaPixels);
  }, []);

  const handleConfirm = async () => {
    if (!src || !croppedArea) return;
    setExporting(true);
    try {
      const blob = await cropToBlob(src, croppedArea, rotation);
      onConfirm(blob);
    } catch {
      onCancel();
    } finally {
      setExporting(false);
    }
  };

  if (!src) return null;

  const working = exporting || busy;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}
      role="dialog"
      aria-modal="true"
      aria-label="Crop and resize image"
    >
      <div className="w-full max-w-[640px]" style={{ backgroundColor: '#f5f0e8' }}>
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid #d4c9b8' }}
        >
          <div>
            <h3 className="font-display text-xl" style={{ color: '#1a3a2f' }}>
              Crop &amp; resize
            </h3>
            <p className="text-xs mt-0.5" style={{ color: '#6b5f4f' }}>
              {aspectLabel} — drag to reposition, scroll or use the slider to zoom
            </p>
          </div>
          <button onClick={onCancel} aria-label="Cancel image editing" style={{ color: '#6b5f4f' }}>
            <X size={20} />
          </button>
        </div>

        <div className="relative h-[340px] sm:h-[400px]" style={{ backgroundColor: '#1a1a1a' }}>
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            showGrid
          />
        </div>

        <div className="px-5 py-4 space-y-4">
          <div className="flex items-center gap-3">
            <ZoomOut size={16} style={{ color: '#6b5f4f' }} />
            <input
              type="range"
              min={1}
              max={4}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1"
              aria-label="Zoom"
            />
            <ZoomIn size={16} style={{ color: '#6b5f4f' }} />
            <button
              type="button"
              onClick={() => setRotation((r) => (r + 90) % 360)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold"
              style={{ border: '1px solid #d4c9b8', color: '#1a3a2f' }}
            >
              <RotateCw size={13} />
              Rotate
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={working}
              className="flex-1 py-2.5 text-sm font-semibold"
              style={{ border: '1px solid #d4c9b8', color: '#1a3a2f' }}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={working || !croppedArea}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
              style={{ backgroundColor: '#b8511f' }}
            >
              <Check size={15} />
              {working ? 'Applying…' : 'Apply crop'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
