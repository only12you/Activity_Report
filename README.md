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
| `tools/check.js` | 문법 점검 (`node tools/check.js`) |

## 제품·사양 DB
앱 안에 저장합니다(브라우저 저장소 `ar:pdb`, `ar:sdb`). 자재정보 입력 화면의 **제품·사양 DB 파일(JSON) 불러오기**로 넣고, 바뀌면 같은 방법으로 다시 불러옵니다.

## 실행
정적 파일이라 서버 없이 올리면 됩니다(GitHub Pages 등). 로컬 확인: `python3 -m http.server` 후 `index.html`.

## 변경 이력
- 2026.11.13 v1 — CoatOn에서 완전 분리. 코드를 파일별로 분리하고 CoatOn 연동(DB 자동 복사·복귀 버튼) 제거. 활동 분류표 화면, A1/A2 입력 화면 리디자인 포함.
