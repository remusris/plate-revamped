// plugins/badge-plugin.tsx
import {
  Key,
  PlateElement,
  type PlateElementProps,
  createTPlatePlugin,
  //   type PlateEditor,
} from "platejs/react";
import type { PluginConfig } from "platejs";
import { useSelected, useFocused } from "platejs/react";
// import { Element, Editor, Node, Path, Transforms } from "platejs";

type BadgeOptions = {
  defaultLabel?: string;
};

// Declare a typed config so editor.tf.insert.badge() is known
type BadgeConfig = PluginConfig<
  "badge",
  BadgeOptions,
  {}, // api
  {
    // transforms
    insert: {
      badge: (opts?: { label?: string; color?: string }) => void;
    };
  }
>;

export const BadgePlugin = createTPlatePlugin<BadgeConfig>({
  key: "badge",
  options: { defaultLabel: "Badge" },
  node: {
    isElement: true,
    isVoid: true,
    isInline: false,
    isSelectable: false,
  },
  rules: {
    delete: {
      start: "default",
      empty: "default",
    },
    merge: {
      removeEmpty: false,
    },
  },
})
  .withComponent(BadgeElement)
  .extendEditorTransforms<BadgeConfig["transforms"]>(
    ({ editor, type, getOptions }) => ({
      insert: {
        badge: (opts) => {
          const { defaultLabel } = getOptions();
          // Use a block insert helper; void still needs a text child
          editor.tf.insertNode(
            {
              type,
              label: opts?.label ?? defaultLabel ?? "Badge",
              color: opts?.color,
              children: [{ text: "" }],
            },
            { select: true, mode: "highest" }
          );
        },
      },
    })
  )
  .extend({
    // Name the shortcut the same as the transform to auto-wire,
    // or provide a handler that calls editor.tf.insert.badge()
    shortcuts: {
      badge: {
        keys: [[Key.Mod, Key.Alt, "b"]],
      },
      // Or with explicit handler:
      // badge: {
      //   keys: [[Key.Mod, Key.Alt, 'b']],
      //   handler: ({ editor }) => editor.tf.insert.badge(),
      // },
    },
  })
  .overrideEditor(
    ({ editor, type, tf: { deleteBackward, deleteForward } }) => ({
      transforms: {
        deleteBackward(unit) {
          const selection = editor.selection;

          if (!selection) {
            deleteBackward(unit);
            return;
          }

          // Get the current block
          const blockEntry = editor.api.block({ at: selection });

          if (blockEntry) {
            const [block] = blockEntry;

            // If current block is a badge, prevent deletion
            if (block.type === type) {
              return;
            }
          }

          // Check if the previous sibling is a badge when at start of current block
          const isAtStart = editor.api.isStart(selection.anchor, selection);
          if (isAtStart && blockEntry) {
            const [, blockPath] = blockEntry;

            // Try to get previous sibling
            if (blockPath[blockPath.length - 1] > 0) {
              const previousPath = [...blockPath];
              previousPath[previousPath.length - 1] -= 1;

              try {
                const previousNode = editor.api.node({ at: previousPath });
                if (previousNode) {
                  const [prevBlock] = previousNode;
                  if (prevBlock.type === type) {
                    // Select the badge instead of deleting
                    editor.tf.select(previousPath);
                    return;
                  }
                }
              } catch (e) {
                // Path doesn't exist, continue with normal deletion
              }
            }
          }

          // Default behavior
          deleteBackward(unit);
        },

        deleteForward(unit) {
          const selection = editor.selection;

          if (!selection) {
            deleteForward(unit);
            return;
          }

          // Get the current block
          const blockEntry = editor.api.block({ at: selection });

          if (blockEntry) {
            const [block] = blockEntry;

            // If current block is a badge, prevent deletion
            if (block.type === type) {
              return;
            }
          }

          // Check if the next sibling is a badge when at end of current block
          const isAtEnd = editor.api.isEnd(selection.anchor, selection);
          if (isAtEnd && blockEntry) {
            const [, blockPath] = blockEntry;

            // Try to get next sibling
            const nextPath = [...blockPath];
            nextPath[nextPath.length - 1] += 1;

            try {
              const nextNode = editor.api.node({ at: nextPath });
              if (nextNode) {
                const [nextBlock] = nextNode;
                if (nextBlock.type === type) {
                  // Select the badge instead of deleting
                  editor.tf.select(nextPath);
                  return;
                }
              }
            } catch (e) {
              // Path doesn't exist, continue with normal deletion
            }
          }

          // Default behavior
          deleteForward(unit);
        },
      },
    })
  );

// --- Rendering ---

/* function BadgeElement(props: PlateElementProps) {
    const { element } = props as PlateElementProps & {
      element: { label?: string; color?: string };
    };
  
    return (
      <PlateElement as="div" {...props}>
        <div
          contentEditable={false}
          aria-hidden="true"
          tabIndex={-1}
          className="my-2 inline-flex select-none items-center gap-2 rounded-md border px-2 py-1"
          // onMouseDown={(e) => e.preventDefault()}
          suppressContentEditableWarning
        >
          <span
            className="inline-flex items-center rounded px-2 py-0.5 text-sm"
            style={{
              background: element.color ?? "var(--muted)",
              color: "var(--foreground)",
            }}
          >
            {element.label ?? "Badge"}
          </span>
        </div>
  
        {props.children}
      </PlateElement>
    );
  } */

function BadgeElement(props: PlateElementProps) {
  const { element } = props as PlateElementProps & {
    element: { label?: string; color?: string };
  };

  const selected = useSelected(); // true if this element (or its text) is in the current selection
  const focused = useFocused();

  return (
    <PlateElement {...props} className="m-1">
      <div
        contentEditable={false}
        aria-hidden="true"
        role="presentation"
        tabIndex={-1}
        data-plate-prevent-deselect
        className="pointer-events-none select-none h-8 w-full bg-gray-200"
        // suppress React warning when CE=false nodes contain children
        suppressContentEditableWarning
      />
      <div
        contentEditable={false}
        // className="inline-flex select-none items-center gap-2 rounded-md border px-2 py-1"
        className={`inline-flex select-none items-center gap-2 rounded-md border px-2 py-1 ${
          selected ? "border-blue-500" : ""
        }`}
      >
        <span
          //   className="inline-flex items-center rounded px-2 py-0.5 text-sm bg-gray-200 border"
          className={`inline-flex items-center rounded px-2 py-0.5 text-sm bg-gray-200 border `}
          style={{
            background: element.color ?? "var(--muted)",
            color: "var(--foreground)",
          }}
        >
          {element.label ?? "Badge"}
        </span>
      </div>
      {/* <span className="hidden">{props.children}</span> */}
      {props.children}
    </PlateElement>
  );
}

/* function BadgeElement(props: PlateElementProps) {
    const { element } = props as PlateElementProps & {
      element: { label?: string; color?: string };
    };
  
    // IMPORTANT: spread {...props}, not {...attributes}
    // Also render {props.children} to keep Slate happy around voids.
    return (
      <PlateElement
        as="div"
        {...props}
        className="my-2 inline-flex items-center gap-2 rounded-md border px-2 py-1"
      >
        <span
          className="inline-flex select-none items-center rounded px-2 py-0.5 text-sm"
          style={{
            background: element.color ?? "var(--muted)",
            color: "var(--foreground)",
          }}
        >
          {element.label ?? "Badge"}
        </span>
        {props.children}
      </PlateElement>
    );
  } */
