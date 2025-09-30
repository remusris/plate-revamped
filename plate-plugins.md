Plugin Methods
Previous
Next
Explore the various methods available for extending Plate plugins.

Copy Markdown
Open
Configuration Methods
When extending plugins, all properties are deeply merged by default, with two exceptions: arrays are replaced entirely, and the options object is shallow merged.

.configure
The .configure method allows you to override the plugin's configuration.

const ConfiguredPlugin = MyPlugin.configure({
  options: {
    myOption: 'new value',
  },
});
Copy
You can also use a function to access the current configuration:

const ConfiguredPlugin = MyPlugin.configure(({ getOptions }) => ({
  options: {
    ...getOptions(),
    myOption: `${getOptions().myOption} + extra`,
  },
}));
Copy
It's used to modify existing properties of the plugin.
It doesn't add new properties to the plugin.
The last configuration applied is the one used by the editor.
It doesn't return an extended type, maintaining the original plugin type.
.configurePlugin
The .configurePlugin method allows you to configure the properties of a nested plugin:

const TablePlugin = createPlatePlugin({
  key: 'table',
  plugins: [TableCellPlugin],
}).configurePlugin(TableCellPlugin, {
  options: {
    cellOption: 'modified',
  },
});
Copy
It's used to configure nested plugins within a parent plugin.
Like .configure, it modifies existing properties but doesn't add new ones.
It's useful for adjusting the behavior of sub-plugins without extending their types.
.extend
The .extend method allows you to extend the plugin's configuration and functionality.

const ExtendedPlugin = MyPlugin.extend({
  options: {
    newOption: 'new value',
  },
});
Copy
You can also use a function to access the current configuration and editor:

const ExtendedPlugin = MyPlugin.extend(({ editor, plugin }) => ({
  options: {
    newOption: 'new value',
  },
  handlers: {
    onKeyDown: () => {
      // Custom key down logic
    },
  },
}));
Copy
It's used to add new properties or modify existing ones in the plugin.
It returns a new plugin instance with extended types.
It's chainable, allowing multiple extensions to be applied sequentially.
.extendPlugin
The .extendPlugin method allows you to extend the configuration and functionality of a nested plugin:

const TablePlugin = createPlatePlugin({
  key: 'table',
  plugins: [TableCellPlugin],
}).extendPlugin(TableCellPlugin, {
  options: {
    newCellOption: 'added',
  },
  handlers: {
    onKeyDown: () => {
      // Custom key down logic for table cells
    },
  },
});
Copy
It's used to extend nested plugins within a parent plugin.
It can add new properties and modify existing ones in the nested plugin.
It returns a new parent plugin instance with the extended nested plugin.
Difference between .configure and .extend
While both methods can be used to modify plugin configuration, they have some key differences:

Chaining: .extend is chainable, while .configure is not.
Type extension: .extend returns a new plugin instance with extended types, while .configure maintains the original type.
New properties: .extend can add new properties to the plugin configuration, while .configure only modifies existing ones.
Choose the appropriate method based on whether you need to extend the plugin's type and functionality (use .extend) or simply modify existing configuration (use .configure).

.extendSelectors
The extendSelectors method allows you to add subscribable selectors to your plugin:

const CounterPlugin = createPlatePlugin({
  key: 'counter',
  options: {
    count: 0,
  },
}).extendSelectors(({ getOptions }) => ({
  doubleCount: () => getOptions().count * 2,
  isEven: () => getOptions().count % 2 === 0,
}));
Copy
You can then use those selectors in your components or other plugin methods:

const CounterComponent = () => {
  const count = usePluginOption(CounterPlugin, 'count');
  const doubleCount = usePluginOption(CounterPlugin, 'doubleCount');
  const isEven = usePluginOption(CounterPlugin, 'isEven');
 
  return (
    <div>
      <p>Count: {count}</p>
      <p>Double Count: {doubleCount}</p>
      <p>Is Even: {isEven ? 'Yes' : 'No'}</p>
    </div>
  );
};
Copy
It allows you to create derived state or computed values from plugin options.
Read the value using getOption
Subscribe to the value using usePluginOption, recomputed whenever options change, re-rendering only when the result changes. This is the main difference with .extendApi.
.withComponent
The withComponent method allows you to set or replace the component associated with a plugin.

const ParagraphPlugin = createPlatePlugin({
  key: 'p',
  node: {
    isElement: true,
    type: 'p',
  },
}).withComponent(ParagraphElement);
Copy
API and Transforms
Plugins can define their own API methods and transforms that will be merged into the editor's API and transforms. This is done using the extendApi, extendEditorApi, extendTransforms, and extendEditorTransforms methods.

.extendApi
Use extendApi to add plugin-specific API methods:

const MyPlugin = createPlatePlugin({
  key: 'myPlugin',
}).extendApi(() => ({
  pluginMethod: () => 'plugin method result',
}));
 
// Access the plugin's API
editor.api.myPlugin.api.pluginMethod();
Copy
.extendEditorApi
Use extendEditorApi to add root-level API methods:

const MyPlugin = createPlatePlugin({
  key: 'myPlugin',
}).extendEditorApi(({ getOptions }) => ({
  editorMethod: () => getOptions().someOption,
}));
 
// Access the plugin's API
editor.api.editorMethod();
Copy
.extendTransforms
Use extendTransforms to add plugin-specific transform methods:

const MyPlugin = createPlatePlugin({
  key: 'myPlugin',
}).extendTransforms(() => ({
  pluginTransform: () => {
    // Custom transform logic
  },
}));
 
// Access the plugin's transform
editor.tf.myPlugin.pluginTransform();
 
// NOTE: `editor.tf` in a short alias to `editor.transforms`
editor.transforms.myPlugin.pluginTransform();
Copy
.extendEditorTransforms
Use extendEditorTransforms to add root-level transform methods:

const MyPlugin = createPlatePlugin({
  key: 'myPlugin',
}).extendEditorTransforms(({ editor }) => ({
  editorTransform: () => {
    // Custom editor transform logic
  },
}));
 
// Access the plugin's transform
editor.tf.editorTransform();
Copy
.overrideEditor
The overrideEditor method is used specifically for overriding existing editor methods without altering the plugin's type:

const MyPlugin = createPlatePlugin({
  key: 'myPlugin',
}).overrideEditor(({ editor, tf: { insertText }, api: { isInline } }) => ({
  transforms: {
    insertText(text, options) {
      // Override insertText behavior
      insertText(text, options);
    },
  },
  api: {
    isInline(element) {
      // Override isInline behavior
      return isInline(element);
    },
  },
}));
Copy
Used specifically for overriding existing editor methods
Returns the overridden methods wrapped in transforms or api objects
Cannot add new methods (use extendEditorTransforms or extendEditorApi instead)
Provides access to original methods through the context
Difference between API and Transforms
While there is currently no core difference between API and Transforms in Plate, they serve distinct purposes and are designed with future extensibility in mind:

Transforms:

Store all Slate transforms and editor operations here. Structured to potentially support middlewares in the future, allowing for more complex transform pipelines and devtools.
Typically used for operations that modify the editor state, such as inserting, deleting, or transforming content.
Example: editor.tf.toggleBlock(), editor.tf.toggleMark('bold')
API:

Store all queries, utility functions, and other methods that don't directly modify the editor state.
Example: editor.api.save(), editor.api.debug.log()
Chaining Extensions
You can chain these methods to create a comprehensive plugin:

const MyPlugin = createPlatePlugin({
  key: 'myPlugin',
  options: {
    baseValue: 5,
  },
})
  .extendApi(() => ({
    pluginMethod: () => 'plugin method',
  }))
  .extendEditorApi(({ getOptions }) => ({
    multiply: (factor: number) => getOptions().baseValue * factor,
  }))
  .extendTransforms(() => ({
    pluginTransform: () => {
      // Plugin-specific transform
    },
  }))
  .extendEditorTransforms(({ editor }) => ({
    editorTransform: () => {
      // Editor-specific transform
    },
  }));
 
editor.api.myPlugin.api.pluginMethod();
editor.api.multiply(3);
editor.tf.myPlugin.pluginTransform();
editor.tf.editorTransform();
Copy
Convert a Slate Plugin to a Plate Plugin
To convert a typed Slate plugin to a Plate plugin, you can use toPlatePlugin:

const CodeBlockPlugin = toPlatePlugin(createSlatePlugin({ key: 'code_block' }), {
  handlers: {},
  options: { hotkey: ['mod+opt+8', 'mod+shift+8'] },
});


Plugin Shortcuts
Previous
Next
Learn how to configure keyboard shortcuts.

Copy Markdown
Open
Keyboard shortcuts are essential for a fast and productive editing workflow. Plate allows you to easily define and customize shortcuts for your editor plugins.

Defining Shortcuts
You can add or modify shortcuts for any plugin when you create or configure it (e.g., using createPlatePlugin().extend({...}) or ExistingPlugin.configure({...})). Shortcuts are defined within the shortcuts field of your plugin configuration.

