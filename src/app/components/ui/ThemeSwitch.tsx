import { memo, useEffect, useState } from "react";
import { IconButton } from "./IconButton";

interface ThemeSwitchProps {
  className?: string;
}

export const ThemeSwitch = memo(({ className }: ThemeSwitchProps) => {
  const [domLoaded, setDomLoaded] = useState(false);

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  return (
    domLoaded && (
      <IconButton
        className={className}
        icon={"i-ph-sun-dim-duotone"}
        size="xl"
        title="Toggle Theme"
        onClick={() => {}}
      />
    )
  );
});
