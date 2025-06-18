import { useHasNoImage } from '@/components/management/products/ProdForm';
import { MAX_IMAGE_SIZE, MAX_IMAGE_UPLOAD } from '@/lib/constants';
import { ProdFormSchemaType } from '@/schemas/products';
import { UseFieldArrayReturn } from 'react-hook-form';
import { toast } from 'sonner';

const usePreviewImage = (fieldImagesArrUtils: UseFieldArrayReturn<ProdFormSchemaType, 'images', 'id'>) => {
  const setHasNoImage = useHasNoImage((state) => state.setHasNoImage);
  const { fields, update, append, remove } = fieldImagesArrUtils;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let files = e.target.files;
    let isValidFile = true;
    let isValidSize = true;
    if (files) {
      if (files.length > MAX_IMAGE_UPLOAD || fields.length + files.length > MAX_IMAGE_UPLOAD)
        return toast.error(`You can only upload a maximum of ${MAX_IMAGE_UPLOAD} images`);

      const newImageFiles = Array.from(files).map((file) => {
        const imageUrl = URL.createObjectURL(file);
        if (!file.type.startsWith('image/')) isValidFile = false;
        if (file.size > MAX_IMAGE_SIZE) isValidSize = false;
        return { imageUrl, isPrimary: false, imageFile: file };
      });
      if (!isValidFile) return toast.error('Please upload only image files');
      if (!isValidSize) return toast.error(`File size should be less than ${MAX_IMAGE_SIZE / 1024 / 1024}MB`);
      if (!fields.some((obj) => obj.isPrimary)) newImageFiles[0].isPrimary = true;

      setHasNoImage(false);
      append(newImageFiles);
    }
  };

  const handleRemoveImage = (idx: number) => {
    URL.revokeObjectURL(fields[idx].imageUrl);
    remove(idx);
  };

  const handleCheckboxChange = (isChecked: boolean, idx: number) => {
    if (isChecked) {
      const oldCheckedFieldIdx = fields.findIndex((field) => field.isPrimary);
      update(oldCheckedFieldIdx, { ...fields[oldCheckedFieldIdx], isPrimary: false });
      update(idx, { ...fields[idx], isPrimary: true });
    } else update(idx, { ...fields[idx], isPrimary: false });
  };

  return { handleFileChange, handleRemoveImage, handleCheckboxChange };
};

export { usePreviewImage };
