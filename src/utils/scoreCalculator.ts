/**
 * 생기부 점수 산출 로직
 * 학생의 생기부 데이터를 분석하여 점수를 계산합니다.
 */

import {
  Student,
  SchoolType,
  AttendanceRecord,
  GradeRecord,
  ScoreBreakdown,
  ScoreDetail,
  ActivityAnalysis,
  SubjectAnalysis,
} from '@/types';

import {
  SCHOOL_TYPE_BONUS,
  ATTENDANCE_DEDUCTION,
  KEYWORD_BONUS,
  GRADE_SCORES,
  UNIVERSITY_SUBJECT_CONFIG,
  ART_MUSIC_SUBJECTS,
  PHYSICAL_ED_SUBJECTS,
  SCORE_CONFIG,
  GANGNAM_8_SCHOOLS,
  SPECIAL_SCHOOLS,
} from '@/constants/scoreConfig';

// ============================================
// 학교 유형 자동 판별
// ============================================
export function detectSchoolType(schoolName: string): SchoolType {
  // 영재학교 체크
  for (const school of SPECIAL_SCHOOLS.gifted) {
    if (schoolName.includes(school) || school.includes(schoolName)) {
      return 'gifted';
    }
  }
  
  // 과학고 체크
  for (const school of SPECIAL_SCHOOLS.science) {
    if (schoolName.includes(school) || school.includes(schoolName)) {
      return 'science';
    }
  }
  
  // 국제고 체크
  for (const school of SPECIAL_SCHOOLS.international) {
    if (schoolName.includes(school) || school.includes(schoolName)) {
      return 'international';
    }
  }
  
  // 외고 체크
  for (const school of SPECIAL_SCHOOLS.foreign_language) {
    if (schoolName.includes(school) || school.includes(schoolName)) {
      return 'foreign_language';
    }
  }
  
  // 외고 키워드 체크
  if (schoolName.includes('외국어고') || schoolName.includes('외고')) {
    return 'foreign_language';
  }
  
  // 국제고 키워드 체크
  if (schoolName.includes('국제고')) {
    return 'international';
  }
  
  // 과학고 키워드 체크
  if (schoolName.includes('과학고') || schoolName.includes('과고')) {
    return 'science';
  }
  
  // 자사고 키워드 체크
  if (schoolName.includes('자율형사립')) {
    return 'autonomous';
  }
  
  // 강남 8학군 체크
  for (const school of GANGNAM_8_SCHOOLS) {
    if (schoolName.includes(school) || school.includes(schoolName)) {
      return 'gangnam_8';
    }
  }
  
  return 'general';
}

// ============================================
// 학교 유형 가산점 계산
// ============================================
export function calculateSchoolTypeBonus(schoolType: SchoolType): ScoreDetail {
  const bonus = SCHOOL_TYPE_BONUS[schoolType] || 0;
  
  const schoolTypeNames: Record<SchoolType, string> = {
    general: '일반고',
    gangnam_8: '강남 8학군',
    foreign_language: '외국어고',
    international: '국제고',
    science: '과학고',
    gifted: '영재학교',
    autonomous: '자율형사립고',
    special_purpose: '특수목적고',
  };
  
  return {
    category: '학교유형',
    description: schoolTypeNames[schoolType],
    points: bonus,
    reason: bonus > 0 
      ? `${schoolTypeNames[schoolType]} 재학으로 +${bonus}점 가산`
      : '일반고 (가산점 없음)',
  };
}

// ============================================
// 출결 감점 계산
// ============================================
export function calculateAttendanceDeduction(
  attendance: AttendanceRecord | undefined
): ScoreDetail {
  if (!attendance) {
    return {
      category: '출결',
      description: '출결 정보 없음',
      points: 0,
      reason: '출결 정보가 제공되지 않음',
    };
  }
  
  const { absenceUnexcused, lateCount, earlyLeaveCount, classAbsenceCount } = attendance;
  
  // 지각/조퇴/결과 3회 = 결석 1회 환산
  const convertedAbsences = Math.floor(
    (lateCount + earlyLeaveCount + classAbsenceCount) / ATTENDANCE_DEDUCTION.LATE_TO_ABSENCE_RATIO
  );
  
  const totalAbsences = absenceUnexcused + convertedAbsences;
  
  // 감점 계산
  let deduction = 0;
  for (const threshold of ATTENDANCE_DEDUCTION.ABSENCE_THRESHOLDS) {
    if (totalAbsences >= threshold.days) {
      deduction = threshold.deduction;
    }
  }
  
  // 최대 감점 제한
  deduction = Math.max(deduction, SCORE_CONFIG.MAX_ATTENDANCE_DEDUCTION);
  
  let reason = '';
  if (totalAbsences === 0) {
    reason = '무결석 (감점 없음)';
  } else {
    reason = `미인정 결석 ${absenceUnexcused}일`;
    if (convertedAbsences > 0) {
      reason += ` + 환산 결석 ${convertedAbsences}일 (지각${lateCount}/조퇴${earlyLeaveCount}/결과${classAbsenceCount})`;
    }
    reason += ` = 총 ${totalAbsences}일 → ${deduction}점`;
  }
  
  return {
    category: '출결',
    description: `총 결석 ${totalAbsences}일`,
    points: deduction,
    reason,
  };
}

