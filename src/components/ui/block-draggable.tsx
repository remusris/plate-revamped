"use client";

import * as React from "react";

import { DndPlugin, useDraggable, useDropLine } from "@platejs/dnd";
import { expandListItemsWithChildren } from "@platejs/list";
import { BlockSelectionPlugin } from "@platejs/selection/react";
import { GripVertical } from "lucide-react";
import { type TElement, getPluginByType, isType, KEYS } from "platejs";
import {
  type PlateEditor,
  type PlateElementProps,
  type RenderNodeWrapper,
  MemoizedChildren,
  useEditorRef,
  useElement,
  usePluginOption,
} from "platejs/react";
import { useSelected } from "platejs/react";

import { ParagraphPlugin } from "platejs/react";
import { BadgePlugin } from "../plugins/badge-plugin";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const BlockDraggable: RenderNodeWrapper = (props) => {
  return (props) => <Draggable {...props} />;
};

function Draggable(props: PlateElementProps) {
  const { children, editor, element, path } = props;
  const blockSelectionApi = editor.getApi(BlockSelectionPlugin).blockSelection;

  const elementType = element.type;
  console.log(elementType, " inside block draggable");

  let dragHandlePositioning = "";

  if (elementType === BadgePlugin.key) {
    dragHandlePositioning = "bottom-[10px]";
  } else if (elementType === ParagraphPlugin.key) {
    dragHandlePositioning = "bottom-[8px]";
  }

  // const dragHandlePositioning = elementType === "badge" ? "bottom-[10px]" : "bottom-[8px]";

  const { isAboutToDrag, isDragging, nodeRef, previewRef, handleRef } =
    useDraggable({
      element,
      onDropHandler: (_, { dragItem }) => {
        const id = (dragItem as { id: string[] | string }).id;

        if (blockSelectionApi) {
          blockSelectionApi.add(id);
        }
        resetPreview();
      },
    });

  const isInColumn = path.length === 3;
  const isInTable = path.length === 4;

  const [previewTop, setPreviewTop] = React.useState(0);

  const resetPreview = () => {
    if (previewRef.current) {
      previewRef.current.replaceChildren();
      previewRef.current?.classList.add("hidden");
    }
  };

  // clear up virtual multiple preview when drag end
  React.useEffect(() => {
    if (!isDragging) {
      resetPreview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging]);

  React.useEffect(() => {
    if (isAboutToDrag) {
      previewRef.current?.classList.remove("opacity-0");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAboutToDrag]);

  return (
    <div
      className={cn(
        "relative",
        isDragging && "opacity-50",
        getPluginByType(editor, element.type)?.node.isContainer
          ? "group/container"
          : "group"
      )}
      onMouseEnter={() => {
        if (isDragging) return;
        // setDragButtonTop(calcDragButtonTop(editor, element));
      }}
    >
      {!isInTable && (
        <Gutter>
          <div
            className={cn(
              "slate-blockToolbarWrapper",
              // was: 'flex h-[1.5em]'
              "flex h-full items-end", // ⬅️ fill block height, stick to bottom
              isInColumn && "h-full" // keep full height in columns too
            )}
          >
            <div
              className={cn(
                "slate-blockToolbar relative w-4.5",
                "pointer-events-auto mr-1 flex items-end", // ⬅️ bottom align
                isInColumn && "mr-1.5"
              )}
            >
              <Button
                ref={handleRef}
                variant="ghost"
                // className="absolute -left-0 bottom-[8px] h-6 w-full p-0" // ⬅️ bottom instead of top
                className={`absolute -left-0 ${dragHandlePositioning} h-6 w-full p-0`}
                data-plate-prevent-deselect
              >
                <DragHandle
                  isDragging={isDragging}
                  previewRef={previewRef}
                  resetPreview={resetPreview}
                  setPreviewTop={setPreviewTop}
                />
              </Button>
            </div>
          </div>
        </Gutter>
      )}

      <div
        ref={previewRef}
        className={cn("absolute -left-0 hidden w-full")}
        style={{ top: `${-previewTop}px` }}
        contentEditable={false}
      />

      <div
        ref={nodeRef}
        className="slate-blockWrapper flow-root"
        onContextMenu={(event) =>
          editor
            .getApi(BlockSelectionPlugin)
            .blockSelection.addOnContextMenu({ element, event })
        }
      >
        <MemoizedChildren>{children}</MemoizedChildren>
        <DropLine />
      </div>
    </div>
  );
}

function Gutter({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  const editor = useEditorRef();
  const element = useElement();
  const isSelectionAreaVisible = usePluginOption(
    BlockSelectionPlugin,
    "isSelectionAreaVisible"
  );
  const selected = useSelected();

  return (
    <div
      {...props}
      className={cn(
        "slate-gutterLeft",
        "absolute top-0 z-50 flex h-full -translate-x-full cursor-text hover:opacity-100 sm:opacity-0",
        getPluginByType(editor, element.type)?.node.isContainer
          ? "group-hover/container:opacity-100"
          : "group-hover:opacity-100",
        isSelectionAreaVisible && "hidden",
        !selected && "opacity-0",
        className
      )}
      contentEditable={false}
    >
      {children}
    </div>
  );
}

const DragHandle = React.memo(function DragHandle({
  isDragging,
  previewRef,
  resetPreview,
  setPreviewTop,
}: {
  isDragging: boolean;
  previewRef: React.RefObject<HTMLDivElement | null>;
  resetPreview: () => void;
  setPreviewTop: (top: number) => void;
}) {
  const editor = useEditorRef();
  const element = useElement();

  return (
    <div
      className="flex size-full items-center justify-center"
      onClick={(e) => {
        e.preventDefault();
        editor.getApi(BlockSelectionPlugin).blockSelection.focus();
      }}
      onMouseDown={(e) => {
        resetPreview();
        if ((e.button !== 0 && e.button !== 2) || e.shiftKey) return;
      }}
      onMouseEnter={() => {
        if (isDragging) return;
      }}
      onMouseUp={() => {
        resetPreview();
      }}
      data-plate-prevent-deselect
      role="button"
    >
      <GripVertical className="text-muted-foreground" />
    </div>
  );
});

const DropLine = React.memo(function DropLine({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { dropLine } = useDropLine();

  if (!dropLine) return null;

  return (
    <div
      {...props}
      className={cn(
        "slate-dropLine",
        "absolute inset-x-0 h-0.5 opacity-100 transition-opacity",
        "bg-sky-200",
        dropLine === "top" && "-top-px",
        dropLine === "bottom" && "-bottom-px",
        className
      )}
    />
  );
});
