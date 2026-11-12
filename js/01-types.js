// 표준화 유형 데이터 — Activity 표준화 정의 사진 기준 (양식이 준비된 서브유형은 forms.js 의 READY 참고)
window.ACTIVITY_TYPES = [
  { code: 'A', name: '현장 판촉', title: '현장 판촉', icon: 'roller', color: '#3b82f6', subs: ['건축 현장', '재도장 현장', '정비사업 현장'] },
  { code: 'B', name: '거래처 판촉', title: '거래처 판촉', icon: 'building', color: '#84cc16', subs: ['신규 거래처', '재거래', '조달 수주업체', '기존 거래처'] },
  { code: 'C', name: '상품 판매 확대', title: '상품 판매 확대', icon: 'cans', color: '#f59e0b', subs: ['프로젝트 상품 소싱', '매입처 다변화', '전략상품 판매확대'] },
  { code: 'D', name: '크로스오버', title: 'Cross Over', icon: 'tray', color: '#8b5cf6', subs: ['거래처 교차', '현장 연계 교차'] },
  { code: 'E', name: '사업부 중점 운영', title: '사업부 전략', icon: 'helmet', color: '#14b8a6', subs: ['내외장재', '보온재', '창호/수주', '유통도료', '공업'] },
  { code: 'F', name: '사업부 건의사항', title: '사업부 건의사항', icon: 'handshake', color: '#6366f1', subs: ['시스템 개선', '판촉/홍보 지원', '품질/물류/수급 개선', '단가 지원'] },
  { code: 'G', name: '제품개발/상품도입', title: '제품개발/상품도입', icon: 'chart', color: '#22c55e', subs: ['제품 개선/개발', '신규 상품 도입'] },
  { code: 'H', name: '보고사항', title: '보고사항', icon: 'clipboard', color: '#d946ef', subs: ['실적분석/운영계획', '채권 관리', '재고 관리', '출장 보고', '시장/경쟁사 주요 정보', '직판 수주 현황'] },
  { code: 'I', name: '지점장 Activity', title: '지점장 Activity', icon: 'map', color: '#06b6d4', subs: [], direct: true }
];
