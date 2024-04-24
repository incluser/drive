import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { MoreVertical, TrashIcon } from "lucide-react"
import React from "react"
import { Doc } from "../../convex/_generated/dataModel"
import { useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"
import { useToast } from "@/components/ui/use-toast"


function FileCardActions({ file }: { file: Doc<"files"> }) {
    const deletFile = useMutation(api.files.deleteFile)
    const [isConfirmOpen, setIsConfirmOpen] = React.useState(false)
    const { toast } = useToast()
    return (<>
        <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={async () => {
                        await deletFile({ fileId: file._id })
                        toast({
                            variant: "default",
                            title: "File deleted",
                            description: "Your file is now gone from the system",
                        })
                    }}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        <DropdownMenu>
            <DropdownMenuTrigger><MoreVertical /></DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setIsConfirmOpen(true)} className="flex gap-1 text-red-600 items-center cursor-pointer">
                    <TrashIcon className="w-4 h-4" /> Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </>
    )
}

export function FileCard({ file }: { file: Doc<"files"> }) {
    return (
        <Card>
            <CardHeader className="relative">
                <CardTitle>{file.name}
                    <div className="absolute top-4 right-2"><FileCardActions file={file} /></div>
                </CardTitle>
                <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Card Content</p>
            </CardContent>
            <CardFooter>
                <p>Card Footer</p>
                <Button>Download</Button>
            </CardFooter>
        </Card>

    )
}