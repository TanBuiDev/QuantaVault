/**
 * Focus a source location without ever editing the textarea value.
 * A temporary offscreen mirror measures visual wrapping only on navigation,
 * rather than guessing the scroll position from logical Markdown line count.
 */
export function focusMarkdownTextareaAtOffset(textarea: HTMLTextAreaElement, offset: number): boolean {
  if (!Number.isSafeInteger(offset) || offset < 0 || offset > textarea.value.length) return false;

  const caretTop = measureCaretTop(textarea, offset);
  const priorScrollLeft = textarea.scrollLeft;
  textarea.focus({ preventScroll: true });
  textarea.setSelectionRange(offset, offset);

  if (caretTop !== null && textarea.clientHeight > 0) {
    const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight) || 20;
    const viewportTop = textarea.scrollTop;
    const viewportBottom = viewportTop + textarea.clientHeight;
    if (caretTop < viewportTop + lineHeight || caretTop + lineHeight > viewportBottom - lineHeight) {
      textarea.scrollTop = Math.max(0, caretTop - textarea.clientHeight / 3);
    }
  }
  textarea.scrollLeft = priorScrollLeft;
  return true;
}

function measureCaretTop(textarea: HTMLTextAreaElement, offset: number): number | null {
  // Avoid expensive mirror layout for unusually large inputs or invisible controls.
  if (textarea.value.length > 200_000 || textarea.clientWidth <= 0 || !document.body) return null;
  const computed = getComputedStyle(textarea);
  const mirror = document.createElement("div");
  const marker = document.createElement("span");
  mirror.setAttribute("aria-hidden", "true");
  Object.assign(mirror.style, {
    position: "fixed",
    left: "-100000px",
    top: "0",
    visibility: "hidden",
    pointerEvents: "none",
    width: textarea.clientWidth + "px",
    boxSizing: "border-box",
    border: "0",
    padding: computed.padding,
    fontFamily: computed.fontFamily,
    fontSize: computed.fontSize,
    fontWeight: computed.fontWeight,
    fontStyle: computed.fontStyle,
    lineHeight: computed.lineHeight,
    letterSpacing: computed.letterSpacing,
    tabSize: computed.tabSize,
    textAlign: computed.textAlign,
    whiteSpace: "pre-wrap",
    overflowWrap: "break-word",
    wordBreak: "break-word",
  });
  mirror.append(document.createTextNode(textarea.value.slice(0, offset)));
  marker.textContent = "\u200b";
  mirror.append(marker);
  try {
    document.body.append(mirror);
    return Number.isFinite(marker.offsetTop) ? marker.offsetTop : null;
  } finally {
    mirror.remove();
  }
}
