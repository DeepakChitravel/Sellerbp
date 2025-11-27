"use client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FormInputs from "@/components/form-inputs";
import { useState } from "react";
import { InputField, ManualPaymentMethodFormProps } from "@/types";
import {
  addManualPaymentMethod,
  updateManualPaymentMethod,
} from "@/lib/api/manual-payment-methods";
import { handleToast } from "@/lib/utils";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import useCurrentUser from "@/hooks/useCurrentUser";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Form {
  [key: string]: InputField;
}

const ManualPaymentMethodForm = ({
  children,
  isEdit,
  data,
  setReload,
}: ManualPaymentMethodFormProps) => {
  const { userData } = useCurrentUser();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const [name, setName] = useState<string>(data ? data.name : "");
  const [icon, setIcon] = useState<string>(data ? data.icon : "");
  const [instructions, setInstructions] = useState<string>(
    data ? data.instructions : ""
  );
  const [image, setImage] = useState<string>(data ? data.image : "");

  const inputFields: Form = {
    name: {
      type: "text",
      value: name,
      setValue: setName,
      label: "Payment Method Name",
      placeholder: "E.g. Bank Transfer",
      required: true,
      inputFieldBottomArea: (
        <div className="mt-2 flex gap-2">
          <Badge
            className="cursor-pointer"
            onClick={() => {
              setName("Bank Transfer");
              setIcon("static/bank.png");
              setImage("");
              setInstructions(`1. Account Holder Name: [Your Business Name]
2. Bank Name: [Your Bank Name]
3. Account Number: [Your Account Number]
4. Sort Code: [Your Sort Code]
5. IBAN: [Your IBAN Number]
6. BIC/SWIFT Code: [Your BIC/SWIFT Code]

Please make the payment within [X] business days to secure your appointment. Once the payment is received, we will confirm your booking.

If you have any questions or need further assistance, please don't hesitate to contact our customer support team at ${userData?.siteSettings[0].phone}.`);
            }}
          >
            Bank Transfer
          </Badge>

          <Badge
            className="cursor-pointer"
            onClick={() => {
              setName("UPI");
              setIcon("static/upi.png");
              setImage("static/upi-qr-code.png");
              setInstructions(`1. Scan the UPI QR code displayed on the checkout page.
2. Open your preferred UPI payment app (e.g., Google Pay, PhonePe, BHIM) on your mobile device.
3. Select the "Scan and Pay" or "UPI" option in your UPI app.
4. Point your camera at the QR code to initiate the payment.
5. Verify the payment details, including the payment amount and the recipient's UPI ID.
6. Enter your UPI PIN or use biometric authentication (e.g., fingerprint, face ID) to authorize the payment.
7. Once the payment is successful, you will receive a confirmation message in your UPI app.

Please complete the UPI payment within [X] business days to secure your appointment. Once the payment is received, we will confirm your booking.

If you have any questions or need further assistance, please don't hesitate to contact our customer support team at ${userData?.siteSettings[0].phone}.`);
            }}
          >
            UPI
          </Badge>
        </div>
      ),
    },
    icon: {
      type: "file",
      value: icon,
      setValue: setIcon,
      label: "Payment Method Icon",
    },
    image: {
      type: "file",
      value: image,
      setValue: setImage,
      label: "Image",
    },
    instructions: {
      type: "textarea",
      value: instructions,
      setValue: setInstructions,
      label: "Payment Instructions",
      placeholder: "E.g. 'Transfer to Account #123456, Reference: Order ID'",
      required: true,
      rows: 10,
    },
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      const dataObj = {
        name,
        icon,
        instructions,
        image,
      };

      const response = !isEdit
        ? await addManualPaymentMethod(dataObj)
        : await updateManualPaymentMethod(data?.id as number, dataObj);

      handleToast(response);

      if (response.success) {
        if (!isEdit) {
          setName("");
          setIcon("");
          setInstructions("");
          setImage("");
        }

        setOpen(false);

        setReload && setReload(Math.random());
      }
    } catch (error: any) {
      toast.error(error.message);
    }
    setIsLoading(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        onOpenChange={(value) => {
          setOpen(value);
        }}
      >
        <DialogTrigger
          asChild
          onClick={() => {
            setOpen(true);
          }}
        >
          {children}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[565px] px-0">
          <DialogHeader className="px-6">
            <DialogTitle>
              {isEdit ? "Update" : "Set up"} manual payment method
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="my-6 max-h-[66vh]">
            <div className="px-6 pb-1">
              <FormInputs inputFields={inputFields} />
            </div>
          </ScrollArea>

          <DialogFooter className="px-6">
            <Button
              onClick={handleSave}
              isLoading={isLoading}
              disabled={isLoading}
            >
              {isEdit ? "Update" : "Set up"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManualPaymentMethodForm;
