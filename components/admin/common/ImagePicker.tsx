import React, { useState, useRef } from 'react';
import { Image as ImageIcon, UploadCloud, X, Plus, Loader2 } from 'lucide-react';
import { AdminMedia } from '../AdminMedia';
import { mediaService } from '../../../services/mediaService';

interface ImagePickerProps {
  label?: string;
  images: string[];
  onChange: (images: string[]) => void;
  multiple?: boolean;
}

export const ImagePicker: React.FC<ImagePickerProps> = ({ label, images = [], onChange, multiple = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelect = (files: any[]) => {
    const urls = files.map(f => f.url);
    if (multiple) {
      onChange([...images, ...urls]);
    } else {
      onChange([urls[0]]);
    }
    setIsOpen(false);
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const handleDirectUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploading(true);
      try {
        const files = Array.from(e.target.files) as File[];
        const response = await mediaService.upload(files);
        // Response structure: { message, media: [...] }
        const newUrls = response.media.map((m: any) => m.url);
        
        if (multiple) {
          onChange([...images, ...newUrls]);
        } else {
          onChange([newUrls[0]]);
        }
      } catch (err) {
        alert('Failed to upload image directly.');
        console.error(err);
      } finally {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-3">
      {label && <label className="block text-sm font-bold text-gray-800">{label}</label>}
      
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
        {images.map((img, idx) => (
          <div key={idx} className="aspect-square relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
            <img src={img} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(idx)}
              className="absolute top-1 right-1 bg-white/90 p-1.5 rounded-full text-red-500 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shadow-sm hover:bg-white"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        
        {/* Add Button */}
        {(multiple || images.length === 0) && (
          <div className="flex flex-col gap-2">
             <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="aspect-square w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors text-gray-400 hover:text-indigo-600 bg-white"
              title="Select from Library"
            >
              <ImageIcon size={24} className="mb-1" />
              <span className="text-[10px] font-bold">Library</span>
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="aspect-square w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors text-gray-400 hover:text-indigo-600 bg-white"
              title="Upload New"
            >
              {uploading ? <Loader2 size={24} className="animate-spin mb-1"/> : <UploadCloud size={24} className="mb-1" />}
              <span className="text-[10px] font-bold">{uploading ? '...' : 'Upload'}</span>
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              multiple={multiple} 
              onChange={handleDirectUpload} 
            />
          </div>
        )}
      </div>

      {isOpen && (
        <AdminMedia 
          pickerMode 
          multiple={multiple} 
          onSelect={handleSelect} 
          onClose={() => setIsOpen(false)} 
        />
      )}
    </div>
  );
};