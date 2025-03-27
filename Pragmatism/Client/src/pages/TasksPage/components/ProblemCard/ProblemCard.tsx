import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@shadcn/components/ui/card";
import { Button } from "@shadcn/components/ui/button";
import { useNavigate } from "react-router";
import { Typography } from "@src/components/Typography";

interface ProblemCardProps {
    title: string;
    description: string;
    numSolves: number;
    id: number;
}

export const ProblemCard: React.FC<ProblemCardProps> = ({ title, description, numSolves, id }) => {
    const navigate = useNavigate();

    const handleSolveClick = () => {
        navigate(`/tasks/${id}`);
    };

    return (
        <Card className="max-w-sm shadow-md hover:shadow-lg transition-shadow border-[0.5px] border-foreground">
            <CardHeader>
                <CardTitle>
                    <Typography variant="subheading">
                        {title}
                    </Typography>
                </CardTitle>
                <CardDescription>
                    Solves: {numSolves}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm">{description}</p>
            </CardContent>
            <CardFooter>
                <Button onClick={handleSolveClick} className="w-full cursor-pointer">
                    Solve
                </Button>
            </CardFooter>
        </Card>
    );
};

export default ProblemCard;