import * as React from "react";
import {
  createPlatePlugin,
  createTPlatePlugin,
  useEditorPlugin,
  usePluginOption,
  useEditorRef,
  useElement,
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

// not updating in real-time
// export const TopBarPlugin = createTPlatePlugin<AboveEachNodeConfig>({
//   key: "aboveEachNode",
//   options: { excludeTypes: [], enabled: true },
// }).extend(({ editor, plugin }) => ({
//   render: {
//     aboveNodes:
//       ({ element }) =>
//       (elementProps) => {
//         const { excludeTypes = [] } = editor.getOptions(plugin);
//         const type = (element as any)?.type as string | undefined;

//         const { enabled } = editor.getOptions(plugin);

//         // If disabled, just render children
//         if (!enabled) {
//           return elementProps.children;
//         }

//         if (type && excludeTypes.includes(type)) {
//           return elementProps.children;
//         }

//         return (
//           <>
//             <div
//               contentEditable={false}
//               aria-hidden="true"
//               role="presentation"
//               tabIndex={-1}
//               className="mb-1 text-xs text-muted-foreground/80 select-none pointer-events-none"
//               // suppress React warning when CE=false elements contain children
//               //   suppressContentEditableWarning
//             >
//               node: {type ?? "element"}
//               <Button
//                 onClick={() => {
//                   console.log("Hello");
//                 }}
//               >
//                 Hello
//               </Button>
//             </div>
//             {elementProps.children}
//           </>
//         );
//       },
//   },
// }));

// still not working
export const TopBarPlugin = createTPlatePlugin<AboveEachNodeConfig>({
  key: "aboveEachNode",
  options: { excludeTypes: [], isVisible: true },
}).extend(({ editor, plugin }) => ({
  render: {
    aboveNodes:
      ({ element }) =>
      (elementProps) => {
        // Move this hook call inside the component that gets returned
        const TopBarContent = () => {
          const { getOptions } = useEditorPlugin(plugin);
          const { excludeTypes = [], enabled = true } = getOptions();
          const type = (element as any)?.type as string | undefined;

          // If disabled, just render children
          if (!enabled) {
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
                className="mb-1 text-xs text-muted-foreground/80 select-none pointer-events-none"
              >
                node: {type ?? "element"}
                <Button
                  onClick={() => {
                    console.log("Hello");
                  }}
                >
                  Hello
                </Button>
              </div>
              {elementProps.children}
            </div>
          );
        };

        return <TopBarContent />;
      },
  },
}));

// works with the visible options
// export const TopBarPlugin = createTPlatePlugin<AboveEachNodeConfig>({
//   key: "aboveEachNode",
//   options: { excludeTypes: [], isVisible: true },
// }).extend(({ plugin }) => ({
//   render: {
//     aboveNodes:
//       ({ element }) =>
//       (elementProps) => {
//         const TopBarContent = () => {
//           // Subscribe to the options so this re-renders when they change
//           const isVisible = usePluginOption(plugin, 'isVisible');
//           // const excludeTypes = usePluginOption<string[]>(plugin, 'excludeTypes') ?? [];

//           const type = (element as any)?.type as string | undefined;

//           if (!isVisible) return elementProps.children;
//           // if (type && excludeTypes.includes(type)) return elementProps.children;

//           return (
//             <>
//               <div
//                 data-plate-prevent-deselect
//                 contentEditable={false}
//                 aria-hidden="true"
//                 role="presentation"
//                 tabIndex={-1}
//                 className="text-xs text-muted-foreground/80 select-none pointer-events-none"
//               >
//                 node: {type ?? "element"}
//               </div>
//               {elementProps.children}
//             </>
//           );
//         };

//         return <TopBarContent />;
//       },
//   },
// }));

// text is being inserted backwards
// export const TopBarPlugin = createTPlatePlugin<AboveEachNodeConfig>({
//   key: 'aboveEachNode',
//   options: { excludeTypes: [], isVisible: true },
// })
// .extend(({ plugin }) => ({
//   render: {
//     aboveNodes:
//       ({ element }) =>
//       (elementProps) => {
//         const TopBarContent = () => {
//           const isVisible = usePluginOption(plugin, 'isVisible');
//           const excludeTypes = usePluginOption(plugin, 'excludeTypes') ?? [];
//           const type = (element as any)?.type as string | undefined;

//           // Don’t render at all if hidden or excluded
//           /* if (!isVisible || (type && excludeTypes.includes(type))) {
//             return elementProps.children;
//           } */

//           // return (
//           //   // Make a positioning context that DOESN'T disable editing
//           //   <div className="relative">
//           //     {/* Absolutely positioned overlay; doesn't affect layout or events */}
//           //     <div
//           //       contentEditable={false}
//           //       aria-hidden="true"
//           //       role="presentation"
//           //       tabIndex={-1}
//           //       draggable={false}
//           //       // className="pointer-events-none select-none absolute -top-2 left-0 text-xs text-muted-foreground/80 bg-gray-200 border rounded-md h-8"
//           //       className={`select-none absolute -top-2 left-0 text-xs text-muted-foreground/80 bg-gray-200 border rounded-md h-8 w-full ${isVisible ? '' : 'hidden'}`}
//           //     >
//           //       node: {type ?? 'element'}
//           //     </div>

//           //     {/* The actual node content */}
//           //     {elementProps.children}
//           //   </div>
//           // );

//           return (
//             <div className="relative">
//               {elementProps.children}
//               <div
//                 contentEditable={false}
//                 aria-hidden="true"
//                 role="presentation"
//                 tabIndex={-1}
//                 draggable={false}
//                 className={`pointer-events-none select-none absolute -top-2 left-0 text-xs text-muted-foreground/80 bg-gray-200 border rounded-md h-8 w-full ${isVisible ? '' : 'hidden'}`}
//               >
//                 node: {type ?? 'element'}
//               </div>
//             </div>
//           );
//         };

//         return <TopBarContent />;
//       },
//   },
// }));

// worked but not what we want
// export const TopBarPlugin = createTPlatePlugin<AboveEachNodeConfig>({
//   key: "aboveEachNode",
//   options: { excludeTypes: [], isVisible: true },
// }).extend(({ plugin }) => ({
//   render: {
//     belowRootNodes: (props) => {
//       const isVisible = usePluginOption(plugin, 'isVisible');
//       const type = props.element?.type;

//       if (!isVisible) return null;

//       return (
//         <div
//           data-plate-prevent-deselect
//           contentEditable={false}
//           className="mb-1 text-xs text-muted-foreground/80 select-none pointer-events-none"
//         >
//           node: {type ?? "element"}
//         </div>
//       );
//     },
//   },
// }));

// const TopBarWrapper = ({ children }: { children: React.ReactNode }) => {
//   const editor = useEditorRef();
//   const element = useElement();
//   const plugin = useEditorPlugin(TopBarPlugin);

//   // This will properly subscribe and re-render when the option changes
//   console.log("plugin", plugin);

//   const isVisible = editor.getOption(TopBarPlugin, 'isVisible');
//   const type = (element as any)?.type as string | undefined;

//   React.useEffect(() => {
//     console.log("isVisible", isVisible);
//   }, [isVisible]);

//   if (!isVisible) {
//     return <>{children}</>;
//   }

//   return (
//     <>
//       <div
//         contentEditable={false}
//         aria-hidden="true"
//         role="presentation"
//         tabIndex={-1}
//         className="mb-1 text-xs text-muted-foreground/80 select-none pointer-events-none"
//       >
//         node: {type ?? "element"}
//       </div>
//       {children}
//     </>
//   );
// };

// export const TopBarPlugin = createTPlatePlugin<AboveEachNodeConfig>({
//   key: "aboveEachNode",
//   options: { excludeTypes: [], isVisible: true },
// }).extend(() => ({
//   render: {
//     aboveNodes: () => (elementProps) => {
//       return <TopBarWrapper>{elementProps.children}</TopBarWrapper>;
//     },
//   },
// }));
