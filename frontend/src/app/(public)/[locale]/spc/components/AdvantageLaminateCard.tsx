import React, {ReactElement} from 'react';
import {Card, CardContent} from "@/src/components/ui/card";

interface Props {
    title: string;
    text: string;
    icon: ReactElement
}

const AdvantageLaminateCard: React.FC<Props> = ({title, text, icon}) => {

    return (
        <Card className="w-full lg:w-[45%]">
            <CardContent className="p-6 flex flex-col items-center gap-2 flex-grow justify-start">
                <div className="w-16 h-16 rounded-full flex items-center justify-start">
                    <span className="text-2xl">{icon}</span>
                </div>
                    <h3 className="font-medium text-lg text-center line-clamp-2 min-h-[48px] flex items-center justify-start mb-3">
                        {title}
                    </h3>
                    <p className="text-center">
                        {text}
                    </p>
            </CardContent>
        </Card>
    );
};

export default AdvantageLaminateCard;