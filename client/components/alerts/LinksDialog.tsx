import { Links } from "@/lib/helpers.ts/getPollAndAnswers";

import Link from "next/link";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

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
          <DialogDescription>Your FunkyPoll is ready</DialogDescription>
        </DialogHeader>
        <p>
          You can use these links to view the results, or head to your dashboard to manage your new
          FunkyPoll.
        </p>
        <DialogFooter>
          <Button variant="secondary">
            <Link href={"/dashboard"}>Dashboard</Link>
          </Button>
          <Button>
            <Link href={links.resultsUrl}>Results</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
