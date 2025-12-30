/**
 * 학생 점수 계산 Custom Hook
 */

import { useMemo } from 'react';
import { Student, ActivityAnalysis, SubjectAnalysis, ScoreBreakdown } from '@/types';
import {
  calculateTotalScore,
  getScoreGrade,
  generateScoreSummary,
  detectSchoolType,
} from '@/utils/scoreCalculator';

interface UseStudentScoreParams {
  student: Student | null;
  analysisText?: string;
  activities?: ActivityAnalysis[];
  subjects?: SubjectAnalysis[];
}

interface UseStudentScoreResult {
  score: number;
  breakdown: ScoreBreakdown | null;
  grade: { grade: string; label: string; color: string };
  summary: string;
  isCalculated: boolean;
  schoolType: string;
}

export function useStudentScore(params: UseStudentScoreParams): UseStudentScoreResult {
  const { student, analysisText, activities, subjects } = params;
  
  const result = useMemo(() => {
    if (!student) {
      return {
        score: 0,
        breakdown: null,
        grade: { grade: '-', label: '미계산', color: 'text-gray-400' },
        summary: '학생 정보가 없습니다.',
        isCalculated: false,
        schoolType: 'unknown',
      };
    }
    
    try {
      const breakdown = calculateTotalScore({
        student,
        analysisText,
        activities,
        subjects,
      });
      
      const grade = getScoreGrade(breakdown.totalScore);
      const summary = generateScoreSummary(breakdown);
      const schoolType = student.schoolType || detectSchoolType(student.school);
      
      return {
        score: breakdown.totalScore,
        breakdown,
        grade,
        summary,
        isCalculated: true,
        schoolType,
      };
    } catch (error) {
      console.error('Score calculation error:', error);
      return {
        score: 0,
        breakdown: null,
        grade: { grade: 'E', label: '오류', color: 'text-red-600' },
        summary: '점수 계산 중 오류가 발생했습니다.',
        isCalculated: false,
        schoolType: 'unknown',
      };
    }
  }, [student, analysisText, activities, subjects]);
  
  return result;
}

// ============================================
// 점수 비교 Hook
// ============================================
interface UseScoreComparisonParams {
  currentScore: number;
  previousScore?: number;
  averageScore?: number;
}

export function useScoreComparison(params: UseScoreComparisonParams) {
  const { currentScore, previousScore, averageScore } = params;
  
  return useMemo(() => {
    const vsAverage = averageScore 
      ? currentScore - averageScore 
      : null;
    
    const vsPrevious = previousScore 
      ? currentScore - previousScore 
      : null;
    
    const trend = vsPrevious !== null
      ? vsPrevious > 0 ? 'up' : vsPrevious < 0 ? 'down' : 'stable'
      : null;
    
    return {
      vsAverage: vsAverage ? {
        diff: vsAverage,
        isAbove: vsAverage > 0,
        label: vsAverage > 0 ? `평균 대비 +${vsAverage}점` : `평균 대비 ${vsAverage}점`,
      } : null,
      vsPrevious: vsPrevious ? {
        diff: vsPrevious,
        isImproved: vsPrevious > 0,
        label: vsPrevious > 0 ? `+${vsPrevious}점 상승` : `${vsPrevious}점 하락`,
      } : null,
      trend,
    };
  }, [currentScore, previousScore, averageScore]);
}
