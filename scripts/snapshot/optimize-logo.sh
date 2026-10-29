#!/usr/bin/env bash
# Re-encode migma.ai's 651 KB animated GIF logo as a ~50 KB animated AVIF.
# Same frames and timing, transparency kept as a separate alpha stream.
set -euo pipefail
cd "$(dirname "$0")/../.."
ffmpeg -y -i public/snap/images/MigmaAI.gif \
  -filter_complex "[0:v]format=yuva444p,split[c][a];[c]format=yuv420p[cc];[a]alphaextract,format=gray[al]" \
  -map "[cc]" -map "[al]" -c:v libaom-av1 -crf 30 -b:v 0 -cpu-used 4 -loop 0 \
  public/snap/images/MigmaAI.avif
