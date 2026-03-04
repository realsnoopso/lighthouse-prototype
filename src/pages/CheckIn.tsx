import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  type: 'ai' | 'user';
  content: string;
  options?: string[];
  onOptionClick?: (option: string) => void;
}

const tasks = [
  '상완님 프롬프트 실제 사용 → 결과물 캡처/기록',
  '내 프롬프트와 차이점 3가지 이내로 정리',
  'v2 방향 한 줄 가설 작성',
];

export default function CheckIn() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setTimeout(() => {
      addAIMessage('중간 체크인할 시간이에요! 👋');
      setTimeout(() => {
        askProgress(0);
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

  const askProgress = (index: number) => {
    if (index >= tasks.length) {
      complete();
      return;
    }

    addAIMessage(
      `하기로 한 "${tasks[index]}", 어떻게 되고 있어요?`,
      ['✅ 완료', '🔄 70%', '🤔 막힘', '⏭ 스킵'],
      (option) => handleProgress(index, option)
    );
  };

  const handleProgress = (index: number, option: string) => {
    addUserMessage(option);
    
    setTimeout(() => {
      if (option === '🤔 막힘') {
        addAIMessage('무엇이 막혀 있나요? 도움이 필요하면 말씀해주세요.');
      } else {
        addAIMessage('좋아요!');
      }
      
      setTimeout(() => {
        askProgress(index + 1);
      }, 1000);
    }, 500);
  };

  const complete = () => {
    addAIMessage('체크인 완료! 잘하고 계시네요 👍');
    
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

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
        <button
          onClick={() => navigate('/daily')}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold">중간 체크인</h1>
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
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {msg.options.map((option, i) => (
                    <Button
                      key={i}
                      onClick={() => msg.onOptionClick?.(option)}
                      variant="outline"
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
    </div>
  );
}
