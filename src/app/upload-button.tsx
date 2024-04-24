'use client'
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useOrganization, useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { Loader2 } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "../../convex/_generated/api";

const formSchema = z.object({
    title: z.string().min(1).max(200),
    file: z
        .custom<FileList>((val) => val instanceof FileList, "Required")
        .refine((files) => files.length > 0, "Required")
})

export default function UploadButton() {
    const organization = useOrganization()
    const { toast } = useToast()
    const user = useUser()
    const generateUploadUrl = useMutation(api.files.generateUploadUrl)
    let orgId: string | undefined = undefined
    if (organization.isLoaded && user.isLoaded) {
        orgId = organization.organization?.id ?? user.user?.id
    }
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            file: undefined,
        },
    })

    const fileRef = form.register("file")
    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!orgId) return;

        const postUrl = await generateUploadUrl();
        const result = await fetch(postUrl, {
            method: "POST",
            headers: { "Content-Type": values.file[0].type },
            body: values.file[0],
        })
        const { storageId } = await result.json()
        try {
            await createFile({
                name: values.title,
                fileId: storageId,
                orgId,
            })

            form.reset()
            setIsDialogClosed(false)
            toast({
                variant: "success",
                title: "File uploaded",
                description: "Your file has been uploaded successfully",
            })
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Something went wrong",
                description: "Your file couldnt be uploaded. Please try again later.",

            })
        }



    }
    const [isDialogClosed, setIsDialogClosed] = React.useState(true)
    const createFile = useMutation(api.files.createFile);
    return (
        <Dialog open={isDialogClosed} onOpenChange={(isClosed) => {
            setIsDialogClosed(isClosed)
            form.reset()
        }}>
            <DialogTrigger asChild><Button onClick={() => {

            }}>Upload File</Button></DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="mb-8">Upload your file here</DialogTitle>
                    <DialogDescription>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input  {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="file"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>File</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="file" {...fileRef}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button disabled={form.formState.isSubmitting} type="submit" className="flex gap-2">
                                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Submit
                                </Button>
                            </form>
                        </Form>

                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>


    );
}


