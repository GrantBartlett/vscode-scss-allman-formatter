import { DocumentFormattingEditProvider, TextDocument, FormattingOptions, CancellationToken, ProviderResult, TextEdit, TextLine } from "vscode";

export class SCSSFormatterProvider implements DocumentFormattingEditProvider
{
    public provideDocumentFormattingEdits(document: TextDocument, options: FormattingOptions, token: CancellationToken): ProviderResult<TextEdit[]>
    {
        const changes: ProviderResult<TextEdit[]> = [];

        for (let i = 0; i < document.lineCount; i++)
        {
            const line: TextLine = document.lineAt(i);
            const newLine = this.createNewLine(options.insertSpaces, line);
            const newText = line.text.replace(/(\S)(.+){\s*$/gm, newLine);
            changes.push(TextEdit.replace(line.range, newText));
        }

        return changes;
    }

    private createNewLine(insertSpaces: boolean, line: TextLine): string 
    {
        let newLine = "$1$2\n";

        if (insertSpaces === true)
        {
            newLine += this.repeat(" ", line.firstNonWhitespaceCharacterIndex) + "{";
        }
        else
        {
            newLine += this.repeat("\t", line.firstNonWhitespaceCharacterIndex) + "{";
        }

        return newLine;
    }

    private repeat(value: string, count: number): string
    {
        let s = "";
        while (count > 0)
        {
            if ((count & 1) === 1)
            {
                s += value;
            }
            value += value;
            count = count >>> 1;
        }
        return s;
    }
}