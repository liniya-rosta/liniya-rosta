import React from 'react';
import {Card, CardContent} from "@/src/components/ui/card";
import Image from "next/image";
import {API_BASE_URL} from "@/lib/globalConstants";

interface Props {
    title: string;
    image: string;
    description: string | null;
}

const LaminateCard: React.FC<Props> = ({title, description, image}) => {
    return (
        <Card>
            <div className="w-full aspect-[3/2] relative">
                <Image
                    src={API_BASE_URL + "/" + image}
                    alt={title}
                    fill
                    priority
                />
            </div>

            <CardContent className="p-4 flex flex-col items-start gap-2">
                <h3 className="text-lg font-semibold line-clamp-2">{title}</h3>
                {description && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                        {description}
                    </p>
                )}
            </CardContent>
        </Card>
    );
};

export default LaminateCard;