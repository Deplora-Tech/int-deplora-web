"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Organization } from "@/app/hooks/organizations";
import { OrganizationSettings } from "../layout/SubHeader/OrganizationSettings";

interface OrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedOrg: Organization | null;
  onSave: (orgData: Organization) => Promise<void>;
}

export function OrganizationModal({
  isOpen,
  onClose,
  selectedOrg,
  onSave,
}: OrganizationModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        {" "}
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-full max-w-lg h-[90vh] max-h-[700px] transform -translate-x-1/2 -translate-y-1/2 bg-black/90 border border-white/10 rounded-xl shadow-lg focus:outline-none overflow-hidden">
          <Dialog.Title className="sr-only">Organization Settings</Dialog.Title>
          <Dialog.Close asChild>
            <button
              className="absolute top-4 right-4 text-white/60 hover:text-white z-10"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </Dialog.Close>
          {selectedOrg && (
            <OrganizationSettings
              organization={selectedOrg}
              onClose={onClose}
              onSave={onSave}
            />
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
