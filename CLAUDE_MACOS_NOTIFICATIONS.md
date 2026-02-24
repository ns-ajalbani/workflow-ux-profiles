# Claude Code macOS Notifications

Get native macOS notifications when Claude Code finishes a task or needs your input. Useful when you context-switch while waiting for long-running operations.

## What You Get

| Event | Sound | Notification Content |
|-------|-------|---------------------|
| **Task completed** | Glass | Shows your last prompt (subtitle) and Claude's reply (body) |
| **Permission needed** | Ping | Shows the permission message Claude is waiting on |

Clicking the notification focuses your terminal window (iTerm2 by default).

## Prerequisites

**Required:**
- macOS
- `jq` (JSON parsing) - `brew install jq`

**Recommended:**
- [`terminal-notifier`](https://github.com/julienXX/terminal-notifier) - `brew install terminal-notifier`
  - Supports click-to-activate (focus your terminal), subtitles, and richer notifications
  - Without it, falls back to `osascript` (basic notifications, no click-to-activate)

## Setup

### 1. Create the scripts directory

```bash
mkdir -p ~/.claude/scripts
```

### 2. Create `~/.claude/scripts/notify-done.sh`

This script fires on the `Stop` hook -- whenever Claude finishes a turn (task complete or waiting for input).

```bash
#!/bin/bash
# Claude Code Stop hook: Send macOS notification with last Q&A from transcript

set -euo pipefail

# Send macOS notification with terminal-notifier or osascript fallback
# Usage: send_notification "message" "title" "sound" ["subtitle"]
send_notification() {
  local message="$1"
  local title="$2"
  local sound="$3"
  local subtitle="${4:-}"

  if command -v terminal-notifier &>/dev/null; then
    local args=(-message "$message" -title "$title" -sound "$sound" -activate com.googlecode.iterm2)
    [[ -n "$subtitle" ]] && args+=(-subtitle "$subtitle")
    terminal-notifier "${args[@]}" >/dev/null &
  else
    local script="display notification \"$message\" with title \"$title\" sound name \"$sound\""
    [[ -n "$subtitle" ]] && script="display notification \"$message\" with title \"$title\" subtitle \"$subtitle\" sound name \"$sound\""
    osascript -e "$script" &
  fi
}

# Read JSON from stdin
input=$(cat)

# Extract fields
cwd=$(echo "$input" | jq -r '.cwd')
transcript_path=$(echo "$input" | jq -r '.transcript_path')

# Get directory name for notification title
dirname=$(basename "$cwd")

# Check if transcript exists
if [[ ! -f "$transcript_path" ]]; then
  send_notification "Transcript not found: $transcript_path" "Claude Code @ $dirname" "Glass"
  exit 0
fi

# Initial delay to give transcript time to flush to disk
sleep 0.2

# Function to strip HTML tags
strip_html() {
  echo "$1" | sed -E 's/<[^>]+>//g'
}

# Function to truncate to N words (default 20)
truncate_words() {
  local text="$1"
  local limit="${2:-20}"
  local words=(${text})
  if [[ ${#words[@]} -gt $limit ]]; then
    echo "${words[@]:0:$limit}..."
  else
    echo "$text"
  fi
}

# Parse transcript backwards to find last user prompt and assistant reply
# Use retry logic to ensure transcript has been fully flushed
last_user_prompt=""
last_assistant_reply=""
last_entry_type=""

max_retries=3
retry_delay=0.3

for attempt in $(seq 1 $max_retries); do
  last_user_prompt=""
  last_assistant_reply=""
  last_entry_type=""

  # Read transcript backwards (tac), process line by line
  while IFS= read -r line; do
    # Skip empty lines
    [[ -z "$line" ]] && continue

    # Check if this is a meta entry (skip if true)
    is_meta=$(echo "$line" | jq -r '.isMeta // false')
    [[ "$is_meta" == "true" ]] && continue

    # Get message type
    msg_type=$(echo "$line" | jq -r '.type // empty')

    # Track the first non-meta entry type we encounter (most recent)
    if [[ -z "$last_entry_type" ]]; then
      last_entry_type="$msg_type"
    fi

    # Look for last user prompt (if we haven't found it yet)
    if [[ -z "$last_user_prompt" && "$msg_type" == "user" ]]; then
      # Check if content is a string (not an array of tool results)
      content_type=$(echo "$line" | jq -r '.message.content | type')
      if [[ "$content_type" == "string" ]]; then
        raw_prompt=$(echo "$line" | jq -r '.message.content')
        # Strip HTML tags
        clean_prompt=$(strip_html "$raw_prompt")
        last_user_prompt=$(truncate_words "$clean_prompt")
      fi
    fi

    # Look for last assistant reply (if we haven't found it yet)
    if [[ -z "$last_assistant_reply" && "$msg_type" == "assistant" ]]; then
      # Extract first text block from content array
      text_content=$(echo "$line" | jq -r '.message.content[]? | select(.type == "text") | .text' | head -1)
      if [[ -n "$text_content" ]]; then
        # Collapse newlines into " · " for single-line notification display
        text_content=$(echo "$text_content" | perl -0777 -pe 's/\n+/ · /g; s/ · $//')
        last_assistant_reply=$(truncate_words "$text_content" 60)
      fi
    fi

    # Stop if we found both
    if [[ -n "$last_user_prompt" && -n "$last_assistant_reply" ]]; then
      break
    fi
  done < <(tac "$transcript_path")

  # If the most recent non-meta entry is an assistant message, we're good
  if [[ "$last_entry_type" == "assistant" ]]; then
    break
  fi

  # Otherwise, transcript may not be flushed yet - retry
  if [[ $attempt -lt $max_retries ]]; then
    sleep $retry_delay
  fi
done

# Build notification parts
subtitle=""
if [[ -n "$last_user_prompt" ]]; then
  subtitle="$last_user_prompt"
  # Escape forward slashes to display in notification badge
  subtitle="${subtitle//\//∕}"
fi

if [[ -n "$last_assistant_reply" ]]; then
  message="$last_assistant_reply"
  # Escape forward slashes to display in notification badge
  message="${message//\//∕}"
else
  message="Task completed"
fi

# Send notification
# terminal-notifier: -activate: focus iTerm2 on click; -subtitle: user prompt; -message: assistant reply
# osascript: subtitle and message only (no click-to-activate support)
send_notification "$message" "Claude Code @ $dirname" "Glass" "$subtitle"
```

### 3. Create `~/.claude/scripts/notify-permission.sh`

This script fires on the `Notification` hook with matcher `permission_prompt` -- whenever Claude needs you to approve a tool call.

```bash
#!/bin/bash
# Claude Code Notification hook: Send macOS notification for permission prompts

set -euo pipefail

# Send macOS notification with terminal-notifier or osascript fallback
# Usage: send_notification "message" "title" "sound" ["subtitle"]
send_notification() {
  local message="$1"
  local title="$2"
  local sound="$3"
  local subtitle="${4:-}"

  if command -v terminal-notifier &>/dev/null; then
    local args=(-message "$message" -title "$title" -sound "$sound" -activate com.googlecode.iterm2)
    [[ -n "$subtitle" ]] && args+=(-subtitle "$subtitle")
    terminal-notifier "${args[@]}" >/dev/null &
  else
    local script="display notification \"$message\" with title \"$title\" sound name \"$sound\""
    [[ -n "$subtitle" ]] && script="display notification \"$message\" with title \"$title\" subtitle \"$subtitle\" sound name \"$sound\""
    osascript -e "$script" &
  fi
}

# Read JSON from stdin
input=$(cat)

# Extract fields
cwd=$(echo "$input" | jq -r '.cwd')
message=$(echo "$input" | jq -r '.message')

# Get directory name for notification title
dirname=$(basename "$cwd")

# Send notification with Ping sound (different from task-done)
send_notification "$message" "Claude Code @ $dirname" "Ping"
```

### 4. Make scripts executable

```bash
chmod +x ~/.claude/scripts/notify-done.sh
chmod +x ~/.claude/scripts/notify-permission.sh
```

### 5. Add hooks to `~/.claude/settings.json`

Add the `hooks` block to your global Claude Code settings. If the file doesn't exist, create it:

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "/bin/bash ~/.claude/scripts/notify-done.sh"
          }
        ]
      }
    ],
    "Notification": [
      {
        "matcher": "permission_prompt",
        "hooks": [
          {
            "type": "command",
            "command": "/bin/bash ~/.claude/scripts/notify-permission.sh"
          }
        ]
      }
    ]
  }
}
```

If you already have a `~/.claude/settings.json`, merge the `hooks` key into it -- don't overwrite existing settings.

## How It Works

### Hook lifecycle

Claude Code supports [hooks](https://docs.anthropic.com/en/docs/claude-code/hooks) that run shell commands in response to lifecycle events:

| Hook | When it fires | Stdin JSON |
|------|--------------|------------|
| `Stop` | Claude finishes its turn (task done or waiting for input) | `{ "cwd", "transcript_path", "session_id", ... }` |
| `Notification` | A notification event occurs (e.g., permission prompt) | `{ "cwd", "message", ... }` |

### notify-done.sh (Stop hook)

1. Reads the JSON payload from stdin to get `cwd` and `transcript_path`
2. Parses the JSONL transcript file **backwards** (`tac`) to find the most recent user prompt and assistant reply
3. Strips HTML tags, collapses newlines, and truncates to fit notification limits
4. Sends a macOS notification:
   - **Title**: `Claude Code @ <project-dir>`
   - **Subtitle**: Your last prompt (truncated to 20 words)
   - **Body**: Claude's reply (truncated to 60 words)
   - **Sound**: Glass
5. Includes retry logic (3 attempts, 300ms delay) in case the transcript hasn't been fully flushed to disk

### notify-permission.sh (Notification hook)

1. Reads the JSON payload from stdin to get `cwd` and `message`
2. Sends a macOS notification:
   - **Title**: `Claude Code @ <project-dir>`
   - **Body**: The permission message
   - **Sound**: Ping (distinct from task completion)

## Customization

### Change the terminal app

Replace `com.googlecode.iterm2` with your terminal's bundle ID:

| Terminal | Bundle ID |
|----------|-----------|
| iTerm2 | `com.googlecode.iterm2` |
| Terminal.app | `com.apple.Terminal` |
| Warp | `dev.warp.Warp-Stable` |
| Alacritty | `org.alacritty` |
| Kitty | `net.kovidgoyal.kitty` |
| WezTerm | `com.github.wez.wezterm` |
| VS Code terminal | `com.microsoft.VSCode` |

### Change notification sounds

Replace `"Glass"` or `"Ping"` with any sound from `/System/Library/Sounds/`:

```
Basso, Blow, Bottle, Frog, Funk, Glass, Hero, Morse,
Ping, Pop, Purr, Sosumi, Submarine, Tink
```

### Disable notifications for specific projects

Add a project-level `.claude/settings.json` that overrides the hooks:

```json
{
  "hooks": {
    "Stop": [],
    "Notification": []
  }
}
```

## Troubleshooting

**No notifications appearing:**
- Check macOS notification permissions: System Settings > Notifications > terminal-notifier (or Script Editor)
- Verify scripts are executable: `ls -la ~/.claude/scripts/notify-*.sh`
- Test manually: `echo '{"cwd":"/tmp","message":"test"}' | bash ~/.claude/scripts/notify-permission.sh`

**"jq: command not found":**
- Install jq: `brew install jq`

**"tac: command not found":**
- Install GNU coreutils: `brew install coreutils`
- Or replace `tac` with `tail -r` in `notify-done.sh` (macOS built-in, but slower on large files)

**Notifications are silent:**
- Check Do Not Disturb / Focus mode
- Verify sound name is valid (see sounds list above)

**Click doesn't focus terminal:**
- Only works with `terminal-notifier`, not the `osascript` fallback
- Verify bundle ID matches your terminal app
