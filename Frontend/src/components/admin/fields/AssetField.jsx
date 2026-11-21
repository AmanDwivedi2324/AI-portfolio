import { useRef, useState } from "react";
import { FileText, ImageUp, Loader2, Trash2, Upload } from "lucide-react";
import toast from "react-hot-toast";
import { inputClass } from "./styles";
import { uploadFile } from "../../../services/admin/admin.service";
import { resolveAssetUrl } from "../../../utils/assetUrl";

const ACCEPT = {
  image: "image/jpeg,image/png,image/webp,image/avif",
  document: "application/pdf",
};

/**
 * Upload an image or PDF (or paste a URL). Stores the resulting URL.
 * `fallbackPreview` is shown when the value is empty (the site's default).
 */
export default function AssetField({ id, value, onChange, kind = "image", fallbackPreview, invalid }) {
  const inputRef = useRef(null);
  const [progress, setProgress] = useState(null);
  const preview = resolveAssetUrl(value, fallbackPreview);

  const pick = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setProgress(0);
    try {
      const { url } = await uploadFile(file, kind, setProgress);
      onChange(url);
      toast.success("Uploaded — remember to save.");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setProgress(null);
    }
  };

  return (
    <div className="flex gap-3">
      {kind === "image" ? (
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-md border border-line bg-ink">
          {preview ? <img src={preview} alt="" className="h-full w-full object-cover" /> : <ImageUp size={20} className="text-dim" />}
        </div>
      ) : (
        <div className="flex h-20 w-16 shrink-0 items-center justify-center rounded-md border border-line bg-ink text-dim">
          <FileText size={22} />
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <input
          id={id}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={fallbackPreview ? "Empty = default image" : "https://… or upload"}
          className={inputClass}
          aria-invalid={invalid || undefined}
        />
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={progress !== null}
            className="flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1.5 text-xs text-mute hover:border-line-strong hover:text-fg disabled:opacity-60"
          >
            {progress !== null ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
            {progress !== null ? `Uploading ${progress}%` : kind === "image" ? "Upload image" : "Upload PDF"}
          </button>
          {value && (
            <>
              <a href={preview} target="_blank" rel="noreferrer" className="text-xs text-mute underline-offset-2 hover:text-fg hover:underline">
                Open
              </a>
              <button type="button" onClick={() => onChange("")} className="flex items-center gap-1 text-xs text-dim hover:text-blaze">
                <Trash2 size={12} /> Clear
              </button>
            </>
          )}
          <input ref={inputRef} type="file" accept={ACCEPT[kind]} onChange={pick} className="hidden" />
        </div>
      </div>
    </div>
  );
}
