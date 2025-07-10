interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container = ({ children, className }: ContainerProps) => {
  return <div className={`container ${className} mx-auto`}>{children}</div>;
};

export default Container;