There are two primary ways to define what a shortcut does:

1. Linking to Plugin Methods (Recommended)
The most straightforward way to create a shortcut is by linking it to an existing method within your plugin. This can be either a transform method or an API method. Transforms are functions that modify the editor's state (e.g., toggling a mark, inserting an element), while API methods provide other functionality.

To do this:

Ensure the name of your shortcut in the shortcuts configuration object matches the name of the method (e.g., a shortcut named toggle will look for a transform named toggle, or if no transform exists, an API method named toggle).
Provide the keys (the key combination) for the shortcut.
Plate will automatically find and call the corresponding method when the specified keys are pressed.

plugins/my-document-plugin.ts
import { createPlatePlugin, Key } from 'platejs/react';
 
// Example: A simplified plugin with both transforms and API
export const MyDocumentPlugin = createPlatePlugin({
  key: 'doc',
})
// Define editor.tf.doc.format()
.extendTransforms(({ editor, type }) => ({
  format: () => {
    editor.tf.normalize({ force: true });
  },
}))
// Define editor.api.doc.format()
.extendApi(({ editor, type }) => ({
  save: async () => {
    // Save the document
    // await fetch(...);
  },
}))
.extend({ // Or .configure() if extending an existing plugin
  shortcuts: {
    // This will call editor.tf.doc.format()
    format: {
      keys: [[Key.Mod, Key.Shift, 'f']], // e.g., Cmd/Ctrl + Shift + F
    },
    // This will call editor.api.doc.save()
    save: {
      keys: [[Key.Mod, 's']], // e.g., Cmd/Ctrl + S
    },
  },
});
Copy
The name of the shortcut (e.g., toggle in the example) is crucial as Plate uses it to locate the matching method on the plugin. It first looks for a transform method, then falls back to an API method if no transform exists with that name.

2. Using a Custom Handler
For actions that require more complex logic, depends on the keyboard event, or if there isn't a direct one-to-one mapping with an existing transform name, you can provide a custom handler function. This function will be executed when the shortcut is activated.

plugins/custom-logger-plugin.ts
import { createPlatePlugin, Key } from 'platejs/react';
 
export const CustomLoggerPlugin = createPlatePlugin({
  key: 'customLogger',
}).extend({
  shortcuts: {
    logEditorState: {
      keys: [[Key.Mod, Key.Alt, 's']], // e.g., Cmd/Ctrl + Alt + S
      handler: ({ editor, event, eventDetails }) => {
        // 'editor' is the PlateEditor instance
        // 'event' is the raw KeyboardEvent
        // 'eventDetails' provides more context from the hotkey library
        console.info('Current editor value:', editor.children);
        console.info('Pressed keys:', eventDetails.keys);
        // You might want to prevent other actions or browser defaults
        // event.preventDefault();
      },
    },
  },
});
Copy
Shortcut Configuration Properties
When defining or configuring a shortcut, you can use the following properties in its configuration object:

