import React, {ReactElement} from 'react';
import {Card, CardContent} from "@/components/ui/card";

interface Props {
    title: string;
    text: string;
    icon: ReactElement
}

const AdvantageLaminateCard: React.FC<Props> = ({title, text, icon}) => {

    return (
        <Card className="min-h-[300px] max-w-[45%] flex-wrap">
            <CardContent className="p-6 flex flex-col items-center gap-2 flex-grow justify-start">
                <div className="w-16 h-16 rounded-full flex items-center justify-start">
                    <span className="text-2xl">{icon}</span>
                </div>
                    <h3 className="font-medium text-center line-clamp-2 min-h-[48px] flex items-center justify-start mb-3">
                        {title}
                    </h3>
                    <p>
                        {text}
                    </p>
            </CardContent>
        </Card>
    );
};

export default AdvantageLaminateCard;