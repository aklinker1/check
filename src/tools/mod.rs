pub mod eslint;
pub mod prettier;
pub mod typescript;

use colored::Colorize;
use std::{
    fmt::{Debug, Display},
    path::PathBuf,
};
use which::which;

pub trait Tool: Display + Debug + Send + Sync {
    fn is_installed(&self) -> bool;
    fn check(&self) -> Result<Output, Box<dyn std::error::Error>>;
    fn fix(&self) -> Result<Output, Box<dyn std::error::Error>>;
}

#[derive(Debug, PartialEq)]
pub struct Problem {
    pub start: Option<CodeLocation>,
    pub message: String,
    pub file: PathBuf,
    pub kind: ProblemKind,
    pub rule: Option<String>,
}

impl std::fmt::Display for Problem {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let icon = match self.kind {
            ProblemKind::Error => "x".bold().red(),
            ProblemKind::Warning => "!".bold().yellow(),
        };
        let file = self.file.to_str().unwrap();
        let location: String = match &self.start {
            None => format!("{file}"),
            Some(start) => format!("{file}:{}", start),
        };
        write!(f, "{} {}\n  {}", icon, self.message, location.dimmed())
    }
}

#[derive(Debug, PartialEq)]
pub struct CodeLocation {
    pub line: u32,
    pub column: u32,
}
impl std::fmt::Display for CodeLocation {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}:{}", self.line, self.column)
    }
}

#[derive(Debug, PartialEq)]
pub enum ProblemKind {
    Error,
    Warning,
}

pub fn is_binary_available(name: &str) -> bool {
    return which(name).is_ok();
}

#[derive(Debug, PartialEq)]
pub enum Output {
    Success,
    Warning(i32, Vec<Problem>),
    Error(i32, Vec<Problem>),
}

pub fn run_and_parse<F>(
    command: &mut std::process::Command,
    parser: F,
) -> Result<Output, Box<dyn std::error::Error>>
where
    F: FnOnce(i32, String, String) -> Output,
{
    Ok(command
        .output()
        .map(|output| {
            parser(
                output.status.code().unwrap(),
                String::from_utf8(output.stdout).unwrap(),
                String::from_utf8(output.stderr).unwrap(),
            )
        })
        .map_err(|err| Box::new(err))?)
}
