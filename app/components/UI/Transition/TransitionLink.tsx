"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ComponentProps, type PointerEvent } from "react";

type NextLinkProps = ComponentProps<typeof Link>;

interface TransitionLinkProps extends NextLinkProps {
  transition?: boolean;
}

export default function TransitionLink({
  transition = true,
  prefetch = true, // Đổi sang false theo best practice cho trang web nhiều nội dung để tránh nghẽn mạng/server
  href,
  onPointerDown,
  ...rest
}: TransitionLinkProps) {
  // Trả về thẻ Link nguyên thủy nhất của Next.js với cờ prefetch=true
  const router = useRouter();

  const handlePointerDown = (event: PointerEvent<HTMLAnchorElement>) => {
    onPointerDown?.(event);

    if (
      event.defaultPrevented ||
      prefetch === false ||
      typeof href !== "string" ||
      !href.startsWith("/")
    ) {
      return;
    }

    router.prefetch(href);
  };

  return (
    <Link
      href={href}
      prefetch={prefetch}
      onPointerDown={handlePointerDown}
      {...rest}
    />
  );
}
