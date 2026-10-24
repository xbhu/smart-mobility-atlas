#!/usr/bin/env bash
# Cut a silent teaser loop (and its poster frame) from a longer video, for an Atlas page's hero.
#
# Usage: tools/make_loop.sh SOURCE.mp4 START_SECONDS DURATION_SECONDS public/media/<slug>/NAME
#   e.g. tools/make_loop.sh demo.mp4 16 13 public/media/my-paper/demo-loop
# Writes NAME.mp4 (1280 px wide, H.264, no audio, ~1-2 MB for 10-15 s) and NAME-poster.jpg.
# Pick a stretch where the view is steady and the action is obvious without sound or titles;
# 8-15 seconds is plenty. To see candidate moments first:
#   ffmpeg -ss 0 -i SOURCE.mp4 -vf "fps=1/2,scale=256:-1,tile=5x4" -frames:v 1 contact.png
set -euo pipefail
src="$1"; start="$2"; dur="$3"; out="$4"
mkdir -p "$(dirname "$out")"
ffmpeg -v error -y -ss "$start" -t "$dur" -i "$src" -an \
  -vf "scale=1280:-2,fps=30" -c:v libx264 -preset veryfast -crf 27 -pix_fmt yuv420p \
  -movflags +faststart "$out.mp4"
ffmpeg -v error -y -ss "$(echo "$start + 0.5" | bc)" -i "$src" -frames:v 1 -vf scale=1280:-2 -q:v 3 "$out-poster.jpg"
ls -lh "$out.mp4" "$out-poster.jpg"
