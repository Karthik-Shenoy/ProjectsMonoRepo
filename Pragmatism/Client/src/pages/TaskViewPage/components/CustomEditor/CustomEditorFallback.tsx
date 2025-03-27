import BasicSpinner from "@src/components/Loaders/BasicSpinner"

export const CustomEditorFallback = () => {
    return (
        <div className="grow flex flex-col gap-y-4 w-full h-full items-center justify-center bg-accent">
            <BasicSpinner className="h-16 w-16"/>
            <h1 className="text-2xl">Loading</h1>
        </div>
    )
}