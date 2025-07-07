'use client';

import Error from '@/components/common/Error';

const ErrorPage = ({ reset, error }: { error: Error & { digest?: string }; reset: () => void }) => {
  return <Error reset={reset} error={error} />;
};

export default ErrorPage;
