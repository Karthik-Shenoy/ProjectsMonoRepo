import * as React from "react";

export const GameOverDialog: React.FC<{}> = () => {
    const dialogRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const showDialogCallback = () => {
            console.log("Game Over");
            if (dialogRef.current) {
                dialogRef.current.style.display = "flex";
            }
        };

        window.addEventListener("game-over", showDialogCallback);

        return () => {
            window.removeEventListener("game-over", showDialogCallback);
        };
    }, []);

    return (
        <div
            ref={dialogRef}
            className="fixed top-[50%] left-[50%] w-[300px] h-[300px] hidden border-[1px] border-gray-600 rounded-md translate-x-[-50%] translate-y-[-50%] items-center justify-center"
        >
            <p className="text-white text-xl">Game Over</p>
        </div>
    );
};