keys: Required. The key combination(s) that trigger the shortcut.
This can be a string like 'mod+b' or an array using the Key enum for more explicit control (e.g., [[Key.Mod, Key.Shift, 'x']]).
Key.Mod is a convenient way to specify Cmd on macOS and Ctrl on other operating systems.
handler: (Optional) A function that is called when the shortcut is activated. Its signature is: ({ editor: PlateEditor; event: KeyboardEvent; eventDetails: HotkeysEvent; }) => void; If you omit the handler, Plate will attempt to call a matching transform based on the shortcut's name. Note: If your transform or handler returns false (e.g. not handled), preventDefault will NOT be called, allowing other handlers or browser defaults to take over. Any other return value will use the default preventDefault behavior.
preventDefault: (Optional) A boolean. If set to true, it prevents the browser's default action for that key combination (e.g., Mod+B typically bolds text in the browser itself). Defaults to true. This is suitable for most editor-specific shortcuts. Set to false if you need to allow the browser's default action or enable other handlers to process the event, especially if your handler might not always perform an action (e.g., an indent command that doesn't apply in the current context).
priority: (Optional) A number. If multiple plugins define shortcuts for the exact same keys, the shortcut with the higher priority number will take precedence. This is useful for resolving conflicts.
(Other options): You can also include other options compatible with the underlying useHotkeys hook from the @udecode/react-hotkeys library, such as enabled, enableOnContentEditable, etc., to fine-tune behavior.
Default Shortcuts in Plate Plugins
Many official Plate plugins come with pre-configured shortcuts for their common actions. These defaults typically link to the plugin's internal transform methods. Currently, the following basic mark plugins include default shortcuts:

BoldPlugin: Mod+B
ItalicPlugin: Mod+I
UnderlinePlugin: Mod+U
Other plugins, like CodePlugin, StrikethroughPlugin, etc., provide transforms that can be easily linked to shortcuts (e.g., a toggle shortcut will link to editor.tf.<pluginKey>.toggle()), but you need to define the shortcut keys for them explicitly.

The specific default key combinations for Bold, Italic, and Underline are defined within each plugin's default configuration. You can always override these defaults or define shortcuts for other plugins if they don't fit your needs (see "Overriding and Disabling Shortcuts" below).

Managing Multiple Shortcuts
A single plugin isn't limited to one shortcut; you can define as many as needed:

plugins/my-formatting-tools.ts
import { createPlatePlugin, Key } from 'platejs/react';
 
export const MyFormattingTools = createPlatePlugin({
  key: 'myFormatting',
  // Assuming transforms like editor.tf.myFormatting.applyHeader
  // and editor.tf.myFormatting.applyCodeStyle exist.
})
.extend({
  shortcuts: {
    applyHeader: {
      keys: [[Key.Mod, Key.Alt, '1']],
    },
    applyCodeStyle: {
      keys: [[Key.Mod, Key.Alt, 'c']],
    },
    // A shortcut with a custom handler
    logSomething: {
      keys: [[Key.Mod, 'l']],
      handler: () => console.info('Logging from MyFormattingTools!'),
    },
  },
});
Copy
Shortcut Priority
If multiple shortcuts (potentially from different plugins) are configured to use the exact same key combination (e.g., Mod+Shift+P), the priority property on the shortcut configuration object determines which shortcut's action is executed.

A higher number indicates higher priority. If priority is not explicitly set on a shortcut, the priority of its parent plugin is used as a fallback. This allows fine-grained control over which action takes precedence when key combinations overlap.

const PluginA = createPlatePlugin({ key: 'pluginA', priority: 10 }).extend({
  shortcuts: {
    doSomethingImportant: {
      keys: 'mod+shift+p',
      handler: () => console.info('Plugin A: Important action on Mod+Shift+P!'),
      priority: 100, // Explicit, high priority for this specific shortcut
    }
  }
});
 
const PluginB = createPlatePlugin({ key: 'pluginB', priority: 20 }).extend({
  shortcuts: {
    doSomethingLessImportant: {
      keys: 'mod+shift+p', // Same key combination as PluginA's shortcut
      handler: () => console.info('Plugin B: Less important action on Mod+Shift+P.'),
      // No explicit shortcut priority, will use PluginB's priority (20)
    }
  }
});
 
// If both plugins are active, pressing Mod+Shift+P will execute PluginA's handler
// for 'doSomethingImportant' because its shortcut has a higher priority (100 vs 20).
Copy
Overriding and Disabling Shortcuts
You can change or disable shortcuts for a specific plugin when you configure it.

To change a plugin's shortcut: When you configure a plugin (e.g., BoldPlugin.configure({ ... })), you can define a shortcut by its name (like toggle). If the plugin already has a shortcut with that name (perhaps a default one), your new configuration for toggle will be used for that plugin. You can change its keys, provide a new handler, or adjust other properties.

import { BoldPlugin, Key } from '@platejs/basic-nodes/react';
 
// BoldPlugin has a default shortcut named 'toggle' (typically Mod+B).
// Let's change its key combination to Mod+Shift+B for BoldPlugin.
const MyCustomBoldPlugin = BoldPlugin.configure({
  shortcuts: {
    toggle: { // This re-configures BoldPlugin's 'toggle' shortcut
      keys: [[Key.Mod, Key.Shift, 'b']], // New key combination
      // The original handler (linking to the 'toggle' transform) is often preserved
      // unless a new 'handler' is specified here.
    },
  },
});
Copy
To disable a plugin's shortcut: Set the shortcut's configuration to null in that plugin's shortcuts object. This will remove that specific shortcut (e.g., toggle for ItalicPlugin).

import { ItalicPlugin } from '@platejs/basic-nodes/react';
 
// Example: Disable the 'toggle' shortcut for the ItalicPlugin
const MyCustomItalicPlugin = ItalicPlugin.configure({
  shortcuts: {
    toggle: null, // This will remove/disable the ItalicPlugin's 'toggle' shortcut.
  },
});
Copy
Global Shortcuts (Editor Level)
In addition to plugin-specific shortcuts, you can define global shortcuts directly on the editor instance when you create it using createPlateEditor. These shortcuts behave similarly to plugin shortcuts.

editor-config.ts
import { createPlateEditor, Key } from 'platejs/react';
 
const editor = createPlateEditor({
  plugins: [/* ...your array of plugins... */],
  shortcuts: {
    // A global shortcut, perhaps for saving the document
    saveDocument: {
      keys: [[Key.Mod, 's']],
      handler: ({ editor, event }) => {
        console.info('Attempting to save document content:', editor.children);
        // Since preventDefault is set to false for this shortcut,
        // the browser's save dialog will appear by default.
        // If you want to conditionally prevent the default browser behavior
        // (for example, only prevent saving if certain conditions are met),
        // you can call event.preventDefault() inside your handler as needed:
        // if (shouldPrevent) event.preventDefault();
      },
      preventDefault: false,
    },
    anotherGlobalAction: {
      keys: [[Key.Ctrl, Key.Alt, 'g']],
      handler: () => alert('Global action triggered!'),
    }
  },
});
Copy
Editor-level shortcuts generally have a high default priority but can still be influenced by the priority settings of individual plugin shortcuts if there are conflicts.

Best Practices
Link to Transforms: For clarity and to keep your code DRY, link shortcuts to existing transform methods by matching the shortcut name to the transform name.
preventDefault: Most editor shortcuts should prevent the browser's default action for the key combination. Plate handles this by defaulting preventDefault to true. You generally don't need to set it explicitly. However, if your shortcut handler conditionally performs an action (e.g., an indent command that only applies if certain conditions are met), and you want other handlers or the browser's default behavior to take over if your action doesn't run, set preventDefault: false for that shortcut.
Maintain Consistency: Strive for intuitive and consistent key combinations. Consider standard shortcuts found in popular text editors or those that make logical sense within your application's context.
Manage Priorities for Conflicts: If you anticipate or encounter situations where multiple plugins might try to handle the same key combination, use the priority property to explicitly define which shortcut should take precedence.
Provide User Feedback: For actions triggered by shortcuts that aren't immediately visible (like a "Save" action), consider providing some form of user feedback, such as a brief toast notification.

Plugin Context
Previous
Next
Understanding and utilizing the Plugin Context in Plate plugins.

Copy Markdown
Open
The Plugin Context is an object available in all plugin methods, providing access to the editor instance, plugin configuration, and utility functions.

Accessing Plugin Context
Plugin Methods
The Plugin Context is available as the first parameter in all plugin methods:

const MyPlugin = createPlatePlugin({
  key: 'myPlugin',
  handlers: {
    onKeyDown: (ctx) => {
      // ctx is the Plugin Context
      console.info(ctx.editor, ctx.plugin);
    },
  },
});
Copy
getEditorPlugin
This function is particularly useful when you need to access the context of another plugin. It allows for cross-plugin communication and interaction, enabling more complex and interconnected plugin behaviors.

const MyPlugin = createPlatePlugin({
  key: 'myPlugin',
  handlers: {
    onKeyDown: ({ editor }) => {
      const linkCtx = getEditorPlugin(LinkPlugin);
    },
  },
});
Copy
useEditorPlugin
In React components, you can use the useEditorPlugin hook to access the Plugin Context:

const MyComponent = () => {
  const { editor, plugin, type } = useEditorPlugin(MyPlugin);
  
  return <div>{type}</div>;
};
Copy
Plugin Context Properties
editor
The current PlateEditor instance:

const MyPlugin = createPlatePlugin({
  key: 'myPlugin',
  handlers: {
    onChange: ({ editor }) => {
      console.info('Editor value:', editor.children);
    },
  },
});
Copy
plugin
The current plugin configuration:

const MyPlugin = createPlatePlugin({
  key: 'myPlugin',
  handlers: {
    onKeyDown: ({ plugin }) => {
      console.info('Plugin key:', plugin.key);
    },
  },
});
Copy
getOption
A function to get a specific option value for the plugin:

const MyPlugin = createPlatePlugin({
  key: 'myPlugin',
  options: { myOption: 'default' },
  handlers: {
    onClick: ({ getOption }) => {
      const myOption = getOption('myOption');
      console.info('My option value:', myOption);
    },
  },
});
Copy
getOptions
A function to get all options for the plugin:

const MyPlugin = createPlatePlugin({
  key: 'myPlugin',
  options: { option1: 'value1', option2: 'value2' },
  handlers: {
    onClick: ({ getOptions }) => {
      const options = getOptions();
      console.info('All options:', options);
    },
  },
});
Copy
setOption
A function to set a specific option value for the plugin:

const MyPlugin = createPlatePlugin({
  key: 'myPlugin',
  options: { count: 0 },
  handlers: {
    onClick: ({ setOption }) => {
      setOption('count', 1);
    },
  },
});
Copy
setOptions
A function to set multiple options for the plugin:

const MyPlugin = createPlatePlugin({
  key: 'myPlugin',
  options: { option1: 'value1', option2: 'value2' },
  handlers: {
    onClick: ({ setOptions }) => {
      setOptions({
        option1: 'newValue1',
        option2: 'newValue2',
      });
    },
  },
});
Copy
type
The node type associated with the plugin:

const MyPlugin = createPlatePlugin({
  key: 'myPlugin',
  node: { type: 'myNodeType' },
  handlers: {
    onKeyDown: ({ type }) => {
      console.info('Node type:', type);
    },
  },
});

Plugin Components
Previous
Next
Learn how to create and style custom components for Plate plugins.

Copy Markdown
Open
By default, Plate plugins are headless, meaning all nodes will be rendered as plain text. This guide will show you how to create and style custom components for your editor.

Plate UI
Unless you prefer to build everything from scratch, we recommend using Plate UI to get started. Plate UI is a collection of components that you can copy into your app and modify to suit your needs.

The process of creating and registering components is similar whether you use Plate UI or build your own from scratch.

Defining Components
Use PlateElement for element nodes (like paragraphs, headings) and PlateLeaf for text leaf nodes (like bold, italic). These components handle applying the necessary Plate props to your custom HTML elements.

Ensure the children prop is rendered unconditionally for the editor to function correctly, even for void nodes.

Element Component
import { type PlateElementProps, PlateElement } from 'platejs/react';
 
export function BlockquoteElement(props: PlateElementProps) {
  // props contains attributes, children, element, editor, etc.
  // plus any custom props your plugin might pass.
  return (
    <PlateElement
      as="blockquote"
      className="my-1 border-l-2 pl-6 italic" // Apply custom styles directly
      {...props} // Pass all original props (attributes, children, element, etc.)
    />
  );
}
Copy
This example defines a BlockquoteElement. The as prop on PlateElement specifies that it should render an HTML <blockquote>. PlateElement handles rendering the children passed via {...props}.

Leaf Component
import { type PlateLeafProps, PlateLeaf } from 'platejs/react';
 
export function CodeLeaf(props: PlateLeafProps) {
  // props contains attributes, children, leaf, text, editor, etc.
  // plus any custom props your plugin might pass.
  return (
    <PlateLeaf
      as="code"
      className="rounded-md bg-muted px-[0.3em] py-[0.2em] font-mono text-sm" // Apply custom styles
      {...props} // Pass all original props (attributes, children, leaf, text, etc.)
    />
  );
}
Copy
Styling
We recommend styling components using Tailwind CSS, as demonstrated in Plate UI.

Alternatively, Plate generates class names like slate-<node-type> (e.g., slate-p for paragraphs, slate-h1 for H1 headings) which you can target with global CSS:

.slate-p {
  margin-bottom: 1rem;
}
.slate-bold {
  font-weight: bold;
}
Copy
Register Components
To use your custom components, register them with the corresponding plugin or directly in the editor configuration.

Method 1: Plugin's withComponent (Recommended)
The withComponent method is the most straightforward way to associate a component with a plugin.

const plugins = [
  // This is equivalent to:
  // ParagraphPlugin.configure({ node: { component: MyParagraphElement }});
  ParagraphPlugin.withComponent(MyParagraphElement),
  CodeBlockPlugin.withComponent(MyCodeBlockElement),
  CodeLinePlugin.withComponent(MyCodeLineElement),
  CodeSyntaxPlugin.withComponent(MyCodeSyntaxLeaf),
]
Copy
Method 2: Plugin override.components
For plugins that manage multiple component parts (like CodeBlockPlugin with code_block, code_line, and code_syntax), or when you need to override components for a specific plugin instance, use the override.components option within configure.

const plugins = [
  CodeBlockPlugin.configure({
    override: {
      components: {
        [CodeBlockPlugin.key]: MyCodeBlockElement,
        [CodeLinePlugin.key]: MyCodeLineElement,
        [CodeSyntaxPlugin.key]: MyCodeSyntaxLeaf,
      },
    },
  }),
];
Copy
Method 3: Editor components Option
You can globally map plugin keys to components in createPlateEditor (or usePlateEditor). This is useful for managing all components in one place, or for plugins composed of multiple plugins.

const editor = createPlateEditor({
  plugins: [ParagraphPlugin, CodeBlockPlugin /* ...other plugins */],
  components: {
    [ParagraphPlugin.key]: MyParagraphElement,
    [CodeBlockPlugin.key]: MyCodeBlockElement,
    [CodeLinePlugin.key]: MyCodeLineElement,
    [CodeSyntaxPlugin.key]: MyCodeSyntaxLeaf,
    // ...other component overrides
  },
});

Plugin Rules
Previous
Next
Configure common editing behaviors.

Copy Markdown
Open
Plugin Rules control how editor nodes respond to common user actions. Instead of overriding the editor methods, you can configure these behaviors directly on a plugin's rules property.

This guide shows you how to use rules.break, rules.delete, rules.merge, rules.normalize, rules.selection and rules.match to create intuitive editing experiences.

Preview
Code
16
Plugin Rules
Plugin rules control how blocks respond to Enter, Backspace, selection, and normalization.
Break Rules
Heading splitReset: Press Enter in middle of heading to split and reset new block to paragraph.
Press Enter after "Press" to see splitReset behavior
Blockquote with line breaks: Enter adds line breaks, Enter on empty lines resets to paragraph.
This blockquote uses lineBreak rules. Press Enter here for line breaks.
Delete Rules
Code block reset: Backspace in empty code block resets to paragraph.
console.info('Hello world');
﻿
List items: Backspace at start removes list formatting.
Press Backspace at start to remove list formatting
Selection Rules
Hard affinity (code): Use arrow keys around  code marks  - requires two key presses to cross boundaries.
Directional affinity: Use arrow keys around superscript text - cursor affinity depends on movement direction.
Link directional: Navigate with arrows around  this link  to test directional behavior.
Normalize Rules
Empty link removal: Delete all text from  this link  - the link element will be automatically removed.
Merge Rules
Void elements:
﻿
Press Backspace at start - void element are selected rather than deleted.
﻿
Backspace at start removes empty paragraph above
﻿
Actions
Plugin rules use specific action names to define behavior:

'default': Default Slate behavior.
'reset': Changes the current block to a default paragraph, keeping content.
'exit': Exits the current block, inserting a new paragraph after it. See Exit Break to learn more about this behavior.
'deleteExit': Deletes content then exits the block.
'lineBreak': Inserts a line break (\n) instead of splitting the block.
default
Standard Slate behavior. For rules.break, splits the block. For rules.delete, merges with the previous block.

<p>
  Hello world|
</p>
Copy
After pressing Enter:

<p>Hello world</p>
<p>
  |
</p>
Copy
After pressing Backspace:

<p>Hello world|</p>
Copy
reset
Converts the current block to a default paragraph while preserving content. Custom properties are removed.

<h3 listStyleType="disc">
  |
</h3>
Copy
After pressing Enter with rules: { break: { empty: 'reset' } }:

<p>
  |
</p>
Copy
exit
Exits the current block structure by inserting a new paragraph after it.

<blockquote>
  |
</blockquote>
Copy
After pressing Enter with rules: { break: { empty: 'exit' } }:

<blockquote>
  <text />
</blockquote>
<p>
  |
</p>
Copy
deleteExit
Deletes content then exits the block.

<blockquote>
  line1
  |
</blockquote>
Copy
After pressing Enter with rules: { break: { emptyLineEnd: 'deleteExit' } }:

<blockquote>line1</blockquote>
<p>
  |
</p>
Copy
lineBreak
Inserts a soft line break (\n) instead of splitting the block.

<blockquote>
  Hello|
</blockquote>
Copy
After pressing Enter with rules: { break: { default: 'lineBreak' } }:

<blockquote>
  Hello
  |
</blockquote>
Copy
rules.break
Controls what happens when users press Enter within specific block types.

Configuration
BlockquotePlugin.configure({
  rules: {
    break: {
      // Action when Enter is pressed normally
      default: 'default' | 'lineBreak' | 'exit' | 'deleteExit',
      
      // Action when Enter is pressed in an empty block
      empty: 'default' | 'reset' | 'exit' | 'deleteExit',
      
      // Action when Enter is pressed at end of empty line
      emptyLineEnd: 'default' | 'exit' | 'deleteExit',
 
      // If true, the new block after splitting will be reset
      splitReset: boolean,
    },
  },
});
Copy
Each property controls a specific scenario:

default

'default'
'lineBreak'
'exit'
'deleteExit'
empty

'default'
'reset'
'exit'
'deleteExit'
emptyLineEnd

'default'
'exit'
'deleteExit'
splitReset: If true, resets the new block to the default type after a split. This is useful for exiting a formatted block like a heading.

Examples
Reset heading on break:

import { H1Plugin } from '@platejs/heading/react';
 
const plugins = [
  // ...otherPlugins,
  H1Plugin.configure({
    rules: {
      break: {
        splitReset: true,
      },
    },
  }),
];
Copy
Before pressing Enter:

<h1>
  Heading|text
</h1>
Copy
After (split and reset):

<h1>
  Heading
</h1>
<p>
  |text
</p>
Copy
Blockquote with line breaks and smart exits:

import { BlockquotePlugin } from '@platejs/basic-nodes/react';
 
const plugins = [
  // ...otherPlugins,
  BlockquotePlugin.configure({
    rules: {
      break: {
        default: 'lineBreak',
        empty: 'reset',
        emptyLineEnd: 'deleteExit',
      },
    },
  }),
];
Copy
Before pressing Enter in blockquote:

<blockquote>
  Quote text|
</blockquote>
Copy
After (line break):

<blockquote>
  Quote text
  |
</blockquote>
Copy
Code block with custom empty handling:

import { CodeBlockPlugin } from '@platejs/code-block/react';
 
const plugins = [
  // ...otherPlugins,
  CodeBlockPlugin.configure({
    rules: {
      delete: { empty: 'reset' },
      match: ({ editor, rule }) => {
        return rule === 'delete.empty' && isCodeBlockEmpty(editor);
      },
    },
  }),
];
Copy
Before pressing Backspace in empty code block:

<code_block>
  <code_line>
    |
  </code_line>
</code_block>
Copy
After (reset):

<p>
  |
</p>
Copy
rules.delete
Controls what happens when users press Backspace at specific positions.

Configuration
HeadingPlugin.configure({
  rules: {
    delete: {
      // Action when Backspace is pressed at block start
      start: 'default' | 'reset',
      
      // Action when Backspace is pressed in empty block
      empty: 'default' | 'reset',
    },
  },
});
Copy
Each property controls a specific scenario:

start

'default'
'reset'
empty

'default'
'reset'
Examples
Reset blockquotes at start:

import { BlockquotePlugin } from '@platejs/basic-nodes/react';
 
const plugins = [
  // ...otherPlugins,
  BlockquotePlugin.configure({
    rules: {
      delete: { start: 'reset' },
    },
  }),
];
Copy
Before pressing Backspace at start:

<blockquote>
  |Quote content
</blockquote>
Copy
After (reset):

<p>
  |Quote content
</p>
Copy
List items with start reset:

import { ListPlugin } from '@platejs/list/react';
 
const plugins = [
  // ...otherPlugins,
  ListPlugin.configure({
    rules: {
      delete: { start: 'reset' },
      match: ({ rule, node }) => {
        return rule === 'delete.start' && Boolean(node.listStyleType);
      },
    },
  }),
];
Copy
Before pressing Backspace at start of list item:

<p listStyleType="disc">
  |List item content
</p>
Copy
After (reset):

<p>
  |List item content
</p>
Copy
rules.merge
Controls how blocks behave when merging with previous blocks.

Configuration
ParagraphPlugin.configure({
  rules: {
    merge: {
      // Whether to remove empty blocks when merging
      removeEmpty: boolean,
    },
  },
});
Copy
Examples
Only paragraph and heading plugins enable removal by default. Most other plugins use false:

import { H1Plugin, ParagraphPlugin } from 'platejs/react';
 
const plugins = [
  // ...otherPlugins,
  H1Plugin, // rules.merge: { removeEmpty: true } by default
  ParagraphPlugin, // rules.merge: { removeEmpty: true } by default
];
Copy
Before pressing Backspace at start:

<p>
  <text />
</p>
<h1>
  |Heading content
</h1>
Copy
After (empty paragraph removed):

<h1>
  |Heading content
</h1>
Copy
Blockquote with removal disabled:

import { BlockquotePlugin } from '@platejs/basic-nodes/react';
 
const plugins = [
  // ...otherPlugins,
  BlockquotePlugin.configure({
    rules: {
      merge: { removeEmpty: false }, // Default
    },
  }),
];
Copy
Before pressing Backspace at start:

<p>
  <text />
</p>
<blockquote>
  |Code content
</blockquote>
Copy
After (empty paragraph preserved):

<p>
  |Code content
</p>
Copy
Table cells preserve structure during merge:

import { TablePlugin } from '@platejs/table/react';
 
const plugins = [
  // ...otherPlugins,
  TablePlugin, // Table cells have rules.merge: { removeEmpty: false }
];
Copy
Before pressing Delete at end of paragraph:

<p>
  Content|
</p>
<table>
  <tr>
    <td>
      <p>Cell data</p>
    </td>
    <td>
      <p>More data</p>
    </td>
  </tr>
</table>
Copy
After (cell content merged, structure preserved):

<p>
  Content|Cell data
</p>
<table>
  <tr>
    <td>
      <p>
        <text />
      </p>
    </td>
    <td>
      <p>More data</p>
    </td>
  </tr>
</table>
Copy
Slate's default is true since the default block (paragraph) is first-class, while Plate plugins are likely used to define other node behaviors that shouldn't automatically remove empty predecessors.

rules.normalize
Controls how nodes are normalized during the normalization process.

Configuration
LinkPlugin.configure({
  rules: {
    normalize: {
      // Whether to remove nodes with empty text
      removeEmpty: boolean,
    },
  },
});
Copy
Examples
Remove empty link nodes:

import { LinkPlugin } from '@platejs/link/react';
 
const plugins = [
  // ...otherPlugins,
  LinkPlugin.configure({
    rules: {
      normalize: { removeEmpty: true },
    },
  }),
];
Copy
Before normalization:

<p>
  <a href="http://google.com">
    <text />
  </a>
  <cursor />
</p>
Copy
After normalization (empty link removed):

<p>
  <cursor />
</p>
Copy
rules.match
The match function in plugin rules allows you to override the default behavior of specific plugins based on node properties beyond just type matching. This is particularly useful when you want to extend existing node types with new behaviors.

Examples
Code block with custom empty detection:

import { CodeBlockPlugin } from '@platejs/code-block/react';
 
const plugins = [
  // ...otherPlugins,
  CodeBlockPlugin.configure({
    rules: {
      delete: { empty: 'reset' },
      match: ({ rule, node }) => {
        return rule === 'delete.empty' && isCodeBlockEmpty(editor);
      },
    },
  }),
];
Copy
Since the list plugin extends existing blocks that already have their own plugin configuration (e.g. ParagraphPlugin), using rules.match allows you to override those behaviors.

List override for paragraphs:

import { ListPlugin } from '@platejs/list/react';
 
const plugins = [
  // ...otherPlugins,
  ListPlugin.configure({
    rules: {
      match: ({ editor, rule }) => {
        return rule === 'delete.empty' && isCodeBlockEmpty(editor);
      },
    },
  }),
];
Copy
Custom Reset Logic
Some plugins need special reset behavior beyond the standard paragraph conversion. You can override the resetBlock transform:

List plugin reset (outdents instead of converting to paragraph):

const ListPlugin = createPlatePlugin({
  key: 'list',
  // ... other config
}).overrideEditor(({ editor, tf: { resetBlock } }) => ({
  transforms: {
    resetBlock(options) {
      if (editor.api.block(options)?.[0]?.listStyleType) {
        outdentList();
        return;
      }
      
      return resetBlock(options);
    },
  },
}));
Copy
Code block reset (unwraps instead of converting):

const CodeBlockPlugin = createPlatePlugin({
  key: 'code_block',
  // ... other config
}).overrideEditor(({ editor, tf: { resetBlock } }) => ({
  transforms: {
    resetBlock(options) {
      if (editor.api.block({
        at: options?.at,
        match: { type: 'code_block' },
      })) {
        unwrapCodeBlock();
        return;
      }
      
      return resetBlock(options);
    },
  },
}));
Copy
Combining Rules
You can combine different rules for comprehensive block behavior:

import { H1Plugin } from '@platejs/heading/react';
 
const plugins = [
  // ...otherPlugins,
  H1Plugin.configure({
    rules: {
      break: {
        empty: 'reset',
        splitReset: true,
      },
      delete: {
        start: 'reset',
      },
    },
  }),
];
Copy
Line break behavior (default):

<blockquote>
  Hello|
</blockquote>
Copy
After Enter:

<blockquote>
  Hello
  |
</blockquote>
Copy
Empty reset behavior:

<blockquote>
  |
</blockquote>
Copy
After Enter:

<p>
  |
</p>
Copy
Start reset behavior:

<blockquote>
  |Quote content
</blockquote>
Copy
After Backspace:

<p>
  |Quote content
</p>
Copy
Advanced
For complex scenarios beyond simple rules, you can override editor transforms directly using .overrideEditor. This gives you complete control over transforms like resetBlock and insertExitBreak:

const CustomPlugin = createPlatePlugin({
  key: 'custom',
  // ... other config
}).overrideEditor(({ editor, tf: { insertBreak, deleteBackward, resetBlock } }) => ({
  transforms: {
    insertBreak() {
      const block = editor.api.block();
      
      if (/* Custom condition */) {
        // Custom behavior
        return;
      }
      
      // Default behavior
      insertBreak();
    },
    
    deleteBackward(unit) {
      const block = editor.api.block();
      
      if (/* Custom condition */) {
        // Custom behavior
        return;
      }
      
      deleteBackward(unit);
    },
    
    resetBlock(options) {
      if (/* Custom condition */) {
        // Custom behavior
        return true;
      }
      
      return resetBlock(options);
    },
  },
}));
Copy
rules.selection
Controls how cursor positioning and text insertion behave at node boundaries, particularly for marks and inline elements.

Configuration
BoldPlugin.configure({
  rules: {
    selection: {
      // Define selection behavior at boundaries
      affinity: 'default' | 'directional' | 'outward' | 'hard',
    },
  },
});
Copy
Affinity Options
The affinity property determines how the cursor behaves when positioned at the boundary between different marks or inline elements:

default
Uses Slate's default behavior. For marks, the cursor has outward affinity at the start edge (typing before the mark doesn't apply it) and inward affinity at the end edge (typing after the mark extends it).

