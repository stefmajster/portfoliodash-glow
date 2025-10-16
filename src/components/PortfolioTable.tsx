import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface PositionData {
  id: string;
  instrument: string;
  entity: string;
  rowId: string;
  marketValue: number;
  exposure: number;
  expWeight: number;
  pnlDtd: number;
  pnlMtd: number;
  pnlYtd: number;
  portfolio: string;
  isNew?: boolean;
  flashField?: string;
  flashType?: "positive" | "negative";
}

const mockData: PositionData[] = [
  {
    id: "1",
    instrument: "AAPL US Equity",
    entity: "Tech Portfolio Ltd",
    rowId: "POS-2024-001",
    marketValue: 2547832.45,
    exposure: 2547832.45,
    expWeight: 12.47,
    pnlDtd: 15234.67,
    pnlMtd: 87543.21,
    pnlYtd: 234567.89,
    portfolio: "US Tech Growth",
  },
  {
    id: "2",
    instrument: "MSFT US Equity",
    entity: "Tech Portfolio Ltd",
    rowId: "POS-2024-002",
    marketValue: 1876234.12,
    exposure: 1876234.12,
    expWeight: 9.18,
    pnlDtd: -8432.55,
    pnlMtd: 45678.90,
    pnlYtd: 156789.23,
    portfolio: "US Tech Growth",
  },
  {
    id: "3",
    instrument: "GOOGL US Equity",
    entity: "Tech Portfolio Ltd",
    rowId: "POS-2024-003",
    marketValue: 1654321.78,
    exposure: 1654321.78,
    expWeight: 8.09,
    pnlDtd: 12456.89,
    pnlMtd: -23456.78,
    pnlYtd: 98765.43,
    portfolio: "US Tech Growth",
  },
  {
    id: "4",
    instrument: "TSLA US Equity",
    entity: "Growth Ventures Inc",
    rowId: "POS-2024-004",
    marketValue: 987654.32,
    exposure: 987654.32,
    expWeight: 4.83,
    pnlDtd: -15678.90,
    pnlMtd: -34567.89,
    pnlYtd: -45678.90,
    portfolio: "EV Innovation",
  },
  {
    id: "5",
    instrument: "NVDA US Equity",
    entity: "Tech Portfolio Ltd",
    rowId: "POS-2024-005",
    marketValue: 3245678.90,
    exposure: 3245678.90,
    expWeight: 15.88,
    pnlDtd: 23456.78,
    pnlMtd: 123456.78,
    pnlYtd: 456789.12,
    portfolio: "US Tech Growth",
  },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
};

const formatPercent = (value: number) => {
  return `${value.toFixed(2)}%`;
};

const getValueColorClass = (value: number) => {
  if (value > 0) return "text-positive";
  if (value < 0) return "text-negative";
  return "text-neutral";
};

