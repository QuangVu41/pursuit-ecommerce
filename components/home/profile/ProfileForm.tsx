'use client';

import { MAX_IMAGE_SIZE } from '@/lib/constants';
import { UserEditSchema, UserEditSchemaType } from '@/schemas/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { User } from '@prisma/client';
import { useRef, useTransition } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import FormWrapper from '@/components/common/FormWrapper';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { CalendarIcon, FilePenLine, FilePlus2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import InputHome from '@/components/common/InputHome';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { updateUserInfoAct } from '@/actions/user';

interface ProfileFormProps {
  userData: User;
}

const ProfileForm = ({ userData }: ProfileFormProps) => {
  const [isPending, startTransition] = useTransition();
  const form = useForm<UserEditSchemaType>({
    resolver: zodResolver(UserEditSchema),
    defaultValues: {
      id: userData.id,
      name: userData.name as string,
      email: userData.email,
      phoneNumber: userData.phoneNumber ?? undefined,
      birthOfDate: userData.birthOfDate ?? undefined,
      imageUrl: userData.image || undefined,
    },
  });
  const inputFileRef = useRef<HTMLInputElement>(null);
  const imageUrl = useWatch({ control: form.control, name: 'imageUrl' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    const file = files?.[0];
    if (file) {
      if (file.size > MAX_IMAGE_SIZE) return toast.error(`Image size cannot exceed ${MAX_IMAGE_SIZE / 1024 / 1024}MB!`);

      const imageUrl = URL.createObjectURL(file);
      form.setValue('imageFile', file);
      form.setValue('imageUrl', imageUrl);
    }
    if (inputFileRef.current) inputFileRef.current.value = '';
  };

  const handleSubmit = (data: UserEditSchemaType) => {
    startTransition(() => {
      updateUserInfoAct(data).then((res) => {
        if (res?.error) toast.error(res.error);
        if (res?.success) toast.success(res.success);
      });
    });
  };

  return (
    <FormWrapper form={form} handleSubmit={handleSubmit} isModal={false} className='!px-0'>
      <FormField
        control={form.control}
        name='imageUrl'
        render={() => (
          <FormItem>
            <FormLabel htmlFor='cate-file'>Your avatar*</FormLabel>
            <FormControl>
              <div className='flex aria-invalid:*:border-destructive aria-invalid:*:border'>
                <figure
                  className='group size-40 relative flex flex-col items-center justify-center bg-background shadow-md cursor-pointer p-2 overflow-hidden'
                  onClick={() => !isPending && inputFileRef.current?.click()}
                >
                  {imageUrl && (
                    <>
                      <Image
                        src={imageUrl}
                        alt={`${form.getValues('name')}`}
                        height={160}
                        width={160}
                        className='object-cover absolute inset-0 w-full h-full'
                      />
                      <FilePenLine className='w-5 h-5 text-foreground/70 group-hover:text-foreground top-2 right-2 absolute' />
                    </>
                  )}
                  {!imageUrl && (
                    <>
                      <FilePlus2 className='w-5 h-5 text-home-primary/70 group-hover:text-home-primary top-2 right-2 absolute' />
                      <p className='font-manrope text-xl font-bold text-foreground/70 group-hover:text-foreground'>
                        160 X 160
                      </p>
                    </>
                  )}
                  <input
                    ref={inputFileRef}
                    id='cate-file'
                    type='file'
                    onChange={handleInputChange}
                    hidden
                    name='imageFile'
                  />
                </figure>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='id'
        render={({ field }) => (
          <FormItem className='hidden'>
            <FormControl>
              <Input {...field} type='text' hidden />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className='grid sm:grid-cols-2 gap-4'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full name*</FormLabel>
              <FormControl>
                <InputHome
                  {...field}
                  placeholder='John Doe'
                  type='text'
                  disabled={isPending}
                  className='text-foreground bg-background placeholder:text-foreground/70'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email*</FormLabel>
              <FormControl>
                <InputHome
                  {...field}
                  placeholder='examle@gmail.com'
                  type='text'
                  disabled
                  className='text-foreground bg-background placeholder:text-muted-foreground/70'
                  maxLength={10}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='phoneNumber'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone number</FormLabel>
              <FormControl>
                <InputHome
                  {...field}
                  placeholder='0123456789'
                  type='number'
                  disabled={isPending}
                  className='text-foreground bg-background placeholder:text-foreground/70'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='birthOfDate'
          render={({ field }) => (
            <FormItem className='flex flex-col'>
              <FormLabel>Date of birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full rounded-none pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                      <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar
                    mode='single'
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                    captionLayout='dropdown'
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className='flex'>
        <Button
          variant='homeDefault'
          className='w-full md:w-auto ml-auto rounded-none lg:h-[52px] h-12 text-lg'
          disabled={isPending}
        >
          Save Changes
        </Button>
      </div>
    </FormWrapper>
  );
};

export default ProfileForm;
