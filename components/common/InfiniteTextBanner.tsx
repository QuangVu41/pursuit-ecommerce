interface InfiniteTextBannerProps {
  text: string;
}

const InfiniteTextBanner = ({ text }: InfiniteTextBannerProps) => {
  return (
    <div className='flex bg-foreground overflow-hidden mt-[50px] md:mt-[100px] -ml-4 w-[calc(100% + 20px)] -rotate-3'>
      {Array.from({ length: 8 }, (_, idx) => (
        <div key={idx} className='flex items-center px-2 md:px-3 py-4 md:py-5 w-full animate-loop-scroll'>
          <p className='text-muted text-sm md:text-lg whitespace-nowrap'>{text}</p>
        </div>
      ))}
    </div>
  );
};

export default InfiniteTextBanner;