// ============================================
// 키워드 가산점 계산
// ============================================
export function calculateKeywordBonus(
  text: string,
  activities?: ActivityAnalysis[],
  subjects?: SubjectAnalysis[]
): ScoreDetail {
  const foundKeywords: Array<{ keyword: string; count: number; points: number }> = [];
  let totalBonus = 0;
  
  // 전체 텍스트 검색
  const searchText = text.toLowerCase();
  
  for (const [keyword, points] of Object.entries(KEYWORD_BONUS)) {
    const regex = new RegExp(keyword, 'gi');
    const matches = searchText.match(regex);
    if (matches && matches.length > 0) {
      // 같은 키워드는 최대 3회까지만 인정
      const count = Math.min(matches.length, 3);
      const keywordPoints = points * count;
      foundKeywords.push({ keyword, count, points: keywordPoints });
      totalBonus += keywordPoints;
    }
  }
  
  // 활동 분석에서 키워드 추출
  if (activities) {
    for (const activity of activities) {
      const activityText = `${activity.title} ${activity.description} ${activity.evaluation}`;
      for (const [keyword, points] of Object.entries(KEYWORD_BONUS)) {
        if (activityText.includes(keyword) && !foundKeywords.find(k => k.keyword === keyword)) {
          foundKeywords.push({ keyword, count: 1, points });
          totalBonus += points;
        }
      }
    }
  }

  // 과목 분석에서 키워드 추출
  if (subjects) {
    for (const subject of subjects) {
      const subjectText = `${subject.feedback} ${(subject.keywords || []).join(' ')}`;
      for (const [keyword, points] of Object.entries(KEYWORD_BONUS)) {
        if (subjectText.includes(keyword) && !foundKeywords.find(k => k.keyword === keyword)) {
          foundKeywords.push({ keyword, count: 1, points });
          totalBonus += points;
        }
      }
    }
  }
  
  // 최대 가산점 제한
  totalBonus = Math.min(totalBonus, SCORE_CONFIG.MAX_KEYWORD_BONUS);
  
  const topKeywords = foundKeywords
    .sort((a, b) => b.points - a.points)
    .slice(0, 5);
  
  return {
    category: '키워드',
    description: `발견된 키워드 ${foundKeywords.length}개`,
    points: totalBonus,
    reason: topKeywords.length > 0
      ? `주요 키워드: ${topKeywords.map(k => `${k.keyword}(+${k.points})`).join(', ')}`
      : '특별 키워드 미발견',
  };
}

// ============================================
// 성적 점수 계산
// ============================================
export function calculateGradeScore(
  grades: GradeRecord[] | undefined,
  targetUniversity?: string
): ScoreDetail {
  if (!grades || grades.length === 0) {
    return {
      category: '성적',
      description: '성적 정보 없음',
      points: SCORE_CONFIG.BASE_SCORE,
      reason: '성적 정보가 제공되지 않아 기본 점수 부여',
    };
  }
  
  // 대학군별 설정 결정
  let config = UNIVERSITY_SUBJECT_CONFIG.OTHERS;
  if (targetUniversity) {
    const upperTarget = targetUniversity.toUpperCase();
    if (upperTarget.includes('서울대') || upperTarget.includes('SNU')) {
      config = UNIVERSITY_SUBJECT_CONFIG.SEOUL;
    } else if (upperTarget.includes('고려대') || upperTarget.includes('KOREA')) {
      config = UNIVERSITY_SUBJECT_CONFIG.KOREA;
    } else if (upperTarget.includes('교대') || upperTarget.includes('교육대')) {
      config = UNIVERSITY_SUBJECT_CONFIG.EDUCATION;
    }
  }
  
  // 과목별 점수 계산
  let totalScore = 0;
  let subjectCount = 0;
  const excludedSubjects: string[] = [];
  
  for (const grade of grades) {
    const isArtMusic = ART_MUSIC_SUBJECTS.some(s => grade.subject.includes(s));
    const isPhysicalEd = PHYSICAL_ED_SUBJECTS.some(s => grade.subject.includes(s));
    
    // 음미체 반영 여부 확인
    if (isArtMusic && !config.includesArtMusic) {
      excludedSubjects.push(grade.subject);
      continue;
    }
    if (isPhysicalEd && !config.includesPhysicalEd) {
      excludedSubjects.push(grade.subject);
      continue;
    }
    
    const gradeScore = GRADE_SCORES[grade.grade] || 50;
    const weight = (isArtMusic || isPhysicalEd) ? config.weightFactor : 1;
    
    totalScore += gradeScore * weight;
    subjectCount += weight;
  }
  
  const averageScore = subjectCount > 0 ? Math.round(totalScore / subjectCount) : SCORE_CONFIG.BASE_SCORE;
  
  return {
    category: '성적',
    description: `평균 ${averageScore}점 (${grades.length}과목)`,
    points: averageScore,
    reason: excludedSubjects.length > 0
      ? `제외 과목: ${excludedSubjects.join(', ')} (${targetUniversity || '일반'} 기준)`
      : '전 과목 반영',
  };
}

