import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import type { Result } from "../backend";

interface ResultModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Result, "id">) => Promise<void>;
  editData?: Result | null;
  isLoading: boolean;
}

interface FormState {
  market_name: string;
  time: string;
  result_value: string;
  date: string;
}

function getInitialForm(editData?: Result | null): FormState {
  if (editData) {
    return {
      market_name: editData.market_name,
      time: editData.time,
      result_value: editData.result_value,
      date: editData.date,
    };
  }
  return {
    market_name: "",
    time: "",
    result_value: "",
    date: new Date().toISOString().slice(0, 10),
  };
}

function ModalForm({
  editData,
  onClose,
  onSubmit,
  isLoading,
}: Omit<ResultModalProps, "open">) {
  const [form, setForm] = useState<FormState>(() => getInitialForm(editData));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label
          htmlFor="modal_market_name"
          className="text-sm text-muted-foreground"
        >
          Market Name
        </Label>
        <Input
          id="modal_market_name"
          data-ocid="result.market_name.input"
          value={form.market_name}
          onChange={(e) =>
            setForm((p) => ({ ...p, market_name: e.target.value }))
          }
          placeholder="e.g. Mumbai Main"
          required
          className="bg-secondary border-border text-foreground"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="modal_time" className="text-sm text-muted-foreground">
          Time
        </Label>
        <Input
          id="modal_time"
          data-ocid="result.time.input"
          value={form.time}
          onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))}
          placeholder="e.g. 09:00 AM"
          required
          className="bg-secondary border-border text-foreground"
        />
      </div>
      <div className="space-y-2">
        <Label
          htmlFor="modal_result_value"
          className="text-sm text-muted-foreground"
        >
          Result Value
        </Label>
        <Input
          id="modal_result_value"
          data-ocid="result.result_value.input"
          value={form.result_value}
          onChange={(e) =>
            setForm((p) => ({ ...p, result_value: e.target.value }))
          }
          placeholder="e.g. 456"
          required
          className="bg-secondary border-border text-foreground"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="modal_date" className="text-sm text-muted-foreground">
          Date
        </Label>
        <Input
          id="modal_date"
          data-ocid="result.date.input"
          type="date"
          value={form.date}
          onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
          required
          className="bg-secondary border-border text-foreground"
        />
      </div>
      <DialogFooter className="pt-2">
        <Button
          type="button"
          data-ocid="result.cancel.button"
          variant="secondary"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          data-ocid="result.submit.button"
          disabled={isLoading}
          className="bg-primary text-primary-foreground hover:opacity-90"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...
            </>
          ) : editData ? (
            "Update"
          ) : (
            "Add Result"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function ResultModal({
  open,
  onClose,
  onSubmit,
  editData,
  isLoading,
}: ResultModalProps) {
  const modalKey = open
    ? editData
      ? `edit-${editData.id.toString()}`
      : "new"
    : "closed";

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        key={modalKey}
        data-ocid="result.dialog"
        className="sm:max-w-md border-border"
        style={{ backgroundColor: "oklch(0.17 0 0)" }}
      >
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {editData ? "Edit Market Result" : "Add New Result"}
          </DialogTitle>
        </DialogHeader>
        <ModalForm
          editData={editData}
          onClose={onClose}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
