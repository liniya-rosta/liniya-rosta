import React from 'react';
import {motion, AnimatePresence} from "framer-motion";
import {Headset, MessageCircle} from 'lucide-react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faWhatsapp} from "@fortawesome/free-brands-svg-icons";
import {ChatType} from "@/src/components/shared/OnlineChat/ChatContainer";

interface Props {
    isMenuOpen: boolean;
    isChatOpen: boolean;
    onMainButtonClick: () => void;
    onSelectChat: (type: ChatType) => void;
}

const ChatIconsButtons: React.FC<Props> = ({isChatOpen, isMenuOpen, onSelectChat, onMainButtonClick}) => {
    return (
        <div className="fixed bottom-24 right-24 flex flex-col items-center gap-3 z-50">
            <AnimatePresence>
                {isMenuOpen && !isChatOpen && (
                    <>
                        <motion.button
                            key="online"
                            initial={{ opacity: 0, y: 0, scale: 0.5 }}
                            animate={{ opacity: 1, y: -120, scale: 1 }}
                            exit={{ opacity: 0, y: 0, scale: 0.5 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.05 }}
                            className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center shadow-lg absolute cursor-pointer"
                            onClick={() => onSelectChat("online")}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <MessageCircle className="text-white w-6 h-6" />
                        </motion.button>

                        <motion.button
                            key="whatsapp"
                            initial={{ opacity: 0, y: 0, scale: 0.5 }}
                            animate={{ opacity: 1, y: -60, scale: 1 }}
                            exit={{ opacity: 0, y: 0, scale: 0.5 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shadow-lg absolute cursor-pointer"
                            onClick={() => onSelectChat("whatsapp")}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FontAwesomeIcon icon={faWhatsapp} className="w-7 h-7 text-white text-3xl" />
                        </motion.button>
                    </>
                )}
            </AnimatePresence>

            {!isChatOpen && (
                <AnimatePresence>
                    <motion.button
                        key="main-button"
                        onClick={onMainButtonClick}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.2 }}
                        className="bg-highlight-light rounded-full shadow-lg flex items-center justify-center cursor-pointer"
                        style={{ width: 70, height: 70 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Headset className="text-white w-10 h-10 relative z-10" />
                    </motion.button>
                </AnimatePresence>
            )}
        </div>
    );
};

export default ChatIconsButtons;