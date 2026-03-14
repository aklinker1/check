import type { ToolDefinition } from "../types";
import { eslint } from "./eslint";
import { markdownlint } from "./markdownlint";
import { oxfmt } from "./oxfmt";
import { oxlint } from "./oxlint";
import { prettier } from "./prettier";
import { publint } from "./publint";
import { typescript } from "./typescript";

export const ALL_TOOLS: ToolDefinition[] = [
  oxfmt,
  eslint,
  markdownlint,
  oxlint,
  prettier,
  publint,
  typescript,
];
