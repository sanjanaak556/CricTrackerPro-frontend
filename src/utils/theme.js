export const setTheme = (theme) => {
  const html = document.documentElement;

  if (theme === "dark") {
    html.classList.add("dark");
  } else {
    html.classList.remove("dark");
  }

  // save preference
  localStorage.setItem("theme", theme);
};

// load theme at startup
export const loadTheme = () => {
  const saved = localStorage.getItem("theme") || "light";
  const html = document.documentElement;

  if (saved === "dark") {
    html.classList.add("dark");
  } else {
    html.classList.remove("dark");
  }
};
