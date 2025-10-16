import { PortfolioTable } from "@/components/PortfolioTable";
import { Activity } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-[1800px] space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <Activity className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Portfolio Monitor
              </h1>
              <p className="text-sm text-muted-foreground">
                Real-time position tracking and performance analytics
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-md bg-card px-4 py-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            <span className="text-xs font-medium text-muted-foreground">
              LIVE
            </span>
          </div>
        </div>

        {/* Table */}
        <PortfolioTable />

        {/* Footer info */}
        <div className="flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
          <div>
            <span className="text-positive">● Positive values</span>
            <span className="mx-4 text-negative">● Negative values</span>
            <span className="text-neutral">● Neutral values</span>
          </div>
          <div>Last updated: {new Date().toLocaleTimeString()}</div>
        </div>
      </div>
    </div>
  );
};

export default Index;