At end of mark (inward affinity):

<p>
  <text bold>Bold text|</text><text>Normal text</text>
</p>
Copy
Typing would extend the bold formatting to new text.

At start of mark (outward affinity):

<p>
  <text>Normal text|</text><text bold>Bold text</text>
</p>
Copy
Typing would not apply bold formatting to new text.

directional
Selection affinity is determined by the direction of cursor movement. When the cursor moves to a boundary, it maintains the affinity based on where it came from.

import { BoldPlugin } from '@platejs/basic-nodes/react';
 
const plugins = [
  // ...otherPlugins,
  BoldPlugin.configure({
    rules: {
      selection: { affinity: 'directional' },
    },
  }),
];
Copy
Movement from right (inward affinity):

<p>
  <text>Normal</text><text bold>B|old text</text>
</p>
Copy
After pressing ←:

<p>
  <text>Normal</text><text bold>|Bold text</text>
</p>
Copy
Typing would extend the bold formatting, which is not possible with default affinity.

import { LinkPlugin } from '@platejs/link/react';
 
const plugins = [
  // ...otherPlugins,
  LinkPlugin.configure({
    rules: {
      selection: { affinity: 'directional' },
    },
  }),
];
Copy
Movement from right (outward affinity):

<p>
  Visit <a href="https://example.com">our website</a> |for more information text.
