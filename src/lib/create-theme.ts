import { Appearance, AppearanceVariables } from "../types";

export function createTheme(appearance?: Appearance) {
  if (!appearance || !appearance.variables) {
    return toCssVariables(defaultTheme);
  }

  const mergeVariables = {
    ...defaultTheme,
    ...appearance.variables,
  };

  return toCssVariables(mergeVariables);
}

function toCssVariables(variables: AppearanceVariables) {
  const toKebabCase = (str: string) =>
    str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();

  const cssVariables: Record<string, string> = {};

  for (const [key, value] of Object.entries(variables)) {
    cssVariables[`--as-${toKebabCase(key)}`] = value;
  }

  return cssVariables;
}

const defaultTheme: AppearanceVariables = {
  colorPrimary: "#111827",
  colorPrimaryForeground: "#ffffff",
  colorBackground: "#ffffff",
  colorForeground: "#111827",
  colorDanger: "#F33E3E",
  colorRing: "#826AED",
  colorMuted: "#E5E7EB",
  colorInputBorder: "#D1D5DB",
  spacingUnit: "0.25rem",
  borderRadius: "0.5rem",
};
