import { MAX_BANNER_IMAGE_UPLOAD, MAX_IMAGE_SIZE } from '@/lib/constants';
import { BannerFormSchemaType } from '@/schemas/banners';
import { UseFieldArrayReturn } from 'react-hook-form';
import { toast } from 'sonner';

const useBannerPreviewImage = (fieldImagesArrUtils: UseFieldArrayReturn<BannerFormSchemaType, 'images', 'id'>) => {
  const { fields, append, remove } = fieldImagesArrUtils;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let files = e.target.files;
    let isValidFile = true;
    let isValidSize = true;
    if (files) {
      if (files.length > MAX_BANNER_IMAGE_UPLOAD || fields.length + files.length > MAX_BANNER_IMAGE_UPLOAD)
        return toast.error(`You can only upload a maximum of ${MAX_BANNER_IMAGE_UPLOAD} images`);

      const newImageFiles = Array.from(files).map((file) => {
        const imageUrl = URL.createObjectURL(file);
        if (!file.type.startsWith('image/')) isValidFile = false;
        if (file.size > MAX_IMAGE_SIZE) isValidSize = false;
        return { imageUrl, imageFile: file };
      });
      if (!isValidFile) return toast.error('Please upload only image files');
      if (!isValidSize) return toast.error(`File size should be less than ${MAX_IMAGE_SIZE / 1024 / 1024}MB`);

      append(newImageFiles);
    }
  };

  const handleRemoveImage = (idx: number) => {
    URL.revokeObjectURL(fields[idx].imageUrl);
    remove(idx);
  };

  return { handleFileChange, handleRemoveImage };
};

export { useBannerPreviewImage };
