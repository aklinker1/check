import { eslint } from "./eslint";
import { oxlint } from "./oxlint";
import { prettier } from "./prettier";
import { publint } from "./publint";
import { typescript } from "./typescript";

export const ALL_TOOLS = [publint, prettier, typescript, oxlint, eslint];
