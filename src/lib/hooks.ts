import { usePathname } from "@/i18n/navigation";

export function useOnHomePage() {
  return usePathname() === "/";
}
