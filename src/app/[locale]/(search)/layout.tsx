import SearchSection from "./components/SearchSection";
import type { Layout } from "@/types/next";

const ContainsSearchLayout: Layout = ({ children }) => {
  return (
    <>
      <SearchSection />
      {children}
    </>
  );
};

export default ContainsSearchLayout;
