import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  id: string;
  type: 'ai' | 'user';
  content: string;
  options?: string[];
  onOptionClick?: (option: string) => void;
}

type FlowStep = 
  | 'greeting' 
  | 'calendar' 
  | 'energy' 
  | 'tasks' 
  | 'priority' 
  | 'scope' 
  | 'timebox' 
  | 'confirm'
  | 'daily-view'
  | 'checkin-start'
  | 'checkin-progress'
  | 'retro-summary'
  | 'retro-blocked'
  | 'retro-reflection'
  | 'complete';

export default function ChatFlow() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [inputType, setInputType] = useState<'text' | 'energy' | 'none'>('none');
  const [energyLevel, setEnergyLevel] = useState(7);
  const [tasks, setTasks] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<FlowStep>('greeting');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const checkinTasks = [
    '상완님 프롬프트 실제 사용 → 결과물 캡처/기록',
    '내 프롬프트와 차이점 3가지 이내로 정리',
    'v2 방향 한 줄 가설 작성',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (inputType === 'text' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputType]);

  useEffect(() => {
    startFlow();
  }, []);

  const addAIMessage = (content: string, options?: string[], onOptionClick?: (option: string) => void) => {
    const msg: Message = {
      id: Date.now().toString() + Math.random(),
      type: 'ai',
      content,
      options,
      onOptionClick,
    };
    setMessages((prev) => [...prev, msg]);
  };

  const addUserMessage = (content: string) => {
    const msg: Message = {
      id: Date.now().toString() + Math.random(),
      type: 'user',
      content,
    };
    setMessages((prev) => [...prev, msg]);
  };

  const startFlow = () => {
    setTimeout(() => {
      addAIMessage('안녕하세요! 오늘 하루를 함께 계획해볼까요? ☀️');
      setTimeout(() => {
        setCurrentStep('calendar');
        showCalendar();
      }, 1000);
    }, 500);
  };

  const showCalendar = () => {
    addAIMessage('오늘 일정을 확인했어요:\n\n• 10:00 팀 미팅 (60분)\n• 14:00 디자인 리뷰 (30분)');
    setTimeout(() => {
      setCurrentStep('energy');
      addAIMessage('오늘 에너지 레벨은 어떤가요? (1-10점)');
      setInputType('energy');
    }, 1500);
  };

  const handleEnergySubmit = (level: number) => {
    addUserMessage(`${level}점`);
    setInputType('none');
    setCurrentStep('tasks');
    
    setTimeout(() => {
      let response = '';
      if (level <= 3) response = '오늘은 가볍게 시작해볼까요?';
      else if (level <= 7) response = '적당한 에너지네요!';
      else response = '에너지가 넘치시네요! 🔥';
      
      addAIMessage(response);
      setTimeout(() => {
        addAIMessage('오늘 할 일은 무엇인가요?\n\n하나씩 입력해주세요. 다 입력하셨으면 "완료"라고 말씀해주세요.');
        setInputType('text');
      }, 1000);
    }, 500);
  };

  const handleTaskInput = (task: string) => {
    if (task.toLowerCase() === '완료') {
      if (tasks.length === 0) {
        addUserMessage(task);
        setTimeout(() => {
          addAIMessage('최소 1개 이상의 작업을 입력해주세요.');
        }, 500);
        return;
      }
      addUserMessage(task);
      setInputType('none');
      setCurrentStep('priority');
      setTimeout(() => {
        addAIMessage(
          `오늘 꼭 하나만 끝낸다면, 가장 하고 싶은 건 뭐예요?`,
          tasks,
          handlePrioritySelect
        );
      }, 1000);
    } else {
      addUserMessage(task);
      setTasks([...tasks, task]);
      setTimeout(() => {
        addAIMessage('좋아요! 다른 할 일이 있나요?');
      }, 500);
    }
  };

  const handlePrioritySelect = (selectedTask: string) => {
    addUserMessage(selectedTask);
    setInputType('none');
    setCurrentStep('scope');
    
    setTimeout(() => {
      if (selectedTask.length > 30 || selectedTask.includes('프롬프트') || selectedTask.includes('랜딩페이지')) {
        showScopeChallenge(selectedTask);
      } else {
        showTimebox();
      }
    }, 1000);
  };

  const showScopeChallenge = (task: string) => {
    addAIMessage(`"${task}" 이 작업, 범위가 넓어 보여요. 구체적으로 쪼개볼까요?`);
    
    setTimeout(() => {
      let subtasks: string[] = [];
      if (task.includes('프롬프트')) {
        subtasks = [
          '1. 상완님 프롬프트 실제 사용 → 결과물 캡처/기록 (60분)',
          '   ✅ 완료 기준: 캡처 3장 이상 + 메모',
          '',
          '2. 내 프롬프트와 차이점 3가지 이내로 정리 (30분)',
          '   ✅ 완료 기준: 차이점 문서 1장',
          '',
          '3. v2 방향 한 줄 가설 작성 (15분)',
          '   ✅ 완료 기준: 가설 1문장'
        ];
      }
      
      addAIMessage(subtasks.join('\n'));
      setTimeout(() => {
        showTimebox();
      }, 1500);
    }, 1000);
  };

  const showTimebox = () => {
    setCurrentStep('timebox');
    addAIMessage('이렇게 배치했어요:\n\n• 09:00 - 상완님 프롬프트 실제 사용\n• 11:00 - 프롬프트 차이점 정리\n• 15:00 - v2 방향 가설 작성\n\n바꾸고 싶은 게 있으면 말씀해주세요!');
    
    setTimeout(() => {
      setCurrentStep('confirm');
      addAIMessage(
        '이대로 진행할까요?',
        ['네, 좋아요!', '수정할게요'],
        (option) => {
          addUserMessage(option);
          if (option === '네, 좋아요!') {
            setTimeout(() => {
              showDailyView();
            }, 500);
          } else {
            setInputType('text');
          }
        }
      );
    }, 1500);
  };

  const showDailyView = () => {
    setCurrentStep('daily-view');
    addAIMessage('오늘 계획이 완성됐어요! ✨');
    
    setTimeout(() => {
      addAIMessage('타임라인으로 정리하면 이렇게 돼요:\n\n📅 오늘의 일정\n\n09:00 - 상완님 프롬프트 실제 사용 (60분)\n10:00 - 팀 미팅 (60분)\n11:00 - 프롬프트 차이점 정리 (30분)\n14:00 - 디자인 리뷰 (30분)\n15:00 - v2 방향 가설 작성 (15분)');
      
      setTimeout(() => {
        addAIMessage('하기로 한 일들, 차근차근 진행해볼까요?');
        setTimeout(() => {
          simulateTimePass();
        }, 2000);
      }, 2000);
    }, 1500);
  };

  const simulateTimePass = () => {
    addAIMessage('⏰ 잠시 후...\n\n(시간이 흘렀다고 가정하고, 중간 체크인을 시작할게요)');
    setTimeout(() => {
      startCheckin();
    }, 2000);
  };

  const startCheckin = () => {
    setCurrentStep('checkin-start');
    addAIMessage('중간 체크인할 시간이에요! 👋');
    setTimeout(() => {
      setCurrentStep('checkin-progress');
      askCheckinProgress(0);
    }, 1000);
  };

  const askCheckinProgress = (index: number) => {
    if (index >= checkinTasks.length) {
      completeCheckin();
      return;
    }

    addAIMessage(
      `하기로 한 "${checkinTasks[index]}", 어떻게 되고 있어요?`,
      ['✅ 완료', '🔄 70%', '🤔 막힘', '⏭ 스킵'],
      (option) => {
        addUserMessage(option);
        setTimeout(() => {
          if (option === '🤔 막힘') {
            addAIMessage('무엇이 막혀 있나요? 도움이 필요하면 말씀해주세요.');
          } else {
            addAIMessage('좋아요!');
          }
          setTimeout(() => {
            askCheckinProgress(index + 1);
          }, 1000);
        }, 500);
      }
    );
  };

  const completeCheckin = () => {
    addAIMessage('체크인 완료! 잘하고 계시네요 👍');
    setTimeout(() => {
      addAIMessage('⏰ 하루가 마무리되어 가네요...\n\n(저녁이 되었다고 가정하고, 하루 마무리를 시작할게요)');
      setTimeout(() => {
        startRetro();
      }, 2000);
    }, 1500);
  };

  const startRetro = () => {
    setCurrentStep('retro-summary');
    addAIMessage('하루 마무리 시간이에요! 🌙');
    setTimeout(() => {
      addAIMessage('오늘은 이렇게 보내셨어요:\n\n✅ 완료: 2개\n⏭ 미완료: 1개\n⏱ 작업 시간: 2시간 15분\n🔥 연속 기록: 3일');
      setTimeout(() => {
        addAIMessage('오늘 예상보다 30분 더 걸렸어요. 다음엔 이걸 반영할게요.');
        setTimeout(() => {
          showTasksDetail();
        }, 1500);
      }, 1500);
    }, 1000);
  };

  const showTasksDetail = () => {
    addAIMessage('작업 상세:\n\n✅ 상완님 프롬프트 실제 사용\n   예상 60분 → 실제 75분\n\n✅ 프롬프트 차이점 정리\n   예상 30분 → 실제 45분\n\n⏭ v2 방향 가설 작성\n   예상 15분 (스킵됨)');
    
    setTimeout(() => {
      setCurrentStep('retro-blocked');
      addAIMessage('계획대로 안 된 부분이 있네요. 뭐가 방해했을까요?');
      setInputType('text');
    }, 2000);
  };

  const handleBlockedSubmit = (answer: string) => {
    addUserMessage(answer);
    setInputType('none');
    
    setTimeout(() => {
      addAIMessage('그렇군요. 다음번엔 이걸 고려해서 계획을 세워볼게요.');
      setTimeout(() => {
        setCurrentStep('retro-reflection');
        addAIMessage('오늘 하루는 어땠나요? 한 줄로 정리해볼까요.');
        setInputType('text');
      }, 1500);
    }, 500);
  };

  const handleReflectionSubmit = (reflection: string) => {
    addUserMessage(reflection);
    setInputType('none');
    
    setTimeout(() => {
      completeFlow(reflection);
    }, 1000);
  };

  const completeFlow = (reflection: string) => {
    setCurrentStep('complete');
    addAIMessage('오늘도 수고하셨어요! 🎉\n\n3일 연속 달성 중이에요.');
    
    setTimeout(() => {
      addAIMessage(`오늘의 회고:\n"${reflection}"`);
      setTimeout(() => {
        addAIMessage('내일도 함께 해요!');
        setTimeout(() => {
          addAIMessage(
            '프로토타입 테스트를 마치셨네요! 어떠셨나요?',
            ['처음부터 다시', '홈으로'],
            (option) => {
              addUserMessage(option);
              setTimeout(() => {
                if (option === '처음부터 다시') {
                  window.location.reload();
                } else {
                  navigate('/');
                }
              }, 500);
            }
          );
        }, 1500);
      }, 1500);
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    if (currentStep === 'tasks') {
      handleTaskInput(inputValue);
    } else if (currentStep === 'retro-blocked') {
      handleBlockedSubmit(inputValue);
    } else if (currentStep === 'retro-reflection') {
      handleReflectionSubmit(inputValue);
    }
    
    setInputValue('');
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
        <button
          onClick={() => navigate('/')}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold">Lighthouse</h1>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.type === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground'
              }`}
            >
              <p className="whitespace-pre-line">{msg.content}</p>
              
              {msg.options && msg.options.length > 0 && (
                <div className={`mt-3 ${
                  msg.options.length > 2 ? 'space-y-2' : 'grid grid-cols-2 gap-2'
                }`}>
                  {msg.options.map((option, i) => (
                    <Button
                      key={i}
                      onClick={() => msg.onOptionClick?.(option)}
                      variant="outline"
                      className={msg.options!.length > 2 ? 'w-full justify-start' : ''}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-border bg-card">
        {inputType === 'energy' && (
          <div className="space-y-4">
            <input
              type="range"
              min="1"
              max="10"
              value={energyLevel}
              onChange={(e) => setEnergyLevel(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-primary">{energyLevel}</span>
              <Button onClick={() => handleEnergySubmit(energyLevel)}>
                확인
              </Button>
            </div>
          </div>
        )}
        
        {inputType === 'text' && (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="메시지를 입력하세요..."
            />
            <Button
              type="submit"
              disabled={!inputValue.trim()}
              size="icon"
            >
              <Send className="w-5 h-5" />
            </Button>
          </form>
        )}

        {inputType === 'none' && (
          <div className="text-center text-sm text-muted-foreground">
            응답을 기다리는 중...
          </div>
        )}
      </div>
    </div>
  );
}
