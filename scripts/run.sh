#!/usr/bin/env sh
set -eu

ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)

usage() {
  printf '%s\n' "usage: scripts/run.sh test-affected|test [package]" >&2
  exit 2
}

run_test() {
  package="${1:-}"
  case "$package" in
    ""|logstream-e2e)
      "$ROOT/scripts/check-logstream-e2e.sh"
      ;;
    *)
      printf '%s\n' "unknown test package: $package" >&2
      exit 2
      ;;
  esac
}

case "${1:-}" in
  test)
    shift
    run_test "${1:-}"
    ;;
  test-affected)
    run_test logstream-e2e
    ;;
  *)
    usage
    ;;
esac
