export const componentMappings: {
    [key: string]: React.FC<React.PropsWithChildren<any>>
} =
{
    h1: ({ children }) => <h1 className="text-4xl font-extrabold my-5">{children}</h1>,
    h2: ({ children }) => <h2 className="text-3xl font-bold my-4">{children}</h2>,
    h3: ({ children }) => <h3 className="text-2xl font-bold my-3">{children}</h3>,
    h4: ({ children }) => <h4 className="text-lg font-bold my-3">{children}</h4>,
    p: ({ children }) => <p className="text-sm my-2">{children}</p>,
    ul: ({ children }) => <ul className="text-sm list-disc list-outside ml-12 text-justify">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal list-inside ml-4">{children}</ol>,
    li: ({ children }) => <li className="my-2">{children}</li>,
    blockquote: ({ children }) => (
        <blockquote className="border-l-4 border-gray-400 pl-4 italic">
            {children}
        </blockquote>
    ),
    code: ({ children }) => (
        <code className="dark:bg-gray-700 bg-gray-200 text-green-500 px-[3px] py-[2px] rounded-sm">{children}</code>
    ),
    pre: ({ children }) => (
        <pre className="bg-gray-900 text-white p-4 rounded-md overflow-x-auto">{children}</pre>
    ),
    a: ({ children, href }) => (
        <a href={href} className="text-blue-500 underline hover:text-blue-700">
            {children}
        </a>
    ),
    hr: () => <hr className="border-primary" />,
    // img: ({ src, alt: altStr }) => {
    //     const [alt, dims] = altStr.split("|")
    //     const [width, height] = dims.split("x").map((dim: string) => parseInt(dim, 10))
    //     return (
    //         <FlexDiv className="justify-center items-center py-6">

    //         </FlexDiv>
    //     )
    // }
}