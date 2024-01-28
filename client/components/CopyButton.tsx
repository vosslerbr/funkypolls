import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";

export default function CopyButton({ copyTitle, copyData }: { copyTitle: string; copyData: any }) {
  const [copiedPasscode, setCopiedPasscode] = useState(false);

  useEffect(() => {
    if (copiedPasscode) {
      const timeout = setTimeout(() => {
        setCopiedPasscode(false);
      }, 1500);

      return () => clearTimeout(timeout);
    }
  }, [copiedPasscode]);

  if (copiedPasscode) {
    return (
      <p className="flex flex-row items-center bg-green-100 text-green-700 w-min px-2 rounded-lg">
        Copied!
        <Check className="ml-2 h-4 w-4 text-green-400" />
      </p>
    );
  }

  return (
    <p
      className="flex flex-row items-center cursor-pointer bg-slate-100 text-slate-700 w-min px-2 rounded-lg"
      onClick={() => {
        navigator.clipboard.writeText(copyData);
        setCopiedPasscode(true);
      }}>
      {copyTitle}
      <Copy className="ml-2 h-4 w-4 text-slate-400" />
    </p>
  );
}
