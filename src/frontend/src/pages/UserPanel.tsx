import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, RefreshCw, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { useResults } from "../hooks/useQueries";

const SKELETON_CARDS = ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5", "sk-6"];

export function UserPanel() {
  const { data: results = [], isLoading, dataUpdatedAt } = useResults();

  const lastUpdated = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString()
    : "—";

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Live Market Results
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <RefreshCw
              className="h-3.5 w-3.5 text-primary animate-spin"
              style={{ animationDuration: "3s" }}
            />
            <span className="text-sm text-muted-foreground">
              Auto-refreshing · Last updated: {lastUpdated}
            </span>
          </div>
        </div>
        <div
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 text-primary text-sm font-medium"
          style={{ backgroundColor: "oklch(0.82 0.185 90 / 0.1)" }}
        >
          <span className="h-2 w-2 bg-primary rounded-full animate-pulse" />
          LIVE
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SKELETON_CARDS.map((key, i) => (
            <div
              key={key}
              className="rounded-xl border border-border p-5 space-y-3"
              style={{ backgroundColor: "oklch(0.17 0 0)" }}
              data-ocid={`results.item.${i + 1}`}
            >
              <Skeleton
                className="h-4 w-32"
                style={{ backgroundColor: "oklch(0.22 0 0)" }}
              />
              <Skeleton
                className="h-8 w-20"
                style={{ backgroundColor: "oklch(0.22 0 0)" }}
              />
              <Skeleton
                className="h-3 w-full"
                style={{ backgroundColor: "oklch(0.22 0 0)" }}
              />
            </div>
          ))}
        </div>
      ) : results.length === 0 ? (
        <div
          className="rounded-xl border border-border p-16 text-center"
          data-ocid="results.empty_state"
          style={{ backgroundColor: "oklch(0.17 0 0)" }}
        >
          <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">
            No market results available yet.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Check back soon or contact the admin.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {results.map((result, idx) => (
            <motion.div
              key={result.id.toString()}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              data-ocid={`results.item.${idx + 1}`}
              className="rounded-xl border border-border p-5 shadow-card hover:border-primary/30 transition-colors"
              style={{ backgroundColor: "oklch(0.17 0 0)" }}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="h-9 w-9 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "oklch(0.82 0.185 90 / 0.15)" }}
                >
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  #{idx + 1}
                </span>
              </div>
              <h3 className="font-semibold text-foreground text-base leading-tight">
                {result.market_name}
              </h3>
              <p className="text-4xl font-black text-primary mt-2 mb-3">
                {result.result_value}
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {result.time}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {result.date}
                </span>
              </div>
              <div className="mt-4">
                <Progress
                  value={((idx + 1) / results.length) * 100}
                  className="h-1 bg-secondary"
                />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </main>
  );
}