</p>
Copy
After pressing ←:

<p>
  Visit <a href="https://example.com">our website</a>| for more information text.
</p>
Copy
Cursor movement direction determines whether new text extends the link or creates new text outside it.

outward
Forces outward affinity, automatically clearing marks when typing at their boundaries. This creates a natural "exit" behavior from formatted text.

import { CommentPlugin } from '@platejs/comment/react';
 
const plugins = [
  // ...otherPlugins,
  CommentPlugin.configure({
    rules: {
      selection: { affinity: 'outward' },
    },
  }),
];
Copy
At end of marked text:

<p>
  <text comment>Commented text|</text><text>Normal</text>
</p>
Copy
After typing:

<p>
  <text comment>Commented text</text><text>x|Normal</text>
</p>
Copy
Users automatically exit comment formatting by typing at the end of commented text.

hard
Creates a "hard" edge that requires two key presses to move across. This provides precise cursor control for elements that need exact positioning.

import { CodePlugin } from '@platejs/basic-nodes/react';
 
const plugins = [
  // ...otherPlugins,
  CodePlugin.configure({
    rules: {
      selection: { affinity: 'hard' },
    },
  }),
];
Copy
Moving across hard edges:

<p>
  <text>Before</text><text code>code|</text><text>After</text>
</p>
Copy
First → press changes affinity:

<p>
  <text>Before</text><text code>code</text>|<text>After</text>
</p>
Copy
Second → press moves cursor:

<p>
  <text>Before</text><text code>code</text><text>A|fter</text>
