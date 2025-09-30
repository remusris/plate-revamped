"use client";

import * as React from "react";

import type { PlateElementProps } from "platejs/react";

import { PlateElement } from "platejs/react";

import { cn } from "@/lib/utils";

export function ParagraphElement(props: PlateElementProps) {
  return (
    <PlateElement {...props} className={cn("m-1 px-0 py-1")}>
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
      {props.children}
    </PlateElement>
  );
}
