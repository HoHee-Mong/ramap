\# 라맵 (Ramap) 프로젝트



\## 프로젝트 개요

서울/경기권 일본 라멘 맛집을 모아놓은 지도 기반 웹사이트.

두쫀쿠 맵처럼 트렌디하고 힙한 감성 + 타베로그처럼 신뢰도 높은 정보 제공이 목표.

추후 모바일 앱으로 확장 예정.



\## 기술 스택 및 버전



\### 프론트엔드

\- React 19.x

\- Node.js 22 LTS

\- npm 10.x

\- Vite 6.x (빌드 도구 및 개발 서버)

\- 카카오맵 API (지도)



\### 백엔드

\- Kotlin 2.1.x

\- Spring Boot 3.4.x

\- Java 21 LTS

\- Gradle 8.x (Kotlin DSL)

\- Spring Data MongoDB 4.x

\- Spring Security (인증/인가)



\### 데이터베이스

\- MongoDB 7.x



\### 향후 확장

\- 모바일: React Native (React 코드 일부 재사용 목적)



\## 디자인 방향

\- 트렌디하고 힙한 무드 (캐치테이블 레퍼런스)

\- 음식 사진이 돋보이는 레이아웃

\- 모바일 친화적인 반응형 디자인 필수

\- 컬러톤: 따뜻하고 식욕을 자극하는 톤 (추후 구체화)



\## 코드 작성 규칙



\### 구현 원칙

\- \*\*절대 모킹하지 않기\*\*: 테스트용 가짜 데이터, Mock 객체, 하드코딩된 더미 데이터 사용 금지. 항상 실제 동작하는 코드만 작성

\- \*\*오버엔지니어링 금지\*\*: 요청한 기능만 정확히 구현. 요청하지 않은 기능, 확장성 고려한 추가 구조, 없어도 되는 추상화 레이어 임의 추가 금지

\- \*\*단순하게\*\*: 같은 기능이면 코드가 짧고 단순한 쪽 선택

\- \*\*라이브러리\*\*: 새 라이브러리 도입 시 항상 최신 안정 버전 사용. 도입 전 나에게 먼저 이유 설명하고 승인 받을 것



\### 네이밍 규칙

\- 변수명/함수명/클래스명은 영어로, 기능을 명확히 나타내는 이름 사용

\- 축약어 사용 금지 (예: `btn` X → `button` O, `cnt` X → `count` O)

\- Boolean 변수는 `is`, `has`, `can` 으로 시작 (예: `isOpen`, `hasReview`)

\- 함수명은 동사로 시작 (예: `getRestaurant`, `filterByRamenType`)

\- 상수는 대문자 스네이크케이스 (예: `MAX\_REVIEW\_LENGTH`)



\### 주석 규칙

\- 모든 주석은 한국어로 작성

\- 함수/메서드마다 역할 한 줄 주석 필수

\- 복잡한 로직엔 이유 설명 주석 추가

\- 당연한 코드엔 주석 달지 않기



\### 답변 규칙

\- 묻는 것에만 정확히 답하기

\- 내 경험, 비유, 관련 없는 사례 연결 금지

\- 코드 설명은 한국어로, 간결하게

\- 코드 작성 전 구조/설계 먼저 설명하고 진행할 것

\- 선택지가 있을 땐 추천 이유와 함께 제시할 것



\### React 규칙

\- 컴포넌트는 기능 단위로 분리, 하나의 컴포넌트는 하나의 역할만

\- 커스텀 훅으로 분리 가능한 로직은 반드시 분리

\- Props는 명확한 타입 지정 (TypeScript 사용)

\- 불필요한 useEffect 사용 금지



\### Kotlin/Spring Boot 규칙

\- Controller → Service → Repository 레이어 엄격히 분리

\- 비즈니스 로직은 Service에만 작성

\- 예외 처리는 GlobalExceptionHandler로 일관되게 관리

