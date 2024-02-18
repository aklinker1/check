mod tools;

use std::{
    path::PathBuf,
    sync::Arc,
    thread::{self, JoinHandle},
    time::{Duration, Instant},
};

use clap::Parser;
use indicatif::{HumanDuration, MultiProgress, ProgressBar, ProgressStyle};
use tools::Problem;

use crate::tools::Output;

/// Check lint, formatting, and type errors all at once
#[derive(Parser, Debug)]
#[command(version, about, long_about = None)]
struct Args {
    /// Directory or file to check
    path: Option<PathBuf>,

    /// Fix any errors that can be fixed automatically
    #[arg(short, long, default_value_t = false)]
    fix: bool,

    /// Output helpful logs for deubgging
    #[arg(long, default_value_t = false)]
    debug: bool,
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let all_tools: Vec<Box<dyn tools::Tool>> = vec![
        Box::new(tools::prettier::Prettier {}),
        Box::new(tools::eslint::Eslint {}),
        Box::new(tools::typescript::Typescript {}),
    ];

    let args = Args::parse();
    let tools = find_tools(&args, all_tools);

    let m = MultiProgress::new();
    let handles: Vec<JoinHandle<Result<Output, String>>> = tools
        .into_iter()
        .map(|tool| {
            let pb = m.add(ProgressBar::new(0));
            pb.set_style(spinner_style());
            pb.set_prefix(tool.to_string());
            pb.enable_steady_tick(Duration::from_millis(100));
            let tool = Arc::new(tool);
            thread::spawn(move || {
                let start = Instant::now();
                let res = if args.fix { tool.fix() } else { tool.check() };
                let msg = format!("({})", HumanDuration(start.elapsed()));
                match res {
                    Err(e) => {
                        pb.set_style(failure_style());
                        pb.abandon_with_message(msg);
                        Err(e.to_string())
                    }
                    Ok(output) => {
                        match output {
                            tools::Output::Error(_, _) => {
                                pb.set_style(failure_style());
                                pb.abandon_with_message(msg);
                            }
                            tools::Output::Warning(_, _) => {
                                pb.set_style(warning_style());
                                pb.finish_with_message(msg);
                            }
                            tools::Output::Success => {
                                pb.set_style(success_style());
                                pb.finish_with_message(msg);
                            }
                        }
                        Ok(output)
                    }
                }
            })
        })
        .collect();

    let mut errors: Vec<String> = Vec::new();
    let mut problems: Vec<Problem> = Vec::new();

    let mut exit_code = 0i32;
    for h in handles {
        match h.join().unwrap() {
            Ok(output) => match output {
                Output::Warning(code, mut p) => {
                    if code > 0 {
                        exit_code = code;
                    }
                    problems.append(&mut p)
                }
                Output::Error(code, mut p) => {
                    if code > 0 {
                        exit_code = code;
                    }
                    problems.append(&mut p)
                }
                _ => (),
            },
            Err(e) => errors.push(e),
        }
    }

    if problems.len() > 0 {
        println!("\n");
        for p in &problems {
            println!("{p}")
        }
        if problems.len() == 1 {
            println!("\n1 problem")
        } else {
            println!("\n{} problems", problems.len())
        }
    }
    if errors.len() > 0 {
        println!("Errors:");
        for e in errors {
            println!(" - {e}")
        }
    }

    if exit_code > 0 {
        std::process::exit(exit_code)
    }
    Ok(())
}

fn spinner_style() -> ProgressStyle {
    ProgressStyle::with_template("{spinner:.cyan} {prefix} {wide_msg:.dim}")
        .unwrap()
        .tick_strings(&["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏", " "])
}

fn success_style() -> ProgressStyle {
    ProgressStyle::with_template("{spinner:.bold.green} {prefix} {wide_msg:.dim}")
        .unwrap()
        .tick_strings(&["✔"])
}

fn warning_style() -> ProgressStyle {
    ProgressStyle::with_template("{spinner:.bold.yellow} {prefix} {wide_msg:.dim}")
        .unwrap()
        .tick_strings(&["!"])
}

fn failure_style() -> ProgressStyle {
    ProgressStyle::with_template("{spinner:.bold.red} {prefix} {wide_msg:.dim}")
        .unwrap()
        .tick_strings(&["x"])
}

fn find_tools(args: &Args, all_tools: Vec<Box<dyn tools::Tool>>) -> Vec<Box<dyn tools::Tool>> {
    if args.debug {
        let installed_tools: Vec<&Box<dyn tools::Tool>> =
            all_tools.iter().filter(|x| x.is_installed()).collect();
        println!("Installed: {installed_tools:?}");
        let skipped_tools: Vec<&Box<dyn tools::Tool>> =
            all_tools.iter().filter(|x| !x.is_installed()).collect();
        println!("Skipping: {skipped_tools:?}");
    }
    all_tools.into_iter().filter(|x| x.is_installed()).collect()
}
