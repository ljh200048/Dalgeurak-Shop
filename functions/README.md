# 📢 달그락 상점 텔레그램 실시간 예약 알림 시스템 (Firebase Functions v2)

이 디렉토리는 **달그락 상점**의 예약 수집(Firestore `reservations` 컬렉션의 문서 생성) 이벤트를 실시간으로 감지하여, 관리자에게 실시간 텔레그램 메시지를 자동으로 발송하는 **Firebase Cloud Functions (v2)** 프로젝트입니다.

---

## 🛠️ 기능 특징
1. **Firestore 트리거**: `reservations` 컬렉션에 새 예약 건이 등록되면 실시간 자동 감지하여 즉시 동작합니다.
2. **Firebase Cloud Functions v2**: 최신 v2 아키텍처 기반으로 작성되어 빠른 부팅과 우수한 성능을 자랑합니다.
3. **듀얼 스키마 매핑**: 사용자 정의 예약 요청 필드(`name`, `phone`, `date`, `time`, `product`, `quantity`, `message`)와 실제 서비스 내 예약 필드(`userName`, `guestPhone`, `date`, `time`, `className`, `headCount`, `requests`)를 둘 다 완벽하게 자동 맵핑하여 빈틈없는 데이터 처리가 보장됩니다.
4. **자동 재시도(Retry)**: 일시적인 전송 지연 또는 네트워크 장애가 생기면 Firebase 인프라가 자동으로 재시도하여 알림 누락을 최소화합니다.
5. **Node.js 18+ 네이티브 API**: 별도의 외부 무거운 HTTP 패키지 없이 내장된 초경량 네이티브 `fetch` API를 사용하여 안전하고 빠른 런타임을 구현했습니다.

---

## 🤖 1단계: 텔레그램 봇 토큰 및 채팅 ID 발급 방법

### 1) Telegram Bot Token 발급
1. 텔레그램 검색창에 `@BotFather`를 검색합니다.
2. 대화방에 `/newbot`을 입력하여 새 봇을 생성합니다.
3. 봇의 이름(Name)과 사용자 이름(Username, `_bot`으로 끝나야 함)을 순서대로 지정합니다.
4. 발급되는 **HTTP API Access Token**(예: `123456789:ABCdefGhIJKlmNoPQRsTuvwxYz`)을 복사해 둡니다. 이것이 `TELEGRAM_BOT_TOKEN`입니다.

### 2) Telegram Chat ID(수신인 ID) 알아내기
1. 텔레그램 검색창에 `@userinfobot`을 검색하고 대화방에 아무 메시지나 보냅니다.
2. 봇이 회신하는 `Id` 값(예: `987654321`)을 확인합니다. 이것이 알림을 수신받을 관리자의 `TELEGRAM_CHAT_ID`입니다.
3. 방금 만든 내 봇의 대화방에 접속하여 반드시 **[시작(Start)]** 버튼을 클릭해 줍니다. (이를 수행해야 봇이 사용자에게 선제적으로 메시지를 발송할 권한을 갖습니다.)

---

## 💻 2단계: 로컬 에뮬레이터 테스트 방법

Firebase Local Emulator Suite를 사용하여 로컬 환경에서 직접 예약 생성 이벤트를 재현하고 텔레그램 메시지 발송 성능을 테스트할 수 있습니다.

### 1) 환경 변수 설정
`functions/.env` 파일을 열어 발급한 실제 값을 대입합니다.
```env
TELEGRAM_BOT_TOKEN=123456789:ABCdefGhIJKlmNoPQRsTuvwxYz
TELEGRAM_CHAT_ID=987654321
```

### 2) 에뮬레이터 실행
프로젝트 루트 폴더 혹은 `functions` 폴더에서 아래 커맨드를 통해 에뮬레이터를 가동합니다.
```bash
# 디펜던시 설치 및 에뮬레이터 구동
cd functions
npm install
npm run serve
```

### 3) 가상 테스트 수행
Firestore 에뮬레이터가 켜지면 `http://localhost:4000` (기본 에뮬레이터 UI 포트) 혹은 로컬 DB 도구를 열어 `reservations` 컬렉션에 새 문서를 아래와 같은 필드 구조로 생성합니다.
* **이름 (name / userName)**: 홍길동
* **전화번호 (phone / guestPhone)**: 010-1234-5678
* **예약일 (date)**: 2026-07-15
* **예약시간 (time)**: 14:00
* **예약상품 (product / className)**: 시그니처 아크릴 달그락 키트
* **수량 (quantity / headCount)**: 2
* **요청사항 (message)**: "예쁘게 준비해 주세요!"

문서 저장 즉시 로컬 에뮬레이터 로그에 정상 감지 기록이 기록되고, 지정된 텔레그램 메신저로 실시간 메시지가 수신되는지 검토합니다.

---

## 🚀 3단계: Firebase Cloud Functions 실제 배포 방법

배포 시에는 보안 유지를 위해 환경 변수와 함께 소스 코드를 안전하게 실제 Google Cloud Cloud Functions 환경에 게시합니다.

### 1) Firebase 로그인 및 프로젝트 선택
```bash
firebase login
firebase use --add [실제_파이어베이스_프로젝트_ID]
```

### 2) Firebase Secrets Manager에 기밀값 설정
환경변수가 깃허브나 코드 저장소에 평문으로 유출되는 일을 막기 위해 Secret Manager 혹은 환경 설정 변수에 안전하게 주입해 배포합니다.
```bash
firebase functions:secrets:set TELEGRAM_BOT_TOKEN="실제_봇_토큰_값"
firebase functions:secrets:set TELEGRAM_CHAT_ID="실제_채팅_아이디_값"
```

### 3) 함수 단독 배포 명령
```bash
# functions 폴더 내부 또는 루트에서 아래 명령 실행
firebase deploy --only functions
```

성공적으로 배포가 완료되면 Firestore 실시간 알림 기능이 자동 가동되며, 달그락 상점 예약 유입 시 관리자의 휴대전화로 따끈따끈한 알림이 1초 안에 바로 도착하게 됩니다! 🎉