</p>
Copy
This allows users to position the cursor precisely at the boundary and choose whether new text should be inside or outside the code formatting.

Plugin Configuration
How to configure and customize Plate plugins.

Copy Markdown
Open
Plate plugins are highly configurable, allowing you to customize their behavior to suit your needs. This guide will walk you through the most common configuration options and how to use them.

Getting Started: Components - Instructions for adding plugins to your editor
PlatePlugin API - The complete API reference for creating plugins
Basic Plugin Configuration
New Plugin
The most basic plugin configuration requires only a key:

const MyPlugin = createPlatePlugin({
  key: 'minimal',
});
Copy
While this plugin doesn't do anything yet, it's a starting point for more complex configurations.

Existing Plugin
The .configure method allows you to configure an existing plugin:

const ConfiguredPlugin = MyPlugin.configure({
  options: {
    myOption: 'new value',
  },
});
Copy
Node Plugins
Node plugins are used to define new types of nodes in your editor using the node property. These can be elements (either block or inline) or leaf nodes (for text-level formatting).

Elements
To create a new type of element, use the node.isElement option:

const ParagraphPlugin = createPlatePlugin({
  key: 'p',
  node: {
    isElement: true,
    type: 'p',
  },
});
Copy
You can associate a component with your element. See Plugin Components for more information.

const ParagraphPlugin = createPlatePlugin({
  key: 'p',
  node: {
    isElement: true,
    type: 'p',
    component: ParagraphElement,
  },
});
Copy
Inline, Void, and Leaf Nodes
For inline elements, void elements, or leaf nodes, use the appropriate node options:

const LinkPlugin = createPlatePlugin({
  key: 'link',
  node: {
    isElement: true,
    isInline: true,
    type: 'a',
  },
});
 
const ImagePlugin = createPlatePlugin({
  key: 'image',
  node: {
    isElement: true,
    isVoid: true,
    type: 'img',
  },
});
 
const BoldPlugin = createPlatePlugin({
  key: 'bold',
  node: {
    isLeaf: true,
  },
});
Copy
Behavioral Plugins
Rather than render an element or a mark, you may want to customize the behavior of your editor. Various plugin options are available to modify the behavior of Plate.

Plugin Rules
The rules property allows you to configure common editing behaviors like breaking, deleting, and merging nodes without overriding editor methods. This is a powerful way to define intuitive interactions for your custom elements.

For example, you can define what happens when a user presses Enter in an empty heading, or Backspace at the start of a blockquote.

import { H1Plugin } from '@platejs/heading/react';
 
H1Plugin.configure({
  rules: {
    break: { empty: 'reset' },
  },
});
Copy
See the Plugin Rules guide for a complete list of available rules and actions.

Event Handlers
The recommended way to respond to user-generated events from inside a plugin is with the handlers plugin option. A handler should be a function that takes a PlatePluginContext & { event } object.

The onChange handler, which is called when the editor value changes, is an exception to this rule; the context object includes the changed value instead of event.

const ExamplePlugin = createPlatePlugin({
  key: 'example',
  handlers: {
    onChange: ({ editor, value })  => {
      console.info(editor, value);
    },
    onKeyDown: ({ editor, event }) => {
      console.info(`You pressed ${event.key}`);
    },
  },
});
Copy
Inject Props
You may want to inject a class name or CSS property into any node having a certain property. For example, the following plugin sets the textAlign CSS property on paragraphs with an align property.

import { KEYS } from 'platejs';
 
const TextAlignPlugin = createPlatePlugin({
  key: 'align',
  inject: {
    nodeProps: {
      defaultNodeValue: 'start',
      nodeKey: 'align',
      styleKey: 'textAlign',
      validNodeValues: ['start', 'left', 'center', 'right', 'end', 'justify'],
    },
    targetPlugins: [KEYS.p],
    // This is injected into all `targetPlugins`. In this example, ParagraphPlugin will be able to deserialize `textAlign` style.
    targetPluginToInject: ({ editor, plugin }) => ({
      parsers: {
        html: {
          deserializer: {
            parse: ({ element, node }) => {
              if (element.style.textAlign) {
                node[editor.getType('align')] = element.style.textAlign;
              }
            },
          },
        },
      },
    }),
  },
});
Copy
A paragraph node affected by the above plugin would look like this:

{
  type: 'p',
  align: 'right',
  children: [{ text: 'This paragraph is aligned to the right!' }],
}
Copy
Override Editor Methods
The overrideEditor method provides a way to override existing editor methods while maintaining access to the original implementations. This is particularly useful when you want to modify the behavior of core editor functionality.

const CustomPlugin = createPlatePlugin({
  key: 'custom',
}).overrideEditor(({ editor, tf: { deleteForward }, api: { isInline } }) => ({
  // Override transforms
  transforms: {
    deleteForward(options) {
      // Custom logic before deletion
      console.info('Deleting forward...');
      
      // Call original transform
      deleteForward(options);
      
      // Custom logic after deletion
      console.info('Deleted forward');
    },
  },
  // Override API methods
  api: {
    isInline(element) {
      // Custom inline element check
      if (element.type === 'custom-inline') {
        return true;
      }
      
      // Fall back to original behavior
      return isInline(element);
    },
  },
}));
Copy
Access to original methods via destructured tf (transforms) and api parameters
Type-safe overrides of existing methods
Clean separation between transforms and API methods
Plugin context and options access
Example with typed options:

type CustomConfig = PluginConfig<
  'custom',
  { allowDelete: boolean }
>;
 
const CustomPlugin = createTPlatePlugin<CustomConfig>({
  key: 'custom',
  options: { allowDelete: true },
}).overrideEditor(({ editor, tf: { deleteForward }, getOptions }) => ({
  transforms: {
    deleteForward(options) {
      // Use typed options to control behavior
      if (!getOptions().allowDelete) {
        return;
      }
      
      deleteForward(options);
    },
  },
}));
Copy
Extend Editor (Advanced)
You can extend the editor for complex functionality. To do this, you can use the extendEditor plugin option to directly mutate properties of the editor object after its creation.

const CustomNormalizerPlugin = createPlatePlugin({
  key: 'customNormalizer',
  extendEditor: ({ editor }) => {
    editor.customState = true;
    
    return editor;
  },
});
Copy
Difference between extendEditor and overrideEditor

Use extendEditor when integrating legacy Slate plugins like withYjs that need direct editor mutation. There is only one extendEditor per plugin.
Prefer using overrideEditor for modifying editor behavior as it has single purpose responsibility and better type safety. It can be called multiple times to layer different overrides.
Advanced Plugin Configuration
Plugin Store
Each plugin has its own store, which can be used to manage plugin-specific state.

const MyPlugin = createPlatePlugin({
  key: 'myPlugin',
  options: {
    count: 0,
  },
}).extend(({ editor, plugin, setOption }) => ({
  handlers: {
    onClick: () => {
      setOption('count', 1);
    },
  },
}));
Copy
You can access and update the store using the following methods:

// Get the current value
const count = editor.getOption(MyPlugin, 'count');
 
// Set a new value
editor.setOption(MyPlugin, 'count', 5);
 
// Update the value based on the previous state
editor.setOption(MyPlugin, 'count', (prev) => prev + 1);
Copy
In React components, you can use the usePluginOption or usePluginOptions hook to subscribe to store changes:

const MyComponent = () => {
  const count = usePluginOption(MyPlugin, 'count');
  return <div>Count: {count}</div>;
};
Copy
See more in Plugin Context and Editor Methods guides.

Dependencies
You can specify plugin dependencies using the dependencies property. This ensures that the required plugins are loaded before the current plugin.

const MyPlugin = createPlatePlugin({
  key: 'myPlugin',
  dependencies: ['paragraphPlugin', 'listPlugin'],
});
Copy
Enabled Flag
The enabled property allows you to conditionally enable or disable a plugin:

const MyPlugin = createPlatePlugin({
  key: 'myPlugin',
  enabled: true, // or false to disable
});
Copy
Nested Plugins
Plate supports nested plugins, allowing you to create plugin hierarchies. Use the plugins property to define child plugins:

const ParentPlugin = createPlatePlugin({
  key: 'parent',
  plugins: [
    createPlatePlugin({ key: 'child1' }),
    createPlatePlugin({ key: 'child2' }),
  ],
});
Copy
Plugin Priority
The priority property determines the order in which plugins are registered and executed. Plugins with higher priority values are processed first:

const HighPriorityPlugin = createPlatePlugin({
  key: 'highPriority',
  priority: 100,
});
 
const LowPriorityPlugin = createPlatePlugin({
  key: 'lowPriority',
  priority: 50,
});
Copy
This is particularly useful when you need to ensure certain plugins are initialized or run before others.

Custom Parsers
The parsers property accepts string keys to build your own parsers:

