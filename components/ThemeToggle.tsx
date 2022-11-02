import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Switch, useTheme } from "@nextui-org/react";
import { useTheme as useNextTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);

  const { setTheme } = useNextTheme();
  const { isDark } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div>
      <Switch
        shadow
        color="warning"
        initialChecked={!isDark}
        size="xl"
        aria-label="Toggle Dark Mode"
        iconOn={<FontAwesomeIcon icon={faSun} style={{ color: isDark ? "white" : "black" }} />}
        iconOff={<FontAwesomeIcon icon={faMoon} style={{ color: isDark ? "white" : "black" }} />}
        onChange={(e) => setTheme(e.target.checked ? "light" : "dark")}
      />
    </div>
  );
}
