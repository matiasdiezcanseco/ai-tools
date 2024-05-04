import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";

export function BreadcrumbNavigation({
  list,
}: {
  list: { text: string; href: string }[];
}) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {list.map(({ text, href }, index) => (
          <Fragment key={href}>
            <BreadcrumbItem>
              <BreadcrumbLink href={href}>{text}</BreadcrumbLink>
            </BreadcrumbItem>
            {index !== list.length - 1 && <BreadcrumbSeparator />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
