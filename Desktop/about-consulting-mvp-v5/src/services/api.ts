/**
 * API Service - Mock-First, Real-Ready Architecture
 * 
 * USE_MOCK_API = true  → 로컬 Mock 데이터 사용 (데모용)
 * USE_MOCK_API = false → 실제 백엔드 API 호출
 */

import type { 
  LoginRequest, 
  LoginResponse, 
  User,
  StudentCreateRequest,
  UniversityRequest,
  AnalysisResult 
} from '@/types';

// ============================================
// Configuration
// ============================================

export const USE_MOCK_API = true; // 데모 모드
const API_BASE_URL = '/api'; // next.config.mjs proxy를 통해 백엔드로 연결
const MOCK_DELAY = 800; // 실감나는 로딩을 위한 지연

// ============================================
// Token Management
// ============================================

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    localStorage.setItem('access_token', token);
  } else {
    localStorage.removeItem('access_token');
  }
};

export const getAuthToken = (): string | null => {
  if (authToken) return authToken;
  if (typeof window !== 'undefined') {
    authToken = localStorage.getItem('access_token');
  }
  return authToken;
};

// ============================================
// HTTP Client with Auth Header
// ============================================

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
}

async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const token = getAuthToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Always send Authorization header if token exists (Production Ready)
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

async function apiFormData<T>(endpoint: string, formData: FormData): Promise<T> {
  const token = getAuthToken();
  
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

// ============================================
// Mock Helper
// ============================================

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================
// Auth Service
// ============================================

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    if (USE_MOCK_API) {
      await delay(MOCK_DELAY);
      const mockToken = 'mock_jwt_token_' + Date.now();
      setAuthToken(mockToken);
      return {
        access_token: mockToken,
        token_type: 'bearer',
        user: {
          id: 'consultant-1',
          name: '김수현',
          email: credentials.email,
          role: 'consultant',
        },
      };
    }

    const response = await apiRequest<LoginResponse>('/auth/login/', {
      method: 'POST',
      body: credentials,
    });
    
    if (response.access_token) {
      setAuthToken(response.access_token);
    }
    
    return response;
  },

  logout() {
    setAuthToken(null);
  },
};

// ============================================
// Student Service
// ============================================

export const studentService = {
  async create(data: StudentCreateRequest): Promise<{ student_id: number }> {
    if (USE_MOCK_API) {
      await delay(MOCK_DELAY);
      return { student_id: 999 };
    }

    return apiRequest('/students/', {
      method: 'POST',
      body: data,
    });
  },
};

// ============================================
// University Service
// ============================================

export const universityService = {
  async add(studentId: number, data: UniversityRequest): Promise<{ id: number }> {
    if (USE_MOCK_API) {
      await delay(200);
      return { id: Math.floor(Math.random() * 1000) };
    }

    return apiRequest(`/students/${studentId}/universities/`, {
      method: 'POST',
      body: data,
    });
  },
};

// ============================================
// Document Service
// ============================================

