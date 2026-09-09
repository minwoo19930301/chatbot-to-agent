# ChatBot에서 Agent로

큰 사물 그림, 공식 로고, 짧은 문구로 진행하는 49장 HTML 강의입니다. 설명은 발표자 노트에 두고 같은 그림이 장면 사이를 이동·확대하며 이야기를 이어갑니다.

`Start.command`를 더블클릭하거나 `npm run dev`를 실행합니다.

**http://127.0.0.1:8767/**

- `←` / `→` / `Space`: 이전·다음 장
- `P` 또는 Present: 발표자 노트와 별도 청중 화면
- 전환은 약 0.9초 뒤 정지합니다. 자동 반복·자동 장 넘김 없음.
- 운영체제의 모션 줄이기 설정을 따릅니다.
- 노트 수정은 이 브라우저에 저장됩니다. 화면 공유는 청중 탭을 선택합니다.

Node.js가 필요합니다. 발표 중 라이브러리나 이미지를 외부에서 받지 않습니다. `npm run stop`으로 서버 종료, `npm run status`로 상태 확인. 직접 파일을 열지 말고 실행 주소를 사용합니다.

## 이야기

글자만 있는 표지 → 회사 로고와 AI 모델 → Opus·Fable / Flash·Pro / GPT-6 Astra → 다운로드·로컬 LLM·Hugging Face → 학습데이터·데이터센터 → 웹 ChatBot·HTML 전단지 비유 → 내 사이트와 API → 내 컴퓨터의 앱 → 원격 모델과 로컬 실행 도구 → 메일·Slack·카카오톡·GitHub → OpenClaw·Pi·Hermes → CLI·GUI → ChatBot vs Agent → .md 기록·이어받기·개인화 → 내 방식의 결과 → 자동화.

매일 09:00 메일과 Google Calendar에서 놓치면 안 되는 임박한 일정을 알려주는 예시 다음에 취업준비의 실제 흐름을 보여줍니다. 새 공고 검색 → 내 스펙과 비교 → 컴퓨터에서 서류 찾기 → 공고에 맞는 지원서·자기소개서 작성 → 사람이 확인하고 OK → 제출. 검토 기준을 `규칙.md`로 기록하면 다음 실행은 알려진 기준의 검토까지 맡길 수 있습니다.

개인 PC에 흩어진 업무에서 AX로 연결합니다. AX는 사람 중심의 일을 Agent 중심으로 구성하는 변화입니다.

1. 파편화된 자료를 디지털화하고 중앙에서 자산으로 관리
2. 에이전트가 실행할 수 있는 워크플로우와 공용 에이전트
3. 막히는 부분은 바이브코딩으로 필요한 도구 제작
4. 고객의 에이전트가 접근할 수 있는 API·CLI·MCP

마지막은 사람이 쓸 시간과 비용, 빌려 쓰는 AI 모델로 연결됩니다.

## 편집과 검증

- `scripts/build-composition.py`: 장면 배치와 짧은 무대 문구
- `composition/deck.css`, `composition/deck-runtime.js`: 스타일과 오브젝트 이동
- `manifest.json`, `SPEAKER-NOTES.md`: 순서와 상세 설명
- `CONTENT-SOURCES.md`, `composition/assets/logos/SOURCES*.md`: 공식 출처
- `composition/assets/cutouts/`: 원본 캔버스를 유지한 실제 투명 PNG와 검증 기록

장면 수정 후 `python3 scripts/build-composition.py`와 `npm run build`를 실행합니다. 노트만 바꾸면 `npm run build`가 양쪽 HTML 메타데이터를 갱신합니다.

`npm run check`는 HyperFrames CLI 0.8.33 검사를 실행합니다. `scripts/content-proof.mjs`, `scripts/capture-slides.mjs`, `scripts/qa-wrapper.mjs`, `scripts/prove-shared-motion.mjs`는 내용·전체 화면·탐색/발표자·오브젝트 전환을 확인합니다. 캡처와 검증 결과는 `snapshots/`에 저장합니다.

무대는 1920×1080, 브라우저 player/slideshow는 0.8.31, GSAP는 3.14.2입니다. 내부 0–294초는 탐색 좌표이며 실제 발표 시간을 제한하지 않습니다. 앞판 소스는 `revisions/v1/`–`revisions/v6/`에 보관했습니다.

## 이미지와 설명의 범위

사물 그림은 이 강의를 위해 imagegen으로 만든 원본입니다. 승인받은 macOS Vision 및 원본 RGB 기반 마스크 보정으로 배경을 제거했습니다. 흰 종이·화면과 분리된 작은 부품도 대조하고 실제 알파 픽셀을 확인합니다. Hugging Face는 공식 공개 페이지 캡처로서 불투명 화면을 유지합니다. 공식 로고의 권리는 각 소유자에게 있습니다.

HTML 전단지는 화면과 실행 도구를 구별하는 비유이며 웹 앱 전체의 기능 제한이 아닙니다. 배포 방식→오픈 에이전트→제작사 CLI→GUI는 교육 순서입니다. 제품들의 단일 출시 연표나 모든 회사의 동기를 단정하지 않습니다.

로컬 실행 도구와 원격 모델 컴퓨팅을 구분합니다. `.md`는 읽고 옮길 수 있는 작업 맥락이며 모델 재학습·세션 전체 이전의 보장이 아닙니다. 구독/API 과금·저장 설정·권한 조건은 노트에서 설명합니다. 정기 실행과 취업 지원은 발표용 예시입니다. 실제 메일·일정을 읽거나 알람을 만들거나 지원서를 제출하지 않습니다. 알려진 검토 기준의 자동화와 예외·승인 범위를 노트에서 구분합니다.
