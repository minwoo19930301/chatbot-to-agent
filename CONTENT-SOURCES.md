# ChatBot에서 Agent로 — 내용과 공식 출처

검토일: 2026-09-09. 공식 모델 페이지·제작사 모델 카드·프로젝트 문서·제작자 글을 직접 열어 확인했다. 이 문서는 발표 노트의 근거이며 화면 본문이 아니다. 로고 자산 출처는 별도로 관리한다.

## 모델 이름

| 화면 예시 | 공식 풀네임 | 모델 ID | 공식 출처 |
|---|---|---|---|
| Opus | Claude Opus 5 | `claude-opus-5` | [Anthropic](https://platform.claude.com/docs/en/models/opus-5/overview) |
| Fable | Claude Fable 5.1 | `claude-fable-5-1` | [Anthropic](https://platform.claude.com/docs/en/models/fable-5-1/overview) |
| Flash | Gemini 3.8 Flash | `gemini-3.8-flash` | [Google](https://ai.google.dev/gemini-api/docs/models/gemini-3.8-flash) |
| Pro | Gemini 3.1 Pro preview | `gemini-3.1-pro-preview` | [Google](https://ai.google.dev/gemini-api/docs/models/gemini-3.1-pro-preview) |
| GPT-6 Astra | GPT-6 Astra | `gpt-6-astra` | [OpenAI](https://developers.openai.com/api/docs/models/gpt-6-astra) |

Fable은 공식 확인된 이름이며 다른 모델 이름으로 대체하지 않는다. 구체적인 모델 예시를 화면에 복원하되 가격표나 성능 순위는 추가하지 않는다. 모델과 앱의 이름은 구분한다.

## 다운로드·로컬 실행·Hub

| 장면 | 확인한 내용 | 공식 출처 |
|---|---|---|
| download | Qwen 공식 Qwen3-4B 저장소에는 가중치 파일과 실행 안내가 있고 Apache 2.0으로 표시된다. | [공식 모델 카드](https://huggingface.co/Qwen/Qwen3-4B), [파일 목록](https://huggingface.co/Qwen/Qwen3-4B/tree/main) |
| download | Google의 Gemma 3 4B 대화용 모델에는 가중치 파일이 있으며 접근하려면 로그인과 이용 조건 동의가 필요하다. | [공식 모델 카드](https://huggingface.co/google/gemma-3-4b-it), [파일 목록](https://huggingface.co/google/gemma-3-4b-it/tree/main) |
| local | Gemma는 자신의 하드웨어·모바일 장치·호스팅 서비스에서 실행할 수 있는 공개 모델 제품군이다. | [Google Gemma 설명](https://ai.google.dev/gemma/docs) |
| hub | Hugging Face Hub는 다양한 모델을 저장소로 제공하고 모델 카드·다운로드·이용 조건·실행을 안내한다. | [Hugging Face Hub](https://huggingface.co/docs/hub/models) |

다운로드 그림은 Qwen3·Gemma3로 전환한다. 앞 장의 호스팅 모델 이름을 그대로 PC에 내려받는 표현은 쓰지 않는다. 공개 모델 예시는 최신 모델 추천이나 모든 PC에서의 실행 보장이 아니다. 파일 다운로드 외에 실행 프로그램과 적절한 하드웨어가 필요하다. 이번 조사는 페이지·파일 목록 확인으로, 실제 모델 다운로드나 실행을 포함하지 않았다.

## 학습데이터와 웹 대화

`learning`은 모델 개선에 활용할 자료와 사용 경험을 설명한다. 전송 통로 없는 로컬 실행에서는 그런 자료가 회사에 저절로 모이지 않는다는 조건부 추론이다. 이것이 회사의 서비스 방식을 결정한 단일한 이유라는 주장은 아니다. 서버로 대화를 전송한다는 것과 학습 이용은 별개이며 정책·설정·동의 조건에 따른다. 공식 회사 로고는 회사의 표식이다. [Anthropic 데이터 이용 정책](https://privacy.claude.com/en/articles/10023580-is-my-data-used-for-model-training)

`datacenter`와 `web`은 호스팅 모델에 질문을 보내고 응답을 받는 흐름이다. 회사가 이용하는 클라우드 인프라도 포함된다. 통신을 질문·대답으로 단순화했지만 실제 인증·맥락·첨부 데이터 등을 배제한다는 뜻은 아니다. 위 공식 모델 API 문서가 근거다. `chat`의 익숙함은 강의용 표현이며 인구 통계나 사용 단계의 평가가 아니다.

## HTML·내 사이트·API·실행 도구

| 장면 | 설명 범위 | 근거 또는 성격 |
|---|---|---|
| flyer | HTML 전단지는 눈에 보이는 화면과 뒤의 실행 시스템을 구별하는 비유다. 웹 앱 전체가 정적 HTML이거나 실행 능력이 없다는 주장이 아니다. | 교육용 비유. |
| cant_do | 도구 없는 기본 대화 구성을 가정한다. 외부 일을 수행하려면 실행 도구와 권한이 있어야 한다. 모든 웹 챗봇의 기능을 부정하지 않는다. | [Anthropic 도구 사용](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview) |
| my_site | 다른 사이트 화면을 옮기는 것만으로 모델 호출 권한과 실행 기능을 얻지 못한다. 공식 위젯·임베드를 제공하는 서비스까지 부정하지 않는다. | 화면과 인증된 서비스 통합을 구분하는 구조 설명. 특정 사이트의 임베드 정책을 단정하지 않는다. |
| api | 내 사이트가 API로 요청하고 받은 응답 데이터를 자체 화면에 통합한다. 응답은 텍스트 외 데이터도 포함할 수 있다. | [Anthropic API·도구 예제](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview) |
| agent_structure | 모델 호출, 도구 선택, 프로그램의 실행, 결과를 모델에 전달, 다음 행동 또는 답변으로 이어지는 루프다. | [Hermes 구조](https://hermes-agent.nousresearch.com/docs/developer-guide/architecture), [OpenClaw 루프](https://docs.openclaw.ai/concepts/agent-loop) |

API가 항상 제작사 클라우드만 뜻하지는 않는다. Pi 공식 문서에는 Ollama·llama.cpp 등 로컬 모델 연결도 있다. 강의에서는 이해하기 쉬운 AI 서버 요청·응답 예시를 사용한다. API 장면의 위치는 설명 순서이며 발명의 역사나 처음 도입된 시점을 뜻하지 않는다. [Pi 공식 사이트](https://pi.dev/)

## OpenClaw·Pi·Hermes의 대상

| 화면 이름 | 정확한 프로젝트 | 공식 출처 |
|---|---|---|
| OpenClaw | 사용자가 운영하는 Gateway로 채팅 앱과 에이전트·도구를 연결하는 소프트웨어. CLI·웹 관리 화면도 제공한다. | [OpenClaw 개요](https://docs.openclaw.ai/), [도구 실행 루프](https://docs.openclaw.ai/concepts/agent-loop) |
| Pi | Mario Zechner의 Pi Coding Agent. 터미널 중심의 실행 환경으로 모델과 파일·셸 도구를 연결한다. | [Pi](https://pi.dev/), [공식 README](https://github.com/earendil-works/pi/tree/main/packages/coding-agent), [제작자의 설명](https://mariozechner.at/posts/2025-11-30-pi-coding-agent/) |
| Hermes | Nous Research의 Hermes Agent. 모델 API·도구·메모리·Gateway·예약 작업을 엮는 소프트웨어이며 Hermes 모델 제품군과 구분한다. | [Hermes 문서](https://hermes-agent.nousresearch.com/docs/), [실행 구조](https://hermes-agent.nousresearch.com/docs/developer-guide/architecture) |

Pi 해석은 OpenClaw·Hermes 및 API+실행 도구라는 문맥과 공식 Pi 사이트의 OpenClaw 통합 예시를 근거로 한다. Inflection의 개인 대화형 Pi와 섞지 않는다. 옛 `badlogic/pi-mono` 저장소는 현재 `earendil-works/pi`로 이동했으며 공식 npm 표기는 `@earendil-works/pi-coding-agent`다. 화면에는 Pi만 사용한다. 세 프로젝트는 모델 자체가 아니며 기능과 운영 방식이 동일하지도 않다.

## 작업 위임과 24시간 비서

`do_it`의 이메일 발송·컴퓨터 점검은 연결된 계정·도구와 허용된 실행 환경에서 가능한 작업 예다. Hermes 공식 도구는 파일·터미널·브라우저·자동화를 포함하며 공식 개요는 Email 채널도 안내한다. 장면은 예시일 뿐 실제 메시지 발송·점검 작업을 실행하지 않는다. [Hermes 도구](https://hermes-agent.nousresearch.com/docs/user-guide/features/tools/), [Hermes 개요](https://hermes-agent.nousresearch.com/docs/)

`always_on`은 실행 호스트·서비스·모델 접근·인증이 유지되고 일정이나 이벤트를 연결한 구성이다. OpenClaw와 Hermes는 실행 중인 Gateway에서 자동화·예약 작업을 처리한다. 매순간 모델을 호출하거나 전원이 꺼진 호스트에서 계속 실행된다는 뜻이 아니다. [OpenClaw Gateway](https://docs.openclaw.ai/), [Heartbeat](https://docs.openclaw.ai/gateway/heartbeat), [Hermes Cron](https://hermes-agent.nousresearch.com/docs/user-guide/features/cron/)

Pi는 터미널 에이전트이며 공식 문서는 print/JSON·RPC·SDK 모드를 제공한다. 확인한 핵심 문서로 Pi 단독 설치에 동일한 상시 비서·내장 예약 기능이 있다고 주장할 수 없다. 상시 사용에는 이를 호출하고 유지하는 별도 서비스·일정 구성이 필요하다. [Pi 사용 모드](https://github.com/earendil-works/pi/tree/main/packages/coding-agent)

## 회사 CLI·GUI

Gemini CLI, Claude Code, Codex CLI는 터미널에서 파일·명령 작업을 맡기는 제품 예다. 앞 프로젝트 다음에 회사들이 CLI를 처음 만들었다는 역사가 아니다. Pi 자체가 CLI이며 OpenClaw·Hermes에도 CLI가 있다. 강의는 제품과 사용 화면을 비교한다. [Gemini CLI](https://geminicli.com/docs/), [Claude Code](https://code.claude.com/docs/en/overview), [Codex CLI](https://learn.chatgpt.com/docs/codex/cli)

프로젝트 지침은 작업 규칙, 스킬은 반복 절차·자료, MCP는 외부 도구·맥락 연결 방식이다. [AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md), [스킬·플러그인](https://learn.chatgpt.com/docs/skills-and-plugins), [MCP](https://learn.chatgpt.com/docs/extend/mcp)

GUI 예시는 Antigravity, Claude Desktop, Codex다. Claude Desktop은 앱 이름으로 유지하고 그 안의 특정 작업 기능을 설명할 때 실제 기능명을 구분한다. 도구·권한·운영체제에 따라 범위가 다르다. [Antigravity](https://antigravity.google/docs/overview), [Claude Code의 데스크톱 지원](https://code.claude.com/docs/en/overview), [Claude Cowork](https://claude.com/product/cowork), [OpenAI 앱](https://learn.chatgpt.com/docs/app)

OpenAI 앱 문서는 ChatGPT·Codex와 실제 파일·컴퓨터 작업을 함께 설명한다. ChatGPT에 X 표시를 하거나 답변만 가능하다고 단정하지 않는다.

## 비교 장면: 공통 AI와 기록의 위치

`compare`는 같은 원격 AI를 활용할 수 있다는 공통점을 두고, 서비스의 대화 기록 중심 사용과 내 컴퓨터의 작업 파일 중심 사용을 비교한다. 모든 ChatBot·Agent의 저장 위치를 양분하는 정의가 아니다. ChatGPT도 메모리 관리와 데이터 내보내기를 지원하며 Codex에는 클라우드 실행도 있다. [ChatGPT 메모리](https://help.openai.com/en/articles/8590148-memory-faq), [데이터 내보내기](https://help.openai.com/en/articles/7260999-how-do-i-export-my-chatgpt-history-and-data), [Codex cloud](https://learn.chatgpt.com/docs/cloud)

제품에 따라 같은 구독 계정으로 대화와 에이전트 기능을 이용할 수 있지만 모든 에이전트·API에 통용되는 구독권은 아니다. ChatGPT Plus의 API 사용은 별도 과금이며 기능·사용량은 플랜에 따른다. [OpenAI 사용량·요금](https://learn.chatgpt.com/docs/pricing), [ChatGPT Plus의 API 구분](https://help.openai.com/en/articles/6950777-what-is-chatgpt-plus)

로컬 에이전트도 원격 모델 호출 때 자료를 전송할 수 있다. 내 폴더의 파일이 존재한다는 사실을 외부 전송이 없다는 보장으로 설명하지 않는다. [Claude Code 데이터 흐름](https://code.claude.com/docs/en/data-usage)

## 내 파일에 남기고 이어가기

| 장면 | 확인한 범위 | 공식 근거 |
|---|---|---|
| local_files | 작업 지침과 메모리를 Markdown으로 저장해 다음 세션의 문맥으로 읽을 수 있다. 작업.md·취향.md·일정.md는 강의용 예시 파일명이며 자동 생성·전체 기록 보장은 아니다. | [Claude Code 메모리](https://code.claude.com/docs/en/memory), [Codex AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md) |
| handoff | 새 에이전트가 기존 문서를 읽으면 기록된 작업 맥락을 이어받을 수 있다. Claude Code→Codex는 그런 사용 흐름의 예이며 세션 전체 이전 기능의 보장이 아니다. Pi처럼 세션을 JSONL로 저장하는 제품도 있다. | [Codex 파일 작업](https://learn.chatgpt.com/docs/codex/cli), [Pi 세션](https://github.com/earendil-works/pi/tree/main/packages/coding-agent) |
| control | Markdown 메모리는 사람이 직접 읽고 고치거나 삭제할 수 있다. 로컬 파일 제어와 계약상 데이터 권리는 구분한다. | [Claude Code 메모리 편집·삭제](https://code.claude.com/docs/en/memory), [로컬·클라우드 데이터 흐름](https://code.claude.com/docs/en/data-usage) |
| personal | 저장한 선호·업무 맥락을 다음 요청에서 참고할 수 있다. 모든 행동·일정의 자동 수집이나 모델 재학습을 뜻하지 않는다. | [OpenClaw Markdown 메모리](https://docs.openclaw.ai/concepts/memory), [Claude Code 문맥 기반 메모리](https://code.claude.com/docs/en/memory) |
| ax | 업무 기준·프로젝트 지침을 팀과 조직 수준에서 관리하는 예가 있다. AX는 이를 회사 업무 흐름으로 확장하는 강의 개념이며 효과를 보장하는 수치나 제품명은 아니다. | [Claude Code 프로젝트·조직 지침](https://code.claude.com/docs/en/memory) |

파일을 통한 이어가기는 작업에 필요한 정보의 이동이다. 기록되지 않은 대화, 제품별 세션 상태, 인증, 실행 중인 작업, 도구 설정까지 그대로 이전되지는 않는다. 새 에이전트가 관련 파일을 읽도록 지정하고 접근 권한·인증·도구를 갖춰야 한다. 특정 .md 파일명 하나를 모든 에이전트가 자동으로 읽는다고 설명하지 않는다.

개인화는 저장한 맥락을 참고하는 방식이다. 모델 자체를 다시 학습하는 것과 다르며 일정·외부 상태는 필요할 때 재확인한다. 사용자가 기록을 선택·편집·백업·공유할 수 있다는 제어의 범위를 설명한다. 로컬 저장이 법적 소유권 전체 이전, 서버 사본 삭제, 무제한 재사용을 보장한다는 주장은 하지 않는다. 모든 회사가 고객에게 데이터 관리를 맡긴 단일 동기도 이번 공식 자료에서 확인하지 못했다.

## 로컬 앱과 서비스 연결

추가 확인일: 2026-09-09. 기존 모델·도구 루프 근거에 더해 아래 서비스 문서를 실제로 열었다. 로컬 앱이 API로 원격 모델을 사용하는 구성과 로컬 추론을 구별한다. Gmail·Calendar·Slack·KakaoTalk·GitHub는 연결 대상 예시이며, 모든 에이전트에 동일한 기본 기능이 있다는 뜻은 아니다.

| 대상 | 확인한 기능과 한정 | 공식 출처 |
|---|---|---|
| Gmail | 인증된 앱이 메일을 조회·관리할 수 있다. 접근 범위와 사용자 인증이 필요하다. | [Gmail API 개요](https://developers.google.com/workspace/gmail/api/guides) |
| Google Calendar | 일정·캘린더를 HTTP API로 조회·관리하며 일정 시각·시간대·접근 권한을 구별한다. | [Calendar API 개요](https://developers.google.com/workspace/calendar/api/guides/overview) |
| Slack | Web API는 Slack 기능을 프로그램에서 호출하는 인터페이스다. 앱과 토큰의 권한에 따른다. | [Slack Web API](https://docs.slack.dev/apis/web-api/) |
| KakaoTalk | 메시지 발송 제품별 대상·용도·권한이 다르다. 개인의 모든 대화방 열람·임의 발송 API로 설명하지 않는다. | [카카오톡 메시지 개요](https://developers.kakao.com/docs/ko/kakaotalk-message/common) |
| GitHub | 인증·권한 범위에서 GitHub 자료와 기능에 접근하는 REST API가 있다. | [GitHub REST API 개요](https://docs.github.com/en/rest/about-the-rest-api/about-the-rest-api) |

서비스 로고는 공식 페이지/CDN 및 공식 브랜드 ZIP에서 원본 그대로 받았다. 상세 URL·파일 해시·이용 지침 관찰은 [서비스 로고 출처](composition/assets/logos/SOURCES-SERVICES.md)에 있다. Gmail·Calendar는 확인한 공식 2026 SVG이며 Slack은 정사각 심볼, KakaoTalk은 심볼 PNG, GitHub는 Invertocat SVG다. 실제 서비스 연결·데이터 조회·발송은 하지 않았다.

## 맞춤 결과·예약·구직 지원 흐름

`custom_result`는 저장한 선호와 작업 맥락을 읽어 결과를 조정하는 설명이다. 모델 재학습이나 정확성 보장이 아니다. 기존 [Claude Code 메모리](https://code.claude.com/docs/en/memory)와 [OpenClaw 메모리](https://docs.openclaw.ai/concepts/memory)가 문맥 활용의 근거다.

`schedule`은 오전 9시에 Gmail과 Calendar를 읽어 긴급 메일·다가오는 일정을 알려 주는 구성 예다. 스케줄러·인증·네트워크·실행 호스트·알림 채널이 필요하다. 로컬 작업과 클라우드 작업의 실행 조건은 다르다. [OpenAI 예약 작업](https://learn.chatgpt.com/docs/automations), [OpenClaw 자동화](https://docs.openclaw.ai/automation/cron-jobs)

`job_start`부터 `job_submit`은 새 공고 발견 → 저장한 자격과 비교 → 로컬 자료 탐색 → 지원서·자기소개서 초안 → 사람의 검토와 OK → 허용된 경로로 제출하는 시나리오다. 특정 채용 서비스가 이 전체 흐름을 자동화 API로 제공한다는 주장이 아니다. 준비 단계를 자동화하도록 설계하되 처음에는 제출 전에 사람이 내용과 대상을 확인한다. 도구 결과·테스트·사람 검토를 연결하는 방식은 [Anthropic 에이전트 설계](https://www.anthropic.com/engineering/building-effective-agents)에 근거한다. 실제 채용 공고 조회, 개인 자료 접근, 지원서 작성·제출을 실행한 것은 아니다.

`rules`의 규칙.md는 사용자가 확인한 피드백과 검토 기준을 남기는 예시다. `rules_run`은 다음 작업에서 합의한 조건의 검사를 위임하는 흐름이다. 파일 하나로 모든 판단·권한을 넘기거나 필요한 승인을 우회하는 뜻이 아니다. 기존 [Markdown 작업 지침](https://learn.chatgpt.com/docs/agent-configuration/agents-md), [사람의 제어를 유지하는 MCP 도구](https://modelcontextprotocol.io/specification/2025-06-18/server/tools)가 한정의 근거다.

## AX와 팀의 실행 구조

`scattered`는 개인 PC에 업무 지식이 흩어진 상황을 가정한다. `ax`는 사람이 처리하던 업무 단계 중 위임할 부분을 에이전트가 실행할 수 있게 바꾸는 강의 개념이다. `centralize`는 디지털화·정리·공유 관리라는 토대를, `agent_workflow`는 실행 조건·도구·결과·예외 처리의 연결을 보여 준다. DT 전체를 중앙화로 축소하거나 자료를 모으기만 하면 AX가 완성된다고 주장하지 않는다.

`shared_agents`는 공통 기준과 도구를 관리하면서 역할별 작업 공간과 접근 범위를 배정하는 구성이다. 모두가 계정과 개인 기록을 공유한다는 뜻이 아니다. OpenClaw 공식 문서는 workspace가 기본 작업 디렉터리일 뿐 강한 보안 경계가 아님을 명시한다. 실제 접근 제어·샌드박스·필요한 실행 환경 분리를 설정해야 한다. [OpenClaw 다중 에이전트](https://docs.openclaw.ai/concepts/multi-agent), [프로젝트·조직 지침](https://code.claude.com/docs/en/memory)

`vibe_tools`는 빠진 작은 업무 도구를 코딩으로 만들어 연결하는 예다. 결과 코드의 테스트·검토·유지보수와 서비스 인증은 남는다. [Anthropic 코딩 에이전트와 검증](https://www.anthropic.com/engineering/building-effective-agents), [Codex CLI](https://learn.chatgpt.com/docs/codex/cli)

`agent_customers`는 고객이 에이전트에 서비스 탐색과 요청을 위임하는 시나리오다. `interfaces`는 CLI·API·MCP로 기능과 결과를 명확하게 제공하는 방향이다. 모든 사이트에 셋을 동시에 구축해야 하거나 MCP가 권한을 자동 제공한다는 뜻은 아니다. [MCP 구조·도구](https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture)

`human_work`는 반복 업무를 줄여 사람의 판단과 협업에 시간을 쓰자는 목표다. 실제 품질·시간·비용을 평가하며 고정된 효율이나 인원 감축을 보장하지 않는다. `rented_model`은 호스팅 모델을 이용하더라도 필요한 회사 맥락과 실행 절차를 관리하자는 마무리다. 모델 변경은 기능·비용·권한 재검증이 필요하며 공개 모델의 직접 실행도 선택지다. 특정 구독이 모든 API 사용을 포함하지 않는다.

## 확정 구성

제목은 **ChatBot에서 Agent로**이며 표지는 제목만 둔다. GUI 제품 표기는 **Claude Desktop**, 회사 비교 표시는 **AI회사**다. 모델 예시 Opus·Fable, Flash·Pro, GPT-6 Astra와 Qwen3·Gemma3 다운로드 이야기를 보존한다.

최종 49장 순서는 opening → makers → models → download → local → hub → learning → datacenter → web → chat → flyer → cant_do → my_site → api → local_app → agent_structure → services → agents → do_it → always_on → cli → gui → compare → local_files → handoff → control → personal → custom_result → automation → schedule → job_start → job_find → job_filter → job_documents → job_write → job_review → job_submit → rules → rules_run → scattered → ax → centralize → agent_workflow → shared_agents → vibe_tools → agent_customers → interfaces → human_work → rented_model다.

각 6초, 총 0–294초는 탐색 좌표이며 자동 진행이나 내레이션 길이가 아니다. 메이커→모델→다운로드·호스팅·웹/API→로컬 에이전트와 서비스→맞춤 결과·오전 9시 예약→구직 지원의 준비·검토·제출·규칙→AX와 회사 실행 구조→고객 에이전트·인터페이스→사람의 시간·모델 임대로 이어진다. 긴 설명과 제품·권한 조건은 노트에만 둔다.
