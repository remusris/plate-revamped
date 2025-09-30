import { Plate, usePlateEditor } from "platejs/react";

import { Editor, EditorContainer } from "@/components/ui/editor";
import { normalizeNodeId } from "platejs";
import { NormalizeNodeIdOptions } from "platejs";
import { ParagraphPlugin } from "platejs/react";
import { ParagraphElement } from "@/components/ui/paragraph-node";
import { DndPlugin } from "@platejs/dnd";
import { BlockDraggable } from "@/components/ui/block-draggable";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { TopBarPlugin } from "@/components/plugins/top-bar";
import { BadgePlugin } from "@/components/plugins/badge-plugin";
import { Button } from "./ui/button";

import { TrailingBlockPlugin } from 'platejs';

export function PlateEditor() {
  const editor = usePlateEditor({
    plugins: [
      ParagraphPlugin.withComponent(ParagraphElement),
      DndPlugin.configure({
        options: {
          enableScroller: true,
        },
        render: {
          aboveNodes: BlockDraggable,
          aboveSlate: ({ children }) => {
            return <DndProvider backend={HTML5Backend}>{children}</DndProvider>;
          },
        },
      }),
      TopBarPlugin,
      BadgePlugin,
      TrailingBlockPlugin.configure({
        options: {
          type: "p",
        }
      }),
    ],
    value,
  });

  const insertBadge = () => {
    editor.tf.insert.badge();
  }

  return (
    <Plate
      editor={editor}
      onChange={(value) => {
            console.log(value);
          }}
    >
      <Button onClick={insertBadge}>Insert Badge</Button>
      <EditorContainer>
        <Editor />
      </EditorContainer>
    </Plate>
  );
}

const paragraphKey = ParagraphPlugin.key;

const value = normalizeNodeId([
  {
    type: "p",
    id: "1",
    children: [
      {
        text: "Hello, world!",
      },
    ],
  },
  {
    type: "badge",
    id: "3",
    children: [
      {
        text: "",
      },
    ],
  },
  {
    type: paragraphKey,
    id: "2",
    children: [
      {
        text: "Hello, world! 2",
      },
    ],
  },
  
]);
