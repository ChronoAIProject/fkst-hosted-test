-- Raiser: fire ONCE per session at startup (file_watch does a startup scan over
-- pre-existing files). The committed requests/trigger.md is a dummy trigger --
-- the actual task comes from the GitHub issue's Goal, injected at $FKST_GOAL_FILE.
return {
  type = "file_watch",
  glob = "requests/*.md",
  produces = "coding_request",
}
