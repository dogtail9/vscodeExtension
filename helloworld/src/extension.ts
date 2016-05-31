'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as cp from 'child_process';

let myContext;
let outputChannel: vscode.OutputChannel;
var statusBarMessage: vscode.Disposable;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    myContext = context;
    outputChannel = vscode.window.createOutputChannel("npm");
    outputChannel.show();

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "helloworld" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.sayHello', () => {
        // The code you place here will be executed every time your command is executed

        statusBarMessage = vscode.window.setStatusBarMessage('Adding documentation files ...');
        let documentationRoot = vscode.workspace.rootPath + '\\';// + '\\Documentation\\';
        createDirectory(documentationRoot);
        saveFile(documentationRoot + 'convert.js', getContent('convert.js'));
        saveFile(documentationRoot + 'package.json', getContent('package.json'));
        saveFile(documentationRoot + 'Template.html', getContent('Template.html'));

        let vscodeRoot = documentationRoot + '.vscode\\';
        createDirectory(vscodeRoot);
        saveFile(vscodeRoot + 'tasks.json', getContent('tasks.json'));

        let markdownRoot = documentationRoot + 'Markdown\\';
        createDirectory(markdownRoot);

        var markdownFiles = ['Test.md', 'Architecture.md', 'ReleaseNotes.md', 'SystemDocumentation.md', 'UserGuide.md'];
        for (var index in markdownFiles) {
            var file = markdownFiles[index];
            if (!fs.existsSync(markdownRoot + file)) {
                saveFile(markdownRoot + file, getContent(file));
            }
        }
        
        let mediaRoot = markdownRoot + 'Media\\'
        createDirectory(mediaRoot);
        var file = mediaRoot + 'Image.png';
        
        if (!fs.existsSync(file)) {
            copyFile(myContext.asAbsolutePath('files/Image.png'), file);
        }
        
        statusBarMessage.dispose();
        statusBarMessage = vscode.window.setStatusBarMessage('Running npm install ...');
        runCommandInOutputWindow();
    });

    context.subscriptions.push(disposable);
}

function copyFile(src: string, dest: string) {
    fs.readFile(src, (err, data) => {
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

function getContent(path: string): string {
    let data = fs.readFileSync(myContext.asAbsolutePath('files/' + path));
    return String(data);
}

function runCommandInOutputWindow() {
    let cmd = 'npm install';
    let p = cp.exec(cmd, { cwd: vscode.workspace.rootPath, env: process.env });
    p.stderr.on('data', (data: string) => {
        outputChannel.append(data);
    });
    p.stdout.on('data', (data: string) => {
        outputChannel.append(data);
    });
    p.stdout.on('end', () => {
        statusBarMessage.dispose();
        vscode.window.setStatusBarMessage('Documentation added!', 2000);
        vscode.window.showInformationMessage('Documentation added!');
    });
}

// this method is called when your extension is deactivated
export function deactivate() {
}