export const documentService = {
  async upload(studentId: number, file: File): Promise<{ document_id: number }> {
    if (USE_MOCK_API) {
      await delay(MOCK_DELAY * 2);
      return { document_id: 500 };
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('student_id', studentId.toString());

    return apiFormData(`/documents/upload/`, formData);
  },

  async analyze(documentId: number): Promise<{ analysis_id: number }> {
    if (USE_MOCK_API) {
      await delay(MOCK_DELAY * 3);
      return { analysis_id: 777 };
    }

    return apiRequest(`/documents/${documentId}/analyze/`, {
      method: 'POST',
    });
  },
};

// ============================================
// Analysis Service
// ============================================

export const analysisService = {
  async getResult(documentId: string): Promise<AnalysisResult> {
    if (USE_MOCK_API) {
      await delay(MOCK_DELAY);
      return MOCK_ANALYSIS_RESULT;
    }

    try {
      const result = await apiRequest<AnalysisResult>(`/analysis/${documentId}/`);
      return result;
    } catch {
      // Fallback to mock data if API fails
      console.warn('API failed, using fallback data');
      return MOCK_ANALYSIS_RESULT;
    }
  },
};

// ============================================
// Full Analysis Flow (Demo Scenario)
// ============================================

type ProgressCallback = (progress: number, message: string) => void;

export async function executeFullAnalysisFlow(
  studentData: StudentCreateRequest,
  universities: UniversityRequest[],
  file: File,
  onProgress?: ProgressCallback
): Promise<{ documentId: number; analysisId: number }> {
  
  // Step 1: Create Student (0-20%)
  onProgress?.(5, '학생 정보 등록 중...');
  const studentResult = await studentService.create(studentData);
  const studentId = studentResult.student_id;
  onProgress?.(20, '학생 정보 등록 완료');

  // Step 2: Add Universities (20-40%)
  onProgress?.(25, '희망 대학 등록 중...');
  for (let i = 0; i < universities.length; i++) {
    await universityService.add(studentId, universities[i]);
    onProgress?.(25 + (i + 1) * 2.5, `대학 등록 중... (${i + 1}/${universities.length})`);
  }
  onProgress?.(40, '희망 대학 등록 완료');

  // Step 3: Upload Document (40-60%)
  onProgress?.(45, 'PDF 문서 업로드 중...');
  const uploadResult = await documentService.upload(studentId, file);
  const documentId = uploadResult.document_id;
  onProgress?.(60, '문서 업로드 완료');

  // Step 4: Analyze Document (60-95%)
  onProgress?.(65, 'AI 분석 시작...');
  
  // Simulate progressive analysis
  const analysisSteps = [
    { progress: 70, message: '생기부 텍스트 추출 중...' },
    { progress: 75, message: '학업 역량 분석 중...' },
    { progress: 80, message: '진로 적합성 평가 중...' },
    { progress: 85, message: '대학별 합격 가능성 계산 중...' },
    { progress: 90, message: '종합 리포트 생성 중...' },
  ];

  for (const step of analysisSteps) {
    await delay(USE_MOCK_API ? 600 : 100);
    onProgress?.(step.progress, step.message);
  }

  const analysisResult = await documentService.analyze(documentId);
  
  // Step 5: Complete (95-100%)
  onProgress?.(95, '분석 완료!');
  await delay(300);
  onProgress?.(100, '결과 페이지로 이동합니다...');

  return {
    documentId,
    analysisId: analysisResult.analysis_id,
  };
}

// ============================================
// Mock Analysis Result (Fallback Data)
// ============================================

export const MOCK_ANALYSIS_RESULT: AnalysisResult = {
  student_name: '김시연',
  school: '한국고등학교',
  consultant_name: '김수현',
  analysis_date: new Date().toISOString().split('T')[0],

  종합분석: {
    종합점수: 88,
    종합의견: '지원자는 뚜렷한 이공계 성향과 우수한 수리적 역량을 보유한 학생입니다. 수학과 과학 교과에서의 지속적인 성취도 향상이 돋보이며, 특히 탐구 활동에서 보여준 주도성과 논리적 사고력은 컴퓨터공학 전공에 매우 적합한 자질입니다. 다만, 인문학적 소양과 사회 문제에 대한 관심을 확대하여 융합적 시각을 기르는 것이 권장됩니다.',
    수시카드: {
      경로A: [
        { 대학: '서울대학교', 학과: '컴퓨터공학부', 전형: '일반전형', 판단: '소신' },
        { 대학: '연세대학교', 학과: '컴퓨터과학과', 전형: '활동우수형', 판단: '적정' },
        { 대학: '고려대학교', 학과: '컴퓨터학과', 전형: '학업우수형', 판단: '적정' },
        { 대학: '성균관대학교', 학과: '소프트웨어학과', 전형: '학과모집', 판단: '안정' },
        { 대학: '한양대학교', 학과: '컴퓨터소프트웨어학부', 전형: '일반', 판단: '안정' },
        { 대학: '서강대학교', 학과: '컴퓨터공학과', 전형: '일반형', 판단: '안정' },
      ],
      경로B: [
        { 대학: '서울대학교', 학과: '컴퓨터공학부', 전형: '지역균형', 판단: '상향' },
        { 대학: '연세대학교', 학과: '컴퓨터과학과', 전형: '추천형', 판단: '소신' },
        { 대학: '고려대학교', 학과: '컴퓨터학과', 전형: '계열적합형', 판단: '적정' },
        { 대학: '성균관대학교', 학과: '소프트웨어학과', 전형: '계열모집', 판단: '적정' },
        { 대학: '한양대학교', 학과: '컴퓨터소프트웨어학부', 전형: '추천형', 판단: '안정' },
        { 대학: '서강대학교', 학과: '컴퓨터공학과', 전형: '종합형', 판단: '안정' },
      ],
    },
    진로적합도: [
      { 대학: '서울대학교 컴퓨터공학부', 적합도: 82 },
      { 대학: '연세대학교 컴퓨터과학과', 적합도: 87 },
      { 대학: '고려대학교 컴퓨터학과', 적합도: 85 },
      { 대학: '성균관대학교 소프트웨어학과', 적합도: 91 },
      { 대학: '한양대학교 컴퓨터소프트웨어학부', 적합도: 89 },
      { 대학: '서강대학교 컴퓨터공학과', 적합도: 88 },
    ],
    긍정적요소: [
      '수학 교과 전 학기 1등급 유지로 수리적 기초 역량 탁월',
      '정보 동아리에서 3년간 활동하며 프로그래밍 경험 축적',
      '교내 과학탐구대회 입상 등 탐구 활동 실적 우수',
      '자기주도적 프로젝트 수행 경험으로 문제해결력 입증',
    ],
    개선필요사항: [
      '국어 교과 성적의 변동폭이 크므로 안정화 필요',
      '봉사활동 시간이 다소 부족하여 확대 권장',
      '인문·사회 분야 독서 활동 다양화 필요',
      '영어 말하기 역량 강화를 위한 활동 추가 권장',
    ],
    학부모님께드리는조언: '자녀분은 명확한 진로 목표와 이를 뒷받침하는 학업 역량을 갖추고 있습니다. 3학년 남은 기간 동안 내신 관리와 함께 자기소개서 작성을 위한 활동 정리에 집중하시기 바랍니다. 특히 컴퓨터공학 분야의 최신 트렌드에 대한 관심을 유지하도록 격려해 주시고, 면접 대비를 위한 시사 이슈 토론 연습도 함께 진행하시면 좋겠습니다.',
    학생에게드리는응원: '시연 학생, 지금까지 꾸준히 노력해온 모습이 정말 대단합니다! 목표를 향해 한 걸음씩 나아가는 당신의 모습은 이미 훌륭한 개발자의 자질을 보여주고 있어요. 남은 기간, 조금 힘들더라도 지금처럼만 해준다면 분명 좋은 결과가 있을 거예요. 화이팅!',
    목표대학종합의견: '상위권 대학 컴퓨터공학과 지원에 적합한 학생입니다. 학업 성취도와 비교과 활동이 균형 있게 갖춰져 있으며, 특히 전공 적합성을 보여주는 활동들이 잘 정리되어 있습니다. 다만 최상위권 대학 지원을 위해서는 국어 성적 향상과 함께 차별화된 탐구 활동 추가를 권장합니다.',
    추천방학계획: [
      {
        시기: '여름방학',
        활동: [
          '코딩 부트캠프 참여 (알고리즘 심화)',
          '교내 SW 경진대회 준비',
          '전공 관련 도서 3권 이상 독서',
          '자기소개서 초안 작성',
        ],
      },
      {
        시기: '겨울방학',
        활동: [
          '면접 대비 스터디 참여',
          '포트폴리오 정리 및 보완',
          '모의 면접 연습 (주 2회)',
          '대학별 기출문제 분석',
        ],
      },
    ],
  },

  성적분석: {
    성적요약: {
      최고등급: '1.0 (수학)',
      성적추이: '상승세',
      반영과목: 8,
      등급변화: '+0.3',
    },
    단기목표: '3학년 1학기 전과목 평균 1.5등급 이내 진입',
    장기목표: '수시 6개 대학 모두 1단계 통과, 최종 2개 이상 합격',
    과목별성적: [
      { 과목: '국어', 등급: [2, 3, 2, 2, 2] },
      { 과목: '수학', 등급: [1, 1, 1, 1, 1] },
      { 과목: '영어', 등급: [2, 2, 2, 1, 1] },
      { 과목: '물리학', 등급: [2, 2, 1, 1, 1] },
      { 과목: '화학', 등급: [2, 2, 2, 2, 1] },
      { 과목: '정보', 등급: [1, 1, 1, 1, 1] },
      { 과목: '사회', 등급: [3, 3, 2, 2, 2] },
      { 과목: '한국사', 등급: [2, 2, 2, 2, 2] },
    ],
    성적강점: [
      '수학 교과 전 학기 1등급으로 최상위 수준 유지',
      '정보 교과에서 일관된 1등급 성취',
      '과학 탐구 영역(물리, 화학) 꾸준한 상승세',
      '영어 교과 최근 2개 학기 1등급 달성',
    ],
    성적약점: [
      '국어 교과 2~3등급 변동, 안정성 부족',
      '사회 교과 상대적으로 낮은 성취도',
      '1학년 초기 성적 다소 불안정',
    ],
    성적보완방안: {
      한줄요약: '국어 교과 집중 보완과 사회 교과 기본 개념 정리 필요',
      본문: '국어 교과의 경우 비문학 독해 훈련을 통해 안정적인 성적 유지가 가능합니다. 매일 30분씩 비문학 지문 2개 풀이를 권장하며, 오답 분석 노트를 작성하여 취약 유형을 파악하세요. 사회 교과는 핵심 개념 정리와 함께 시사 이슈와 연계한 학습이 효과적입니다.',
    },
  },

  생기부분석: {
    생기부_진단개요: '탁월한 수리/과학적 탐구 역량을 보유한 학생으로, 컴퓨터공학 전공에 높은 적합성을 보입니다. 특히 자기주도적 프로젝트 수행 경험과 동아리 활동에서의 리더십이 돋보입니다. 다만, 인문학적 소양과 사회적 관심 영역의 확대가 필요하며, 이를 통해 융합적 사고력을 갖춘 인재로 성장할 수 있을 것입니다.',
    강점요약: [
      '수학적 원리를 실생활 문제 해결에 적용하는 응용력이 뛰어나며, 수업 시간 중 제시한 창의적 풀이법이 교사와 동료 학생들에게 긍정적 평가를 받음',
      '동아리 활동에서 부원들의 의견을 조율하고 프로젝트를 이끄는 리더십 발휘. 3년간 정보 동아리 활동을 통해 팀워크와 협업 능력 입증',
      '독서 활동의 스펙트럼이 넓고 깊이 있는 사고를 보여줌. 읽은 책의 내용을 자신의 진로와 연결 짓는 통찰력 보유',
    ],
    약점요약: [
      '자율활동 기록에서 학급 내 역할이 구체적으로 드러나지 않음. 학급 특색 활동 참여 내용 보완 필요',
      '봉사활동이 단순 시간 채우기에 그치는 경향. 전공과 연계된 재능기부 형태의 봉사활동 권장',
      '진로활동에서 직접 체험한 활동보다 조사/발표 위주의 기록이 많음. 실질적인 체험 활동 추가 필요',
    ],
    진로적합성_강화방안: {
      강화방안: {
        한줄요약: '사회 문제 해결을 위한 알고리즘 설계 프로젝트 수행 권장',
        설명: '기술이 사회에 미치는 영향을 고려한 프로젝트 경험이 필요합니다. 단순 코딩 능력을 넘어, 기술을 통해 실제 문제를 해결하는 경험은 면접에서 큰 강점이 됩니다.',
        단계별_방안: [
          '관심 있는 사회 문제 선정 및 분석 (환경, 교육, 의료 등)',
          '문제 해결을 위한 알고리즘 또는 앱 기획 및 설계',
          '프로토타입 개발 및 실제 적용 테스트',
        ],
      },
      비교과_지도필요_영역: {
        한줄요약: '자율 활동 내 "학급 특색 활동" 보완 필요',
        설명: '본인의 전공 적성을 살려 학급 내에서 IT 관련 역할을 맡는 것이 좋습니다. 예를 들어 학급 홈페이지 제작, 디지털 기기 관리 등의 활동을 통해 리더십과 전공 역량을 동시에 보여줄 수 있습니다.',
        프로젝트_추천: [
          {
            제목: 'AI 기반 학습 도우미 챗봇 개발',
            내용: '학급 친구들의 학습을 돕는 간단한 챗봇을 개발하여 실용적인 프로젝트 경험 축적',
          },
          {
            제목: '환경 데이터 분석 프로젝트',
            내용: '학교 주변 환경 데이터를 수집/분석하여 환경 문제에 대한 인식 제고 활동',
          },
          {
            제목: '교내 행사 관리 앱 개발',
            내용: '학교 행사 일정과 정보를 관리하는 앱을 개발하여 학교 커뮤니티에 기여',
          },
        ],
      },
      전공_관련_탐구_및_독서활동: {
        설명: '인공지능의 윤리적 쟁점을 다룬 도서를 읽고, 기술의 사회적 책임에 대해 고민한 흔적을 보여주세요. 이는 단순 기술자가 아닌 사회적 책임을 인식하는 개발자로서의 자질을 어필할 수 있습니다.',
        책_추천: [
          {
            제목: '인공지능과 딥러닝',
            저자: '마쓰오 유타카',
            이유: 'AI 기초 개념을 탄탄히 하면서 미래 기술 트렌드 파악에 도움',
          },
          {
            제목: '알고리즘이 욕망하는 것들',
            저자: '에드 핀',
            이유: '알고리즘의 사회적 영향력에 대한 비판적 시각 형성',
          },
          {
            제목: '이것이 취업을 위한 코딩테스트다',
            저자: '나동빈',
            이유: '실전 알고리즘 학습으로 문제 해결 능력 강화',
          },
          {
            제목: '소프트웨어 장인',
            저자: '산드로 만쿠소',
            이유: '좋은 개발자가 되기 위한 태도와 철학 학습',
          },
        ],
      },
    },
  },
};
