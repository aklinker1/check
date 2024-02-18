use std::{
    fmt::{Debug, Display},
    ops::Add,
    path::PathBuf,
    process::Command,
};

use regex::Regex;

use super::{run_and_parse, CodeLocation, Problem, ProblemKind, Tool};

pub struct Eslint {}

impl Tool for Eslint {
    fn is_installed(&self) -> bool {
        super::is_binary_available("eslint")
    }

    fn check(&self) -> Result<super::Output, Box<dyn std::error::Error>> {
        run_and_parse(
            Command::new("eslint").args(&[
                ".",
                "--ext",
                ".js,.ts,.jsx,.tsx,.mjs,.mts,.cjs,.cts,.vue",
                "--format",
                "compact",
                "--max-warnings",
                "0",
            ]),
            parse_output,
        )
    }

    fn fix(&self) -> Result<super::Output, Box<dyn std::error::Error>> {
        run_and_parse(
            Command::new("eslint").args(&[
                ".",
                "--ext",
                ".js,.ts,.jsx,.tsx,.mjs,.mts,.cjs,.cts,.vue",
                "--format",
                "compact",
                "--max-warnings",
                "0",
                "--fix",
            ]),
            parse_output,
        )
    }
}

fn parse_output(code: i32, stdout: String, stderr: String) -> super::Output {
    if code == 0 {
        return super::Output::Success;
    }
    let newline = Regex::new(r"\r?\n").unwrap();
    let problems: Vec<Problem> = newline
        .split(&stdout.add("\n").add(&stderr))
        .map(|line| {
            Regex::new(r"^(.*?): line ([0-9]+), col ([0-9]+), (\S+) - (.*?) \((\S*?)\)$")
                .unwrap()
                .captures(line)
        })
        .map(|captures| match captures {
            None => None,
            Some(captures) => Some(Problem {
                file: PathBuf::from(captures.get(1).unwrap().as_str()),
                kind: match captures.get(4).unwrap().as_str() {
                    "Warning" => ProblemKind::Warning,
                    _ => ProblemKind::Error,
                },
                message: captures.get(5).unwrap().as_str().into(),
                start: Some(CodeLocation {
                    line: captures.get(2).unwrap().as_str().parse().unwrap(),
                    column: captures.get(3).unwrap().as_str().parse().unwrap(),
                }),
                rule: captures.get(6).map(|rule| rule.as_str().into()),
            }),
        })
        .filter(|problem| problem.is_some())
        .map(|problem| problem.unwrap())
        .collect();
    return super::Output::Error(code, problems);
}

impl Display for Eslint {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "ESLint")
    }
}

impl Debug for Eslint {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "eslint")
    }
}

#[cfg(test)]
mod tests {
    use std::str::FromStr;

    use crate::tools::Output;

    use super::*;

    #[test]
    fn parse_check_warning_output() {
        let code = 1;
        let stdout = "/Users/aklinker1/Development/github.com/aklinker1/check/demo/test.ts: line 1, col 7, Warning - 'test' is assigned a value but never used. (@typescript-eslint/no-unused-vars)
/Users/aklinker1/Development/github.com/aklinker1/check/demo/test.ts: line 5, col 7, Error - 'variable' is assigned a value but never used. (@typescript-eslint/no-unused-vars)

4 problems
";
        let stderr = "";

        let actual = parse_output(code, stdout.into(), stderr.into());

        assert_eq!(
            actual,
            Output::Error(
                code,
                vec![
                    Problem {
                        file: PathBuf::from_str(
                            "/Users/aklinker1/Development/github.com/aklinker1/check/demo/test.ts"
                        )
                        .unwrap(),
                        message: "'test' is assigned a value but never used.".into(),
                        kind: ProblemKind::Warning,
                        start: Some(CodeLocation { line: 1, column: 7 }),
                        rule: Some("@typescript-eslint/no-unused-vars".into()),
                    },
                    Problem {
                        file: PathBuf::from_str(
                            "/Users/aklinker1/Development/github.com/aklinker1/check/demo/test.ts"
                        )
                        .unwrap(),
                        message: "'variable' is assigned a value but never used.".into(),
                        kind: ProblemKind::Error,
                        start: Some(CodeLocation { line: 5, column: 7 }),
                        rule: Some("@typescript-eslint/no-unused-vars".into()),
                    }
                ]
            )
        );
    }
}
