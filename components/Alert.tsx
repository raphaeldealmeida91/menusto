"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

type AlertProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  description: string;
  variant: "success" | "error";
  redirectTo?: string;
};

export default function Alert({
  open,
  setOpen,
  title,
  description,
  variant,
  redirectTo,
}: AlertProps) {
  const router = useRouter();

  const handleClose = () => {
    setOpen(false);
    if (redirectTo) {
      router.push(redirectTo);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            {variant === "success" ? (
              <CheckCircle className="text-green-600" />
            ) : (
              <XCircle className="text-red-600" />
            )}
            <AlertDialogTitle
              className={
                variant === "success" ? "text-green-600" : "text-red-600"
              }
            >
              {title}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="mt-2">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            className="cursor-pointer uppercase font-bold"
            onClick={handleClose}
          >
            Fermer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
