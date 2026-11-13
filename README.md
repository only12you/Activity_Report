# Activity Report (독립 프로그램)

영업 활동(Activity) 표준화 정의에 따라 활동 유형을 고르고, 유형별 입력 양식으로 보고서를 작성·미리보기·Excel 저장하는 모바일 웹앱입니다.
**CoatOn 등 다른 앱의 파일·저장소를 참조하지 않으며, 이 폴더만 올리면 단독으로 동작합니다.**

## 폴더 구성
| 경로 | 역할 |
|---|---|
| `index.html` | 화면 틀(스크립트·스타일 연결만) |
| `css/app.css` | 전체 스타일 |
| `js/01-types.js` | 활동 유형(구분 A~I)·세부 유형 정의 |
| `js/02-store.js` | 보관함(저장·미리보기·백업, IndexedDB) |
| `js/03-forms-core.js` | A1·A2 입력 양식(개요 OCR, 자재 표, Excel) |
| `js/04-icons.js` | 카드 일러스트·아이콘(인라인 SVG) |
| `js/05-forms-std.js` | B~H 표준 입력 양식·Excel |
| `js/06-decorate.js` | 입력 화면 디자인 레이어(카드·타일·하단 바) |
| `js/07-app.js` | 홈·활동 분류표·보관함 화면 흐름 |
| `js/08-material.js` | 자재정보 입력(제품·사양 DB 선택) |
| `js/09-pwa.js`, `sw.js`, `manifest.webmanifest` | 오프라인·설치(PWA) |
| `vendor/ocr/` | 사진 글자 읽기(Tesseract.js 5.1.1 · 한글/영문 데이터) — **인터넷 없이 동작, 폴더째 올려야 함** |
| `tools/check.js` | 문법 점검 (`node tools/check.js`) |

## 개요판 사진 자동 입력(OCR)
- Claude 앱 아트팩트에서는 Claude 이미지 인식을 쓰고, GitHub Pages 등 그 밖에서는 `vendor/ocr/`의 내장 글자 읽기를 씁니다(서버·키 불필요, 처음 한 번 언어 데이터 로딩에 수십 초).
- 표의 선을 지우고 줄 단위로 읽은 뒤 라벨(공사명·위치·건축주·연면적 등)로 항목을 채웁니다. 노란 칸은 꼭 확인하세요.

## 제품·사양 DB
앱 안에 저장합니다(브라우저 저장소 `ar:pdb`, `ar:sdb`). 자재정보 입력 화면의 **제품·사양 DB 파일(JSON) 불러오기**로 넣고, 바뀌면 같은 방법으로 다시 불러옵니다.

## 실행
정적 파일이라 서버 없이 올리면 됩니다(GitHub Pages 등). 로컬 확인: `python3 -m http.server` 후 `index.html`.

## 변경 이력
- 2026.11.13 v1 — CoatOn에서 완전 분리. 코드를 파일별로 분리하고 CoatOn 연동(DB 자동 복사·복귀 버튼) 제거. 활동 분류표 화면, A1/A2 입력 화면 리디자인 포함.
- 2026.11.13 v1.1 — GitHub 등 Claude 밖에서 사진 자동 입력이 동작하도록 수정: 글자 읽기 도구를 `vendor/ocr/`에 포함(외부 CDN 불필요), 표 선 제거·읽기 방식(PSM 4/11)·해상도 지정으로 인식 개선, 개요판 형태 우선 해석.
