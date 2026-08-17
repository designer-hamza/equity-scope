import { useState } from "react";
import { SectionHeading } from "@/components/finance/primitives";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatStatementValue } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { CompanyAnalysis, Period } from "@/types/finance";

interface LineDef {
  label: string;
  key: string;
  emphasis?: boolean;
}

const INCOME_LINES: LineDef[] = [
  { label: "Revenue", key: "revenue", emphasis: true },
  { label: "Cost of Revenue", key: "costOfRevenue" },
  { label: "Gross Profit", key: "grossProfit", emphasis: true },
  { label: "Operating Expenses", key: "operatingExpenses" },
  { label: "Operating Income", key: "operatingIncome", emphasis: true },
  { label: "EBITDA", key: "ebitda" },
  { label: "Interest Expense", key: "interestExpense" },
  { label: "Pre-Tax Income", key: "pretaxIncome" },
  { label: "Taxes", key: "taxes" },
  { label: "Net Income", key: "netIncome", emphasis: true },
];

const BALANCE_LINES: LineDef[] = [
  { label: "Cash", key: "cash" },
  { label: "Accounts Receivable", key: "accountsReceivable" },
  { label: "Inventory", key: "inventory" },
  { label: "Total Current Assets", key: "totalCurrentAssets", emphasis: true },
  { label: "Property, Plant & Equipment", key: "ppe" },
  { label: "Total Assets", key: "totalAssets", emphasis: true },
  { label: "Current Liabilities", key: "currentLiabilities" },
  { label: "Long-Term Debt", key: "longTermDebt" },
  { label: "Total Liabilities", key: "totalLiabilities", emphasis: true },
  { label: "Shareholders' Equity", key: "shareholdersEquity", emphasis: true },
];

const CASHFLOW_LINES: LineDef[] = [
  { label: "Operating Cash Flow", key: "operatingCashFlow", emphasis: true },
  { label: "Capital Expenditures", key: "capex" },
  { label: "Investing Cash Flow", key: "investingCashFlow" },
  { label: "Financing Cash Flow", key: "financingCashFlow" },
  { label: "Free Cash Flow", key: "freeCashFlow", emphasis: true },
];

function StatementTable({
  rows,
  lines,
}: {
  rows: Record<string, string | number>[];
  lines: LineDef[];
}) {
  const periods = rows.map((r) => String(r.period));
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="sticky left-0 min-w-[200px] bg-card">Line item</TableHead>
            {periods.map((p) => (
              <TableHead key={p} className="text-right num">
                {p}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {lines.map((line) => (
            <TableRow key={line.key}>
              <TableCell
                className={cn(
                  "sticky left-0 bg-card text-sm",
                  line.emphasis && "font-semibold",
                )}
              >
                {line.label}
              </TableCell>
              {rows.map((r) => (
                <TableCell
                  key={`${line.key}-${r.period}`}
                  className={cn("text-right num text-sm", line.emphasis && "font-semibold")}
                >
                  {formatStatementValue(Number(r[line.key] ?? 0))}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function StatementsSection({ analysis }: { analysis: CompanyAnalysis }) {
  const [period, setPeriod] = useState<Period>("annual");
  const statements = analysis.statements[period];
  const limit = period === "annual" ? 6 : 8;

  return (
    <section>
      <SectionHeading
        title="Financial statements"
        description={`Values in millions of ${analysis.company.currency}. Latest ${limit} reporting periods.`}
        action={
          <div className="flex gap-1.5">
            {(["annual", "quarterly"] as Period[]).map((p) => (
              <Button
                key={p}
                size="sm"
                variant={period === p ? "default" : "outline"}
                className="capitalize"
                onClick={() => setPeriod(p)}
              >
                {p}
              </Button>
            ))}
          </div>
        }
      />
      <Tabs defaultValue="income">
        <TabsList>
          <TabsTrigger value="income">Income Statement</TabsTrigger>
          <TabsTrigger value="balance">Balance Sheet</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow Statement</TabsTrigger>
        </TabsList>
        <TabsContent value="income" className="mt-4">
          <StatementTable
            rows={statements.income.slice(-limit) as unknown as Record<string, string | number>[]}
            lines={INCOME_LINES}
          />
        </TabsContent>
        <TabsContent value="balance" className="mt-4">
          <StatementTable
            rows={statements.balance.slice(-limit) as unknown as Record<string, string | number>[]}
            lines={BALANCE_LINES}
          />
        </TabsContent>
        <TabsContent value="cashflow" className="mt-4">
          <StatementTable
            rows={
              statements.cashFlow.slice(-limit) as unknown as Record<string, string | number>[]
            }
            lines={CASHFLOW_LINES}
          />
        </TabsContent>
      </Tabs>
    </section>
  );
}