export const PortfolioTable = () => {
  const [data, setData] = useState<PositionData[]>(mockData);

  // Simulate live updates - multiple cells at once
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prevData) => {
        const newData = [...prevData];
        
        // Update 3-4 random cells at once
        const numUpdates = 3 + Math.floor(Math.random() * 2); // 3 or 4 updates
        const updatedIds = new Set<string>();
        
        for (let i = 0; i < numUpdates && updatedIds.size < newData.length; i++) {
          let randomIndex = Math.floor(Math.random() * newData.length);
          
          // Make sure we don't update the same row twice in one cycle
          while (updatedIds.has(newData[randomIndex].id)) {
            randomIndex = Math.floor(Math.random() * newData.length);
          }
          
          const item = { ...newData[randomIndex] };
          updatedIds.add(item.id);
          
          // Randomly update a numeric field
          const fields = ["marketValue", "exposure", "pnlDtd", "pnlMtd", "pnlYtd"];
          const randomField = fields[Math.floor(Math.random() * fields.length)];
          const oldValue = item[randomField as keyof PositionData] as number;
          const change = (Math.random() - 0.5) * oldValue * 0.08; // ±8% change for more visibility
          const newValue = oldValue + change;
          
          item[randomField as keyof PositionData] = newValue as never;
          item.flashField = randomField;
          item.flashType = change > 0 ? "positive" : "negative";
          
          newData[randomIndex] = item;
        }
        
        // Clear flash after animation
        setTimeout(() => {
          setData((currentData) =>
            currentData.map((d) =>
              updatedIds.has(d.id) ? { ...d, flashField: undefined, flashType: undefined } : d
            )
          );
        }, 1000);
        
        return newData;
      });
    }, 1200); // Update every 1.2 seconds instead of 3

    return () => clearInterval(interval);
  }, []);

  // Simulate new row addition
  useEffect(() => {
    const timeout = setTimeout(() => {
      const newRow: PositionData = {
        id: "new-1",
        instrument: "META US Equity",
        entity: "Social Media Fund",
        rowId: "POS-2024-006",
        marketValue: 1432567.89,
        exposure: 1432567.89,
        expWeight: 7.01,
        pnlDtd: 8765.43,
        pnlMtd: 34567.89,
        pnlYtd: 87654.32,
        portfolio: "Tech Diversified",
        isNew: true,
      };

      setData((prev) => [...prev, newRow]);

      setTimeout(() => {
        setData((current) =>
          current.map((d) => (d.id === newRow.id ? { ...d, isNew: false } : d))
        );
      }, 1200);
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  const getCellAnimation = (item: PositionData, field: string) => {
    if (item.flashField === field && item.flashType === "positive") {
      return "animate-flash-positive";
    }
    if (item.flashField === field && item.flashType === "negative") {
      return "animate-flash-negative";
    }
    return "";
  };

  return (
    <ScrollArea className="w-full rounded-md border border-border">
      <Table className="min-w-max">
        <TableHeader>
          <TableRow className="border-b border-border hover:bg-transparent">
            <TableHead className="whitespace-nowrap text-xs font-semibold uppercase tracking-wider text-muted-foreground min-w-[150px]">
              Instrument
            </TableHead>
            <TableHead className="whitespace-nowrap text-xs font-semibold uppercase tracking-wider text-muted-foreground min-w-[180px]">
              Entity
            </TableHead>
            <TableHead className="whitespace-nowrap text-xs font-semibold uppercase tracking-wider text-muted-foreground min-w-[120px]">
              Row ID
            </TableHead>
            <TableHead className="whitespace-nowrap text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground min-w-[160px]">
              Market Value (BASE)
            </TableHead>
            <TableHead className="whitespace-nowrap text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground min-w-[180px]">
              Exposure (NET BASE)
            </TableHead>
            <TableHead className="whitespace-nowrap text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground min-w-[150px]">
              Exp Weight (NET %)
            </TableHead>
            <TableHead className="whitespace-nowrap text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground min-w-[150px]">
              P&L - DTD (BASE)
            </TableHead>
            <TableHead className="whitespace-nowrap text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground min-w-[150px]">
              P&L - MTD (BASE)
            </TableHead>
            <TableHead className="whitespace-nowrap text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground min-w-[150px]">
              P&L - YTD (BASE)
            </TableHead>
            <TableHead className="whitespace-nowrap text-xs font-semibold uppercase tracking-wider text-muted-foreground min-w-[160px]">
              Portfolio
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow
              key={item.id}
              className={`
                border-b border-border/50 transition-colors
                ${index % 2 === 0 ? "bg-table-row-even" : "bg-table-row-odd"}
                hover:bg-table-row-hover
                ${item.isNew ? "animate-glow-new" : ""}
              `}
            >
              <TableCell className="whitespace-nowrap font-mono text-sm text-foreground max-w-[150px] truncate">
                {item.instrument}
              </TableCell>
              <TableCell className="whitespace-nowrap text-sm text-muted-foreground max-w-[180px] truncate">
                {item.entity}
              </TableCell>
              <TableCell className="whitespace-nowrap font-mono text-xs text-muted-foreground">
                {item.rowId}
              </TableCell>
              <TableCell
                className={`whitespace-nowrap text-right font-mono text-sm tabular-nums ${getCellAnimation(
                  item,
                  "marketValue"
                )}`}
              >
                {formatCurrency(item.marketValue)}
              </TableCell>
              <TableCell
                className={`whitespace-nowrap text-right font-mono text-sm tabular-nums ${getCellAnimation(
                  item,
                  "exposure"
                )}`}
              >
                {formatCurrency(item.exposure)}
              </TableCell>
              <TableCell
                className={`whitespace-nowrap text-right font-mono text-sm tabular-nums ${getCellAnimation(
                  item,
                  "expWeight"
                )}`}
              >
                {formatPercent(item.expWeight)}
              </TableCell>
              <TableCell
                className={`whitespace-nowrap text-right font-mono text-sm tabular-nums ${getValueColorClass(
                  item.pnlDtd
                )} ${getCellAnimation(item, "pnlDtd")}`}
              >
                {formatCurrency(item.pnlDtd)}
              </TableCell>
              <TableCell
                className={`whitespace-nowrap text-right font-mono text-sm tabular-nums ${getValueColorClass(
                  item.pnlMtd
                )} ${getCellAnimation(item, "pnlMtd")}`}
              >
                {formatCurrency(item.pnlMtd)}
              </TableCell>
              <TableCell
                className={`whitespace-nowrap text-right font-mono text-sm tabular-nums ${getValueColorClass(
                  item.pnlYtd
                )} ${getCellAnimation(item, "pnlYtd")}`}
              >
                {formatCurrency(item.pnlYtd)}
              </TableCell>
              <TableCell className="whitespace-nowrap text-sm text-muted-foreground max-w-[160px] truncate">
                {item.portfolio}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
