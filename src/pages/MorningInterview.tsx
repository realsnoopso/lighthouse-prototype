import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Calendar, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

type Step = 'calendar' | 'energy' | 'tasks' | 'priority' | 'scope' | 'timebox' | 'complete';

interface Task {
  id: string;
  title: string;
  duration: number; // minutes
  completionCriteria?: string;
  timeSlot?: string;
  subtasks?: Task[];
}

export default function MorningInterview() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('calendar');
  const [energyLevel, setEnergyLevel] = useState<number>(7);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTaskInput, setCurrentTaskInput] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);

  // Mock calendar events
  const mockCalendarEvents = [
    { time: '10:00', title: '팀 미팅', duration: 60 },
    { time: '14:00', title: '디자인 리뷰', duration: 30 },
  ];

  // Mock AI responses for scope challenge
  const mockScopeChallenge = (taskTitle: string): Task[] => {
    if (taskTitle.includes('프롬프트') || taskTitle.length > 30) {
      return [
        {
          id: '1',
          title: '상완님 프롬프트 실제 사용 → 결과물 캡처/기록',
          duration: 60,
          completionCriteria: '캡처 3장 이상 + 메모',
          timeSlot: '오전 9:00'
        },
        {
          id: '2',
          title: '내 프롬프트와 차이점 3가지 이내로 정리',
          duration: 30,
          completionCriteria: '차이점 문서 1장',
          timeSlot: '오전 11:00'
        },
        {
          id: '3',
          title: 'v2 방향 한 줄 가설 작성',
          duration: 15,
          completionCriteria: '가설 1문장',
          timeSlot: '오후 3:00'
        }
      ];
    }
    
    if (taskTitle.includes('랜딩페이지') || taskTitle.includes('디자인')) {
      return [
        {
          id: '1',
          title: '레퍼런스 3개 수집 + 무드보드',
          duration: 30,
          completionCriteria: 'Figma에 무드보드 프레임 생성',
          timeSlot: '오전 10:00'
        },
        {
          id: '2',
          title: '와이어프레임 모바일 1장',
          duration: 60,
          completionCriteria: '주요 섹션 5개 배치 완료',
          timeSlot: '오전 10:40'
        },
        {
          id: '3',
          title: '카피라이팅 초안',
          duration: 45,
          completionCriteria: '히어로/기능/CTA 텍스트 작성',
          timeSlot: '오후 2:00'
        }
      ];
    }
    
    return [];
  };

  const handleAddTask = () => {
    if (!currentTaskInput.trim()) return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      title: currentTaskInput,
      duration: 60,
    };
    
    setTasks([...tasks, newTask]);
    setCurrentTaskInput('');
  };

  const handleNext = () => {
    if (step === 'calendar') {
      setStep('energy');
    } else if (step === 'energy') {
      setStep('tasks');
    } else if (step === 'tasks') {
      if (tasks.length === 0) {
        toast.error('최소 1개 이상의 작업을 입력해주세요');
        return;
      }
      setStep('priority');
    } else if (step === 'priority') {
      if (!selectedPriority) {
        toast.error('가장 중요한 작업을 선택해주세요');
        return;
      }
      // Check if any task needs scope challenge
      const needsScopeChallenge = tasks.some(t => 
        t.title.length > 30 || t.title.includes('프롬프트') || t.title.includes('랜딩페이지')
      );
      if (needsScopeChallenge) {
        setStep('scope');
      } else {
        setStep('timebox');
      }
    } else if (step === 'scope') {
      setStep('timebox');
    } else if (step === 'timebox') {
      setStep('complete');
    }
  };

  const handleBack = () => {
    if (step === 'energy') setStep('calendar');
    else if (step === 'tasks') setStep('energy');
    else if (step === 'priority') setStep('tasks');
    else if (step === 'scope') setStep('priority');
    else if (step === 'timebox') {
      const hasScopeChallenge = tasks.some(t => t.subtasks && t.subtasks.length > 0);
      setStep(hasScopeChallenge ? 'scope' : 'priority');
    }
    else if (step === 'complete') setStep('timebox');
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => step === 'calendar' ? navigate('/') : handleBack()}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          {step === 'calendar' ? '홈으로' : '이전'}
        </button>
        <h1 className="text-3xl font-bold">아침 인터뷰</h1>
        <p className="text-muted-foreground mt-2">
          오늘 하루를 함께 계획해볼까요?
        </p>
      </div>

      {/* Calendar Step */}
      {step === 'calendar' && (
        <div className="space-y-6">
          <div className="p-6 bg-card border border-border rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">오늘의 일정</h2>
            </div>
            <div className="space-y-3">
              {mockCalendarEvents.map((event, i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-muted rounded">
                  <div className="text-sm font-medium text-muted-foreground">
                    {event.time}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{event.title}</div>
                    <div className="text-sm text-muted-foreground">{event.duration}분</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button
            onClick={handleNext}
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            다음
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Energy Step */}
      {step === 'energy' && (
        <div className="space-y-6">
          <div className="p-6 bg-card border border-border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">오늘 에너지 레벨은 어떤가요?</h2>
            <p className="text-sm text-muted-foreground mb-6">
              10점 만점으로 평가해주세요
            </p>
            
            <div className="space-y-4">
              <input
                type="range"
                min="1"
                max="10"
                value={energyLevel}
                onChange={(e) => setEnergyLevel(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">{energyLevel}</div>
                <div className="text-sm text-muted-foreground mt-2">
                  {energyLevel <= 3 && '오늘은 가볍게 시작해볼까요?'}
                  {energyLevel > 3 && energyLevel <= 7 && '적당한 에너지네요!'}
                  {energyLevel > 7 && '에너지가 넘치시네요! 🔥'}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleNext}
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            다음
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tasks Step */}
      {step === 'tasks' && (
        <div className="space-y-6">
          <div className="p-6 bg-card border border-border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">오늘 할 일은 무엇인가요?</h2>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentTaskInput}
                  onChange={(e) => setCurrentTaskInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                  placeholder="예: 랜딩페이지 만들기"
                  className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  onClick={handleAddTask}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
                >
                  추가
                </button>
              </div>

              {tasks.length > 0 && (
                <div className="space-y-2 mt-4">
                  {tasks.map((task) => (
                    <div key={task.id} className="p-3 bg-muted rounded-lg flex items-center justify-between">
                      <div className="font-medium">{task.title}</div>
                      <button
                        onClick={() => setTasks(tasks.filter(t => t.id !== task.id))}
                        className="text-sm text-muted-foreground hover:text-foreground"
                      >
                        삭제
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleNext}
            disabled={tasks.length === 0}
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            다음
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Priority Step */}
      {step === 'priority' && (
        <div className="space-y-6">
          <div className="p-6 bg-card border border-border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">오늘 꼭 하나만 끝낸다면</h2>
            <p className="text-muted-foreground mb-6">가장 하고 싶은 건 뭐예요?</p>
            
            <div className="space-y-2">
              {tasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => setSelectedPriority(task.id)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    selectedPriority === task.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="font-medium">{task.title}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleNext}
            disabled={!selectedPriority}
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            다음
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Scope Challenge Step */}
      {step === 'scope' && (
        <div className="space-y-6">
          {tasks.filter(t => t.id === selectedPriority).map(task => {
            const subtasks = mockScopeChallenge(task.title);
            if (subtasks.length === 0) return null;
            
            return (
              <div key={task.id} className="space-y-4">
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-900">이 작업, 범위가 넓어 보여요</p>
                    <p className="text-sm text-amber-700 mt-1">
                      구체적으로 쪼개볼까요?
                    </p>
                  </div>
                </div>

                <div className="p-6 bg-card border border-border rounded-lg">
                  <h3 className="font-semibold mb-1">원래 작업</h3>
                  <p className="text-muted-foreground mb-4">{task.title}</p>

                  <h3 className="font-semibold mb-3">이렇게 쪼개면 어떨까요?</h3>
                  <div className="space-y-3">
                    {subtasks.map((subtask, i) => (
                      <div key={subtask.id} className="p-4 bg-muted rounded-lg">
                        <div className="flex items-start gap-3 mb-2">
                          <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                            {i + 1}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium mb-1">{subtask.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {subtask.duration}분 • {subtask.timeSlot}
                            </div>
                            {subtask.completionCriteria && (
                              <div className="mt-2 text-sm">
                                <span className="text-muted-foreground">✅ 완료 기준:</span>{' '}
                                {subtask.completionCriteria}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          <button
            onClick={handleNext}
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            이렇게 진행할게요
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Timebox Step */}
      {step === 'timebox' && (
        <div className="space-y-6">
          <div className="p-6 bg-card border border-border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">이렇게 배치했어요</h2>
            <p className="text-muted-foreground mb-6">
              바꾸고 싶은 게 있으면 탭하세요
            </p>

            <div className="space-y-3">
              {tasks.map((task) => {
                const subtasks = mockScopeChallenge(task.title);
                const items = subtasks.length > 0 ? subtasks : [task];
                
                return items.map((item, i) => (
                  <div key={item.id || i} className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">{item.title}</div>
                      <div className="text-sm text-muted-foreground">{item.duration}분</div>
                    </div>
                    {item.timeSlot && (
                      <div className="text-sm text-muted-foreground">
                        {item.timeSlot}
                      </div>
                    )}
                  </div>
                ));
              })}
            </div>
          </div>

          <button
            onClick={handleNext}
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            확정하기
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Complete Step */}
      {step === 'complete' && (
        <div className="space-y-6">
          <div className="p-8 bg-card border border-border rounded-lg text-center">
            <div className="text-6xl mb-4">✨</div>
            <h2 className="text-2xl font-bold mb-2">오늘 계획이 완성됐어요!</h2>
            <p className="text-muted-foreground mb-6">
              하기로 한 일들, 차근차근 진행해볼까요?
            </p>

            <div className="space-y-2">
              <button
                onClick={() => navigate('/daily')}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                오늘 일정 보기
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full py-3 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                홈으로
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
