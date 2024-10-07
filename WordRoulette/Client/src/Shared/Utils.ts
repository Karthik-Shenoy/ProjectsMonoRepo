export namespace ContainerUtils {
    export const removeFromList = <T>(list: T[], index: number) => {
        return list.slice(0, index).concat(list.slice(index + 1));
    }
}