import { useMonaco } from "@monaco-editor/react"
import * as React from "react"

export type MonacoCodeEditor = {
    getValue: () => string
}

export type MonacoEditorWrapperProps = {
    extraLibContent?: string
    value?: string
    ref?: React.RefObject<MonacoCodeEditor | undefined>
    className?: string
    onMount?: (editor: MonacoCodeEditor) => void
    onChange?: (editor: MonacoCodeEditor) => void
    language: string
    theme: "vs-dark" | "light"
}

export const MonacoEditorWrapper: React.FC<MonacoEditorWrapperProps> = ({ extraLibContent, value, ref, onMount, onChange, language, theme, className }) => {
    const monaco = useMonaco()
    const editorDivRef = React.useRef<HTMLDivElement>(null)
    let editorRefHandle: MonacoCodeEditor | undefined = undefined;

    React.useImperativeHandle(ref, () => editorRefHandle)

    React.useEffect(() => {
        if (!editorDivRef.current || !monaco) {
            return
        }

        monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
            moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
            allowJs: false,
            strict: true,
            noEmit: true,
        });


        monaco.languages.typescript.typescriptDefaults.addExtraLib(
            extraLibContent || "",
            "inmemory://model/contracts.ts"
        );

        const rand = Date.now()


        const model = monaco.editor.createModel(
            value || "",
            language,
            monaco.Uri.parse(`inmemory://model/index-${rand}.ts`)
        );

        const editor = monaco.editor.create(editorDivRef.current, {
            model: model,
            language,
            theme,
        });

        editor.onDidChangeCursorSelection(() => {
            onChange?.(editor)
        })

        const resizeObserver = new ResizeObserver(() => {
            editor.layout();
        })

        resizeObserver.observe(editorDivRef.current)

        editorRefHandle = {
            getValue: () => editor.getValue()
        }

        onMount?.(editorRefHandle)



        return () => {
            editor.dispose();
            resizeObserver.disconnect();
        }
    }, [])

    return (
        <div ref={editorDivRef} className={className} />
    )
}