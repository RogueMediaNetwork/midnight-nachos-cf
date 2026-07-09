#!/usr/bin/env bash
# Reinstalls the runtime CLIs the vendored skills depend on.
# The .claude/ skill + hook files are committed to the repo, but these
# CLIs live outside the repo and must be reinstalled in a fresh container.
# Idempotent and fast: skips anything already on PATH. Never fails the session.
set -u
export PATH="$HOME/.local/bin:$PATH"

log() { printf '[provision] %s\n' "$1" >&2; }

# graphify (knowledge-graph skill + PreToolUse hook-guard). Hook calls
# /root/.local/bin/graphify, which is where `uv tool install` places it.
command -v graphify >/dev/null 2>&1 || {
  log "installing graphifyy"; uv tool install graphifyy >/dev/null 2>&1 || log "graphifyy install failed"; }

# yt-dlp (claude-video /watch downloads)
command -v yt-dlp >/dev/null 2>&1 || {
  log "installing yt-dlp"; uv tool install yt-dlp >/dev/null 2>&1 || log "yt-dlp install failed"; }

# ffmpeg (claude-video frame extraction) — system package
command -v ffmpeg >/dev/null 2>&1 || {
  log "installing ffmpeg"
  if command -v apt-get >/dev/null 2>&1; then
    (apt-get update -qq && apt-get install -y -qq ffmpeg) >/dev/null 2>&1 || log "ffmpeg install failed"
  else
    log "no apt-get; install ffmpeg manually"
  fi
}

# notebooklm CLI (NotebookLM skill). Also needs Google auth at runtime.
command -v notebooklm >/dev/null 2>&1 || {
  log "installing notebooklm-py"
  uv tool install "notebooklm-py[browser]" >/dev/null 2>&1 \
    || pip install --quiet "notebooklm-py[browser]" >/dev/null 2>&1 \
    || log "notebooklm-py install failed"
}

exit 0
