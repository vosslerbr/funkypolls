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
  passcode,
  open,
  setShowLinksDialog,
}: {
  links: Links | null;
  passcode: string;
  open: boolean;
  setShowLinksDialog: (open: boolean) => void;
}) {
  if (!links) return null;

  // TODO styling
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
          FunkyPoll passcode is: <strong>{passcode}</strong>. Your voters will need this to vote and
          you can view the passcode in your dashboard.
        </p>
        <p>
          You can use these links to view the results, or head to your dashboard to manage your new
          FunkyPoll.
        </p>
        <DialogFooter>
          <Button variant="secondary">
            <Link href={"/dashboard"}>Dashboard</Link>
          </Button>
          <Button className="bg-gradient-to-r from-violet-700 to-purple-500">
            <Link href={links.resultsUrl}>Results</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
