import Image from 'next/image';
import { SquarePen, Bookmark } from 'lucide-react';

interface ConsultCardProps {
  profileImage?: string;
  consultantName: string;
  consultantRole: string;
  numAssignedStudent?: number;
  starRatio?: number;
  onClick?: () => void;
  onEdit?: () => void;
  onViewStudents?: () => void;
  onBookmark?: () => void;
}

export default function ConsultCard({
  profileImage = '/images/default-avatar.png',
  consultantName,
  consultantRole,
  numAssignedStudent = 0,
  starRatio = 0,
  onClick,
  onEdit,
  onViewStudents,
  onBookmark
}: ConsultCardProps) {
  return (
    <div
      onClick={onClick}
      className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
    >
      <div className="flex items-start gap-4 mb-6">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
          <Image
            src={profileImage}
            alt={consultantName}
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 flex flex-col justify-between h-16">
          <div className="flex items-center">
            <h3 className="text-3xl pt-1 font-semibold text-gray-800">
              {consultantName}
            </h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
              }}
              className="pl-2 text-black hover:text-blue-800"
            >
              <SquarePen size={18} />
            </button>
          </div>
          <p className="text-sm text-gray-600 pb-1">{consultantRole}</p>
        </div>
      </div>

      {/* 구분선 */}
      <div className="border-t border-gray-200 my-4"></div>

      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-700">
          담당 학생 <span className="pl-1 font-semibold text-black">{numAssignedStudent}명</span>
        </p>
        <div className="flex items-center gap-1">
          <span className="text-gray-500">☆</span>
          <span className="text-sm font-semibold">{starRatio.toFixed(1)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewStudents?.();
          }}
          className="w-full outline outline-1 py-3 font-bold rounded hover:bg-blue-600 transition-colors"
          style={{ color: '#0080C4', backgroundColor: '#F6F8FA', outlineColor: '#D8D8D8' }}
        >
          담당 학생 보기
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onBookmark?.();
          }}
          className="ml-4 text-gray-500 hover:text-yellow-500 transition-colors"
        >
          <Bookmark size={24} color="#BCD0DC" />
        </button>
      </div>
    </div>
  );
}