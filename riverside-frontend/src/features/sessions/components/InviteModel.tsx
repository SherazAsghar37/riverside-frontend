import { AlertCircle, Copy, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { IP, PORT } from "@/app/base";

interface InviteModelProps {
  sessionCode: string;
  inviteOpen?: boolean;
  setInviteOpen?: (open: boolean) => void;
}

function InviteModel({
  sessionCode,
  inviteOpen,
  setInviteOpen,
}: InviteModelProps) {
  const [copied, setCopied] = useState(false);

  const sessionLink = `https://${IP}:${PORT}/join-session?session-code=${sessionCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sessionLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <>
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite people</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Share link section */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">Share a link</p>
              <div className="flex items-center gap-2">
                <Input value={sessionLink} readOnly disabled />
                <Button onClick={handleCopy} variant="secondary">
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </Button>
              </div>
            </div>

            {/* Invite via email */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Invite via email
              </p>
              <div className="flex items-center gap-2">
                <Input placeholder="example@email.com" />
                <Button>Add</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default InviteModel;
