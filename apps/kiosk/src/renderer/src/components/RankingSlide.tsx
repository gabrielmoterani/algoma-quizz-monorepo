import { useMemo } from 'react'

function RankingSlide({ ranking }: { ranking: Map<string, number> }) {
  // Convert map to array and sort by value in descending order
  const rankingArray = useMemo(
    () =>
      Array.from(ranking)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5),
    [ranking]
  )

  return (
    <div className="flex flex-col h-full min-h-[500px] text-center justify-center items-center">
      <div className="w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-center mb-8">Top 5 Players</h2>
        <div className="flex flex-col gap-4">
          {rankingArray.map(([name, score], index) => (
            <div
              key={name}
              className="flex items-center gap-4 p-4 bg-base-200 rounded-lg shadow-md"
            >
              <div className="text-2xl font-bold w-12 text-center">#{index + 1}</div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{name}</h3>
              </div>
              <div className="badge badge-primary badge-lg">{score} pts</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RankingSlide
