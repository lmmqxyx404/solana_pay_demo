import Link from "next/link";
import { PropsWithChildren } from "react";

interface Props {
  href: string;
}
/** 返回按钮 */
export default function BackLink({ children, href }: PropsWithChildren<Props>) {
  return (<Link href={href}><a>⬅️&nbsp;&nbsp;<span className='underline hover:no-underline'>{children}</span></a></Link>)
}