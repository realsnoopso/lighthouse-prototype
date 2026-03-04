import { useNavigate } from 'react-router-dom';
import { Sun, Calendar, CheckSquare, BarChart3 } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Lighthouse</h1>
        <p className="text-muted-foreground">
          ADHD를 위한 생산성 도우미 프로토타입
        </p>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => navigate('/morning')}
          className="w-full p-6 bg-card border border-border rounded-lg hover:bg-accent transition-colors text-left group"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
              <Sun className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2">아침 인터뷰</h2>
              <p className="text-sm text-muted-foreground">
                오늘의 일정 확인, 에너지 레벨 체크, 우선순위 설정
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={() => navigate('/daily')}
          className="w-full p-6 bg-card border border-border rounded-lg hover:bg-accent transition-colors text-left group"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2">오늘 일정 보기</h2>
              <p className="text-sm text-muted-foreground">
                타임라인 뷰로 오늘의 작업 확인
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={() => navigate('/checkin')}
          className="w-full p-6 bg-card border border-border rounded-lg hover:bg-accent transition-colors text-left group"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
              <CheckSquare className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2">중간 체크인</h2>
              <p className="text-sm text-muted-foreground">
                진행 상황 빠르게 업데이트
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={() => navigate('/retro')}
          className="w-full p-6 bg-card border border-border rounded-lg hover:bg-accent transition-colors text-left group"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2">하루 마무리</h2>
              <p className="text-sm text-muted-foreground">
                오늘의 성과 돌아보기
              </p>
            </div>
          </div>
        </button>
      </div>

      <div className="mt-12 p-6 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">프로토타입 안내</h3>
        <p className="text-sm text-muted-foreground">
          이 프로토타입은 AI가 실제로 작동하지 않고 미리 준비된 시나리오로 동작합니다.
          각 단계를 진행하며 사용자 경험을 테스트해보세요.
        </p>
      </div>
    </div>
  );
}
