export const formatUpdatedAt = (value: string) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));

export const normalizeAssetUrl = (value: unknown, projectUrl?: string) => {
  if (typeof value !== "string" || !value) return undefined;

  let urlStr = value;

  if (urlStr.includes("github.com") && urlStr.includes("/blob/")) {
    urlStr = urlStr.replace("/blob/", "/raw/");
  }

  if (urlStr.startsWith("http") || urlStr.startsWith("data:")) return urlStr;

  if (urlStr.startsWith("public/")) {
    return `/${urlStr.slice("public/".length)}`;
  }

  if (projectUrl && !urlStr.startsWith("#") && !urlStr.startsWith("mailto:")) {
    const cleanPath = urlStr.replace(/^(\.\/|\/)/, "");
    const repoPath = projectUrl
      .replace("https://github.com/", "")
      .replace(/\/$/, "");
    return `https://github.com/${repoPath}/raw/HEAD/${cleanPath}`;
  }

  return urlStr;
};
