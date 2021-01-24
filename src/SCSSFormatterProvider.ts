import { DocumentFormattingEditProvider, TextDocument, FormattingOptions, CancellationToken, ProviderResult, TextEdit, TextLine } from "vscode";

export class SCSSFormatterProvider implements DocumentFormattingEditProvider
{
    private linesToIgnore: Array<number> = [];
    private changes = [];

    public provideDocumentFormattingEdits(document: TextDocument, options: FormattingOptions, token: CancellationToken): ProviderResult<TextEdit[]>
    {
        this.changes = [];

        this.linesToIgnore = this.findCommentsReturnIgnoredLines(document);
        this.format(document, options);

        return this.changes;
    }

    private format(document: TextDocument, options: FormattingOptions): void
    {
        for (let i = 0; i < document.lineCount; i++)
        {
            const line: TextLine = document.lineAt(i);

            if (this.linesToIgnore.indexOf(line.lineNumber) > -1)
            {
                continue;
            }

            const newLine = this.createNewLine(options.insertSpaces, line);
            const newText = line.text.replace(/(\S)(.+){\s*$/gm, newLine);
            this.changes.push(TextEdit.replace(line.range, newText));
        }
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

    private findCommentsReturnIgnoredLines(document: TextDocument): Array<number>
    {
        const ignoredLines = [];

        let multiLineCommentFound = false;

        for (let i = 0; i < document.lineCount; i++)
        {
            const line: TextLine = document.lineAt(i);
            const scssCommentMatch = line.text.match(/(\/\/*)/);
            if (scssCommentMatch !== null)
            {
                ignoredLines.push(line.lineNumber);
            }

            const cssMultiLineCommentMatch = line.text.match(/\/\*[^]/s);
            if (cssMultiLineCommentMatch !== null && multiLineCommentFound === false)
            {
                multiLineCommentFound = true;
            }

            if (multiLineCommentFound === true)
            {
                ignoredLines.push(line.lineNumber);
                const closing = line.text.match(/[^]\/\s*$/gm);
                if (closing !== null)
                {
                    multiLineCommentFound = false;
                }
            }
        }

        return ignoredLines;
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