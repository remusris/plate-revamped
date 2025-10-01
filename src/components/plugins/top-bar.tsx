import * as React from "react";
import { createPlatePlugin, createTPlatePlugin } from "platejs/react";
import { PluginConfig } from "platejs";
import { Button } from "../ui/button";

type AboveEachNodeConfig = PluginConfig<
  "aboveEachNode",
  { excludeTypes: string[] }
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
  options: { excludeTypes: [] },
}).extend(({ editor, plugin }) => ({
  render: {
    aboveNodes:
      ({ element }) =>
      (elementProps) => {
        const { attributes} = elementProps
        const { excludeTypes = [] } = editor.getOptions(plugin);
        const type = (element as any)?.type as string | undefined;

        if (type && excludeTypes.includes(type)) {
          return elementProps.children;
        }

        return (
          <div {...attributes}>
            <div
              contentEditable={false}
              aria-hidden="true"
              role="presentation"
              tabIndex={-1}
              className="mb-1 text-xs text-muted-foreground/80 select-none"
              // suppress React warning when CE=false elements contain children
              //   suppressContentEditableWarning
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
      },
  },
}));
