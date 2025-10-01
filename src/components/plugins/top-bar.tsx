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
        // const { excludeTypes = [], isVisible } = editor.getOptions(plugin);
        const type = element?.type as string | undefined;

        // const { excludeTypes, isVisible } = useEditorPlugin(plugin).getOptions();

        const isVisible = usePluginOption(plugin, "isVisible");
        const excludeTypes = usePluginOption(plugin, "excludeTypes");

        if (!isVisible) {
          return elementProps.children;
        }

        if (type && excludeTypes.includes(type)) {
          return elementProps.children;
        }

        /* return (
          <div {...attributes} className="">
            <div
              contentEditable={false}
              aria-hidden="true"
              role="presentation"
              tabIndex={-1}
              className="mb-1 text-xs text-muted-foreground/80 select-none h-10 bg-gray-200 flow-root pointer-events-none"
            >
              <Button
                className="pointer-events-auto" // Re-enable pointer events for interactive elements
                onClick={() => {
                  console.log("Hello");
                }}
              >
                Hello
              </Button>
            </div>
            {elementProps.children}
          </div>
        ); */

        return (
          <div className="relative">
            <div
              contentEditable={false}
              className="absolute -top-10 left-0 right-0 text-xs text-muted-foreground/80 select-none h-7 bg-gray-200 pointer-events-none z-10"
            >
              {/* Your top bar content */}
            </div>
            {elementProps.children}
          </div>
        );
      },
  },
}));

{
  /* <div
  contentEditable={false}
  aria-hidden="true"
  role="presentation"
  tabIndex={-1}
  className="mb-1 text-xs text-muted-foreground/80 select-none h-10 bg-gray-200 flow-root"
  // suppress React warning when CE=false elements contain children
  //   suppressContentEditableWarning
></div>; */
}

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
