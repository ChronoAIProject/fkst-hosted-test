#!/usr/bin/env sh
set -eu

ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
MANIFEST="$ROOT/tests/logstream-e2e/manifest.tsv"

fail() {
  printf '%s\n' "logstream-e2e: $*" >&2
  exit 1
}

[ -f "$MANIFEST" ] || fail "missing manifest: tests/logstream-e2e/manifest.tsv"

found_65=0
found_68=0
found_71=0

while IFS="|" read -r issue artifact expected_line; do
  case "$issue" in
    ""|\#*) continue ;;
  esac

  case "$issue" in
    65) found_65=1 ;;
    68) found_68=1 ;;
    71) found_71=1 ;;
    *) fail "unexpected issue in manifest: $issue" ;;
  esac

  if [ -n "$artifact" ]; then
    [ -f "$ROOT/$artifact" ] || fail "missing artifact for issue #$issue: $artifact"
    actual_line=$(sed -n '1p' "$ROOT/$artifact")
    [ "$(sed -n '2p' "$ROOT/$artifact")" = "" ] || fail "$artifact must contain exactly one line"
    [ "$actual_line" = "$expected_line" ] || fail "$artifact content mismatch for issue #$issue"
  else
    [ "$issue" = "71" ] || fail "only issue #71 may be harness-only"
    [ ! -e "$ROOT/LOGSTREAM3.md" ] || fail "LOGSTREAM3.md must not be added; issue #71 is harness-covered"
  fi
done < "$MANIFEST"

[ "$found_65" -eq 1 ] || fail "manifest does not cover issue #65"
[ "$found_68" -eq 1 ] || fail "manifest does not cover issue #68"
[ "$found_71" -eq 1 ] || fail "manifest does not cover issue #71"

printf '%s\n' "logstream-e2e: covered issues #65, #68, and #71"
