import { cn } from "../../lib/utils";
import type { FC } from "react";

interface AnimatedTextProps {
    text: string;
    textClassName?: string;
}

export const AnimatedText: FC<AnimatedTextProps> = ({ text, textClassName }) => {
    return (
        <>
            <style>
                {`@keyframes shiny-text { from { background-position: 200% 0; } to { background-position: -200% 0; } }`}
            </style>
            <span
                style={{ animation: 'shiny-text 3s linear infinite' }}
                className={cn(
                    "inline-block bg-[linear-gradient(110deg,#60a5fa,45%,#ffffff,55%,#60a5fa)] bg-[length:250%_100%] bg-clip-text text-transparent",
                    textClassName
                )}
            >
        {text}
      </span>
        </>
    );
};