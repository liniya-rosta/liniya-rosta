'use client';

import { motion } from 'framer-motion';
import React from 'react';

type Direction = 'left' | 'right' | 'top' | 'bottom';

interface Props extends React.PropsWithChildren {
    direction?: Direction;
    duration?: number;
    delay?: number;
    className?: string;

}

const getInitialPosition = (direction: Direction) => {
    switch (direction) {
        case 'left':
            return { x: -100, y: 0 };
        case 'right':
            return { x: 100, y: 0 };
        case 'top':
            return { x: 0, y: -100 };
        case 'bottom':
            return { x: 0, y: 100 };
        default:
            return { x: 0, y: 0 };
    }
};

const AnimatedEntrance: React.FC<Props> = ({children, direction = 'left', duration = 0.6, delay = 0, className}) => {
    const initial = getInitialPosition(direction);

    return (
        <motion.div
            className={className}
            initial={{ ...initial, opacity: 0 }}
            animate={{ x: 0, y: 0, opacity: 1 }}
            transition={{ duration, ease: 'easeOut', delay }}
        >
            {children}
        </motion.div>
    );
};

export default AnimatedEntrance;
