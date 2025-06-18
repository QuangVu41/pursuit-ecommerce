import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import React from 'react';

interface TooltipWrapperProps {
  children: React.ReactNode;
  content?: string;
}

const TooltipWrapper = ({ children, content }: TooltipWrapperProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div>{children}</div>
      </TooltipTrigger>
      {content && <TooltipContent align='end'>{content}</TooltipContent>}
    </Tooltip>
  );
};

export default TooltipWrapper;
