import { Loader2 } from "lucide-react";

export function Loading() {
  return (
    <div className=" flex justify-center items-center">
      <Loader2 className="w-12 h-12 text-gray-500 mx-auto animate-spin" />
    </div>
  );
}
