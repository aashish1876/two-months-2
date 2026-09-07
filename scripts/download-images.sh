#!/bin/bash
# Downloads all Unsplash images used by the site to public/assets/aistudio/
set -euo pipefail

OUT_DIR="/Users/aashish.m/Downloads/two-months-2/public/assets/aistudio"
mkdir -p "$OUT_DIR"

# id|filename  pairs
LIST=(
  "1463453091185-61582044d556|leo-connected-3.jpg"
  "1469854523086-cc02fe5d8800|mem-2-coastal-bend.jpg"
  "1492562080023-ab3db95bfbce|julian-connected-2.jpg"
  "1500648767791-00dcc994a43e|leo-connected-1.jpg"
  "1502082553048-f009c37129b9|mem-11-seawall.jpg"
  "1506744038136-46273834b3fb|mem-8-desert-stars.jpg"
  "1506794778202-cad84cf45f1d|julian-connected-3.jpg"
  "1507003211169-0a1dd7228f2d|leo-portrait.jpg"
  "1507525428034-b723cf961d3e|mem-3-pier-jump.jpg"
  "1508873696983-2df5293cb32f|mem-13-bonfire.jpg"
  "1511632765486-a01980e01a18|mem-1-pact.jpg"
  "1517457373958-b7bdd4587205|mem-6-rooftop-hammock.jpg"
  "1517486808906-6ca8b3f04846|julian-connected-1.jpg"
  "1517841905240-472988babdf9|maya-connected-2.jpg"
  "1518709268805-4e9042af9f23|mem-15-quiet-drive.jpg"
  "1519741497674-611481863552|mem-5-rainstorm.jpg"
  "1522075469751-3a6694fb2f61|leo-connected-2.jpg"
  "1523240795612-9a054b0db644|mem-10-library.jpg"
  "1524504388940-b1c1722653e1|maya-connected-3.jpg"
  "1529156069898-49953e39b3ac|maya-portrait.jpg"
  "1534528741775-53994a69daeb|maya-portrait-alt.jpg"
  "1539571696357-5a69c17a67c6|julian-portrait.jpg"
  "1555396273-367ea4eb4db5|mem-4-diner.jpg"
  "1556910103-1c02745aae4d|mem-9-pasta.jpg"
)

ok=0
fail=0
for entry in "${LIST[@]}"; do
  id="${entry%%|*}"
  fname="${entry##*|}"
  dest="$OUT_DIR/$fname"
  if [ -s "$dest" ]; then
    echo "skip  $fname (already exists)"
    ok=$((ok+1))
    continue
  fi
  url="https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=80"
  echo "fetch $fname"
  if curl -fsSL --retry 3 --retry-delay 1 -A "Mozilla/5.0" -o "$dest.tmp" "$url"; then
    sips -s format jpeg --resampleHeightWidthMax 1600 "$dest.tmp" --out "$dest" >/dev/null 2>&1 || cp "$dest.tmp" "$dest"
    rm -f "$dest.tmp"
    ok=$((ok+1))
  else
    echo "FAIL   $id"
    rm -f "$dest.tmp"
    fail=$((fail+1))
  fi
done

echo "----"
echo "ok=$ok  fail=$fail"
exit $fail
