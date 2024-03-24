import "prismjs/themes/prism-tomorrow.css";

import { useEffect } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-typescript";

export default function useCodeHighlighter() {
  useEffect(() => {
    Prism.highlightAll();
  }, []);
}