\- API 응답은 공통 응답 형식 사용



\### API 규칙

\- RESTful 원칙 준수

\- 응답 형식 통일:

```json

&#x20; {

&#x20;   "success": true,

&#x20;   "data": {},

&#x20;   "message": ""

&#x20; }

```

\- 에러 응답도 동일한 형식 유지

\- API 엔드포인트는 소문자 + 하이픈 (예: `/api/v1/ramen-shops`)



\## Git 규칙



\### 브랜치 전략

\- `main` — 배포 가능한 최종 코드만

\- `develop` — 개발 통합 브랜치

\- `feature/기능명` — 기능 단위 개발 (예: `feature/map-pin`, `feature/review`)

\- `fix/버그명` — 버그 수정 (예: `fix/pin-overlap`)

\- 작업 순서: feature 브랜치 → develop 머지 → main 머지



\### 커밋 메시지 형식

```

feat: 기능 추가 설명

fix: 버그 수정 설명

docs: 문서 수정

style: 코드 포맷, 세미콜론 등 (로직 변경 없음)

refactor: 코드 리팩토링

chore: 빌드, 패키지 설정 변경

```

예시: `feat: 카카오맵 라멘 가게 핀 표시 기능 추가`



\---



\## 폴더 구조 세부화

```

ramap/

├── frontend/

│   ├── public/

│   ├── src/

│   │   ├── assets/          # 이미지, 폰트, 아이콘

│   │   ├── components/      # 재사용 컴포넌트

│   │   │   ├── common/      # 버튼, 인풋 등 공통 UI

│   │   │   ├── map/         # 지도 관련 컴포넌트

│   │   │   ├── shop/        # 가게 관련 컴포넌트

│   │   │   └── review/      # 리뷰 관련 컴포넌트

│   │   ├── pages/           # 페이지 단위 컴포넌트

│   │   │   ├── HomePage.tsx

│   │   │   ├── ShopDetailPage.tsx

│   │   │   └── RegisterShopPage.tsx

│   │   ├── hooks/           # 커스텀 훅

│   │   ├── api/             # 백엔드 API 호출 함수

│   │   ├── types/           # TypeScript 타입 정의

│   │   ├── constants/       # 상수 값 모음

│   │   ├── utils/           # 유틸리티 함수

│   │   └── styles/          # 전역 스타일

│   ├── .env

│   ├── .env.example

│   └── package.json

│

├── backend/

│   └── src/main/kotlin/com/ramap/

│       ├── controller/      # API 엔드포인트

│       ├── service/         # 비즈니스 로직

│       ├── repository/      # MongoDB 쿼리

│       ├── model/           # MongoDB 도큐먼트 모델

│       ├── dto/             # 요청/응답 데이터 형식

│       ├── exception/       # 예외 처리

│       └── config/          # 설정 파일 (Security, CORS 등)

│   ├── .env

│   ├── .env.example

│   └── build.gradle.kts

```



\---



\## 환경변수 관리 규칙



\- 모든 민감 정보는 `.env` 파일에서 관리

\- `.env` 파일은 절대 Git에 올리지 않음 (`.gitignore`에 반드시 포함)

\- `.env.example` 파일을 만들어 어떤 변수가 필요한지 키 이름만 공유

\- 프론트엔드 환경변수는 `VITE\_` 접두사 사용 (예: `VITE\_KAKAO\_MAP\_KEY`)

\- 백엔드 환경변수 예시:

```

&#x20; MONGODB\_URI=

&#x20; KAKAO\_MAP\_KEY=

&#x20; JWT\_SECRET=

```



\---



\## 개발 현황

Phase 1~5 완료 (지도, 가게등록, 필터링, 상세페이지, 리뷰, 회원가입/로그인)

다음: 즐겨찾기, 배포

- 파일 수정/실행 등 확인이 필요한 모든 질문은 한국어로 물어볼 것