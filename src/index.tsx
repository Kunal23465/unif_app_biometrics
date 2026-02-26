

// --- GLOBAL LOG OVERRIDE FOR FLUTTER ---
const originalLog = console.log;
const originalError = console.error;
const originalWarn = console.warn;

function sendToFlutter(level: "log" | "error" | "warn", ...args: any[]) {
  if (window.flutter_inappwebview?.callHandler) {
    // Convert objects to JSON strings so Flutter sees them properly
    const serializedArgs = args.map((a) =>
      typeof a === "object" ? JSON.stringify(a, null, 2) : a
    );
    window.flutter_inappwebview.callHandler("consoleLog", { level, args: serializedArgs });
  }
}

console.log = (...args: any[]) => {
  sendToFlutter("log", ...args);
  originalLog(...args);
};

console.error = (...args: any[]) => {
  sendToFlutter("error", ...args);
  originalError(...args);
};

console.warn = (...args: any[]) => {
  sendToFlutter("warn", ...args);
  originalWarn(...args);
};
