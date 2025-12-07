type ScoreCardProps = {
  score?: number;
  keywordMatch?: number;
  matchedKeywords?: string[];
  missingKeywords?: string[];
  length?: string;
  readability?: string;
};

const meterColors = [
  "bg-red-500",
  "bg-orange-500",
  "bg-yellow-400",
  "bg-emerald-400",
  "bg-green-500",
];

export default function ScoreCard({
  score,
  keywordMatch,
  matchedKeywords,
  missingKeywords,
  length,
  readability,
}: ScoreCardProps) {
  const safeScore = typeof score === "number" ? score : 0;
  const progressColor = meterColors[Math.min(Math.floor(safeScore / 20), meterColors.length - 1)];

  return (
    <div className="glass grid gap-4 rounded-md p-5 md:grid-cols-4">
      {typeof score !== "number" ? (
        <div className="md:col-span-4 text-center text-sm text-gray-600">
          Generate ATS Rewrite first
        </div>
      ) : (
        <>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-500">ATS Score</p>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="text-4xl font-semibold text-gray-900">{score}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                <div className={`h-full ${progressColor}`} style={{ width: `${safeScore}%` }} />
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-600">
              Higher scores mean cleaner formatting, stronger keywords, and clearer structure.
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Keyword coverage</p>
            <p className="mt-2 text-xl font-semibold text-gray-900">
              {typeof keywordMatch === "number" ? `${keywordMatch}%` : "Pending"}
            </p>
            <p className="text-xs text-gray-600">Match rate against the provided JD.</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Readability</p>
            <p className="mt-2 text-xl font-semibold text-gray-900">{readability ?? "—"}</p>
            <p className="text-xs text-gray-600">Length: {length ?? "—"}</p>
          </div>
          <div className="md:col-span-2 space-y-2">
            <p className="text-sm font-semibold text-gray-900">Keywords matched</p>
            <div className="flex flex-wrap gap-2 text-xs text-gray-800">
              {matchedKeywords?.length ? (
                matchedKeywords.map((kw) => (
                  <span
                    key={`match-${kw}`}
                    className="rounded-full bg-blue-50 px-2 py-1 text-[11px] font-medium text-brand"
                  >
                    {kw}
                  </span>
                ))
              ) : (
                <span className="text-gray-500">No matches yet</span>
              )}
            </div>
            <p className="text-sm font-semibold text-gray-900">Missing keywords</p>
            <div className="flex flex-wrap gap-2 text-xs text-gray-800">
              {missingKeywords?.length ? (
                missingKeywords.map((kw) => (
                  <span
                    key={`missing-${kw}`}
                    className="rounded-full bg-orange-50 px-2 py-1 text-[11px] font-medium text-orange-700"
                  >
                    {kw}
                  </span>
                ))
              ) : (
                <span className="text-gray-500">None detected</span>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
