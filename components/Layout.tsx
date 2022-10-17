import { Container } from "@nextui-org/react";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function Layout({ children, className }: LayoutProps) {
  return (
    <Container responsive lg className={`mt-8 ${className || ""}`}>
      {children}
    </Container>
  );
}
