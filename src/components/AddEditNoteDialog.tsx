"use client";
import { useForm } from "react-hook-form";
import { CreateNote, createNotesSchema } from "../../prisma/validation/note";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import LoadingButton from "./ui/loading-button";
import { Note } from "@prisma/client";
import { useState } from "react";

type AddNoteProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  notesToEdit?: Note;
};

const AddEditNoteDialog = ({ open, setOpen, notesToEdit }: AddNoteProps) => {
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const router = useRouter();
  const form = useForm<CreateNote>({
    resolver: zodResolver(createNotesSchema),
    defaultValues: {
      title: notesToEdit?.title || "",
      content: notesToEdit?.content || "",
    },
  });

  async function onSubmit(data: CreateNote) {
    try {
      if (notesToEdit) {
        const response = await fetch(`/api/notes`, {
          method: "PUT",
          body: JSON.stringify({
            id: notesToEdit.id,
            ...data,
          }),
        });
        if (!response.ok) {
          throw Error("Something went wrong " + response.status);
        }
      } else {
        const response = await fetch("/api/notes", {
          method: "POST",
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw Error("Something went wrongfff " + response.status);
        }
        form.reset();
      }

      router.refresh();
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert("Something went wrong add note");
    }
  }

  async function deleteNotesSchema() {
    if (!notesToEdit) return;
    setDeleteInProgress(true);
    try {
      const response = await fetch(`/api/notes/`, {
        method: "DELETE",
        body: JSON.stringify({
          id: notesToEdit.id,
        }),
      });

      if (!response.ok) {
        throw Error("Something went wrong deleting Note" + response.status);
      }
      router.refresh();
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert("Something went wrong delete");
    } finally {
      setDeleteInProgress(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Note</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="title">
                    {notesToEdit ? "Edit Note" : "Add Note"}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Note Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="title">Note Content</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Note Content" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="gap-2 sm:gap-0">
              {notesToEdit && (
                <LoadingButton
                  variant="destructive"
                  disabled={form.formState.isSubmitting}
                  loading={deleteInProgress}
                  onClick={deleteNotesSchema}
                  type="button"
                >
                  Delete
                </LoadingButton>
              )}
              <LoadingButton
                type="submit"
                loading={form.formState.isSubmitting}
              >
                Submit
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditNoteDialog;
