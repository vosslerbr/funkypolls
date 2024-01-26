import { maxStringFieldLength } from "@/lib/constants";

export default function CharacterCount({ currentLength }: { currentLength: number }) {
  return <span className="text-slate-400">Characters left: {maxStringFieldLength - currentLength}</span>;
}
