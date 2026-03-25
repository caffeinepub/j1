import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Result } from "../backend";
import { ResultModal } from "../components/ResultModal";
import {
  useAddResult,
  useDeleteResult,
  useResults,
  useUpdateResult,
} from "../hooks/useQueries";

const SKELETON_ROWS = ["sk-1", "sk-2", "sk-3", "sk-4"];
const SKELETON_COLS = ["c1", "c2", "c3", "c4", "c5", "c6"];

export function AdminDashboard() {
  const { data: results = [], isLoading, dataUpdatedAt } = useResults();
  const addResult = useAddResult();
  const updateResult = useUpdateResult();
  const deleteResult = useDeleteResult();

  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<Result | null>(null);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);

  const lastUpdated = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString()
    : "—";

  const handleAdd = () => {
    setEditData(null);
    setModalOpen(true);
  };

  const handleEdit = (result: Result) => {
    setEditData(result);
    setModalOpen(true);
  };

  const handleModalSubmit = async (data: Omit<Result, "id">) => {
    try {
      if (editData) {
        await updateResult.mutateAsync({ ...data, id: editData.id });
        toast.success("Result updated successfully");
      } else {
        await addResult.mutateAsync({ ...data, id: BigInt(Date.now()) });
        toast.success("Result added successfully");
      }
      setModalOpen(false);
    } catch {
      toast.error(
        editData ? "Failed to update result" : "Failed to add result",
      );
    }
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    try {
      await deleteResult.mutateAsync(deleteId);
      toast.success("Result deleted");
    } catch {
      toast.error("Failed to delete result");
    } finally {
      setDeleteId(null);
    }
  };

  const stats = [
    {
      key: "total",
      label: "Total Markets",
      value: results.length,
      unit: "entries",
    },
    {
      key: "dates",
      label: "Unique Dates",
      value: new Set(results.map((r) => r.date)).size,
      unit: "days",
    },
    {
      key: "latest",
      label: "Latest Result",
      value: results[0]?.result_value ?? "—",
      unit: results[0]?.market_name ?? "",
    },
  ];

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage market results · Last updated: {lastUpdated}
        </p>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            Manage Market Results
          </h2>
          <Button
            data-ocid="admin.add.primary_button"
            onClick={handleAdd}
            className="bg-primary text-primary-foreground hover:opacity-90 gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Entry
          </Button>
        </div>

        <div
          className="rounded-xl border border-border overflow-hidden shadow-card"
          style={{ backgroundColor: "oklch(0.17 0 0)" }}
        >
          <div
            className="px-5 py-3 border-b border-border flex items-center gap-2"
            style={{ backgroundColor: "oklch(0.22 0 0)" }}
          >
            <span className="text-sm font-semibold text-foreground">
              Live Market Results
            </span>
            <RefreshCw
              className="h-3.5 w-3.5 text-muted-foreground ml-auto animate-spin"
              style={{ animationDuration: "3s" }}
            />
          </div>
          <Table data-ocid="admin.results.table">
            <TableHeader>
              <TableRow
                className="border-border hover:bg-transparent"
                style={{ backgroundColor: "oklch(0.22 0 0)" }}
              >
                <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wide">
                  #
                </TableHead>
                <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wide">
                  Market Name
                </TableHead>
                <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wide">
                  Time
                </TableHead>
                <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wide">
                  Result
                </TableHead>
                <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wide">
                  Date
                </TableHead>
                <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wide text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                SKELETON_ROWS.map((rowKey) => (
                  <TableRow key={rowKey} className="border-border">
                    {SKELETON_COLS.map((colKey) => (
                      <TableCell key={colKey}>
                        <Skeleton
                          className="h-4 w-24"
                          style={{ backgroundColor: "oklch(0.22 0 0)" }}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : results.length === 0 ? (
                <TableRow className="border-border">
                  <TableCell
                    colSpan={6}
                    className="text-center py-12"
                    data-ocid="admin.results.empty_state"
                  >
                    <p className="text-muted-foreground">
                      No results yet. Add your first entry.
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                results.map((result, idx) => (
                  <TableRow
                    key={result.id.toString()}
                    data-ocid={`admin.results.item.${idx + 1}`}
                    className="border-border hover:bg-secondary/40 transition-colors"
                  >
                    <TableCell className="text-muted-foreground text-sm">
                      {idx + 1}
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      {result.market_name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {result.time}
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-primary text-lg">
                        {result.result_value}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {result.date}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          data-ocid={`admin.results.edit_button.${idx + 1}`}
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(result)}
                          className="border-primary/50 text-primary hover:bg-primary/10 gap-1 h-7"
                        >
                          <Pencil className="h-3 w-3" />
                          Edit
                        </Button>
                        <Button
                          data-ocid={`admin.results.delete_button.${idx + 1}`}
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteId(result.id)}
                          className="border-destructive/50 text-destructive hover:bg-destructive/10 gap-1 h-7"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Live Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat, i) => (
            <div
              key={stat.key}
              data-ocid={`admin.stat.card.${i + 1}`}
              className="rounded-xl border border-border p-5 shadow-card"
              style={{ backgroundColor: "oklch(0.17 0 0)" }}
            >
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                {stat.label}
              </p>
              <p className="text-3xl font-black text-primary mt-1">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {stat.unit}
              </p>
              <div className="mt-3 h-1 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{
                    width: `${Math.min(100, Number(stat.value) * 10 || 50)}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <ResultModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        editData={editData}
        isLoading={addResult.isPending || updateResult.isPending}
      />

      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(v) => !v && setDeleteId(null)}
      >
        <AlertDialogContent
          data-ocid="admin.delete.dialog"
          className="border-border"
          style={{ backgroundColor: "oklch(0.17 0 0)" }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">
              Delete Result
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to delete this market result? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              data-ocid="admin.delete.cancel_button"
              className="bg-secondary border-border text-foreground hover:bg-secondary/80"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="admin.delete.confirm_button"
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:opacity-90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
