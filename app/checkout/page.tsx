"use client";

import Button from "@/components/Button";
import PageHeader from "@/components/PageHeader";
import { formatCurrency } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";

type Plan = {
  name: string;
  priceInCents: number;
  description: string;
};

const plans: Plan[] = [
  {
    name: "Download Optimized Resume",
    priceInCents: 299,
    description: "One-time download of your ATS-optimized resume.",
  },
  {
    name: "Resume + Cover Letter Bundle",
    priceInCents: 399,
    description: "Resume plus a tailored cover letter for your target role.",
  },
  {
    name: "Unlimited for 30 Days",
    priceInCents: 999,
    description: "Unlimited rewrites, JD matches, and downloads for 30 days.",
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resumeId = searchParams.get("resume_id") ?? undefined;

  const checkoutMutation = useMutation({
    mutationFn: async (priceInCents: number) => {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceInCents, resumeId }),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json() as Promise<{ url: string }>;
    },
    onSuccess: ({ url }) => {
      if (url) window.location.href = url;
    },
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Checkout"
        subtitle="Choose the plan that fits your search. Upgrade unlocks blur-free previews and PDF downloads."
      />

      <div className="grid gap-4">
        {plans.map((plan) => (
          <div key={plan.name} className="glass flex items-center justify-between rounded-md p-5 shadow-card">
            <div>
              <p className="text-lg font-semibold text-gray-900">{plan.name}</p>
              <p className="text-sm text-gray-700">{plan.description}</p>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(plan.priceInCents)}</p>
              <Button
                onClick={() => checkoutMutation.mutate(plan.priceInCents)}
                loading={checkoutMutation.isPending}
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500">
        Need help? <button className="underline" onClick={() => router.push("/upload")}>Go back to upload</button>
      </p>
    </div>
  );
}
