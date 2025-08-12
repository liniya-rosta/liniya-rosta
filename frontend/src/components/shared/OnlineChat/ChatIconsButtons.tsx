import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import {Headset, MessageCircle } from 'lucide-react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faWhatsapp} from "@fortawesome/free-brands-svg-icons";

interface Props {
    isMenuOpen: boolean;
    isChatOpen: boolean;
    onMainButtonClick: () => void;
    onSelectChat: (type: ChatType) => void;
}

const ChatIconsButtons: React.FC<Props> = ({isChatOpen, isMenuOpen, onSelectChat, onMainButtonClick}) => {
    return (
        <>
            <AnimatePresence>
                {isMenuOpen && !isChatOpen && (
                    <>
                        <motion.button
                            key="whatsapp"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, y: -5, scale: 1 }}
                            exit={{ opacity: 0, y: 50, scale: 0.5 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shadow-lg"
                            onClick={() => onSelectChat("whatsapp")}
                        >
                            <FontAwesomeIcon icon={faWhatsapp} className="w-7 h-7 text-white text-3xl"/>
                        </motion.button>

                        <motion.button
                            key="online"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, y: -10, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.05 }}
                            className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center shadow-lg"
                            onClick={() => onSelectChat("online")}
                        >
                            <MessageCircle className="text-white w-6 h-6" />
                        </motion.button>
                    </>
                )}
            </AnimatePresence>

            {!isChatOpen && (
                <motion.button
                    onClick={onMainButtonClick}
                    className="bg-highlight-light rounded-full shadow-lg relative flex items-center justify-center"
                    style={{ width: 70, height: 70 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Headset className="text-white w-10 h-10 relative z-10" />
                </motion.button>
            )}
        </>
    );
};

export default ChatIconsButtons;