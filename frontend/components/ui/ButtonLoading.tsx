import { Loader2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"

const ButtonLoading = ()=> {
    return (
        <Button size="sm" disabled>
            <Loader2Icon className="animate-spin" />
            Загрузка
        </Button>
    )
}
export default ButtonLoading;