import MonacoEditor, { Monaco } from '@monaco-editor/react'
import { editor } from 'monaco-editor'
import { VSEditorSkeleton } from './skeleton'

interface VSEditorProps {
  isDarkMode: boolean
}

export function VSEditor({ isDarkMode }: VSEditorProps) {
  // Define os temas customizados para o Monaco Editor
  const defineMonacoThemes = (monacoInstance: Monaco) => {
    // --- TEMA ESCURO: "radioactive-code-dark" ---
    monacoInstance.editor.defineTheme('radioactive-code-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: 'FF073A', fontStyle: 'bold' },
        { token: 'type', foreground: 'FF073A', fontStyle: 'bold' },
        { token: 'storage', foreground: 'FF073A', fontStyle: 'bold' },
        { token: 'interface', foreground: 'FF073A', fontStyle: 'bold' },

        { token: 'string', foreground: '00F0FF' },
        { token: 'string.escape', foreground: '00F0FF' },

        { token: 'comment', foreground: '666666', fontStyle: 'italic' },

        { token: 'number', foreground: 'FFFF00' },
        { token: 'constant.language.boolean', foreground: 'FFFF00' },

        { token: 'variable', foreground: 'E0E0E0' },
        { token: 'parameter', foreground: 'E0E0E0' },
        { token: 'property', foreground: 'E0E0E0' },

        { token: 'function', foreground: '00BFFF', fontStyle: 'bold' },
        { token: 'function.call', foreground: '00BFFF' },

        { token: 'class', foreground: '4EC9B0' },

        { token: 'operator', foreground: '808080' },
        { token: 'delimiter', foreground: '808080' },
        { token: 'brace', foreground: '808080' },
        { token: 'bracket', foreground: '808080' },
        { token: 'paren', foreground: '808080' },

        { token: 'tag', foreground: 'FF073A' },
        { token: 'attribute.name', foreground: '00BFFF' },
        { token: 'attribute.value', foreground: '00F0FF' },

        { token: 'error.foreground', foreground: 'FF0000' },
        { token: 'warning.foreground', foreground: 'FFFF00' },
        { token: 'info.foreground', foreground: '00BFFF' },
      ],
      colors: {
        'editor.background': '#1E1E1E', // Fundo do editor = background principal do tema
        'editor.foreground': '#E0E0E0',
        'editorCursor.foreground': '#D4D4D4',

        'editor.selectionBackground': '#4C5D6F',
        'editor.inactiveSelectionBackground': '#3A424A',

        'editor.lineHighlightBackground': '#1E1E1E', // Linha ativa mais escura que o fundo do editor
        'editor.lineHighlightBorder': '#1E1E1E',

        'editorLineNumber.foreground': '#FF073A',
        'editorLineNumber.activeForeground': '#00F0FF',

        focusBorder: '#00000000',
        'editor.outlineColor': '#00000000',

        'editorError.foreground': '#FF0000',
        'editorWarning.foreground': '#FFFF00',
        'editorInfo.foreground': '#00BFFF',

        'editorSuggestWidget.background': '#1E1E1E', // Sugestões com a cor do Paper
        'editorSuggestWidget.border': '#4A5057',
        'editorSuggestWidget.foreground': '#E0E0E0',
        'editorSuggestWidget.highlightForeground': '#00F0FF',
        'editorSuggestWidget.selectedBackground': '#3A424A',
      },
    })

    // --- TEMA CLARO: "radioactive-code-light" ---
    monacoInstance.editor.defineTheme('radioactive-code-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: 'FF073A', fontStyle: 'bold' },
        { token: 'type', foreground: 'FF073A', fontStyle: 'bold' },
        { token: 'storage', foreground: 'FF073A', fontStyle: 'bold' },
        { token: 'interface', foreground: 'FF073A', fontStyle: 'bold' },

        { token: 'string', foreground: '00F0FF' },
        { token: 'string.escape', foreground: '00F0FF' },

        { token: 'comment', foreground: '6A7B76', fontStyle: 'italic' },

        { token: 'number', foreground: '39FF14' },
        { token: 'constant.language.boolean', foreground: '39FF14' },

        { token: 'variable', foreground: '212121' },
        { token: 'parameter', foreground: '212121' },
        { token: 'property', foreground: '212121' },

        { token: 'function', foreground: '00BFFF', fontStyle: 'bold' },
        { token: 'function.call', foreground: '00BFFF' },

        { token: 'class', foreground: '1976D2' },

        { token: 'operator', foreground: '616161' },
        { token: 'delimiter', foreground: '616161' },
        { token: 'brace', foreground: '616161' },
        { token: 'bracket', foreground: '616161' },
        { token: 'paren', foreground: '616161' },

        { token: 'tag', foreground: 'FF073A' },
        { token: 'attribute.name', foreground: '00BFFF' },
        { token: 'attribute.value', foreground: '00F0FF' },

        { token: 'error.foreground', foreground: 'FF0000' },
        { token: 'warning.foreground', foreground: 'FFFF00' },
        { token: 'info.foreground', foreground: '00BFFF' },
      ],
      colors: {
        'editor.background': '#FFFFFF', // Fundo do editor = background principal do tema
        'editor.foreground': '#212121',
        'editorCursor.foreground': '#000000',

        'editor.selectionBackground': '#B3D9FF',
        'editor.inactiveSelectionBackground': '#E6F2FF',

        'editor.lineHighlightBackground': '#FFFFFF', // Linha ativa mais escura que o fundo do editor
        'editor.lineHighlightBorder': '#FFFFFF',

        'editorLineNumber.foreground': 'FF073A',
        'editorLineNumber.activeForeground': '00F0FF',

        focusBorder: '#00000000',
        'editor.outlineColor': '#00000000',

        'editorIndentGuide.background': '#E0E0E0',
        'editorIndentGuide.activeBackground': '#C0C0C0',

        'editorError.foreground': 'FF0000',
        'editorWarning.foreground': 'FFFF00',
        'editorInfo.foreground': '00BFFF',

        'editorSuggestWidget.background': '#FFFFFF', // Sugestões com a cor do Paper
        'editorSuggestWidget.border': '#E0E0E0',
        'editorSuggestWidget.foreground': '#212121',
        'editorSuggestWidget.highlightForeground': '00F0FF',
        'editorSuggestWidget.selectedBackground': '#E0E0E0',

        'input.background': '#FFFFFF', // Input com a cor do Paper
        'input.foreground': '#212121',
        'input.border': '#D0D0D0',
        'input.placeholderForeground': '#A0A0A0',
      },
    })
  }

  function handleEditorMount(
    _editor: editor.IStandaloneCodeEditor,
    monacoInstance: Monaco,
  ) {
    defineMonacoThemes(monacoInstance)
    monacoInstance.editor.setTheme(
      isDarkMode ? 'radioactive-code-dark' : 'radioactive-code-light',
    )
  }

  return (
    <MonacoEditor
      height="55vh"
      defaultLanguage="php"
      defaultValue={`<?php\n  // Exemplo de código PHP com o tema radioativo\n  $userName = "Usuário Radioativo"; // String\n  const MAX_LEVEL = 100;\n\n  /**\n   * Função para ativar o núcleo com um nível específico.\n   * @param level O nível de ativação. (variável)\n   */\n  function activateCore(level: number): void {\n    if (level > MAX_LEVEL) {\n      console.error("Nível de radiação excedido!");\n      return;\n    }\n    echo "Ativando núcleo no nível: " . $level . " ...\\n";\n    // Este é um comentário, ele deve ser discreto.\n    echo "<h1 style='color: ${'FF073A'};'>Energia!</h1>";\n  }\n\n  activateCore(99);\n  activateCore(101); // Isto pode gerar um erro!\n`}
      theme={isDarkMode ? 'radioactive-code-dark' : 'radioactive-code-light'}
      saveViewState={false}
      options={{
        fontSize: 16,
        minimap: { enabled: true },
        automaticLayout: true,
        fontFamily: '"Fira Code", monospace',
        lineNumbersMinChars: 3,
        scrollBeyondLastLine: false,
        readOnly: false,
      }}
      loading={<VSEditorSkeleton />}
      onMount={handleEditorMount}
    />
  )
}
