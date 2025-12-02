import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, More, Trash } from "iconsax-react";

import { uploadsUrl } from "@/config";
import Image from "next/image";
import { ManualPaymentMethodCardProps } from "@/types";
import { Button } from "../../ui/button";
import { deleteManualPaymentMethod } from "@/lib/api/manual-payment-methods";
import { toast } from "sonner";
import ManualPaymentMethodForm from "../../forms/settings/payment-settings/manual-payment-method-form";

const ManualPaymentMethodCard = ({
  data,
  setReload,
}: ManualPaymentMethodCardProps) => {
  const handleDelete = async () => {
    try {
      const response = await deleteManualPaymentMethod(data.id);
      toast.success(response.message);

      setReload && setReload(Math.random());
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-5">
        <div className="border rounded-md w-16 h-16 flex items-center justify-center">
          <Image
            src={`${uploadsUrl}/${data.icon}`}
            alt=""
            width={32}
            height={32}
          />
        </div>

        <span className="font-medium text-lg block">{data.name}</span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <More />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuGroup>
            <ManualPaymentMethodForm
              isEdit={true}
              data={data}
              setReload={setReload}
            >
              <button className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-blue-600 w-full">
                <Edit variant="Bold" className="mr-2 h-4 w-4" />
                Edit
              </button>
            </ManualPaymentMethodForm>

            <AlertDialog>
              <AlertDialogTrigger className="w-full">
                <button className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-red-600 w-full">
                  <Trash variant="Bold" className="mr-2 h-4 w-4" />
                  Delete
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently remove
                    your manual payment method from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ManualPaymentMethodCard;
