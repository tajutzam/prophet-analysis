import { useState, useRef } from 'react';
import { Camera, X, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AvatarUploadProps {
    value: string | File | null;
    onChange: (file: File | null) => void;
    currentAvatarUrl?: string;
    className?: string;
}

export default function AvatarUpload({ value, onChange, currentAvatarUrl, className }: AvatarUploadProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onChange(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onChange(null);
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const displayImage = preview || (typeof value === 'string' ? value : null) || currentAvatarUrl;

    return (
        <div className={cn("relative flex flex-col items-center group", className)}>
            <div 
                className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-xl bg-slate-100 transition-all group-hover:shadow-2xl cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
            >
                {displayImage ? (
                    <img 
                        src={displayImage} 
                        alt="Avatar preview" 
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                        <Upload className="w-8 h-8 mb-2" />
                        <span className="text-xs font-bold uppercase tracking-wider">Upload</span>
                    </div>
                )}
                
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-8 h-8 text-white" />
                </div>
            </div>

            {preview && (
                <button
                    onClick={handleRemove}
                    className="absolute -top-2 -right-2 bg-rose-500 text-white p-1.5 rounded-full shadow-lg hover:bg-rose-600 transition-colors z-10"
                    title="Remove selected image"
                >
                    <X className="w-4 h-4" />
                </button>
            )}

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
            />
            
            <p className="mt-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Format: JPG, PNG, GIF (Max. 2MB)
            </p>
        </div>
    );
}
