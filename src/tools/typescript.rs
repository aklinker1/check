use std::{fmt::Display, process::Command};

use regex::Regex;

use super::*;

pub struct Typescript {}

impl Tool for Typescript {
    fn is_installed(&self) -> bool {
        super::is_binary_available("tsc")
    }
    // --pretty false
    fn check(&self) -> Result<super::Output, Box<dyn std::error::Error>> {
        run_and_parse(
            Command::new("tsc").args(["--noEmit", "--pretty", "false"]),
            parse_output,
        )
    }

    fn fix(&self) -> Result<super::Output, Box<dyn std::error::Error>> {
        self.check()
    }
}

impl Display for Typescript {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "TypeScript")
    }
}

impl Debug for Typescript {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "tsc")
    }
}

fn parse_output(code: i32, stdout: String, _stderr: String) -> super::Output {
    if code == 0 {
        return super::Output::Success;
    }
    let newline = Regex::new(r"\r?\n").unwrap();
    let problems: Vec<Problem> = newline
        .split(&stdout)
        .map(|line| {
            Regex::new(r"^(\S+?)\(([0-9]+),([0-9]+)\): \w+? (TS[0-9]+): (.*)$")
                .unwrap()
                .captures(line)
        })
        .map(|captures| match captures {
            None => None,
            Some(captures) => Some(Problem {
                file: PathBuf::from(captures.get(1).unwrap().as_str()),
                kind: ProblemKind::Error,
                message: captures.get(5).unwrap().as_str().into(),
                start: Some(CodeLocation {
                    line: captures.get(2).unwrap().as_str().parse().unwrap(),
                    column: captures.get(3).unwrap().as_str().parse().unwrap(),
                }),
                rule: captures.get(4).map(|rule| rule.as_str().into()),
            }),
        })
        .filter(|problem| problem.is_some())
        .map(|problem| problem.unwrap())
        .collect();
    return super::Output::Error(code, problems);
}

#[cfg(test)]
mod tests {
    use std::str::FromStr;

    use super::*;

    #[test]
    fn parse_check_warning_output() {
        let code = 1;
        let stdout = "test.ts(1,19): error TS2355: A function whose declared type is neither 'undefined', 'void', nor 'any' must return a value.
test.ts(5,24): error TS7006: Parameter 'a' implicitly has an 'any' type.
";
        let stderr = "";

        let actual = parse_output(code, stdout.into(), stderr.into());

        assert_eq!(
            actual,
            Output::Error(code, vec![
                Problem {
                    file: PathBuf::from_str("test.ts").unwrap(),
                    message: "A function whose declared type is neither 'undefined', 'void', nor 'any' must return a value.".into(),
                    kind: ProblemKind::Error,
                    start: Some(CodeLocation {
                        line: 1,
                        column: 19
                    }),
                    rule: Some("TS2355".into()),
                },
                Problem {
                    file: PathBuf::from_str("test.ts").unwrap(),
                    message: "Parameter 'a' implicitly has an 'any' type.".into(),
                    kind: ProblemKind::Error,
                    start: Some(CodeLocation {
                        line: 5,
                        column: 24
                    }),
                    rule: Some("TS7006".into()),
                }
            ])
        );
    }
}
