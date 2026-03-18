// Circular SVG progress ring for AI match score display

interface ScoreRingProps {
    score: number // 0-100
    size?: number
}

function ringColor(score: number): string {
    if (score >= 80) return "#10B981" // emerald
    if (score >= 60) return "#F59E0B" // amber
    return "#EF4444"                  // red
}

export default function ScoreRing({ score, size = 40 }: ScoreRingProps) {
    const color = ringColor(score)
    const fontSize = size <= 40 ? "10px" : "12px"

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg className="w-full h-full" viewBox="0 0 36 36">
                {/* Track */}
                <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E2E8F0"
                    strokeWidth="3"
                />
                {/* Progress */}
                <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={color}
                    strokeWidth="3"
                    strokeDasharray={`${score}, 100`}
                    strokeLinecap="round"
                />
            </svg>
            <div
                className="absolute inset-0 flex items-center justify-center font-bold"
                style={{ fontSize }}
            >
                {score}%
            </div>
        </div>
    )
}
