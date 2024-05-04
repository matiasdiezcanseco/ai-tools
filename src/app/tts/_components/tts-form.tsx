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
import { ttsFormSchema } from "~/lib/schemas";
import { type z } from "zod";
import { createTts } from "~/server/actions/tts";

export default function TtsForm() {
  const form = useForm<z.infer<typeof ttsFormSchema>>({
    resolver: zodResolver(ttsFormSchema),
    defaultValues: {
      text: "",
    },
  });

  async function onSubmit(values: z.infer<typeof ttsFormSchema>) {
    toast(
      <div className="flex items-center gap-2">
        <Spinner className="size-4" />
        Translating {values.text.slice(0, 20)}...
      </div>,
      { duration: 100000, id: "ttsRequest" },
    );
    try {
      await createTts(values);
      toast.dismiss("ttsRequest");
      toast("Request submitted", { duration: 3000 });
    } catch (e: unknown) {
      toast.dismiss("ttsRequest");
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
                <span className="text-right text-sm">
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
