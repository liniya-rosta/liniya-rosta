import React from 'react';
import {useTranslations} from "next-intl";
import {motion} from 'motion/react';

interface Props {
    onClick: () => void;
}

const RequestBtn: React.FC<Props> = ({onClick}) => {
    const tBtn = useTranslations("Buttons");

    return (
        <motion.button
            onClick={onClick}
            className="rounded-full px-6 py-3 text-md font-bold shadow-lg
            bg-background text-highlight cursor-pointer hover:text-primary"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{
                duration: 1.8,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
            }}
            whileHover={{ scale: 1.08}}
        >
            {tBtn('requestBtn1')}
        </motion.button>
    );
};

export default RequestBtn;