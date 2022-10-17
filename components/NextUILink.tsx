import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { Link, LinkProps } from "@nextui-org/react";
import { forwardRef } from "react";

type NextUILinkAndNextProps = LinkProps & NextLinkProps;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const NextUILink = forwardRef(function NextUILink({ href, children, ...props }: NextUILinkAndNextProps, ref: any)  {
  return (
    <NextLink href={href} passHref>
      <Link ref={ref} {...props}>
        {children}
      </Link>
    </NextLink>
  );
});

export default NextUILink;
