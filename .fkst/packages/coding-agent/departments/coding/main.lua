-- General-purpose coding + refactoring department. The topic of each run is NOT
-- hardcoded here: it is the GitHub issue's Goal, which fkst-hosted injects as
-- JSON at $FKST_GOAL_FILE ({ title, description, repo }). This one package can
-- build a site, write a README, refactor code -- whatever the issue asks.
local M = {}

M.spec = {
  consumes = { "coding_request" },
  produces = { "coding_result" },
  stall_window = "1h",
}

function pipeline(event)
  -- Read the injected goal (exec_sync runs `sh -c`, so env expands).
  local read = exec_sync('cat "$FKST_GOAL_FILE"')
  if read.exit_code ~= 0 or read.stdout == "" then
    log.warn("coding-agent: goal file unavailable: " .. tostring(read.stderr))
    return
  end
  local goal = json.decode(read.stdout)

  local prompt = table.concat({
    "You are working inside a cloned git repository; your current working",
    "directory is the repository root. GITHUB_TOKEN/GH_TOKEN and a git",
    "credential helper are already configured, so `git` and `gh` work.",
    "",
    "Task title: " .. tostring(goal.title or ""),
    "Task: " .. tostring(goal.description or ""),
    "",
    "Implement exactly what the task asks, in this repository. Keep the change",
    "focused and the code clean. When done: create a new branch, commit your",
    "changes with a clear message, push the branch, and open a pull request to",
    "the default branch with `gh pr create --fill`.",
  }, "\n")

  -- No `worktree`: the department already runs with cwd = the repo root, so
  -- codex edits the clone directly. It inherits the token + credential helper +
  -- CODEX_HOME + LLM_API_KEY from the engine.
  local result = spawn_codex_sync({ prompt = prompt, timeout = 3600 })
  log.info(string.format("coding-agent: codex finished exit_code=%s", tostring(result.exit_code)))
  raise("coding_result", { exit_code = result.exit_code })
end

return M
