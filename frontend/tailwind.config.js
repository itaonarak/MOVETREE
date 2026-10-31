/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

// Bai Jamjuree ships each weight as its own font family (loaded in src/app/_layout.tsx),
// so font-normal / font-medium / font-semibold / font-bold switch the family instead of fontWeight.
const fonts = {
  normal: "BaiJamjuree_400Regular",
  medium: "BaiJamjuree_500Medium",
  semibold: "BaiJamjuree_600SemiBold",
  bold: "BaiJamjuree_700Bold",
};

module.exports = {
  // Every file that uses className="..." must be listed here
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class", // never follow the phone's dark mode
  corePlugins: {
    fontWeight: false,
  },
  theme: {
    extend: {
      fontFamily: {
        sans: [fonts.normal],
      },
      colors: {
        // App palette — change these to re-theme every screen
        paper: "#E8F5E9", // background (secondary)
        ink: {
          DEFAULT: "#1C1B1F", // main text
          soft: "#5E5A66", // secondary text
          faint: "#9A96A3", // placeholder / hints
        },
        line: "#D3E3D4", // borders
        brand: {
          DEFAULT: "#3E513B", // primary buttons, links
          dark: "#2E3C2C",
          light: "#E8F5E9", // secondary
        },
        sage: {
          DEFAULT: "#8A9E7A", // auth buttons
          light: "#D5E0CB", // help page background
        },
        accent: "#E07A3F", // badges, unread dots
      },
    },
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities(
        Object.fromEntries(
          Object.entries(fonts).map(([weight, family]) => [
            `.font-${weight}`,
            { fontFamily: family },
          ]),
        ),
      );
    }),
  ],
};
