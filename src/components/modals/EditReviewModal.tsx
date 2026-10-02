import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, BookOpen, AlertCircle } from 'lucide-react';
import { CompetitionReviewItem } from '../../types';

interface EditReviewModalProps {
  isOpen: boolean;
  initialData: CompetitionReviewItem | null;
  onClose: () => void;
  onSave: (data: CompetitionReviewItem) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

export const EditReviewModal: React.FC<EditReviewModalProps> = ({
  isOpen,
  initialData,
  onClose,
  onSave,
  onDelete,
}) => {
  const [formData, setFormData] = useState<CompetitionReviewItem>({
    id: `review-${Date.now()}`,
    title: '',
    competition: '',
    period: '',
    location: '',
    teamName: '',
    members: [],
    officialUrl: '',
    notionUrl: '',
    coverImage: '/wro-oc-regular-apac-india-2026.webp',
    rankBadge: '',
    finalScore: '',
    overviewSummary: '',
    day1: {
      title: '첫째 날',
      subtitle: '연습',
      fixes: [''],
      strategy: '',
      codeSummary: '',
      result: '',
    },
    day2: {
      title: '둘째 날',
      subtitle: '1, 2, 3, 4라운드',
      rank: '11등',
      scores: [
        { round: '1라운드', score: 30 },
        { round: '2라운드', score: 107 },
        { round: '3라운드', score: 109 },
        { round: '4라운드', score: 179 },
      ],
      strategy: '',
      codeSummary: '',
    },
    day3: {
      title: '셋째 날',
      subtitle: '1, 2라운드',
      rank: '11등',
      scores: [
        { round: '1라운드', score: 55 },
        { round: '2라운드', score: 60 },
        { round: '3라운드 (멀리건)', score: 70 },
      ],
      strategy: '',
      codeSummary: '',
    },
    reflections: {
      strengths: '',
      regrets: '',
      improvements: '',
    },
    competitionDetails: {
      venueAndDate: '',
      criticalRules: '',
      ruleLessonLearned: '',
      differencesFromPrevious: '',
    },
    order: 1,
  });

  const [membersInput, setMembersInput] = useState('');
  const [fixesInput, setFixesInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setMembersInput(initialData.members?.join(', ') || '');
      setFixesInput(initialData.day1?.fixes?.join('\n') || '');
    } else {
      setFormData({
        id: `review-${Date.now()}`,
        title: '새 대회 후기',
        competition: 'WRO Open Championship',
        period: '',
        location: '',
        teamName: 'K.F.C.',
        members: ['배지훈'],
        officialUrl: '',
        notionUrl: '',
        coverImage: '/wro-oc-regular-apac-india-2026.webp',
        rankBadge: '',
        finalScore: '',
        overviewSummary: '',
        day1: {
          title: '첫째 날',
          subtitle: '연습',
          fixes: [''],
          strategy: '',
          codeSummary: '',
          result: '',
        },
        day2: {
          title: '둘째 날',
          subtitle: '1, 2, 3, 4라운드',
          rank: '11등',
          scores: [
            { round: '1라운드', score: 30 },
            { round: '2라운드', score: 107 },
            { round: '3라운드', score: 109 },
            { round: '4라운드', score: 179 },
          ],
          strategy: '',
          codeSummary: '',
        },
        day3: {
          title: '셋째 날',
          subtitle: '1, 2라운드',
          rank: '11등',
          scores: [
            { round: '1라운드', score: 55 },
            { round: '2라운드', score: 60 },
            { round: '3라운드 (멀리건)', score: 70 },
          ],
          strategy: '',
          codeSummary: '',
        },
        reflections: {
          strengths: '',
          regrets: '',
          improvements: '',
        },
        competitionDetails: {
          venueAndDate: '',
          criticalRules: '',
          ruleLessonLearned: '',
          differencesFromPrevious: '',
        },
        order: 1,
      });
      setMembersInput('배지훈');
      setFixesInput('');
    }
    setError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const parsedMembers = membersInput
        .split(',')
        .map((m) => m.trim())
        .filter(Boolean);

      const parsedFixes = fixesInput
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean);

