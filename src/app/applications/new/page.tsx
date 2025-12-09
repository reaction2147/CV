import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApplicationForm } from "@/components/applications/application-form";

export default async function NewApplicationPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6">
      <PageHeader
        title="New application"
        description="Paste the job description, pick your tone, and get tailored drafts. Add your base CV first on the CV page."
      />
      <Card className="border border-border/70 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Job details</CardTitle>
        </CardHeader>
        <CardContent>
          <ApplicationForm />
        </CardContent>
      </Card>
    </div>
  );
}
