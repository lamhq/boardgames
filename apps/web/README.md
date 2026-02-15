# Web

## Debug with VS Code

Debug the web app using Chrome and VS Code.

### Prerequisites

- Google Chrome installed
- VS Code installed
- Web app dependencies installed (`pnpm install`)

### Start the Web Server and Chrome

Open a terminal and run:

```bash
pnpm run --filter "web" debug
```

This starts the Vite dev server on `http://localhost:6001` and open Chrome with that URL.

**Note:** Chrome opens in a special debug profile (`/tmp/chrome-debug-profile`) which is required for remote debugging.


### Attach VS Code Debugger

Now in VS Code:

1. Open the **Run and Debug** view (`Ctrl+Shift+D` / `Cmd+Shift+D`)
2. Select **"Debug Web App"** from the dropdown
3. Click the **Play button** (or press `F5`)

VS Code will connect to Chrome and you'll see "Debugger attached" in the Debug Console.

Once attached, you can:

- **Set breakpoints** - Click line numbers in VS Code  
- **Step through code** - Use F10 (step over), F11 (step into), Shift+F11 (step out)  
- **Inspect variables** - Hover over variables or use the Debug Console  
- **View call stack** - See function calls in the Debug view  
- **Evaluate expressions** - Type JavaScript in the Debug Console  
- **Hot reload** - Vite auto-refreshes on file save; breakpoints persist


### Troubleshooting

**Chrome won't start?**
- Ensure `/Applications/Google Chrome.app` path is correct
- Check that port 9222 isn't already in use: `lsof -i :9222`
- Try killing Chrome manually: `killall "Google Chrome"`

**Debugger won't attach?**
- Verify Chrome is running: `ps aux | grep "Google Chrome"`
- Check the dev server is running on port 6001
- Restart Chrome with the debug script

**Source maps not working?**
- Ensure Vite is running in dev mode (not production build)
- Check browser DevTools Sources tab shows correct file paths
- Hard refresh Chrome (Cmd+Shift+R)
