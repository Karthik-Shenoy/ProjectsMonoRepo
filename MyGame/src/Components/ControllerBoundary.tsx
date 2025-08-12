// import * as ReactDom from "react-dom/client";
// import { GameOverModal } from "./modals/GameOverModal"

// export class ControllerBoundary {

//     private static component: ReactDom.Root | undefined = undefined;

//     public static showDialog = () => {
//         this.component = ReactDom.createRoot(document.getElementById("controller-boundary")!);
//         this.component.render(<GameOverModal />);
//     }

//     public static dispose = () => {
//         // deletes the modal from the DOM
//         this.component?.unmount();
//     }
// };


// export const ControllerBoundaryDiv: React.FC<{}> = () => {
//     return <div id="controller-boundary"></div>
// }