'use client';
import { useState } from 'react';
import { useEffect } from 'react';
import useMediaQuery from './hooks/useMediaQuery';
import './index.css';
import { $getRoot, LexicalEditor } from 'lexical';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { TRANSFORMERS } from '@lexical/markdown';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { $generateHtmlFromNodes } from '@lexical/html';
import Nodes from './nodes';
import EditorTheme from './themes/EditorTheme';

import DragDropPaste from './plugins/DragDropPastePlugin';
import FloatingLinkEditorPlugin from './plugins/FloatingLinkEditorPlugin';
import LinkPlugin from './plugins/LinkPlugin';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import ContentEditable from './ui/ContentEditable';
import Placeholder from './ui/Placeholder';
import LexicalAutoLinkPlugin from './plugins/AutoLinkPlugin/index';
import CodeHighlightPlugin from './plugins/CodeHighlightPlugin';
import InlineImagePlugin from './plugins/InlineImagePlugin';

const loadContent = () => {
  // 'empty' editor
  const value =
    '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';

  return value;
};
interface EditorProps {
  value?: string;
  onChange?: any;
}
function MyCustomAutoFocusPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Focus the editor when the effect fires!
    editor.focus();
  }, [editor]);

  return null;
}

export function Editor({ value, onChange }: EditorProps) {
  const isSmallWidthViewPort = useMediaQuery('(max-width: 1025px)');
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);
  const placeholder = <Placeholder>Enter some rich text...</Placeholder>;
  const initialEditorState = loadContent();
  const initialConfig = {
    namespace: 'MyEditor',
    editorState: initialEditorState,
    theme: EditorTheme,
    onError: (error: Error) => {
      throw error;
    },
    nodes: [...Nodes],
    showTreeView: true,
  };

  const onChangeValue = (editorState: any, editor: LexicalEditor) => {
    editor.update(() => {
      const rawHTML = $generateHtmlFromNodes(editor, null);
      onChange && onChange(rawHTML);
    });
  };

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };
  useEffect(() => {
    console.log(value);
  }, [value]);

  return (
    <>
      <LexicalComposer initialConfig={initialConfig}>
        <div className='editor-shell'>
          <ToolbarPlugin />
          <div className='editor-container tree-view'>
            <ClearEditorPlugin />
            <LexicalAutoLinkPlugin />
            <InlineImagePlugin />
            <CheckListPlugin />
            <RichTextPlugin
              contentEditable={
                <div className='editor-scroller'>
                  <div className='editor' ref={onRef}>
                    <ContentEditable />
                  </div>
                </div>
              }
              placeholder={placeholder}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <OnChangePlugin onChange={onChangeValue} />
            <HistoryPlugin />
            <MyCustomAutoFocusPlugin />
            <DragDropPaste />
            <ListPlugin />
            <CodeHighlightPlugin />
            <HorizontalRulePlugin />
            <LinkPlugin />
            {floatingAnchorElem && !isSmallWidthViewPort && (
              <FloatingLinkEditorPlugin anchorElem={floatingAnchorElem} />
            )}
            <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          </div>
        </div>
      </LexicalComposer>
    </>
  );
}
