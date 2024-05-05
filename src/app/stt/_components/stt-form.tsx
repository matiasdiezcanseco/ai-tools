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
import { sttFormSchema } from "~/lib/schemas";
import { type z } from "zod";
import { useDropzone } from "react-dropzone";
import { useCallback } from "react";

export default function SttForm() {
  const form = useForm<z.infer<typeof sttFormSchema>>({
    resolver: zodResolver(sttFormSchema),
    defaultValues: {
      file: undefined,
    },
  });
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!acceptedFiles[0]) return;
      form.setValue("file", acceptedFiles[0]);
    },
    [form],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    accept: {
      "audio/*": [".mp3"],
    },
    onDrop,
  });

  async function onSubmit(values: z.infer<typeof sttFormSchema>) {
    toast(
      <div className="flex items-center gap-2">
        <Spinner className="size-4" />
        Processing file...
      </div>,
      { duration: 100000, id: "sttRequest" },
    );
    try {
      // await createTts(values);
      toast.dismiss("sttRequest");
      toast("Request submitted", { duration: 3000 });
    } catch (e: unknown) {
      toast.dismiss("sttRequest");
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
          name="file"
          render={({ field }) => (
            <FormItem className="relative flex flex-col">
              <FormControl>
                <div
                  className="rounded-md border border-border p-4"
                  {...getRootProps()}
                >
                  <input {...getInputProps()} name="file" id="file" />
                  {field.value && <p>{field.value.name}</p>}
                  {isDragActive ? (
                    <p>Drop your audio file here ...</p>
                  ) : (
                    <p>
                      Drag and drop your audio here, or click to select your
                      file. Only .mp3 files are accepted.
                    </p>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
