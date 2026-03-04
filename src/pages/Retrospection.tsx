import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';

interface Message {
  id: string;
  type: 'ai' | 'user';
  content: string;
  options?: string[];
  onOptionClick?: (option: string) => void;
}

export default function Retrospection() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [showInput, setShowInput] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showInput]);

  useEffect(() => {
    setTimeout(() => {
      addAIMessage('하루 마무리 시간이에요! 🌙');
      setTimeout(() => {
        showSummary();
      }, 1000);
    }, 500);
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

  const showSummary = () => {
    addAIMessage('오늘은 이렇게 보내셨어요:\n\n✅ 완료: 2개\n⏭ 미완료: 1개\n⏱ 작업 시간: 2시간 15분\n🔥 연속 기록: 3일');
    
    setTimeout(() => {
      addAIMessage('오늘 예상보다 30분 더 걸렸어요. 다음엔 이걸 반영할게요.');
      
      setTimeout(() => {
        showTasksDetail();
      }, 1500);
    }, 1500);
  };

  const showTasksDetail = () => {
    addAIMessage('작업 상세:\n\n✅ 상완님 프롬프트 실제 사용\n   예상 60분 → 실제 75분\n\n✅ 프롬프트 차이점 정리\n   예상 30분 → 실제 45분\n\n⏭ v2 방향 가설 작성\n   예상 15분 (스킵됨)');
    
    setTimeout(() => {
      askWhatBlocked();
    }, 2000);
  };

  const askWhatBlocked = () => {
    addAIMessage('계획대로 안 된 부분이 있네요. 뭐가 방해했을까요?');
    setShowInput(true);
  };

  const handleBlockedSubmit = (answer: string) => {
    addUserMessage(answer);
    setShowInput(false);
    
    setTimeout(() => {
      addAIMessage('그렇군요. 다음번엔 이걸 고려해서 계획을 세워볼게요.');
      
      setTimeout(() => {
        askReflection();
      }, 1500);
    }, 500);
  };

  const askReflection = () => {
    addAIMessage('오늘 하루는 어땠나요? 한 줄로 정리해볼까요.');
    setShowInput(true);
  };

  const handleReflectionSubmit = (reflection: string) => {
    addUserMessage(reflection);
    setShowInput(false);
    
    setTimeout(() => {
      complete(reflection);
    }, 1000);
  };

  const complete = (reflection: string) => {
    addAIMessage('오늘도 수고하셨어요! 🎉\n\n3일 연속 달성 중이에요.');
    
    setTimeout(() => {
      addAIMessage(`오늘의 회고:\n"${reflection}"`);
      
      setTimeout(() => {
        addAIMessage('내일도 함께 해요!');
        
        setTimeout(() => {
          addAIMessage(
            '다음에 뭘 하시겠어요?',
            ['홈으로'],
            (option) => {
              addUserMessage(option);
              setTimeout(() => {
                navigate('/');
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

    if (messages.filter(m => m.type === 'user').length === 0) {
      handleBlockedSubmit(inputValue);
    } else {
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
        <h1 className="text-xl font-bold">하루 마무리</h1>
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
                    <button
                      key={i}
                      onClick={() => msg.onOptionClick?.(option)}
                      className="w-full px-4 py-2 bg-background rounded-lg hover:bg-accent transition-colors text-center"
                    >
                      {option}
                    </button>
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
        {showInput ? (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="메시지를 입력하세요..."
              className="flex-1 px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        ) : (
          <div className="text-center text-sm text-muted-foreground">
            응답을 기다리는 중...
          </div>
        )}
      </div>
    </div>
  );
}
