"use client";
import { useState } from "react";
import CouponInformation from "./coupon-forms/coupon-information";
import Sticky from "../sticky";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { handleToast } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { CouponFormProps } from "@/types";
import { addCoupon } from "@/lib/api/coupons-client";  // client API
import { updateCoupon } from "@/lib/api/coupons";       // server API is okay for update
import UsageLimit from "./coupon-forms/usage-limit";
import BookingAmount from "./coupon-forms/booking-amount";
import CouponDate from "./coupon-forms/date";

const CouponForm = ({ couponId, couponData, isEdit }: CouponFormProps) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState<string>(couponData?.name);
  const [code, setCode] = useState<string>(couponData?.code);
  const [discountType, setDiscountType] = useState<string>(
    couponData?.discountType ? couponData?.discountType : "percentage"
  );
  const [discount, setDiscount] = useState<number>(couponData?.discount);
  const [startDate, setStartDate] = useState<Date>(couponData?.startDate);
  const [endDate, setEndDate] = useState<Date>(couponData?.endDate);
  const [usageLimit, setUsageLimit] = useState<number>(couponData?.usageLimit);
  const [minBookingAmount, setMinBookingAmount] = useState<number>(
    couponData?.minBookingAmount
  );

  const handleSave = async () => {
    setIsLoading(true);

    try {
const data = {
  name,
  code,
  discountType,
  discount,
  startDate: startDate ? new Date(startDate).toISOString() : null,
  endDate: endDate ? new Date(endDate).toISOString() : null,
  usageLimit,
  minBookingAmount,
};


      const response = !isEdit
        ? await addCoupon(data)
        : await updateCoupon(couponId, data);

      handleToast(response);
      !isEdit &&
        response.success &&
        router.push(`/coupons?${Math.floor(Math.random() * 100)}`);
    } catch (error: any) {
      toast.error(error.message);
    }
    setIsLoading(false);
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-5">
        <div className="lg:col-span-7 col-span-12 grid gap-5">
          <CouponInformation
            name={{
              value: name,
              setValue: setName,
            }}
            code={{
              value: code,
              setValue: setCode,
            }}
            discountType={{
              value: discountType,
              setValue: setDiscountType,
            }}
            discount={{
              value: discount,
              setValue: setDiscount,
            }}
          />

          <CouponDate
            startDate={{
              value: startDate,
              setValue: setStartDate,
            }}
            endDate={{
              value: endDate,
              setValue: setEndDate,
            }}
          />
        </div>

        <div className="lg:col-span-5 col-span-12">
          <div className="grid gap-5">
            <UsageLimit
              usageLimit={{
                value: usageLimit,
                setValue: setUsageLimit,
              }}
            />

            <BookingAmount
              minBookingAmount={{
                value: minBookingAmount,
                setValue: setMinBookingAmount,
              }}
            />
          </div>
        </div>
      </div>

      <Sticky>
        <Button onClick={handleSave} disabled={isLoading} isLoading={isLoading}>
          Save
        </Button>
      </Sticky>
    </>
  );
};

export default CouponForm;
