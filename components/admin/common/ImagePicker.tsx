
import React, { useState } from 'react';
import { Image as ImageIcon, UploadCloud, X, Plus } from 'lucide-react';
import { AdminMedia } from '../AdminMedia';

interface ImagePickerProps {
  label?: string;
  images: string[];
  onChange: (images: string[]) => void;
  multiple?: boolean;
}

export const ImagePicker: React.FC<ImagePickerProps> = ({ label, images = [], onChange, multiple = true }) => {
  const [isOpen, setIsOpen] = useState(false);

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
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors text-gray-400 hover:text-indigo-600 bg-white"
          >
            <UploadCloud size={24} className="mb-1" />
            <span className="text-xs font-bold">Add</span>
          </button>
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
