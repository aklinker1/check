import type { Tool } from "../types";
import { eslint } from "./eslint";
import { prettier } from "./prettier";
import { typescript } from "./typescript";
import { publint } from "./publint";

export const ALL_TOOLS: Tool[] = [publint, prettier, typescript, eslint];
