import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { toast } from 'sonner';

type Progress = 'complete' | '70' | 'stuck' | 'skip';

interface TaskProgress {
  task: string;
  progress: Progress | null;
}

export default function CheckIn() {
  const navigate = useNavigate();
  const [tasks] = useState<TaskProgress[]>([
    { task: '상완님 프롬프트 실제 사용 → 결과물 캡처/기록', progress: null },
    { task: '내 프롬프트와 차이점 3가지 이내로 정리', progress: null },
    { task: 'v2 방향 한 줄 가설 작성', progress: null },
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState<Record<number, Progress>>({});

  const progressOptions: { value: Progress; label: string; emoji: string }[] = [
    { value: 'complete', label: '완료', emoji: '✅' },
    { value: '70', label: '70%', emoji: '🔄' },
    { value: 'stuck', label: '막힘', emoji: '🤔' },
    { value: 'skip', label: '스킵', emoji: '⏭' },
  ];

  const handleProgress = (value: Progress) => {
    setProgress({ ...progress, [currentIndex]: value });
    
    if (currentIndex < tasks.length - 1) {
      setTimeout(() => setCurrentIndex(currentIndex + 1), 300);
    } else {
      setTimeout(() => {
        toast.success('체크인 완료!');
        navigate('/daily');
      }, 500);
    }
  };

  const currentTask = tasks[currentIndex];

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="mb-8">
        <button
          onClick={() => navigate('/daily')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          일정으로
        </button>
        <h1 className="text-3xl font-bold">중간 체크인</h1>
        <p className="text-muted-foreground mt-2">
          진행 상황을 빠르게 업데이트해주세요
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2 text-sm text-muted-foreground">
          <span>{currentIndex + 1} / {tasks.length}</span>
          <span>{Math.round((currentIndex / tasks.length) * 100)}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${(currentIndex / tasks.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Current task */}
      <div className="mb-8 p-6 bg-card border border-border rounded-lg">
        <div className="text-lg font-semibold mb-6">
          하기로 한 <span className="text-primary">{currentTask.task}</span>, 어떻게 되고 있어요?
        </div>

        <div className="grid grid-cols-2 gap-3">
          {progressOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleProgress(option.value)}
              className="p-4 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all text-center group"
            >
              <div className="text-3xl mb-2">{option.emoji}</div>
              <div className="font-medium group-hover:text-primary">{option.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Completed tasks */}
      {currentIndex > 0 && (
        <div className="p-4 bg-muted rounded-lg">
          <div className="text-sm font-medium text-muted-foreground mb-3">완료한 체크인</div>
          <div className="space-y-2">
            {tasks.slice(0, currentIndex).map((task, i) => (
              <div key={i} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <div className="text-sm flex-1 truncate">{task.task}</div>
                <div className="text-xs text-muted-foreground">
                  {progressOptions.find(o => o.value === progress[i])?.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
