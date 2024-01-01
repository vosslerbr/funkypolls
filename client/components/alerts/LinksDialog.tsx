import { Links } from "@/lib/helpers.ts/getPollAndAnswers";

import Link from "next/link";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";

export default function LinksDialog({
  links,
  open,
  setShowLinksDialog,
}: {
  links: Links | null;
  open: boolean;
  setShowLinksDialog: (open: boolean) => void;
}) {
  if (!links) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setShowLinksDialog(open);
      }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Success!</DialogTitle>
          <DialogDescription>Your FunkyPoll is ready!</DialogDescription>
        </DialogHeader>
        <p>
          You can view the results <Link href={links.resultsUrl}>here</Link>, or manage your
          FunkyPoll from your <Link href={"/"}>dashboard</Link>.
        </p>
      </DialogContent>
    </Dialog>
  );
}
