import * as vscode from 'vscode';
import { SCSSFormatterProvider } from './SCSSFormatterProvider';

export function activate(context: vscode.ExtensionContext)
{
	context.subscriptions.push(vscode.commands.registerCommand("extension.scssAllmanFormatter", () =>
	{
		vscode.window.showInformationMessage("SCSS Allman Formatter Activated!");
	}));
	context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider(["scss", "css"], new SCSSFormatterProvider()));
}