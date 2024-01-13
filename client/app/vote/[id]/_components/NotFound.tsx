import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function NotFound() {
  return (
    <Alert variant="destructive" className="mt-4">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        This FunkyPoll doesn&apos;t seem to exist. Please try again.
      </AlertDescription>
    </Alert>
  );
}