const MyPlugin = createPlatePlugin({
  key: 'myPlugin',
  parsers: {
    myCustomParser: {
      deserializer: {
        parse: // ...
      },
      serializer: {
        parse: // ...
      }
    },
  },
});
Copy
Core plugins includes html and htmlReact parsers.

Typed Plugins
Using above methods, plugin types are automatically inferred from the given configuration.

If you need to pass an explicit type as generic, you can use createTPlatePlugin.

Using createTPlatePlugin
The createTPlatePlugin function allows you to create a typed plugin:

type CodeBlockConfig = PluginConfig<
  // key
  'code_block',
  // options
  { syntax: boolean; syntaxPopularFirst: boolean },
  // api
  {
    plugin: {
      getSyntaxState: () => boolean;
    };
    toggleSyntax: () => void;
  },
  // transforms
  {
    insert: {
      codeBlock: (options: { language: string }) => void;
    }
  }
>;
 
const CodeBlockPlugin = createTPlatePlugin<CodeBlockConfig>({
  key: 'code_block',
  options: { syntax: true, syntaxPopularFirst: false },
}).extendEditorApi<CodeBlockConfig['api']>(() => ({
  plugin: {
    getSyntaxState: () => true,
  },
  toggleSyntax: () => {},
})).extendEditorTransforms<CodeBlockConfig['transforms']>(() => ({
  insert: {
    codeBlock: ({ editor, getOptions }) => {
      editor.tf.insertBlock({ type: 'code_block', language: getOptions().language });
    },
  },
}));
Copy
Using Typed Plugins
When using typed plugins, you get full type checking and autocompletion ✨

const editor = createPlateEditor({
  plugins: [ExtendedCodeBlockPlugin],
});
 
// Type-safe access to options
const options = editor.getOptions(ExtendedCodeBlockPlugin);
options.syntax;
options.syntaxPopularFirst;
options.hotkey;
 
// Type-safe API
editor.api.toggleSyntax();
editor.api.plugin.getSyntaxState();
editor.api.plugin2.setLanguage('python');
editor.api.plugin.getLanguage();
 
// Type-safe Transforms
editor.tf.insert.codeBlock({ language: 'typescript' });
Copy
See also

Plate Plugin
Previous
Next
API reference for Plate plugins.

Copy Markdown
Open
Plate plugins are objects passed to Plate plugins prop.

Plugin Properties
Attributes

key REQUIRED C['key']
Unique identifier used by Plate to store the plugins by key in editor.plugins.


api Record<string, Function>
An object of API functions provided by the plugin. These functions are accessible via editor.api[key].


transforms Record<string, Function>
Transform functions provided by the plugin that modify the editor state. These are accessible via editor.tf[key].


options Record<string, any>
Extended properties used by the plugin as options.


handlers { onChange?: (editor: PlateEditor) => void } & Record<string, Function>
Event handlers for various editor events.

Hide child attributes
handlers.onChange optional (editor: PlateEditor) => void
Called whenever the editor content changes.

handlers.onNodeChange optional OnNodeChange
Called whenever a node operation occurs (insert, remove, set, merge, split, move).

type OnNodeChange = (ctx: PlatePluginContext & {
  node: Descendant;
  operation: NodeOperation;
  prevNode: Descendant;
}) => HandlerReturnType;
Copy
Parameters:

node: The node after the operation
operation: The node operation that occurred
prevNode: The node before the operation
Note: For insert_node and remove_node operations, both node and prevNode contain the same value to avoid null cases.

handlers.onTextChange optional OnTextChange
Called whenever a text operation occurs (insert or remove text).

type OnTextChange = (ctx: PlatePluginContext & {
  node: Descendant;
  operation: TextOperation;
  prevText: string;
  text: string;
}) => HandlerReturnType;
Copy
Parameters:

node: The parent node containing the text that changed
operation: The text operation that occurred (insert_text or remove_text)
prevText: The text content before the operation
text: The text content after the operation

inject object
Defines how the plugin injects functionality into other plugins or the editor.

Hide child attributes
inject.nodeProps optional Record<string, any>
Properties used by Plate to inject props into any node component.

inject.excludePlugins optional string[]
An array of plugin keys to exclude from node prop injection.

inject.excludeBelowPlugins optional string[]
An array of plugin keys. Node prop injection will be excluded for any nodes that are descendants of elements with these plugin types.

inject.isBlock optional boolean
If true, only matches block elements. Used to restrict prop injection to block-level nodes.

inject.isElement optional boolean
If true, only matches element nodes. Used to restrict prop injection to element nodes.

inject.isLeaf optional boolean
If true, only matches leaf nodes. Used to restrict prop injection to leaf nodes.

inject.maxLevel optional number
Maximum nesting level for node prop injection. Nodes deeper than this level will not receive injected props.

inject.plugins optional Record<string, Partial<PlatePlugin>>
Property that can be used by a plugin to allow other plugins to inject code.

inject.targetPluginToInject optional function
A function that returns a plugin config to be injected into other plugins inject.plugins specified by targetPlugins.

inject.targetPlugins optional string[]
Plugin keys used by InjectNodeProps and the targetPluginToInject function.

Default: [ParagraphPlugin.key]

node object
Defines the node-specific configuration for the plugin.

Hide child attributes
node.isDecoration optional boolean
Indicates if this plugin's nodes can be rendered as decorated leaf. Set to false to render node component only once per text node.

Default: true
node.isElement optional boolean
Indicates if this plugin's nodes should be rendered as elements.

node.isInline optional boolean
Indicates if this plugin's elements should be treated as inline.

node.isLeaf optional boolean
Indicates if this plugin's nodes should be rendered as leaves.

node.isContainer optional boolean
When true, indicates that the plugin's elements are primarily containers for other content. This property is typically used by fragment queries to unwrap the container nodes.

rules.selection.affinity optional 'default' | 'directional' | 'outward' | 'hard'
Defines the selection behavior at the boundaries of nodes. See Plugin Rules.

'default': Uses Slate's default behavior

'directional': Selection affinity is determined by the direction of cursor movement. Maintains inward or outward affinity based on approach

'outward': Forces outward affinity. Typing at the edge of a mark will not apply the mark to new text

'hard': Creates a 'hard' edge that requires two key presses to move across. Uses offset-based navigation

