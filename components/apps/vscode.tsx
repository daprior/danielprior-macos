interface VSCodeProps {
  isDarkMode?: boolean;
}

// Replace VSCode component with an iframe
export default function VSCode({ isDarkMode = true }: VSCodeProps) {
  return (
    <div className={`h-full w-full ${isDarkMode ? "bg-gray-900" : "bg-white"}`}>
      <iframe
        src="https://github1s.com/daprior/danielprior-macos/blob/main/README.md"
        className="w-full h-full border-0"
        title="VSCode Project View"
      />
    </div>
  );
}
