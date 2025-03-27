import * as React from "react";
import { Button } from "@shadcn/components/ui/button";
import { CircleUser, Computer } from "lucide-react";
import { LoginDialogButton } from "../DialogEntryPoints/LoginDialogButton";
import { useNavigate } from "react-router";
import { Typography } from "../Typography";
import { AppLocation, useCurrentLocation } from "@src/hooks";
import { isUserLoggedIn } from "@src/contexts/AppAuthContext/AppAuthContextUtils";
import { useAppAuthContext } from "@src/contexts/AppAuthContext/AppAuthContext";
import { FlexDiv } from "../FlexBox";

export type NavbarProps = {};

export const Navbar: React.FC<NavbarProps> = () => {
    const navigate = useNavigate();
    const currentLocation = useCurrentLocation();
    const authContext = useAppAuthContext();
    const isLoggedIn = isUserLoggedIn(authContext);

    return (
        <header className="absolute top-0 z-50 w-full border-b bg-background/30 backdrop-blur py-2">
            <div className="flex flex-row w-full">
                {/* Nav buttons */}
                <div className="flex flex-row ml-8 gap-x-2">
                    <div className="flex flex-row gap-x-1 items-center justify-center border-[1px] border-accent p-2 rounded-md">
                        <Typography variant="label" className="cursor-default">Pragmatism</Typography>
                        <Computer />
                    </div>

                    <Button
                        variant={currentLocation === AppLocation.HomePage ? "default" : "ghost"}
                        onClick={() => navigate("/")}
                        className="cursor-pointer"
                    >
                        Home
                    </Button>
                    <Button
                        variant={currentLocation === AppLocation.TasksPage || currentLocation === AppLocation.TaskViewPage ? "default" : "ghost"}
                        onClick={() => navigate("/tasks")}
                        className="cursor-pointer"
                    >
                        Problems
                    </Button>
                </div>

                <FlexDiv className="ml-auto mr-8 items-center justify-center gap-x-2 border-[0.5px] border-foreground px-4 rounded-4xl ">
                    {isLoggedIn ?
                        <FlexDiv horizontal className="items-center justify-center gap-x-2">
                            <Typography className="text-background">{authContext.userName}</Typography>
                            <CircleUser size={24} />
                        </FlexDiv> : <LoginDialogButton />}

                </FlexDiv>
            </div>
        </header>
    );
};