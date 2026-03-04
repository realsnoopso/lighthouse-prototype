# Lighthouse Prototype

ADHD 생산성 도우미 프로토타입

## 개요

이 프로토타입은 ADHD 사용자를 위한 생산성 도우미 서비스의 주요 기능을 시뮬레이션합니다. AI가 실제로 작동하지 않고 미리 준비된 시나리오로 동작하여, 사용자 경험을 테스트할 수 있습니다.

## 주요 기능

### 1. 아침 인터뷰 (Morning Interview)
- Google Calendar 일정 확인
- 에너지 레벨 평가 (10점 만점)
- 오늘 할 일 입력
- 우선순위 설정 ("오늘 꼭 하나만 끝낸다면?")
- 스코프 챌린지 (큰 작업 자동 분해)
- 타임박싱 (Strong Default, Easy Override)

### 2. 오늘 일정 보기 (Daily View)
- 타임라인 형식의 일정 표시
- 작업과 미팅 구분
- 시간의 유한성 시각화

### 3. 중간 체크인 (Check-in)
- 빠른 진행 상황 업데이트
- 4가지 선택지: 완료 / 70% / 막힘 / 스킵
- 비판단적 톤

### 4. 하루 마무리 (Retrospection)
- 완료/미완료 요약
- 추정 vs 실제 시간 비교
- 연속 기록 (streak) 표시
- 한 줄 회고
- 비판단적 탐색 ("뭐가 방해했을까요?")

## 핵심 UX 원칙

### 자율성-지지적 구조
- "해야 하니까" ❌ → "하기로 했으니까" ✅
- 실패 시 비난/추궁 ❌, 비판단적 탐색 ✅
- 과잉 선택지 방지: 제한적 선택 (3가지 중 고르기)

### 스코프 챌린지
- 큰 작업(>2시간) 자동 감지
- 30분~2시간 실행 가능한 단위로 분해
- 각 단위마다 완료 기준 + 시간대 배치

### 타임박싱
- Strong Default: AI가 기본값 제안
- Easy Override: 사용자가 쉽게 수정 가능
- 시간의 유한성 시각화

## 기술 스택

- React 19 + TypeScript
- Vite
- React Router
- Tailwind CSS v4
- Lucide React (icons)
- Sonner (toast notifications)

## 개발 환경 실행

```bash
npm install
npm run dev
```

## 빌드

```bash
npm run build
```

## 프로토타입 한계

이 프로토타입은 다음 기능을 포함하지 않습니다:
- 실제 AI 기능 (미리 준비된 시나리오로 동작)
- Google Calendar 실제 연동
- 데이터 저장 (새로고침 시 초기화)
- 주간 워크플로우 (Weekly Workflow)

## 라이선스

MIT
