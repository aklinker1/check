import type { ToolDefinition } from "../types";
import { eslint } from "./eslint";
import { markdownlint } from "./markdownlint";
import { oxlint } from "./oxlint";
import { prettier } from "./prettier";
import { publint } from "./publint";
import { typescript } from "./typescript";

export const ALL_TOOLS: ToolDefinition[] = [
  eslint,
  markdownlint,
  oxlint,
  prettier,
  publint,
  typescript,
];
