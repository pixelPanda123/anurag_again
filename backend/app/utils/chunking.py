"""
Text chunking utility for provider-safe input limits.
Splits long text into chunks of at most max_chars, preferring word boundaries.
"""


def chunk_text(text: str, max_chars: int) -> list[str]:
    """
    Split text into chunks of at most max_chars, breaking on word boundaries
    when possible to avoid cutting mid-word.

    Args:
        text: Input text to chunk.
        max_chars: Maximum characters per chunk (must be >= 1).

    Returns:
        List of non-empty chunks. Empty or whitespace-only input returns [].

    Edge cases:
        - max_chars < 1: treated as 1.
        - Single word longer than max_chars: returned as single chunk (no truncation).
    """
    if not text or not text.strip():
        return []
    max_chars = max(1, max_chars)
    text = text.strip()
    if len(text) <= max_chars:
        return [text]

    chunks: list[str] = []
    remaining = text
    while remaining:
        if len(remaining) <= max_chars:
            chunks.append(remaining)
            break
        segment = remaining[: max_chars + 1]
        last_space = segment.rfind(" ")
        # Prefer breaking at space if we have one in the second half of the segment
        if last_space > max_chars // 2:
            split_at = last_space + 1
        else:
            split_at = max_chars
        chunk = remaining[:split_at].rstrip()
        if chunk:
            chunks.append(chunk)
        remaining = remaining[split_at:].lstrip()
    return chunks