Default: undefined (Slate's default behavior)

node.isMarkableVoid optional boolean
Indicates if this plugin's void elements should be markable.

node.isSelectable optional boolean
Indicates if this plugin's nodes should be selectable.

Default: true
node.isStrictSiblings optional boolean
Indicates whether this element enforces strict sibling type constraints. Set to true when the element only allows specific siblings (e.g., td can only have td siblings, column can only have column siblings) and prevents standard text blocks like paragraphs from being inserted as siblings.

Used by exit break functionality to determine appropriate exit points in nested structures. See Exit Break.

Default: false
rules.break.empty optional 'default' | 'deleteExit' | 'exit' | 'reset'
Action when Enter is pressed in an empty block. See Plugin Rules.

'default': Default behavior
'reset': Reset block to default paragraph type
'exit': Exit the current block
'deleteExit': Delete backward then exit
rules.break.emptyLineEnd optional 'default' | 'deleteExit' | 'exit'
Action when Enter is pressed at the end of an empty line. This is typically used with rules.break.default: 'lineBreak'. See Plugin Rules.

'default': Default behavior
'exit': Exit the current block
'deleteExit': Delete backward then exit
rules.break.default optional 'default' | 'deleteExit' | 'exit' | 'lineBreak'
Default action when Enter is pressed. Defaults to splitting the block. See Plugin Rules.

'default': Default behavior
'exit': Exit the current block
'lineBreak': Insert newline character
'deleteExit': Delete backward then exit
rules.break.splitReset optional boolean
If true, the new block after splitting will be reset to the default type. See Plugin Rules.

rules.delete.start optional 'default' | 'reset'
Action when Backspace is pressed at the start of the block. This applies whether the block is empty or not. See Plugin Rules.

'default': Default behavior
'reset': Reset block to default paragraph type
rules.delete.empty optional 'default' | 'reset'
Action when Backspace is pressed and the block is empty. See Plugin Rules.

'default': Default behavior
'reset': Reset block to default paragraph type
rules.match optional MatchRules
Function to determine if this plugin's rules should apply to a node. Used to override behavior based on node properties beyond just type matching.

Default: type === node.type

Example: matchRules: ({ node }) => Boolean(node.listStyleType)

Example: List plugin sets match: ({ node }) => !!node.listStyleType to override paragraph behavior when the paragraph is a list item.

rules.merge.removeEmpty optional boolean
Whether to remove the node when it's empty during merge operations. See Plugin Rules.

Default: false
rules.normalize.removeEmpty optional boolean
Whether to remove nodes with empty text during normalization. See Plugin Rules.

Default: false
node.isVoid optional boolean
Indicates if this plugin's elements should be treated as void.

node.type optional string
Specifies the type identifier for this plugin's nodes.

Default: plugin.key
node.component optional NodeComponent | null
React component used to render this plugin's nodes.

node.leafProps optional LeafNodeProps<WithAnyKey<C>>
Override data-slate-leaf element attributes.

node.props optional NodeProps<WithAnyKey<C>>
Override node attributes.

node.textProps optional TextNodeProps<WithAnyKey<C>>
Override data-slate-node="text" element attributes.


override object
Allows overriding components and plugins by key.

Hide child attributes
override.components optional Record<string, NodeComponent>
Replace plugin NodeComponent by key.

override.plugins optional Record<string, Partial<EditorPlatePlugin<AnyPluginConfig>>>
Extend PlatePlugin by key.

override.enabled optional Partial<Record<string, boolean>>
Enable or disable plugins.


parser Nullable<Parser<WithAnyKey<C>>>
Defines how the plugin parses content.


parsers object
Defines serializers and deserializers for various formats.

Hide child attributes
parsers.html optional Nullable<{ deserializer?: HtmlDeserializer<WithAnyKey<C>>; serializer?: HtmlSerializer<WithAnyKey<C>> }>
HTML parser configuration.

parsers.htmlReact optional Nullable<{ serializer?: HtmlReactSerializer<WithAnyKey<C>> }>
HTML React serializer configuration.


render object
Defines how the plugin renders components.

Hide child attributes
render.aboveEditable optional Component
Component rendered above the Editable component but inside the Slate wrapper.

render.aboveNodes optional RenderNodeWrapper<WithAnyKey<C>>
Create a function that generates a parent React node for all other plugins' node components.

render.aboveSlate optional Component
Component rendered above the Slate wrapper.

render.afterEditable optional EditableSiblingComponent
Renders a component after the Editable component.

render.beforeEditable optional EditableSiblingComponent
Renders a component before the Editable component.

render.belowNodes optional RenderNodeWrapper<WithAnyKey<C>>
Create a function that generates a React node below all other plugins' node React node, but above their children.

render.belowRootNodes optional (props: PlateElementProps<TElement, C>) => React.ReactNode
Renders a component after the direct children of the root element. This differs from belowNodes in that it's the direct child of PlateElement rather than wrapping the children that could be nested. This is useful when you need components relative to the root element.

render.leaf optional NodeComponent
Renders a component below leaf nodes when isLeaf: true and isDecoration: false. Use render.node instead when isDecoration: true.

render.node optional NodeComponent
Renders a component for:

Elements nodes if isElement: true
Below text nodes if isLeaf: true and isDecoration: false
Below leaf if isLeaf: true and isDecoration: true
render.as optional keyof HTMLElementTagNameMap
Specifies the HTML tag name to use when rendering the node component. Only used when no custom component is provided for the plugin.

Default: 'div' for elements, 'span' for leaves

shortcuts Shortcuts
Defines keyboard shortcuts for the plugin.


useOptionsStore StoreApi<C['key'], C['options']>
Zustand store for managing plugin options.


dependencies string[]
An array of plugin keys that this plugin depends on.


enabled optional boolean
Enables or disables the plugin. Used by Plate to determine if the plugin should be used.


plugins any[]
Recursive plugin support to allow having multiple plugins in a single plugin.


priority number
Defines the order in which plugins are registered and executed.

Default: 100

decorate optional Decorate<WithAnyKey<C>>
Property used by Plate to decorate editor ranges.


extendEditor optional ExtendEditor<WithAnyKey<C>>
Function to extend the editor instance. Used primarily for integrating legacy Slate plugins that need direct editor mutation. Only one extendEditor is allowed per plugin.

extendEditor: ({ editor }) => {
  // Example: Integrating a legacy Slate plugin
  return withYjs(editor);
}
Copy

useHooks optional () => void
Hook called when the editor is initialized.


editOnly optional boolean | EditOnlyConfig
Configures which plugin functionalities should only be active when the editor is not read-only.

Can be either a boolean or an object configuration:

type EditOnlyConfig = {
  render?: boolean;      // default: true
  handlers?: boolean;    // default: true
  inject?: boolean;      // default: true
  normalizeInitialValue?: boolean;  // default: false
}
Copy
When set to true (boolean):

render, handlers, and inject.nodeProps are only active when editor is not read-only
normalizeInitialValue remains active regardless of read-only state
When set to an object:

Each property can be individually configured
Properties default to being edit-only (true) except normalizeInitialValue which defaults to always active (false)
Set a property to false to make it always active regardless of read-only state
For normalizeInitialValue, set to true to make it edit-only
Examples:

// All features (except normalizeInitialValue) are edit-only
editOnly: true
 
// normalizeInitialValue is edit-only, others remain edit-only by default
editOnly: { normalizeInitialValue: true }
 
// render is always active, others follow default behavior
editOnly: { render: false }
Copy
Plugin Methods
Methods

configure (config: PlatePluginConfig | ((ctx: PlatePluginContext) => PlatePluginConfig)) => PlatePlugin
Creates a new plugin instance with updated options.

(config: PlatePluginConfig<C['key'], InferOptions<C>, InferApi<C>, InferTransforms<C>> | ((ctx: PlatePluginContext<C>) => PlatePluginConfig<C['key'], InferOptions<C>, InferApi<C>, InferTransforms<C>>)) => PlatePlugin<C>
Copy

extend (config: Partial<PlatePlugin> | ((ctx: PlatePluginContext) => Partial<PlatePlugin>)) => PlatePlugin
Creates a new plugin instance with additional configuration.

(extendConfig: Partial<PlatePlugin> | ((ctx: PlatePluginContext<AnyPluginConfig>) => Partial<PlatePlugin>)) => PlatePlugin
Copy

extendPlugin (key: string, config: Partial<PlatePlugin> | ((ctx: PlatePluginContext) => Partial<PlatePlugin>)) => PlatePlugin
Extends an existing nested plugin or adds a new one if not found. Supports deep nesting.

(key: string, extendConfig: Partial<PlatePlugin> | ((ctx: PlatePluginContext<AnyPluginConfig>) => Partial<PlatePlugin>)) => PlatePlugin
Copy

withComponent function
Sets or replaces the component associated with a plugin.

(component: NodeComponent) => PlatePlugin<C>
Copy

overrideEditor function
Creates a new plugin instance with overridden editor methods. Provides access to original methods via tf and api parameters. Can be called multiple times to layer different overrides.

overrideEditor(({ editor, tf: { deleteForward }, api: { isInline } }) => ({
  transforms: {
    // Override transforms
    deleteForward(options) {
      deleteForward(options);
    },
  },
  api: {
    // Override API methods
    isInline(element) {
      return isInline(element);
    },
  },
})) => PlatePlugin<C>
Copy
Preferred method for modifying editor behavior
Type-safe access to original methods
Clean separation between transforms and API
Can be chained multiple times

extendApi (api: (ctx: PlatePluginContext) => Record<string, Function>) => PlatePlugin
Extends the plugin's API.

(api: (ctx: PlatePluginContext) => Record<string, Function>) => PlatePlugin
Copy

extendEditorApi (api: (ctx: PlatePluginContext) => Record<string, Function>) => PlatePlugin
Extends the editor's API with plugin-specific methods.

(api: (ctx: PlatePluginContext) => Record<string, Function>) => PlatePlugin
Copy

extendTransforms (transforms: (ctx: PlatePluginContext) => Record<string, Function>) => PlatePlugin
Extends the plugin's transforms.

(transforms: (ctx: PlatePluginContext) => Record<string, Function>) => PlatePlugin
Copy

extendEditorTransforms (transforms: (ctx: PlatePluginContext) => Record<string, Function>) => PlatePlugin
Extends the editor's transforms with plugin-specific methods.

(transforms: (ctx: PlatePluginContext) => Record<string, Function>) => PlatePlugin
Copy

extendSelectors (options: (ctx: PlatePluginContext) => Record<string, any>) => PlatePlugin
Extends the plugin with selectors.

(options: (ctx: PlatePluginContext) => Record<string, any>) => PlatePlugin
Copy
Plugin Context
Attributes

editor PlateEditor
The current editor instance.


plugin EditorPlatePlugin<C>
The current plugin instance.


getOption function
Function to get a specific option value.


getOptions function
Function to get all options for the plugin.


setOption function
Function to set a specific option value.


setOptions function
Function to set multiple options.

For more detailed information on specific aspects of Plate plugins, refer to the individual guides on Plugin Configuration, Plugin Methods, Plugin Context, Plugin Components, and Plugin Shortcuts.

Generic Types
Attributes

C AnyPluginConfig = PluginConfig
Represents the plugin configuration. This type extends PluginConfig which includes key, options, api, and transforms.

Usage example:

type MyPluginConfig = PluginConfig<
  'myPlugin',
  { customOption: boolean },
  { getData: () => string },
  { customTransform: () => void }
>;
 
const MyPlugin = createPlatePlugin<MyPluginConfig>({
  key: 'myPlugin',
  // plugin implementation
});