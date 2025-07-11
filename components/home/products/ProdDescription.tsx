interface ProdDescriptionProps {
  desc?: string;
}

const ProdDescription = ({ desc }: ProdDescriptionProps) => {
  const sanitizedDesc = desc?.replace(/<script.*?>.*?<\/script>/g, '');

  return (
    <section className='grid gap-y-4 ql-snow'>
      <h3 className='text-lg font-bold uppercase'>About this product</h3>
      <div className='ql-editor' dangerouslySetInnerHTML={{ __html: sanitizedDesc || '' }} />
    </section>
  );
};

export default ProdDescription;
