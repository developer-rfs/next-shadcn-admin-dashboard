import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "DDF - Daily Dog Fights",
  version: packageJson.version,
  copyright: `Copyright ${currentYear}, DDF - Daily Dog Fights.`,
  meta: {
    title: "DDF - Daily Dog Fights Admin",
    description: "Administrative console for managing Daily Dog Fights tournaments and operations.",
  },
};
