'use client'

import {motion, useInView} from 'motion/react';
import React, {useRef} from 'react';

interface Props {
    ariaLabelledby?: string;
    className: string;
}

const SectionAnimation: React.FC<React.PropsWithChildren<Props>> = ({ariaLabelledby, className, children}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <motion.section
            ref={ref}
            aria-labelledby={ariaLabelledby}
            className={className}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            {children}
        </motion.section>
    );
};

export default SectionAnimation;