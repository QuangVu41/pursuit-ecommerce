const FooterRating = () => {
  return (
    <div className='text-muted flex flex-col gap-y-3 items-center'>
      <h4 className='font-bold text-[20px]'>Excellent</h4>
      <div className='flex gap-1 mt-1'>
        {Array.from({ length: 5 }, (_, idx) => (
          <span key={idx} className='flex items-center justify-center size-12 bg-[#00B67A] gap-1'>
            <svg width='31' height='29' viewBox='0 0 31 29' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M15.5 22.1148L22.2351 20.4277L25.0491 29L15.5 22.1148ZM31 11.0346H19.1443L15.5 0L11.8557 11.0346H0L9.59524 17.8742L5.95089 28.9088L15.5461 22.0692L21.4509 17.8742L31 11.0346Z'
                fill='white'
              />
            </svg>
          </span>
        ))}
      </div>
      <p className='text-lg'>
        Based on <span className='underline decoration-background underline-offset-2'>13,586 reviews</span>
      </p>
      <span className='text-lg font-bold flex items-center gap-1'>
        <svg width='31' height='29' viewBox='0 0 31 29' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <path
            d='M15.5 22.1148L22.2351 20.4277L25.0491 29L15.5 22.1148ZM31 11.0346H19.1443L15.5 0L11.8557 11.0346H0L9.59524 17.8742L5.95089 28.9088L15.5461 22.0692L21.4509 17.8742L31 11.0346Z'
            fill='#00B67A'
          />
        </svg>
        <span className='translate-y-1'>Trustpilot</span>
      </span>
    </div>
  );
};

export default FooterRating;
