import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, Layers, Plus } from 'lucide-react';
import { ProjectItem } from '../../types';
import { ImageUploader } from '../ImageUploader';
import { ConfirmModal } from './ConfirmModal';

interface EditProjectModalProps {
  initialData?: ProjectItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProjectItem) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

const getDefaultProject = (): ProjectItem => ({
  id: `proj-${Date.now()}`,
  projectId: `PROJECT_ID: ROBOT_${Math.floor(Math.random() * 90 + 10)}`,
  title: '',
  summary: '',
  detailedDescription: '',
  image: '',
  tags: ['Robotics', 'Embedded', 'Control'],
  status: 'COMPLETED',
  specs: {
    microcontroller: '',
    sensors: [],
    actuators: [],
    softwareStack: [],
    dimensions: '',
    weight: '',
    speed: '',
  },
  highlights: [],
  blueprintAnnotations: [],
});

export const EditProjectModal: React.FC<EditProjectModalProps> = ({
  initialData,
  isOpen,
  onClose,
  onSave,
  onDelete,
}) => {
  const isEditing = !!initialData?.id;

  const [formData, setFormData] = useState<ProjectItem>(initialData || getDefaultProject());

  const [tagInput, setTagInput] = useState('');
  const [highlightInput, setHighlightInput] = useState('');
  const [sensorInput, setSensorInput] = useState('');
  const [actuatorInput, setActuatorInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData || getDefaultProject());
      setTagInput('');
      setHighlightInput('');
      setSensorInput('');
      setActuatorInput('');
      setErrorMessage(null);
      setShowConfirmDelete(false);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const addTag = () => {
    if (!tagInput.trim()) return;
    setFormData({
      ...formData,
      tags: [...formData.tags, tagInput.trim()],
    });
    setTagInput('');
  };

  const removeTag = (idx: number) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, i) => i !== idx),
    });
  };

  const addHighlight = () => {
    if (!highlightInput.trim()) return;
    setFormData({
      ...formData,
      highlights: [...(formData.highlights || []), highlightInput.trim()],
    });
    setHighlightInput('');
  };

  const removeHighlight = (idx: number) => {
    setFormData({
      ...formData,
      highlights: (formData.highlights || []).filter((_, i) => i !== idx),
    });
  };

  const addSensor = () => {
    if (!sensorInput.trim()) return;
    setFormData({
      ...formData,
      specs: {
        ...formData.specs,
        sensors: [...(formData.specs?.sensors || []), sensorInput.trim()],
      },
    });
    setSensorInput('');
  };

  const removeSensor = (idx: number) => {
    setFormData({
      ...formData,
      specs: {
        ...formData.specs,
        sensors: (formData.specs?.sensors || []).filter((_, i) => i !== idx),
      },
    });
  };

  const addActuator = () => {
    if (!actuatorInput.trim()) return;
    setFormData({
      ...formData,
      specs: {
        ...formData.specs,
        actuators: [...(formData.specs?.actuators || []), actuatorInput.trim()],
      },
    });
    setActuatorInput('');
  };

  const removeActuator = (idx: number) => {
    setFormData({
      ...formData,
      specs: {
        ...formData.specs,
        actuators: (formData.specs?.actuators || []).filter((_, i) => i !== idx),
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMessage('저장 중 오류가 발생했습니다. 권한을 확인해주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!initialData?.id || !onDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(initialData.id);
      setShowConfirmDelete(false);
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMessage('삭제 중 오류가 발생했습니다. 권한을 확인해주세요.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in"
      >
        <div
          className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-[#081224] border border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.3)] overflow-hidden text-slate-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 bg-[#050c1a] border-b border-cyan-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <h3 className="font-display text-lg font-bold text-white tracking-wide">
                {isEditing ? '프로젝트(Project) 수정' : '새 프로젝트(Project) 추가'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs font-mono">
              {errorMessage}
            </div>
          )}

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 max-h-[calc(90vh-140px)]">
            {/* Title & Project ID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-cyan-400 mb-1">
                  프로젝트 제목 (Title) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="예: Autonomous RoboMission Bot"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#050c1a] border border-cyan-500/30 text-white text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-cyan-400 mb-1">
                  프로젝트 ID 코드 (Identifier) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.projectId}
                  onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                  placeholder="예: PROJECT_ID: WRO_ROBOMISSION_2026"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#050c1a] border border-cyan-500/30 text-white text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Image Uploader Component */}
            <div>
              <label className="block text-xs font-mono text-cyan-400 mb-1.5">
                대표 로봇 이미지 (Robot Image)
              </label>
              <ImageUploader
                value={formData.image}
                onChange={(imgUrl) => setFormData({ ...formData, image: imgUrl })}
                label="대표 로봇 이미지 업로드 (JPG, PNG, WebP)"
              />
            </div>

            {/* Summary */}
            <div>
              <label className="block text-xs font-mono text-cyan-400 mb-1">
                한 줄 요약 (Short Summary) *
              </label>
              <input
                type="text"
                required
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                placeholder="예: 고속 라인트레이싱 및 색상 분류 미션을 수행하는 모듈형 자율주행 로봇"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050c1a] border border-cyan-500/30 text-white text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Detailed Description */}
            <div>
              <label className="block text-xs font-mono text-cyan-400 mb-1">
                상세 설명 (Detailed Description)
              </label>
              <textarea
                rows={3}
                value={formData.detailedDescription}
                onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
                placeholder="프로젝트의 개발 과정, 하드웨어 구성 및 소프트웨어 알고리즘 특징을 상세히 작성하세요."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050c1a] border border-cyan-500/30 text-white text-sm focus:outline-none focus:border-cyan-400 resize-none"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-mono text-cyan-400 mb-1">
                기술 태그 (Tags)
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="예: PID Control, ROS2, OpenCV"
                  className="flex-1 px-3.5 py-2 rounded-xl bg-[#050c1a] border border-cyan-500/30 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-3.5 py-2 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-mono flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> 추가
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-cyan-950/60 border border-cyan-500/40 text-cyan-300"
                  >
                    {t}
                    <button type="button" onClick={() => removeTag(idx)} className="hover:text-rose-400 cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Hardware Specs Grid */}
            <div className="p-4 rounded-xl bg-[#050c1a] border border-cyan-500/20 space-y-3">
              <div className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                하드웨어 제원 (Hardware Specs)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">
                    메인 제어기 (Microcontroller)
                  </label>
                  <input
                    type="text"
                    value={formData.specs?.microcontroller || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specs: { ...formData.specs, microcontroller: e.target.value },
                      })
                    }
                    placeholder="예: STM32F407 / Raspberry Pi 4"
                    className="w-full px-3 py-2 rounded-lg bg-[#081224] border border-slate-700 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">
                    크기 / 규격 (Dimensions)
                  </label>
                  <input
                    type="text"
                    value={formData.specs?.dimensions || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specs: { ...formData.specs, dimensions: e.target.value },
                      })
                    }
                    placeholder="예: 250 x 245 x 230 mm"
                    className="w-full px-3 py-2 rounded-lg bg-[#081224] border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">
                    무게 (Weight)
                  </label>
                  <input
                    type="text"
                    value={formData.specs?.weight || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specs: { ...formData.specs, weight: e.target.value },
                      })
                    }
                    placeholder="예: 1.45 kg"
                    className="w-full px-3 py-2 rounded-lg bg-[#081224] border border-slate-700 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">
                    최대 속도 (Max Speed)
                  </label>
                  <input
                    type="text"
                    value={formData.specs?.speed || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specs: { ...formData.specs, speed: e.target.value },
                      })
                    }
                    placeholder="예: 1.2 m/s"
                    className="w-full px-3 py-2 rounded-lg bg-[#081224] border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>

              {/* Sensors List */}
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  장착 센서 목록 (Sensors)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={sensorInput}
                    onChange={(e) => setSensorInput(e.target.value)}
                    placeholder="예: Dual Color Sensor (Front)"
                    className="flex-1 px-3 py-1.5 rounded-lg bg-[#081224] border border-slate-700 text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={addSensor}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-cyan-300 text-xs font-mono cursor-pointer"
                  >
                    추가
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(formData.specs?.sensors || []).map((s, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-[11px] text-slate-300">
                      {s}
                      <button type="button" onClick={() => removeSensor(idx)} className="hover:text-rose-400 cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Actuators List */}
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  구동기 목록 (Actuators / Motors)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={actuatorInput}
                    onChange={(e) => setActuatorInput(e.target.value)}
                    placeholder="예: High-Torque Servo Motor x2"
                    className="flex-1 px-3 py-1.5 rounded-lg bg-[#081224] border border-slate-700 text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={addActuator}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-cyan-300 text-xs font-mono cursor-pointer"
                  >
                    추가
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(formData.specs?.actuators || []).map((a, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-[11px] text-slate-300">
                      {a}
                      <button type="button" onClick={() => removeActuator(idx)} className="hover:text-rose-400 cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Highlights */}
            <div>
              <label className="block text-xs font-mono text-cyan-400 mb-1">
                주요 핵심 성과 / 하이라이트 (Highlights)
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={highlightInput}
                  onChange={(e) => setHighlightInput(e.target.value)}
                  placeholder="예: 0.05초 단위 초정밀 실시간 센서 샘플링 피드백"
                  className="flex-1 px-3.5 py-2 rounded-xl bg-[#050c1a] border border-cyan-500/30 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="button"
                  onClick={addHighlight}
                  className="px-3.5 py-2 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-mono flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> 추가
                </button>
              </div>
              <ul className="space-y-1 text-xs text-slate-300">
                {(formData.highlights || []).map((h, idx) => (
                  <li key={idx} className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800">
                    <span className="truncate mr-2 text-slate-300">• {h}</span>
                    <button type="button" onClick={() => removeHighlight(idx)} className="text-slate-400 hover:text-rose-400 cursor-pointer">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Submit Footer */}
            <div className="pt-4 flex items-center justify-between border-t border-cyan-500/20">
              {isEditing && onDelete ? (
                <button
                  type="button"
                  onClick={() => setShowConfirmDelete(true)}
                  className="px-3.5 py-2 rounded-xl text-xs font-mono text-rose-400 hover:text-white hover:bg-rose-950/80 border border-rose-500/40 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> 삭제
                </button>
              ) : <div />}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-700 cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl text-xs font-mono font-bold text-black bg-cyan-400 hover:bg-cyan-300 transition-all flex items-center gap-1.5 shadow-[0_0_15px_#00f0ff] cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? '저장 중...' : '저장'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirmDelete}
        title="프로젝트 삭제"
        message="정말로 이 프로젝트를 삭제하시겠습니까?"
        itemName={formData.title ? `${formData.projectId} - ${formData.title}` : ''}
        confirmText={isDeleting ? '삭제 중...' : '삭제하기'}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowConfirmDelete(false)}
      />
    </>
  );
};
