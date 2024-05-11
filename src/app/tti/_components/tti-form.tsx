"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { Spinner } from "~/components/ui/spinner";
import { Textarea } from "~/components/ui/textarea";
import { type z } from "zod";
import { ttiFormSchema } from "~/lib/schemas";
import { createTtiAction } from "~/server/actions/tti";

export default function TtiForm() {
  const form = useForm<z.infer<typeof ttiFormSchema>>({
    resolver: zodResolver(ttiFormSchema),
    defaultValues: {
      text: "",
    },
  });

  async function onSubmit(values: z.infer<typeof ttiFormSchema>) {
    toast(
      <div className="flex items-center gap-2">
        <Spinner className="size-4" />
        Creating image...
      </div>,
      { duration: 100000, id: "ttiRequest" },
    );
    try {
      await createTtiAction(values);
      toast.dismiss("ttiRequest");
      toast("Request submitted", { duration: 3000 });
    } catch (e: unknown) {
      toast.dismiss("ttiRequest");
      if (e instanceof Error) {
        toast(e.message, { duration: 3000 });
        return;
      }
      toast("There was an error", { duration: 3000 });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem className="relative flex flex-col">
              <FormControl>
                <Textarea
                  cols={80}
                  rows={8}
                  placeholder="Add your text here"
                  {...field}
                />
              </FormControl>
              <div className="grid grid-cols-2">
                <div>
                  <FormMessage />
                </div>
                <span className="text-right text-xs text-muted">
                  {field.value.length} / 500
                </span>
              </div>
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