// ============================================
// 활동 점수 계산
// ============================================
export function calculateActivityScore(
  activities: ActivityAnalysis[] | undefined
): ScoreDetail {
  if (!activities || activities.length === 0) {
    return {
      category: '비교과',
      description: '활동 정보 없음',
      points: 0,
      reason: '비교과 활동 정보가 제공되지 않음',
    };
  }
  
  const totalScore = activities.reduce((sum, a) => sum + (a.score || 0), 0);
  const averageScore = Math.round(totalScore / activities.length);
  
  // 활동 다양성 보너스
  const categories = new Set(activities.map(a => a.category));
  const diversityBonus = Math.min(categories.size * 2, 10);
  
  const finalScore = Math.min(averageScore + diversityBonus, SCORE_CONFIG.MAX_ACTIVITY_BONUS + averageScore);
  
  return {
    category: '비교과',
    description: `${activities.length}개 활동, 평균 ${averageScore}점`,
    points: finalScore,
    reason: `활동 점수 ${averageScore}점 + 다양성 보너스 ${diversityBonus}점 (${categories.size}개 분야)`,
  };
}

// ============================================
// 종합 점수 계산
// ============================================
export interface ScoreCalculationInput {
  student: Student;
  analysisText?: string;
  activities?: ActivityAnalysis[];
  subjects?: SubjectAnalysis[];
}

export function calculateTotalScore(input: ScoreCalculationInput): ScoreBreakdown {
  const { student, analysisText = '', activities, subjects } = input;
  
  // 학교 유형 자동 판별 (없으면)
  const schoolType = student.schoolType || detectSchoolType(student.school);
  
  // 각 영역별 점수 계산
  const schoolBonus = calculateSchoolTypeBonus(schoolType);
  const attendanceDeduction = calculateAttendanceDeduction(student.attendance);
  const keywordBonus = calculateKeywordBonus(analysisText, activities, subjects);
  const gradeScore = calculateGradeScore(student.grades, student.targetUniversity);
  const activityScore = calculateActivityScore(activities);
  
  // 상세 내역
  const details: ScoreDetail[] = [
    schoolBonus,
    attendanceDeduction,
    keywordBonus,
    gradeScore,
    activityScore,
  ];
  
  // 기본 점수 + 각 영역 점수/감점
  const baseScore = SCORE_CONFIG.BASE_SCORE;
  const totalScore = Math.max(
    SCORE_CONFIG.MIN_SCORE,
    Math.min(
      SCORE_CONFIG.MAX_SCORE,
      baseScore +
      schoolBonus.points +
      attendanceDeduction.points +
      keywordBonus.points +
      (gradeScore.points - SCORE_CONFIG.BASE_SCORE) + // 성적은 기준점 대비 가감
      activityScore.points
    )
  );
  
  return {
    baseScore,
    schoolTypeBonus: schoolBonus.points,
    attendanceDeduction: attendanceDeduction.points,
    keywordBonus: keywordBonus.points,
    gradeScore: gradeScore.points,
    activityScore: activityScore.points,
    specialBonus: 0, // 추후 확장용
    totalScore,
    details,
  };
}

// ============================================
// 점수 등급 변환
// ============================================
export function getScoreGrade(score: number): {
  grade: string;
  label: string;
  color: string;
} {
  if (score >= 90) return { grade: 'A+', label: '최우수', color: 'text-green-600' };
  if (score >= 85) return { grade: 'A', label: '우수', color: 'text-green-500' };
  if (score >= 80) return { grade: 'B+', label: '양호', color: 'text-blue-600' };
  if (score >= 75) return { grade: 'B', label: '보통 상', color: 'text-blue-500' };
  if (score >= 70) return { grade: 'C+', label: '보통', color: 'text-yellow-600' };
  if (score >= 65) return { grade: 'C', label: '보통 하', color: 'text-yellow-500' };
  if (score >= 60) return { grade: 'D+', label: '미흡', color: 'text-orange-500' };
  if (score >= 55) return { grade: 'D', label: '부족', color: 'text-orange-600' };
  return { grade: 'F', label: '매우 부족', color: 'text-red-600' };
}

// ============================================
// 점수 요약 생성
// ============================================
export function generateScoreSummary(breakdown: ScoreBreakdown): string {
  const { totalScore, details } = breakdown;
  const { grade, label } = getScoreGrade(totalScore);
  
  const positiveFactors = details.filter(d => d.points > 0);
  const negativeFactors = details.filter(d => d.points < 0);
  
  let summary = `종합 점수 ${totalScore}점 (${grade}, ${label})\n\n`;
  
  if (positiveFactors.length > 0) {
    summary += '▲ 강점:\n';
    positiveFactors.forEach(f => {
      summary += `  • ${f.category}: ${f.reason}\n`;
    });
  }
  
  if (negativeFactors.length > 0) {
    summary += '\n▼ 개선 필요:\n';
    negativeFactors.forEach(f => {
      summary += `  • ${f.category}: ${f.reason}\n`;
    });
  }
  
  return summary;
}
