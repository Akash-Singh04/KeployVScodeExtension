import * as vscode from 'vscode';
import {getKeployVersion} from './version';
import {downloadAndUpdate ,downloadAndUpdateDocker } from './updateKeploy';
import { SidebarProvider } from './SidebarProvider';


export function activate(context: vscode.ExtensionContext) {
    const logo = `
       ▓██▓▄
    ▓▓▓▓██▓█▓▄
     ████████▓▒
          ▀▓▓███▄      ▄▄   ▄               ▌
         ▄▌▌▓▓████▄    ██ ▓█▀  ▄▌▀▄  ▓▓▌▄   ▓█  ▄▌▓▓▌▄ ▌▌   ▓
       ▓█████████▌▓▓   ██▓█▄  ▓█▄▓▓ ▐█▌  ██ ▓█  █▌  ██  █▌ █▓
      ▓▓▓▓▀▀▀▀▓▓▓▓▓▓▌  ██  █▓  ▓▌▄▄ ▐█▓▄▓█▀ █▓█ ▀█▄▄█▀   █▓█
       ▓▌                           ▐█▌                   █▌
        ▓
`;

    const sidebarProvider = new SidebarProvider(context.extensionUri);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            "Keploy-Sidebar",
            sidebarProvider
        )
    );

    let updateKeployDisposable = vscode.commands.registerCommand('heykeploy.updateKeploy', () => {
            //open popup to ask user to choose beteween keploy docker or keploy binary
            const options = [
                { label: "Keploy Docker", description: "Update using Keploy Docker" },
                { label: "Keploy Binary", description: "Update using Keploy Binary" }
            ];
        
            vscode.window.showQuickPick(options, {
                placeHolder: "Choose how to update Keploy"
            }).then(async selection => {
                if (selection) {
                    // Handle the user's choice here
                    if (selection.label === "Keploy Docker") {
                        try{
                        await downloadAndUpdateDocker();
                            vscode.window.showInformationMessage('Keploy Docker updated!');
                    }catch(error){
                            vscode.window.showErrorMessage(`Failed to update Keploy Docker: ${error}`);
                        }
                    } else if (selection.label === "Keploy Binary") {
                        try {
                            await downloadAndUpdate();
                            // this._view?.webview.postMessage({ type: 'success', value: 'Keploy binary updated!' });
                        } catch (error) {
                            vscode.window.showErrorMessage(`Failed to update Keploy binary: ${error}`);
                        }
                    }
                }
            });

        });
        context.subscriptions.push(updateKeployDisposable);

    let getLatestKeployDisposable = vscode.commands.registerCommand('heykeploy.KeployVersion', () => {
        // Logic to get the latest Keploy
        vscode.window.showInformationMessage('Feature coming soon!');
    }
    );
    context.subscriptions.push(getLatestKeployDisposable);
    
    let viewChangeLogDisposable = vscode.commands.registerCommand('heykeploy.viewChangeLog', () => {
        // Logic to view the change log
        vscode.window.showInformationMessage('Feature coming soon!');
    }
    );
    context.subscriptions.push(viewChangeLogDisposable);

    let viewDocumentationDisposable = vscode.commands.registerCommand('heykeploy.viewDocumentation', () => {
        // Logic to view the documentation
        vscode.window.showInformationMessage('Feature coming soon!');
    }
    );
    context.subscriptions.push(viewDocumentationDisposable);
    

    let hellocommand = vscode.commands.registerCommand('heykeploy.HeyKeploy', () => {
        vscode.window.showInformationMessage(`Hey Keploy Community!`);
    });

    context.subscriptions.push(hellocommand);

    let versioncommand = vscode.commands.registerCommand('heykeploy.getLatestVersion', () => {
        const panel = vscode.window.createWebviewPanel(
            'keployVersion', // Identifies the type of the webview. Used internally
            'Keploy Version', // Title of the panel displayed to the webviewuser
            vscode.ViewColumn.One, // Editor column to show the new  panel in
            {}
        );


        // Get the Keploy version and update the Webview content
        getKeployVersion().then(version => {
            panel.webview.html = `
                <html>
                    <body>
						<pre>${logo}</pre>
                        <h1>The latest version of Keploy is ${version}</h1>
						<h1>View the latest version at <a href="https://github.com/keploy/keploy"> Keploy GitHub</a></h1>
                    </body>
                </html>
            `;
        }).catch(error => {
            // Display error message in case of failure
            vscode.window.showErrorMessage(`Error fetching Keploy version: ${error}`);
        });
    }
    );

    context.subscriptions.push(versioncommand);

}

// This method is called when your extension is deactivated
export function deactivate() { }
