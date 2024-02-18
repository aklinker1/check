use std::{fmt::Display, process::Command};

use regex::Regex;

use super::*;

pub struct Prettier {}

impl Tool for Prettier {
    fn is_installed(&self) -> bool {
        super::is_binary_available("prettier")
    }

    fn check(&self) -> Result<super::Output, Box<dyn std::error::Error>> {
        super::run_and_parse(
            Command::new("prettier").args([".", "--list-different"]),
            parse_output,
        )
    }

    fn fix(&self) -> Result<super::Output, Box<dyn std::error::Error>> {
        super::run_and_parse(Command::new("prettier").args([".", "--fix"]), |_, _, _| {
            Output::Success
        })
    }
}

impl Display for Prettier {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "Prettier")
    }
}

impl Debug for Prettier {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "prettier")
    }
}

fn parse_output(code: i32, stdout: String, _stderr: String) -> super::Output {
    if code == 0 {
        return super::Output::Success;
    }
    let newline = Regex::new(r"\r?\n").unwrap();
    let problems: Vec<Problem> = newline
        .split(stdout.trim())
        .map(|line| Problem {
            file: line.trim().into(),
            kind: ProblemKind::Warning,
            message: "Not formatted.".into(),
            start: None,
            rule: None,
        })
        .collect();
    return super::Output::Warning(code, problems);
}

#[cfg(test)]
mod tests {
    use std::str::FromStr;

    use super::*;

    #[test]
    fn parse_check_warning_output() {
        let code = 1;
        let stdout = "target/.rustc_info.json
        test.ts
";
        let stderr = "";

        let actual = parse_output(code, stdout.into(), stderr.into());

        assert_eq!(
            actual,
            Output::Warning(
                code,
                vec![
                    Problem {
                        file: PathBuf::from_str("target/.rustc_info.json").unwrap(),
                        message: "Not formatted.".into(),
                        kind: ProblemKind::Warning,
                        start: None,
                        rule: None,
                    },
                    Problem {
                        file: PathBuf::from_str("test.ts").unwrap(),
                        message: "Not formatted.".into(),
                        kind: ProblemKind::Warning,
                        start: None,
                        rule: None,
                    }
                ]
            )
        );
    }
}
