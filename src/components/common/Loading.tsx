import { motion } from "framer-motion";

export default function Loading({ text = "Preparando o espetáculo..." }: { text?: string }) {
    return (
        <div className="relative w-full h-screen flex flex-col items-center justify-center bg-background-dark text-white select-none overflow-hidden">
            <motion.div
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
                className="absolute top-12 flex gap-3 opacity-25 z-0"
            >
                {[...Array(25)].map((_, i) => (
                    <div
                        key={i}
                        className="w-10 h-6 bg-purple-500/70 rounded-sm shadow-[0_0_10px_#8b5cf6aa]"
                    />
                ))}
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-[500px] h-[500px] rounded-full bg-purple-600/40 blur-[120px]"
            />

            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
                className="relative z-10 w-24 h-24 border-[6px] border-purple-500/80 border-t-transparent rounded-full flex items-center justify-center shadow-[0_0_25px_#8b5cf6aa]"
            >
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                    className="w-10 h-10 border-[4px] border-purple-400/80 border-b-transparent rounded-full"
                />
            </motion.div>

            <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: [0.6, 1, 0.6], y: [10, 0, 10] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                className="z-10 mt-8 text-purple-300 text-2xl md:text-3xl font-semibold tracking-[0.25em] uppercase"
            >
                {text}
            </motion.h2>



            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-b from-purple-800/20 via-transparent to-purple-900/30"
            />

            <motion.div
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
                className="absolute top-12 flex gap-3 opacity-25 z-0"
            >
                {[...Array(25)].map((_, i) => (
                    <div
                        key={i}
                        className="w-10 h-6 bg-purple-500/70 rounded-sm shadow-[0_0_10px_#8b5cf6aa]"
                    />
                ))}
            </motion.div>
        </div>
    );
}
