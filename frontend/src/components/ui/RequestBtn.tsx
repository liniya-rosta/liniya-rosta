import React from 'react';
import {useTranslations} from "next-intl";
import {motion} from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface Props {
    onClick: () => void;
}

const RequestBtn: React.FC<Props> = ({onClick}) => {
    const tBtn = useTranslations("Buttons");

    return (
        <motion.button
            onClick={onClick}
            className="rounded-full px-6 py-3 text-md font-bold shadow-lg
                bg-background text-highlight cursor-pointer hover:text-primary
                flex items-center gap-3"
            whileHover={{
                scale: 1.08,
                transition: { duration: 0.3, ease: 'easeInOut' },
            }}
            whileTap={{ scale: 0.95 }}
        >
            <motion.span
                className="inline-block"
                animate={{ x: [0, 6, 0, 6] }}
                transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut",
                }}
            >
                <ArrowRight size={18} />
            </motion.span>
            {tBtn('requestBtn1')}
        </motion.button>

    );
};

export default RequestBtn;