      const updated = {
        ...formData,
        members: parsedMembers.length > 0 ? parsedMembers : ['배지훈'],
        day1: {
          ...formData.day1,
          fixes: parsedFixes,
        },
      };

      await onSave(updated);
      onClose();
    } catch (err: unknown) {
      console.error(err);
      setError('저장 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-[#e3e2de] max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e3e2de] bg-[#f7f6f3]">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base sm:text-lg font-bold text-[#37352f]">
              {initialData ? '대회 후기 수정' : '새 대회 후기 추가'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#787774] hover:text-[#37352f] hover:bg-[#efefed] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 text-sm text-[#37352f]">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Basic Info */}
          <div className="space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#787774] border-b pb-1">
              기본 정보
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">제목 *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#e3e2de] focus:border-emerald-500 focus:outline-hidden"
                  placeholder="예: WRO Open Championship 2026 India- ASIA PACIFIC"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">팀 명</label>
                <input
                  type="text"
                  value={formData.teamName}
                  onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#e3e2de] focus:border-emerald-500 focus:outline-hidden"
                  placeholder="K.F.C."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">팀원 (쉼표로 구분)</label>
                <input
                  type="text"
                  value={membersInput}
                  onChange={(e) => setMembersInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#e3e2de] focus:border-emerald-500 focus:outline-hidden"
                  placeholder="배지훈, 송민규"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">참가일 / 기간</label>
                <input
                  type="text"
                  value={formData.period}
                  onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#e3e2de] focus:border-emerald-500 focus:outline-hidden"
                  placeholder="2026년 9월 25일 ~ 27일"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold mb-1">대회 장소</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#e3e2de] focus:border-emerald-500 focus:outline-hidden"
                  placeholder="GMR Arena, Aerocity, Hyderabad, India"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">최종 성적 / 뱃지</label>
                <input
                  type="text"
                  value={formData.rankBadge || ''}
                  onChange={(e) => setFormData({ ...formData, rankBadge: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#e3e2de] focus:border-emerald-500 focus:outline-hidden"
                  placeholder="11등 (총 249점)"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">커버 이미지 경로 / URL</label>
                <input
                  type="text"
                  value={formData.coverImage || ''}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#e3e2de] focus:border-emerald-500 focus:outline-hidden"
                  placeholder="/wro-oc-regular-apac-india-2026.webp"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">공식 사이트 URL</label>
                <input
                  type="url"
                  value={formData.officialUrl || ''}
                  onChange={(e) => setFormData({ ...formData, officialUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#e3e2de] focus:border-emerald-500 focus:outline-hidden"
                  placeholder="https://oc26.wroindia.org/schedule/"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">노션 원본 URL</label>
                <input
                  type="url"
                  value={formData.notionUrl || ''}
                  onChange={(e) => setFormData({ ...formData, notionUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#e3e2de] focus:border-emerald-500 focus:outline-hidden"
                  placeholder="https://app.notion.com/p/..."
                />
              </div>
            </div>
          </div>

          {/* Reflections */}
          <div className="space-y-4 pt-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#787774] border-b pb-1">
              느낀 점 & 회고
            </h4>

            <div>
              <label className="block text-xs font-semibold mb-1">좋았던 점</label>
              <textarea
                rows={2}
                value={formData.reflections.strengths}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    reflections: { ...formData.reflections, strengths: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-[#e3e2de] focus:border-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">아쉬웠던 점</label>
              <textarea
                rows={2}
                value={formData.reflections.regrets}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    reflections: { ...formData.reflections, regrets: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-[#e3e2de] focus:border-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">부족했던 점</label>
              <textarea
                rows={2}
                value={formData.reflections.improvements}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    reflections: { ...formData.reflections, improvements: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-[#e3e2de] focus:border-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Modal Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-[#e3e2de]">
            {initialData && onDelete ? (
              <button
                type="button"
                onClick={async () => {
                  if (confirm('정말로 이 후기를 삭제하시겠습니까?')) {
                    await onDelete(initialData.id);
                    onClose();
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>삭제하기</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-[#787774] hover:bg-[#efefed] rounded-lg transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-sm disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? '저장 중...' : '저장하기'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
