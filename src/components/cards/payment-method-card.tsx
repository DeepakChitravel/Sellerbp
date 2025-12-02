import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { uploadsUrl } from "@/config";
import Image from "next/image";
import { Switch } from "../ui/switch";
import { PaymentMethodCardProps } from "@/types";
import { updateSiteSettings } from "@/lib/api/site-settings";
import { handleToast } from "@/lib/utils";
import { toast } from "sonner";
import FormInputs from "../form-inputs";
import { Button } from "../ui/button";
import { useState } from "react";

const PaymentMethodCard = ({
  name,
  value,
  method,
  inputFields,
}: PaymentMethodCardProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const handleSwitch = async () => {
    if (!value || !name) return;

    const newValue = !value.value;

    value.setValue(newValue);

    try {
      const data = {
        [name]: newValue,
      };

      const response = await updateSiteSettings(data);

      handleToast(response);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      let data: { [key: string]: string } = {};

      inputFields &&
        Object.keys(inputFields)?.map((item) => {
          data[item as string] = inputFields?.[item].value as string;
        });

      const response = await updateSiteSettings(data);

      handleToast(response);
      setIsLoading(false);
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message);
      setIsLoading(false);
      setOpen(false);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-5">
        <div className="border rounded-md w-16 h-16 flex items-center justify-center">
          <Image
            src={`${uploadsUrl}/static/${method.icon}`}
            alt=""
            width={32}
            height={32}
          />
        </div>

        <span className="font-medium text-lg block">{method.name}</span>
      </div>

      {value && (
        <Switch
          onClick={handleSwitch}
          defaultChecked={value.value ? true : false}
        />
      )}

      {inputFields && (
        <Dialog
          open={open}
          onOpenChange={(value) => {
            setOpen(value);
          }}
        >
          <DialogTrigger asChild>
            <Button
              size="sm"
              onClick={() => {
                setOpen(true);
              }}
            >
              Set up
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[565px]">
            <DialogHeader>
              <DialogTitle>Set up {method.name} Payment Gateway</DialogTitle>
              <DialogDescription>
                Please enter your {method.name} credentials
              </DialogDescription>
            </DialogHeader>

            <div className="my-6">
              <FormInputs inputFields={inputFields} />
            </div>

            <DialogFooter>
              <Button
                onClick={handleSave}
                isLoading={isLoading}
                disabled={isLoading}
              >
                Set up
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default PaymentMethodCard;
