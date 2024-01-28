import { Status } from "@prisma/client";

/**
 * Maps poll status to color, for consistent styling. Has to be in a tsx file for Tailwind to work.
 */
export const statusColorMap: { [key in Status]: string } = {
  DRAFT: "bg-violet-100 text-violet-700",
  OPEN: "bg-emerald-100 text-emerald-700",
  EXPIRED: "bg-orange-100 text-orange-700",
  ARCHIVED: "bg-rose-100 text-rose-700",
};

export default function PollStatus({ status }: { status: Status }) {
  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded ${statusColorMap[status]}`}>
      {status}
    </span>
  );
}
