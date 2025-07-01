import {
    Card,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
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
            toast.success(
                "title:",response.data.message ?? 'Message deleted successfully'
            );
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
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>{message.content}</CardTitle>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive"><X /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your
                                    account and remove your data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteConfirm} >Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardHeader>
            </Card>
        </div>
    )
}

export default CustomCard