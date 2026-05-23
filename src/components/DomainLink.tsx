import { Link } from "react-router-dom";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";
import type { ReactNode, AnchorHTMLAttributes } from "react";

interface DomainLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  /** Route path WITHOUT lang prefix, e.g. "/" or "/products" or "/contact?source=Get Started" */
  to: string;
  children: ReactNode;
  className?: string;
}

/**
 * Localized link component — all navigation is now same-domain SPA routing.
 */
export const DomainLink = ({ to, children, className, ...rest }: DomainLinkProps) => {
  const { localizedPath } = useLocalizedPath();

  return (
    <Link to={localizedPath(to)} className={className} {...rest}>
      {children}
    </Link>
  );
};
