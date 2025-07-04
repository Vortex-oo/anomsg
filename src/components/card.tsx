import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { X } from "lucide-react"
import { toast } from "sonner"
import { IMessage } from "@/models/message.model"
import axios, { AxiosError } from "axios"

type MessageCardProps = {
    message: IMessage;
    callBack: (messageId: string) => void;
}

const CustomCard = ({ message, callBack }: MessageCardProps) => {
    const handleDeleteConfirm = async () => {
        try {
            const response = await axios.delete(
                `/api/delete-message/${message._id}`
            );
            toast.success(response.data.message ?? 'Message deleted successfully');
            callBack(message._id);
        } catch (error) {
            const axiosError = error as AxiosError;
            const errorMessage =
                axiosError.response && typeof axiosError.response.data === 'object' && axiosError.response.data !== null && 'message' in axiosError.response.data
                    ? (axiosError.response.data as { message?: string }).message
                    : undefined;
            toast.error(errorMessage ?? 'Failed to delete message');
        }
    };

    return (
        <div className="relative border border-white rounded-xl bg-black font-mono text-xl pt-10 pr-10 pb-4 pl-4 text-white">
    {/* Message Text */}
    <p className="whitespace-pre-wrap">{message.content}</p>

    {/* Delete Button in Top Right */}
    <div className="absolute top-2 right-2">
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="ghost"
                    className="border-2 border-red-500 text-white hover:bg-red-500 hover:text-black rounded-lg p-2 hover:cursor-pointer"
                >
                    <X className="w-5 h-5" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-black text-white border border-white">
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete the message. This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="text-white border border-white">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDeleteConfirm}
                        className="bg-red-500 hover:bg-red-600 text-white"
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
</div>

    )
}

export default CustomCard
