"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { CreditCard } from "lucide-react";
import Button from "./Button";

type PaymentModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCheckout: () => void;
  loading?: boolean;
};

export default function PaymentModal({ open, onOpenChange, onCheckout, loading }: PaymentModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-md border border-brand-border bg-white p-6 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-50 text-brand">
              <CreditCard className="h-6 w-6" />
            </div>
            <div>
              <Dialog.Title className="text-xl font-semibold text-gray-900">
                Unlock your optimized resume
              </Dialog.Title>
              <Dialog.Description className="text-sm text-gray-600">
                Checkout to download the ATS-optimized PDF and generated cover letter.
              </Dialog.Description>
            </div>
          </div>
          <div className="mt-4 rounded-md bg-gray-50 p-4 text-sm text-gray-700">
            <ul className="list-disc space-y-1 pl-5">
              <li>ATS-optimized rewrite + keyword tuning</li>
              <li>Cover letter tailored to your job description</li>
              <li>PDF export with clean, parsable formatting</li>
            </ul>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Dialog.Close asChild>
              <Button variant="secondary">Cancel</Button>
            </Dialog.Close>
            <Button onClick={onCheckout} loading={loading}>
              Continue to checkout
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
