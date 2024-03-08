import type { Tool } from "../types";
import { eslint } from "./eslint";
import { prettier } from "./prettier";
import { typescript } from "./typescript";

export const ALL_TOOLS: Tool[] = [prettier, typescript, eslint];
