import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';

export default function DailyView() {
  const navigate = useNavigate();

  // Mock schedule data
  const schedule = [
    { time: '09:00', title: '상완님 프롬프트 실제 사용 → 결과물 캡처/기록', duration: 60, type: 'task' },
    { time: '10:00', title: '팀 미팅', duration: 60, type: 'meeting' },
    { time: '11:00', title: '내 프롬프트와 차이점 3가지 이내로 정리', duration: 30, type: 'task' },
    { time: '14:00', title: '디자인 리뷰', duration: 30, type: 'meeting' },
    { time: '15:00', title: 'v2 방향 한 줄 가설 작성', duration: 15, type: 'task' },
  ];

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
        <h1 className="text-3xl font-bold">오늘 일정</h1>
        <p className="text-muted-foreground mt-2">
          {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
        </p>
      </div>

      <div className="space-y-4">
        {schedule.map((item, i) => (
          <div key={i} className="relative">
            {/* Timeline connector */}
            {i < schedule.length - 1 && (
              <div className="absolute left-[31px] top-12 w-0.5 h-16 bg-border" />
            )}
            
            <div className={`p-4 rounded-lg border-2 transition-all ${
              item.type === 'task' 
                ? 'bg-primary/5 border-primary/20 hover:border-primary/40' 
                : 'bg-card border-border'
            }`}>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className={`w-16 h-16 rounded-lg flex flex-col items-center justify-center ${
                    item.type === 'task' ? 'bg-primary/10' : 'bg-muted'
                  }`}>
                    <div className="text-xs text-muted-foreground">{item.time.split(':')[0]}</div>
                    <div className="text-lg font-bold">{item.time.split(':')[1]}</div>
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="font-semibold mb-1">{item.title}</div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {item.duration}분
                    {item.type === 'task' && (
                      <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded">
                        작업
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <div className="text-sm text-muted-foreground text-center">
          총 작업 시간: 105분 (1시간 45분)
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => navigate('/checkin')}
          className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
        >
          중간 체크인하기
        </button>
      </div>
    </div>
  );
}
