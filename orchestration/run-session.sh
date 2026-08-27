#!/usr/bin/env bash
# 워커 세션 소환 스크립트 — 오케스트레이터 전용
# 사용법: ./run-session.sh <세션ID(소문자, 예: s1)>
set -euo pipefail

SID="$1"
REPO=/home/jimin/Jiseong-Cleaning
WT="$REPO/wt/$SID"
BRANCH="work/$SID"
BASE="redesign/2026-08-28"
INSTR="$REPO/orchestration/sessions/${SID^^}.md"
LOG="$REPO/orchestration/logs/${SID}.log"

mkdir -p "$REPO/orchestration/logs"
[ -f "$INSTR" ] || { echo "지시서 없음: $INSTR"; exit 1; }

# 워크트리 준비 (기존 것 있으면 재사용하지 않고 실패 — 오케스트레이터가 정리 후 재실행)
if [ ! -d "$WT" ]; then
  git -C "$REPO" worktree add "$WT" -b "$BRANCH" "$BASE"
fi

# node_modules 공유 (심링크) — 각 워크트리에서 next build 가능하게
if [ ! -e "$WT/website/node_modules" ]; then
  ln -s "$REPO/website/node_modules" "$WT/website/node_modules"
fi

# 폰트 생성 (pretendard.css 는 gitignore — prebuild 훅이 만들지만 미리 준비)
(cd "$WT/website" && npm run setup:fonts >/dev/null 2>&1) || true

echo "[$(date '+%F %T')] $SID 소환 — 브랜치 $BRANCH, 워크트리 $WT" | tee -a "$LOG"

cd "$WT/website"
claude --dangerously-skip-permissions -p "$(cat "$INSTR")

추가 컨텍스트: 너의 세션 ID 는 ${SID^^} 이다. 위 지시서와 RULES.md 를 절대 준수하라." \
  >> "$LOG" 2>&1

echo "[$(date '+%F %T')] $SID 종료 (exit $?)" | tee -a "$LOG"
