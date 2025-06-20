import { Loader2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {cn} from "@/lib/utils";

interface Props {
    className?: string
}

const ButtonLoading: React.FC<Props> = ({className})=> {
    return (
        <Button size="sm" disabled>
            <Loader2Icon className={cn("animate-spin", className)} />
            Загрузка
        </Button>
    )
}
export default ButtonLoading;