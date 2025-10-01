import * as React from "react";
import {
  createPlatePlugin,
  createTPlatePlugin,
  useEditorPlugin,
  usePluginOption,
  usePluginOptions,
} from "platejs/react";
import { PluginConfig } from "platejs";
import { Button } from "../ui/button";

import { useFloating } from "@floating-ui/react";
import { offset, flip, shift, autoUpdate } from "@floating-ui/react";

type AboveEachNodeConfig = PluginConfig<
  "aboveEachNode",
  { excludeTypes: string[]; isVisible: boolean }
>;

export const TopBarPlugin = createTPlatePlugin<AboveEachNodeConfig>({
  key: "aboveEachNode",
  options: { excludeTypes: [], isVisible: false },
  node: {
    isVoid: true,
    isElement: true,
  },
}).extend(({ editor, plugin }) => ({
  render: {
    aboveNodes:
      ({ element }) =>
      (elementProps) => {
        const { attributes } = elementProps;
        const type = element?.type as string | undefined;

        const isVisible = usePluginOption(plugin, "isVisible");
        const excludeTypes = usePluginOption(plugin, "excludeTypes");

        const [referenceElement, setReferenceElement] =
          React.useState<HTMLDivElement | null>(null);

        const { refs, floatingStyles } = useFloating({
          placement: "top-start",
          middleware: [offset(4)],
          whileElementsMounted: autoUpdate,
        });

        React.useEffect(() => {
          if (referenceElement) {
            refs.setReference(referenceElement);
          }
        }, [referenceElement, refs]);

        /* if (!isVisible) {
          return elementProps.children;
        } */

        if (type && excludeTypes.includes(type)) {
          return elementProps.children;
        }

        return (
          <div {...attributes} ref={setReferenceElement} className="mt-10">
            {elementProps.children}
            {isVisible && (
              <div
                ref={refs.setFloating}
                style={floatingStyles}
                contentEditable={false}
                aria-hidden="true"
                role="presentation"
                tabIndex={-1}
                className="z-50 bg-gray-200 text-xs text-muted-foreground/80 select-none h-10 px-3 rounded shadow-md flex items-center gap-2 pointer-events-auto"
              >
                <span>Node: {type ?? "element"}</span>
                {/* Add buttons or controls here */}
              </div>
            )}
          </div>
        );
      },
  },
}));

{
  /* node: {type ?? "element"}
              <Button
                onClick={() => {
                  console.log("Hello");
                }}
              >
                Hello
              </Button> */
}

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

// export const TopBarPlugin = createTPlatePlugin<AboveEachNodeConfig>({
//   key: "aboveEachNode",
//   options: { excludeTypes: [], isVisible: false },
//   node: {
//     isVoid: true,
//     isElement:true
//   }
// }).extend(({ editor, plugin }) => ({
//   render: {
//     aboveNodes:
//       ({ element }) =>
//       (elementProps) => {
//         const { attributes} = elementProps
//         // const { excludeTypes = [], isVisible } = editor.getOptions(plugin);
//         const type = (element)?.type as string | undefined;

//         // const { excludeTypes, isVisible } = useEditorPlugin(plugin).getOptions();

//         const isVisible = usePluginOption(plugin, "isVisible");
//         const excludeTypes = usePluginOption(plugin, "excludeTypes");

//         if (!isVisible) {
//           return elementProps.children;
//         }

//         if (type && excludeTypes.includes(type)) {
//           return elementProps.children;
//         }

//         return (
//           <div {...attributes}>
//             <div
//               contentEditable={false}
//               aria-hidden="true"
//               role="presentation"
//               tabIndex={-1}
//               className="mb-1 text-xs text-muted-foreground/80 select-none h-10 bg-gray-200"
//               // suppress React warning when CE=false elements contain children
//               //   suppressContentEditableWarning
//             >

//             </div>
//             {elementProps.children}
//           </div>
//         );
//       },
//   },
// }));
