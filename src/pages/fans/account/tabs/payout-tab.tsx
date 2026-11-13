import { FIELD_LABEL_ON_DARK_CLASS } from "@/components/shared/field-label";
import { BaseSelect } from "@/components/reusable";
import { FormBase, FormField } from "@/components/reusable";
import { defaultPayoutValues, PayoutSchema } from "@/schema/payout-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { africanCurrencies, date_list } from "@/components/constants";
import { AccountInput } from "../components/account-input";

export default function PayoutTab() {
  return (
    <div className="w-full flex flex-col gap-8 pb-[100px]">
      <p className="font-inter-tight text-sm text-center px-3">
        Add your payout account details to receive funds from your Ticket sales
      </p>

      <PayoutForm />

      <CreditCard />

      <div className="flex flex-col gap-1 font-inter-tight">
        <p className="font-semibold text-white">
          If the event is canceled, postponed or rescheduled
        </p>
        <p>This card will be used to refund the buyer</p>
      </div>
    </div>
  );
}

function PayoutForm() {
  const form = useForm<z.infer<typeof PayoutSchema>>({
    resolver: zodResolver(PayoutSchema),
    defaultValues: defaultPayoutValues,
  });

  function onSubmit(values: z.infer<typeof PayoutSchema>) {
    console.log(values);
  }

  return (
    <FormBase
      form={form}
      onSubmit={onSubmit}
      className="w-full flex flex-col items-center gap-3"
    >
      <div className="w-full flex flex-col gap-1">
        <p className={FIELD_LABEL_ON_DARK_CLASS}>Payment Method</p>
        <div className="w-full flex gap-1">
          <FormField form={form} name="currency">
            {(field) => (
              <BaseSelect
                onChange={(value) => field.onChange(value)}
                label="Payment Method"
                placeholder="Currency"
                items={africanCurrencies}
                triggerClassName="!h-10 w-[85px] rounded-l-[5px] rounded-r-none px-3 bg-soft-gray text-sm font-inter-tight !text-white !placeholder:text-white border-none"
              />
            )}
          </FormField>
          <p className="flex w-full h-10 rounded-r-[5px] bg-soft-gray justify-center items-center text-sm font-medium font-inter-tight">
            DEBIT/CREDIT CARD
          </p>
        </div>
      </div>

      {payout_input_fields.slice(0, 2).map((item) => (
        <AccountInput
          key={item.name}
          form={form}
          name={item.name}
          label={item.label}
          type={
            item.name === "card_number" || item.name === "cvc"
              ? "number"
              : "text"
          }
        />
      ))}

      <div className="w-full flex flex-col gap-1">
        <p className={FIELD_LABEL_ON_DARK_CLASS}>Expiry</p>
        <div className="grid grid-cols-2 gap-1">
          <FormField form={form} name="expiry_date.month">
            {(field) => (
              <BaseSelect
                onChange={(value) => field.onChange(value)}
                label="Month"
                placeholder="Month"
                items={date_list.items}
                triggerClassName="h-10 w-full rounded-none px-3 rounded-t-[5px] bg-transparent text-sm font-inter-tight !text-white border-none"
              />
            )}
          </FormField>
          <FormField form={form} name="expiry_date.year">
            {(field) => (
              <BaseSelect
                onChange={(value) => field.onChange(value)}
                label="Year"
                placeholder="Year"
                items={years}
                triggerClassName="h-10 w-full rounded-none px-3 rounded-t-[5px] bg-transparent text-sm font-inter-tight !text-white border-none"
              />
            )}
          </FormField>
        </div>
      </div>

      {payout_input_fields.slice(2).map((item) => (
        <AccountInput
          key={item.name}
          form={form}
          name={item.name}
          label={item.label}
          type="number"
        />
      ))}

      <Button
        variant="destructive"
        className="w-[200px] h-10 rounded-[5px] bg-white text-sm text-deep-red font-inter-tight hover:bg-white/80"
      >
        SAVE
      </Button>
    </FormBase>
  );
}

function CreditCard() {
  return (
    <RadioGroup
      defaultValue="option-one"
      className="w-full flex flex-col gap-3"
    >
      <div className="w-full h-[55px] flex items-center gap-[7px] bg-medium-gray py-[11px] pl-[22px] pr-[15px] rounded-[5px]">
        <RadioGroupItem value="option-one" id="option-one" />
        <Label
          htmlFor="option-one"
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-center gap-2.5">
            <img
              src="/assets/dashboard/visa.png"
              alt="Visa"
              width={45}
              height={33}
            />
            <p className="font-inter-tight font-bold text-white">****4567</p>
          </div>

          <img
            src="/assets/dashboard/Icon.png"
            alt="Icon"
            width={21}
            height={21}
          />
        </Label>
      </div>
    </RadioGroup>
  );
}

const years = Array.from({ length: 20 }, (_, i) => {
  const year = `${new Date().getFullYear() + i}`;
  return { value: year, label: year };
});

type PayoutFormFields = z.infer<typeof PayoutSchema>;

const payout_input_fields: {
  label: string;
  name: keyof PayoutFormFields;
}[] = [
    {
      label: "Name",
      name: "name",
    },
    {
      label: "Card Number",
      name: "card_number",
    },
    {
      label: "CVC",
      name: "cvc",
    },
  ];
