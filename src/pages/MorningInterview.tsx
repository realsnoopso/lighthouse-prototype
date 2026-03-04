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
  inputType?: 'text' | 'energy' | 'priority';
}

export default function MorningInterview() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [inputType, setInputType] = useState<'text' | 'energy' | 'priority' | 'none'>('none');
  const [energyLevel, setEnergyLevel] = useState(7);
  const [tasks, setTasks] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initial greeting
    setTimeout(() => {
      addAIMessage('안녕하세요! 오늘 하루를 함께 계획해볼까요? ☀️');
      setTimeout(() => {
        showCalendar();
      }, 1000);
    }, 500);
  }, []);

  const addAIMessage = (content: string, options?: string[], onOptionClick?: (option: string) => void) => {
    const msg: Message = {
      id: Date.now().toString(),
      type: 'ai',
      content,
      options,
      onOptionClick,
    };
    setMessages((prev) => [...prev, msg]);
  };

  const addUserMessage = (content: string) => {
    const msg: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
    };
    setMessages((prev) => [...prev, msg]);
  };

  const showCalendar = () => {
    addAIMessage('오늘 일정을 확인했어요:\n\n• 10:00 팀 미팅 (60분)\n• 14:00 디자인 리뷰 (30분)');
    setTimeout(() => {
      askEnergy();
    }, 1500);
  };

  const askEnergy = () => {
    addAIMessage('오늘 에너지 레벨은 어떤가요? (1-10점)');
    setInputType('energy');
  };

  const handleEnergySubmit = (level: number) => {
    addUserMessage(`${level}점`);
    setInputType('none');
    
    setTimeout(() => {
      let response = '';
      if (level <= 3) response = '오늘은 가볍게 시작해볼까요?';
      else if (level <= 7) response = '적당한 에너지네요!';
      else response = '에너지가 넘치시네요! 🔥';
      
      addAIMessage(response);
      setTimeout(() => {
        askTasks();
      }, 1000);
    }, 500);
  };

  const askTasks = () => {
    addAIMessage('오늘 할 일은 무엇인가요?\n\n하나씩 입력해주세요. 다 입력하셨으면 "완료"라고 말씀해주세요.');
    setInputType('text');
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
      setTimeout(() => {
        askPriority();
      }, 1000);
    } else {
      addUserMessage(task);
      setTasks([...tasks, task]);
      setTimeout(() => {
        addAIMessage('좋아요! 다른 할 일이 있나요?');
      }, 500);
    }
  };

  const askPriority = () => {
    addAIMessage(
      `오늘 꼭 하나만 끝낸다면, 가장 하고 싶은 건 뭐예요?`,
      tasks,
      handlePrioritySelect
    );
  };

  const handlePrioritySelect = (selectedTask: string) => {
    addUserMessage(selectedTask);
    setInputType('none');
    
    setTimeout(() => {
      // Check if needs scope challenge
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
      } else if (task.includes('랜딩페이지')) {
        subtasks = [
          '1. 레퍼런스 3개 수집 + 무드보드 (30분)',
          '   ✅ Figma에 무드보드 프레임 생성',
          '',
          '2. 와이어프레임 모바일 1장 (60분)',
          '   ✅ 주요 섹션 5개 배치 완료',
          '',
          '3. 카피라이팅 초안 (45분)',
          '   ✅ 히어로/기능/CTA 텍스트 작성'
        ];
      }
      
      addAIMessage(subtasks.join('\n'));
      setTimeout(() => {
        showTimebox();
      }, 1500);
    }, 1000);
  };

  const showTimebox = () => {
    addAIMessage('이렇게 배치했어요:\n\n• 09:00 - 상완님 프롬프트 실제 사용\n• 11:00 - 프롬프트 차이점 정리\n• 15:00 - v2 방향 가설 작성\n\n바꾸고 싶은 게 있으면 말씀해주세요!');
    
    setTimeout(() => {
      addAIMessage(
        '이대로 진행할까요?',
        ['네, 좋아요!', '수정할게요'],
        (option) => {
          addUserMessage(option);
          setTimeout(() => {
            if (option === '네, 좋아요!') {
              complete();
            } else {
              addAIMessage('어떤 부분을 수정하고 싶으신가요?');
              setInputType('text');
            }
          }, 500);
        }
      );
    }, 1500);
  };

  const complete = () => {
    addAIMessage('오늘 계획이 완성됐어요! ✨\n\n하기로 한 일들, 차근차근 진행해볼까요?');
    
    setTimeout(() => {
      addAIMessage(
        '다음에 뭘 하시겠어요?',
        ['오늘 일정 보기', '홈으로'],
        (option) => {
          addUserMessage(option);
          setTimeout(() => {
            if (option === '오늘 일정 보기') {
              navigate('/daily');
            } else {
              navigate('/');
            }
          }, 500);
        }
      );
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    if (inputType === 'text') {
      handleTaskInput(inputValue);
    }
    
    setInputValue('');
  };

  const handleEnergyChange = (level: number) => {
    setEnergyLevel(level);
  };

  const handleEnergyConfirm = () => {
    handleEnergySubmit(energyLevel);
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
        <h1 className="text-xl font-bold">아침 인터뷰</h1>
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
                <div className="mt-3 space-y-2">
                  {msg.options.map((option, i) => (
                    <Button
                      key={i}
                      onClick={() => msg.onOptionClick?.(option)}
                      variant="outline"
                      className="w-full justify-start"
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
              onChange={(e) => handleEnergyChange(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-primary">{energyLevel}</span>
              <Button onClick={handleEnergyConfirm}>
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
              autoFocus
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
