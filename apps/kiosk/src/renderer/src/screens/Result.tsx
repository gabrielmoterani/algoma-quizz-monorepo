import { usePageStore } from '@/store'

function Result(): JSX.Element {
  const { setPage, pagePayload } = usePageStore((store) => store)

  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center">
      <div className="card w-full max-w-2xl shadow-xl">
        <div className="card-body text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="text-success">
              {/* biome-ignore lint/a11y/noSvgWithoutTitle: Not a web application */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-24 h-24"
                aria-label="Success Icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          {/* Thank You Message */}
          <h2 className="text-3xl font-bold text-primary mb-4">Thank You for Participating!</h2>

          <div className="space-y-4">
            <p className="text-xl text-base-content/80">
              Your answer has been successfully recorded.
            </p>
            <div className="alert alert-info shadow-lg">
              <div className="flex items-center">
                {/* biome-ignore lint/a11y/noSvgWithoutTitle: Not a web application */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="stroke-current shrink-0 w-6 h-6"
                  aria-label="Info Icon"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>The correct answers will be available tomorrow.</span>
              </div>
            </div>
          </div>

          {/* Return Home Button */}
          <div className="card-actions justify-center mt-8">
            <button
              onClick={() => setPage('user', { studentId: pagePayload?.studentId })}
              className="btn btn-primary btn-lg"
              type="button"
            >
              Check your student page
            </button>
          </div>
          <div className="card-actions justify-between mt-8">
            <button type="button" className="btn btn-ghost" onClick={() => setPage('home')}>
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Result
