import { SchoolType } from '@/types';

// ============================================
// 학교 유형별 가산점
// ============================================
export const SCHOOL_TYPE_BONUS: Record<SchoolType, number> = {
  general: 0,           // 일반고
  gangnam_8: 10,        // 강남 8학군
  foreign_language: 20, // 외고
  international: 30,    // 국제고
  science: 50,          // 과학고
  gifted: 70,           // 영재학교
  autonomous: 15,       // 자사고
  special_purpose: 25,  // 특목고 기타
};

// ============================================
// 출결 감점 기준
// ============================================
export const ATTENDANCE_DEDUCTION = {
  // 미인정 결석 일수별 감점
  ABSENCE_THRESHOLDS: [
    { days: 0, deduction: 0 },
    { days: 1, deduction: -5 },
    { days: 2, deduction: -10 },
    { days: 3, deduction: -15 },
    { days: 5, deduction: -25 },
    { days: 10, deduction: -50 },
  ],
  // 지각/조퇴/결과 3회 = 결석 1회 환산
  LATE_TO_ABSENCE_RATIO: 3,
};

// ============================================
// 키워드 가산점
// ============================================
export const KEYWORD_BONUS: Record<string, number> = {
  // 학업 관련 (세특/창체)
  '논문': 5,
  '심화': 4,
  '탐구': 4,
  '연구': 5,
  '실험': 3,
  '분석': 3,
  '발표': 2,
  '토론': 2,
  '프로젝트': 3,
  '대회': 4,
  '수상': 5,
  '1등': 5,
  '최우수': 5,
  '우수': 3,
  '장려': 2,
  
  // 인성/태도 관련 (행특)
  '예리한': 3,
  '깨닫게 됨': 3,
  '성찰': 3,
  '성장': 2,
  '발전': 2,
  '리더십': 4,
  '배려': 3,
  '협동': 2,
  '책임감': 3,
  '주도적': 4,
  '적극적': 3,
  '창의적': 4,
  '비판적': 3,
  '논리적': 3,
  
  // 특별 활동
  '봉사': 2,
  '동아리': 2,
  '임원': 3,
  '회장': 4,
  '부회장': 3,
  '학급': 2,
};

// ============================================
// 성적 등급별 점수
// ============================================
export const GRADE_SCORES: Record<number, number> = {
  1: 100,
  2: 95,
  3: 90,
  4: 80,
  5: 70,
  6: 60,
  7: 50,
  8: 40,
  9: 30,
};

// ============================================
// 대학군별 반영 과목
// ============================================
export const UNIVERSITY_SUBJECT_CONFIG = {
  // 서울대 - 음악/미술/체육 반영
  SEOUL: {
    includesArtMusic: true,
    includesPhysicalEd: true,
    weightFactor: 1.0,
  },
  // 고려대 - 음악/미술만 반영
  KOREA: {
    includesArtMusic: true,
    includesPhysicalEd: false,
    weightFactor: 0.5,
  },
  // 교대 - 전 과목 동일 반영
  EDUCATION: {
    includesArtMusic: true,
    includesPhysicalEd: true,
    weightFactor: 1.0,
  },
  // 기타 - 음미체 미반영
  OTHERS: {
    includesArtMusic: false,
    includesPhysicalEd: false,
    weightFactor: 0,
  },
};

// 음악/미술/체육 과목 목록
export const ART_MUSIC_SUBJECTS = ['음악', '미술', '음악과 생활', '미술 창작'];
export const PHYSICAL_ED_SUBJECTS = ['체육', '스포츠 생활', '운동과 건강'];

// ============================================
// 점수 범위
// ============================================
export const SCORE_CONFIG = {
  MIN_SCORE: 0,
  MAX_SCORE: 100,
  BASE_SCORE: 50, // 기본 점수
  
  // 각 영역별 최대 가산점
  MAX_SCHOOL_BONUS: 70,
  MAX_KEYWORD_BONUS: 30,
  MAX_ACTIVITY_BONUS: 20,
  MAX_ATTENDANCE_DEDUCTION: -50,
};

// ============================================
// 강남 8학군 학교 목록
// ============================================
export const GANGNAM_8_SCHOOLS = [
  '휘문고등학교',
  '중동고등학교',
  '숙명여자고등학교',
  '경기고등학교',
  '서울고등학교',
  '경기여자고등학교',
  '반포고등학교',
  '세화고등학교',
  '세화여자고등학교',
  '서초고등학교',
  '양재고등학교',
  '단대부속고등학교',
  '은광여자고등학교',
  '청담고등학교',
  '압구정고등학교',
  '진선여자고등학교',
  '영동고등학교',
  '경문고등학교',
  // ... 추가 가능
];

// ============================================
// 외고/국제고/과학고/영재학교 목록
// ============================================
export const SPECIAL_SCHOOLS = {
  foreign_language: [
    '대원외국어고등학교',
    '대일외국어고등학교',
    '명덕외국어고등학교',
    '이화외국어고등학교',
    '한영외국어고등학교',
    '서울외국어고등학교',
    // ...
  ],
  international: [
    '청심국제고등학교',
    '고양국제고등학교',
    '동탄국제고등학교',
    '세종국제고등학교',
    // ...
  ],
  science: [
    '서울과학고등학교',
    '한성과학고등학교',
    '경기과학고등학교',
    '대전과학고등학교',
    '대구과학고등학교',
    '광주과학고등학교',
    // ...
  ],
  gifted: [
    '서울영재학교',
    '경기영재학교',
    '한국과학영재학교',
    '대구영재학교',
    '대전영재학교',
    '광주영재학교',
    '세종영재학교',
    '인천영재학교',
    // ...
  ],
};
