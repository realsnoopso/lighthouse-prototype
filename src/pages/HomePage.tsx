import { useNavigate } from 'react-router-dom';

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
          onClick={() => navigate('/chat')}
          className="w-full p-8 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
        >
          <div className="text-center">
            <div className="text-4xl mb-3">💬</div>
            <h2 className="text-2xl font-bold mb-2">하루 시작하기</h2>
            <p className="text-sm opacity-90">
              아침 인터뷰부터 하루 마무리까지 연속된 대화로 진행됩니다
            </p>
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
