import {useState} from "react";
import {Button} from "@/src/components/ui/button";
import {CheckIcon, CopyIcon} from "lucide-react";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/src/components/ui/tooltip";
import {toast} from "react-toastify";
import {useTranslations} from "next-intl";

export const CopyPhoneButton = ({ phone }: { phone: string }) => {
    const [copied, setCopied] = useState(false);
    const tTooltip = useTranslations("Tooltips");
    const tAction = useTranslations("Actions");
    const tToast = useTranslations("Toasts")

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(phone);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (err) {
            console.log(err);
            toast.error(tToast("copyPhoneError"));
        }
    };

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    size="lg"
                    onClick={handleCopy}
                    className="bg-primary-foreground text-primary hover:bg-background/80 btn-hover-scale select-none"
                >
                    {copied ? (
                        <>
                            <CheckIcon className="w-4 h-4 mr-2" />
                            {tAction("copied")}
                        </>
                    ) : (
                        <>
                            <CopyIcon className="w-4 h-4 mr-2" />
                            {phone}
                        </>
                    )}
                </Button>
            </TooltipTrigger>
            <TooltipContent>{tTooltip("copyPhoneBtn")}</TooltipContent>
        </Tooltip>
    );
};