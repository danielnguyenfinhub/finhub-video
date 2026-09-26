import { loadFont } from "@remotion/fonts";
import { useEffect, useState } from "react";
import { staticFile, useDelayRender } from "remotion";

// Loads Be Vietnam Pro from public/fonts/ before a frame renders. Full TTFs
// (not Google's split subsets) so every Vietnamese diacritic is in one file.
export const useTyDoFont = () => {
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [handle] = useState(() => delayRender("loading Be Vietnam Pro"));
  useEffect(() => {
    Promise.all(
      (
        [
          ["600", "SemiBold"],
          ["800", "ExtraBold"],
          ["900", "Black"],
        ] as const
      ).map(([weight, name]) =>
        loadFont({
          family: "Be Vietnam Pro",
          url: staticFile(`fonts/BeVietnamPro-${name}.ttf`),
          weight,
          display: "block",
        }),
      ),
    )
      .then(() => continueRender(handle))
      .catch((err) => cancelRender(err));
  }, [handle, continueRender, cancelRender]);
};
