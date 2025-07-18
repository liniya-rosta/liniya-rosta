import {useState} from "react";
import {Button} from "@/components/ui/button";
import {CheckIcon, CopyIcon} from "lucide-react";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

export const CopyPhoneButton = ({ phone }: { phone: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(phone);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (err) {
            console.error("Не удалось скопировать:", err);
        }
    };

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    variant="outline"
                    size="lg"
                    onClick={handleCopy}
                    className="bg-transparent border-white text-white btn-hover-scale select-none"
                >
                    {copied ? (
                        <>
                            <CheckIcon className="w-4 h-4 mr-2" />
                            Скопировано
                        </>
                    ) : (
                        <>
                            <CopyIcon className="w-4 h-4 mr-2" />
                            {phone}
                        </>
                    )}
                </Button>
            </TooltipTrigger>
            <TooltipContent>Кликните чтобы скопировать</TooltipContent>
        </Tooltip>
    );
};