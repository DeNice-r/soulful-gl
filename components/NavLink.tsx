import React from "react";
import Button from "@mui/material/Button";
import Link from "next/link";

const MyLink = ({ href, children, ...props }: { href: string, children: any, props?: any }) => (
  <Link href={href} passHref {...props}>
    <Button component="a">
      {children}
    </Button>
  </Link>
);

export default MyLink;
