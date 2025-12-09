import { Button } from "@/components/ui/button";
import { CV_PRICE_LABEL } from "@/lib/config";

export function PaywallCTA({
  locked,
  unlockHref,
}: {
  locked: boolean;
  unlockHref: string;
}) {
  if (!locked) return null;
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <Button asChild className="flex-1">
        <a href={unlockHref}>Unlock Full CV ({CV_PRICE_LABEL})</a>
      </Button>
      <Button variant="outline" className="flex-1" type="button">
        Regenerate for free
      </Button>
    </div>
  );
}
