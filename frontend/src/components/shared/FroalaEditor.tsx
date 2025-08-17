'use client';

import dynamic from 'next/dynamic';
import 'froala-editor/js/plugins.pkgd.min.js';
import 'froala-editor/js/languages/ru.js';

const FroalaEditorComponent = dynamic(
    () => import('react-froala-wysiwyg'),
    { ssr: false }
);

export default function FroalaEditorWrapper({ model, onChangeAction }: { model: string, onChangeAction: (content: string) => void }) {
    return (
        <FroalaEditorComponent
            tag='textarea'
            model={model}
            onModelChange={onChangeAction}
            config={{
                placeholderText: 'Введите текст...',
                charCounterCount: false,
                heightMin: 300,
                toolbarButtons: [
                    'bold', 'italic', 'underline', '|',
                    'textColor', 'backgroundColor', '|',
                    'alignLeft', 'alignCenter', 'alignRight', 'alignJustify', '|',
                    'formatOL', 'formatUL', '|',
                    'undo', 'redo'
                ],
                pluginsEnabled: [
                    'align', 'colors', 'paragraphFormat', 'paragraphStyle', 'lists'
                ]
            }}
        />
    );
}
