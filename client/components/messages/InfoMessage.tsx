import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

export default function InfoMessage({ title, message }: { title: string; message: string }) {
  return (
    <Alert className="bg-slate-100 text-slate-700 border border-slate-500/50">
      <AlertTitle className="text-lg">{title}</AlertTitle>
      <AlertDescription className="text-md">{message}</AlertDescription>
    </Alert>
  );
}
