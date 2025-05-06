import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import reactCompiler from 'eslint-plugin-react-compiler'; // Import the new plugin

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname, // Keep FlatCompat for the legacy extends
});

// Define the configuration object for the react-compiler plugin
const reactCompilerConfig = {
  plugins: {
    'react-compiler': reactCompiler,
  },
  rules: {
    'react-compiler/react-compiler': 'error',
  },
};

// Combine the configurations into a single array for export
const eslintConfig = [
  // Spread the configurations derived from the legacy 'extends' using FlatCompat
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Add the react-compiler configuration object
  reactCompilerConfig,

  // You can add more configuration objects here if needed
  // { ... }
];

export default eslintConfig;