import { maxStringFieldLength } from "@/lib/constants";

export default function CharacterCount({ currentLength }: { currentLength: number }) {
  return <span className="text-gray-400">Characters left: {maxStringFieldLength - currentLength}</span>;
}
