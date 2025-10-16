import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prevData) => {
        const newData = [...prevData];
        const randomIndex = Math.floor(Math.random() * newData.length);
        const item = { ...newData[randomIndex] };
        
        // Randomly update a numeric field
        const fields = ["marketValue", "exposure", "pnlDtd", "pnlMtd", "pnlYtd"];
        const randomField = fields[Math.floor(Math.random() * fields.length)];
        const oldValue = item[randomField as keyof PositionData] as number;
        const change = (Math.random() - 0.5) * oldValue * 0.05; // ±5% change
        const newValue = oldValue + change;
        
        item[randomField as keyof PositionData] = newValue as never;
        item.flashField = randomField;
        item.flashType = change > 0 ? "positive" : "negative";
        
        newData[randomIndex] = item;
        
        // Clear flash after animation
        setTimeout(() => {
          setData((currentData) =>
            currentData.map((d) =>
              d.id === item.id ? { ...d, flashField: undefined, flashType: undefined } : d
            )
          );
        }, 1000);
        
        return newData;
      });
    }, 3000);

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
    <div className="w-full overflow-auto rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border hover:bg-transparent">
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Instrument
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Entity
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Row ID
            </TableHead>
            <TableHead className="text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Market Value (BASE)
            </TableHead>
            <TableHead className="text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Exposure (NET BASE)
            </TableHead>
            <TableHead className="text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Exp Weight (NET %)
            </TableHead>
            <TableHead className="text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              P&L - DTD (BASE)
            </TableHead>
            <TableHead className="text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              P&L - MTD (BASE)
            </TableHead>
            <TableHead className="text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              P&L - YTD (BASE)
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
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
              <TableCell className="font-mono text-sm text-foreground">
                {item.instrument}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {item.entity}
              </TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">
                {item.rowId}
              </TableCell>
              <TableCell
                className={`text-right font-mono text-sm tabular-nums ${getCellAnimation(
                  item,
                  "marketValue"
                )}`}
              >
                {formatCurrency(item.marketValue)}
              </TableCell>
              <TableCell
                className={`text-right font-mono text-sm tabular-nums ${getCellAnimation(
                  item,
                  "exposure"
                )}`}
              >
                {formatCurrency(item.exposure)}
              </TableCell>
              <TableCell
                className={`text-right font-mono text-sm tabular-nums ${getCellAnimation(
                  item,
                  "expWeight"
                )}`}
              >
                {formatPercent(item.expWeight)}
              </TableCell>
              <TableCell
                className={`text-right font-mono text-sm tabular-nums ${getValueColorClass(
                  item.pnlDtd
                )} ${getCellAnimation(item, "pnlDtd")}`}
              >
                {formatCurrency(item.pnlDtd)}
              </TableCell>
              <TableCell
                className={`text-right font-mono text-sm tabular-nums ${getValueColorClass(
                  item.pnlMtd
                )} ${getCellAnimation(item, "pnlMtd")}`}
              >
                {formatCurrency(item.pnlMtd)}
              </TableCell>
              <TableCell
                className={`text-right font-mono text-sm tabular-nums ${getValueColorClass(
                  item.pnlYtd
                )} ${getCellAnimation(item, "pnlYtd")}`}
              >
                {formatCurrency(item.pnlYtd)}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {item.portfolio}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
