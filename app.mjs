import { spawn } from "child_process";

const bashChildProcess = spawn("bash", ["script.sh"]);

// console.log(bashChildProcess);

// bashChildProcess.stdout.pipe(process.stdout);

bashChildProcess.stdout.on("data", (data) => {
  console.log("Got stdout data");
  process.stdout.write(data);
});

bashChildProcess.stderr.on("data", (data) => {
  process.stdout.write(data);
});

bashChildProcess.on("close", (code) => {
  if (code === 0) {
    console.log("Script Executed Succesfully!");
  } else {
    console.log("Script Failed!");
  }
});

bashChildProcess.on("error", (err) => {
  console.log("Error in spawning the process.");
  console.log(err);
});
