import React from "react";
import { MovingBorderContainer } from "./moving-border";

export function MovingBorderDemo() {
  return (
    <div className="space-y-8">
      {/* Button Example */}
      <MovingBorderContainer
        as="button"
        borderRadius="1.75rem"
        className="bg-white dark:bg-slate-900 text-black dark:text-white border border-neutral-200 dark:border-slate-800 px-8 py-3"
      >
        Borders are cool
      </MovingBorderContainer>

      {/* Banner/Div Example */}
      <MovingBorderContainer
        as="div"
        borderRadius="1.5rem"
        className="bg-purple-50 text-purple-900 px-8 py-6 text-lg font-semibold shadow-md"
      >
        This is a banner with a moving border effect!
      </MovingBorderContainer>
    </div>
  );
}
