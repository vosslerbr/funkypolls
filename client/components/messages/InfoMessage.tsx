import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

export default function InfoMessage({ title, message }: { title: string; message: string }) {
  return (
    <Alert className="bg-gray-100 text-gray-700 border border-gray-500/50">
      <AlertTitle className="text-lg">{title}</AlertTitle>
      <AlertDescription className="text-md">{message}</AlertDescription>
    </Alert>
  );
}
