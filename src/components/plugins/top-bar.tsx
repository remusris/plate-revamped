import * as React from "react";
import {
  createPlatePlugin,
  createTPlatePlugin,
  usePluginOption,
} from "platejs/react";
import { PluginConfig } from "platejs";
import { Button } from "../ui/button";

type AboveEachNodeConfig = PluginConfig<
  "aboveEachNode",
  { excludeTypes: string[]; isVisible: boolean }
>;

/* export const TopBarPlugin = createTPlatePlugin<AboveEachNodeConfig>({
  key: 'aboveEachNode',
  options: { excludeTypes: [] }, // default prevents undefined
}).extend(({ editor, plugin }) => ({
  render: {
    // RenderNodeWrapper: (ctx) => RenderNodeWrapperFunction
    // RenderNodeWrapperFunction: (elementProps) => ReactNode
    aboveNodes: ({ element }) => (elementProps) => {
      const { excludeTypes = [] } = editor.getOptions(plugin); // avoid undefined
      const type = (element)?.type as string | undefined;

      if (type && excludeTypes.includes(type)) {
        // identity wrapper: do nothing
        return elementProps.children;
      }

      return (
        <>
          <div className="mb-1 text-xs text-muted-foreground/80 select-none">
            node: {type ?? 'element'}
          </div>
          {elementProps.children}
        </>
      );
    },
  },
})); */

/* export const TopBarPlugin = createTPlatePlugin<AboveEachNodeConfig>({
  key: "aboveEachNode",
  options: { excludeTypes: [], isVisible: true },
}).extend(({ editor, plugin }) => ({
  render: {
    aboveNodes:
      ({ element }) =>
      (elementProps) => {
        const { excludeTypes = [] } = editor.getOptions(plugin);
        const type = (element)?.type as string | undefined;

        const isVisible = usePluginOption(plugin, 'isVisible');

        if (isVisible === false) {
          return elementProps.children;
        }

        if (type && excludeTypes.includes(type)) {
          return elementProps.children;
        }

        return (
          <div>
            <div
              contentEditable={false}
              aria-hidden="true"
              role="presentation"
              tabIndex={-1}
              // className="mb-1 text-xs text-muted-foreground/80 select-none"
              className={` h-10 w-full text-xs text-muted-foreground/80 bg-gray-200 border rounded-md select-none ${isVisible ? 'block' : 'hidden'}`}
              // suppress React warning when CE=false elements contain children
              //   suppressContentEditableWarning
            >
              node: {type ?? "element"}              
            </div>
            {elementProps.children}
          </div>
        );
      },
  },
})); */

export const TopBarPlugin = createTPlatePlugin<AboveEachNodeConfig>({
  key: "aboveEachNode",
  options: { excludeTypes: [], isVisible: true },
})
.extend(({ editor, plugin }) => ({
  render: {
    aboveNodes:
      ({ element }) =>
      (elementProps) => {
        const { excludeTypes = [] } = editor.getOptions(plugin);
        const type = element?.type as string | undefined;
        const isVisible = usePluginOption(plugin, "isVisible");

        if (isVisible === false || (type && excludeTypes.includes(type))) {
          return elementProps.children;
        }

        return (
          <>
            {/* <div
              contentEditable={false}
              aria-hidden="true"
              role="presentation"
              tabIndex={-1}
              className="h-10 w-full text-xs text-muted-foreground/80 bg-gray-200 border rounded-md select-none mb-1 pointer-events-none"
              data-plate-prevent-deselect
            >
              node: {type ?? "element"}              
            </div> */}
            <div
              className="h-10 bg-gray-200 w-full"
              data-plate-dropzone="true"
              contentEditable={false}
            ></div>
            {elementProps.children}
          </>
        );
      },
  },  
}));

// export const TopBarPlugin = createTPlatePlugin<AboveEachNodeConfig>({
//   key: "aboveEachNode",
//   options: { excludeTypes: [], isVisible: true },
// }).extend(({ editor, plugin }) => ({
//   render: {
//     // You can keep `aboveNodes` if you prefer, but we’ll ensure
//     // it doesn't affect layout or pointer events.
//     aboveNodes:
//       ({ element }) =>
//       (elementProps) => {
//         const { excludeTypes = [] } = editor.getOptions(plugin);
//         const type = (element)?.type as string | undefined;

//         const isVisible = usePluginOption(plugin, 'isVisible');

//         if (type && excludeTypes.includes(type)) {
//           return elementProps.children;
//         }

//         return (
//           <div className="relative">
//             {/* absolutely positioned -> no layout impact; pointer-events-none -> no interference */}
//             <div
//               contentEditable={false}
//               aria-hidden="true"
//               role="presentation"
//               tabIndex={-1}
//               data-plate-prevent-deselect
//               className={[
//                 // keep it above node content but below the gutter/handle (z-50)
//                 "absolute -top-5 left-0 z-40",
//                 "text-xs text-muted-foreground/80 select-none",
//                 "pointer-events-none",
//                 isVisible ? "block" : "hidden",
//               ].join(" ")}
//             >
//               node: {type ?? "element"}
//             </div>

//             {/* add a little padding so the absolute bar doesn't overlap text (optional) */}
//             <div className="pt-3">{elementProps.children}</div>
//           </div>
//         );
//       },

//     // Alternative (even safer): render *inside* the element root instead of wrapping it
//     // so wrappers like BlockDraggable are outermost.
//     // belowRootNodes: (props) => {
//     //   const type = (props.element as any)?.type as string | undefined
//     //   const isVisible = usePluginOption(plugin, 'isVisible')
//     //   return (
//     //     <div className="relative">
//     //       <div
//     //         contentEditable={false}
//     //         aria-hidden
//     //         tabIndex={-1}
//     //         data-plate-prevent-deselect
//     //         className={[
//     //           "absolute -top-5 left-0 z-40 text-xs text-muted-foreground/80 select-none pointer-events-none",
//     //           isVisible ? "block" : "hidden",
//     //         ].join(" ")}
//     //       >
//     //         node: {type ?? "element"}
//     //       </div>
//     //       <div className="pt-5" />
//     //     </div>
//     //   )
//     // },
//   },
// }));
