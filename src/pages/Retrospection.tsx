import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Clock, Target } from 'lucide-react';
import { toast } from 'sonner';

export default function Retrospection() {
  const navigate = useNavigate();
  const [reflection, setReflection] = useState('');
  const [step, setStep] = useState<'summary' | 'reflection' | 'complete'>('summary');

  // Mock data
  const summary = {
    completed: 2,
    total: 3,
    estimatedTime: 105, // minutes
    actualTime: 135,
    streak: 3,
  };

  const tasks = [
    { title: '상완님 프롬프트 실제 사용 → 결과물 캡처/기록', completed: true, estimated: 60, actual: 75 },
    { title: '내 프롬프트와 차이점 3가지 이내로 정리', completed: true, estimated: 30, actual: 45 },
    { title: 'v2 방향 한 줄 가설 작성', completed: false, estimated: 15, actual: 0 },
  ];

  const handleComplete = () => {
    if (step === 'summary') {
      setStep('reflection');
    } else if (step === 'reflection') {
      if (!reflection.trim()) {
        toast.error('한 줄 회고를 입력해주세요');
        return;
      }
      setStep('complete');
    } else {
      toast.success('오늘도 수고하셨어요!');
      navigate('/');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="mb-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          홈으로
        </button>
        <h1 className="text-3xl font-bold">하루 마무리</h1>
        <p className="text-muted-foreground mt-2">
          오늘의 성과를 돌아봐요
        </p>
      </div>

      {step === 'summary' && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-card border border-border rounded-lg text-center">
              <div className="text-2xl font-bold text-primary">
                {summary.completed}/{summary.total}
              </div>
              <div className="text-sm text-muted-foreground mt-1">완료</div>
            </div>
            
            <div className="p-4 bg-card border border-border rounded-lg text-center">
              <div className="text-2xl font-bold">
                {Math.floor(summary.actualTime / 60)}h {summary.actualTime % 60}m
              </div>
              <div className="text-sm text-muted-foreground mt-1">작업 시간</div>
            </div>
            
            <div className="p-4 bg-card border border-border rounded-lg text-center">
              <div className="text-2xl font-bold text-orange-600">
                {summary.streak} 🔥
              </div>
              <div className="text-sm text-muted-foreground mt-1">연속 기록</div>
            </div>
          </div>

          {/* Time comparison */}
          <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">
                  오늘 예상보다 30분 더 걸렸어요
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  다음엔 이걸 반영할게요
                </p>
              </div>
            </div>
          </div>

          {/* Tasks detail */}
          <div className="p-6 bg-card border border-border rounded-lg">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5" />
              작업 상세
            </h3>
            <div className="space-y-3">
              {tasks.map((task, i) => (
                <div key={i} className={`p-3 rounded-lg ${
                  task.completed ? 'bg-green-50 border border-green-200' : 'bg-muted'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className="text-xl">
                      {task.completed ? '✅' : '⏭'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium mb-1 ${
                        task.completed ? 'text-green-900' : 'text-muted-foreground line-through'
                      }`}>
                        {task.title}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        예상 {task.estimated}분
                        {task.completed && ` → 실제 ${task.actual}분 (+${task.actual - task.estimated}분)`}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Incomplete exploration */}
          {summary.completed < summary.total && (
            <div className="p-6 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="font-medium text-amber-900 mb-2">
                계획대로 안 된 부분이 있네요
              </p>
              <p className="text-sm text-amber-700">
                뭐가 방해했을까요? 다음 회고 단계에서 이야기해볼게요
              </p>
            </div>
          )}

          <button
            onClick={handleComplete}
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            다음
          </button>
        </div>
      )}

      {step === 'reflection' && (
        <div className="space-y-6">
          <div className="p-6 bg-card border border-border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">오늘 하루는 어땠나요?</h2>
            <p className="text-sm text-muted-foreground mb-4">
              한 줄로 정리해볼까요
            </p>
            
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="예: 프롬프트 비교 작업이 생각보다 재미있었다. 다음엔 v2 가설 먼저 세우고 시작해야겠다."
              className="w-full h-32 px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          <button
            onClick={handleComplete}
            disabled={!reflection.trim()}
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            완료
          </button>
        </div>
      )}

      {step === 'complete' && (
        <div className="space-y-6">
          <div className="p-8 bg-card border border-border rounded-lg text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold mb-2">오늘도 수고하셨어요!</h2>
            <p className="text-muted-foreground mb-4">
              {summary.streak}일 연속 달성 중이에요
            </p>

            <div className="p-4 bg-muted rounded-lg mb-6">
              <p className="text-sm font-medium mb-1">오늘의 회고</p>
              <p className="text-muted-foreground italic">"{reflection}"</p>
            </div>

            <div className="flex items-center justify-center gap-2 text-primary mb-6">
              <TrendingUp className="w-5 h-5" />
              <span className="font-medium">내일도 함께 해요!</span>
            </div>

            <button
              onClick={() => navigate('/')}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              홈으로
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
