'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';

let myContext;
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    myContext = context;

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "helloworld" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.sayHello', () => {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        let documentationRoot = vscode.workspace.rootPath + '\\';// + '\\Documentation\\';
        createDirectory(documentationRoot);
        //copyFile(context.asAbsolutePath('files/convert.txt'), documentationRoot + 'convert.js');
        saveFile(documentationRoot + 'convert.js', getConvertJsText());
        saveFile(documentationRoot + 'package.json', getPackageJsonText());
        saveFile(documentationRoot + 'Template.html', getTemplateHtmlText());

        let markdownRoot = documentationRoot + 'Markdown\\';
        createDirectory(markdownRoot);
        saveFile(markdownRoot + 'Test.md', getTextMarkdownText());

        let mediaRoot = markdownRoot + 'Media\\'
        createDirectory(mediaRoot);

        vscode.window.showInformationMessage('Documentation added!');
    });

    context.subscriptions.push(disposable);
}

function copyFile(src: string, dest: string) {
    fs.readFile(src, 'utf8', (err, data) => {
        if (err) throw err;

        fs.writeFile(dest, data, (err) => {
            if (err) throw err;
            console.log('File Written');
        });
    });
}

function createDirectory(path: string) {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
}

function saveFile(path: string, data: string) {
    fs.writeFile(path, data, (err: NodeJS.ErrnoException) => {
        console.log(err);
    });
}

function getConvertJsText(): string {
    let data = fs.readFileSync(myContext.asAbsolutePath('files/convert.txt'));
    return String(data);
}

function getPackageJsonText(): string {
    return 'package';
}

function getTemplateHtmlText(): string {
    return 'template';
}

function getTextMarkdownText(): string {
    return 'test';
}

// this method is called when your extension is deactivated
export function deactivate() {
}