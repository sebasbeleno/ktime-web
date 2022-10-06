import Link from "next/link";
import { useRouter } from "next/router";

export default function ActiveLink({
  children,
  href,
  defaultClass,
  activeClass,
}) {
  const router = useRouter();

  console.log(router.pathname);
  console.log(href);
  let className = defaultClass;
  if (router.pathname === href) {
    className = activeClass;
  }

  const handleClick = (e) => {
    e.preventDefault();
    router.push(href);
  };

  return (
    <Link href={href}>
      <div className={className}>{children}</div>
    </Link>
  );
}
