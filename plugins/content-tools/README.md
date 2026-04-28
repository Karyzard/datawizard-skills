# content-tools

Document conversion and processing tools — email, PDF, meeting transcripts, and image generation.

## Skills

### email-to-markdown

Converts Outlook `.msg` email files to clean Markdown. Extracts subject, sender, date, and body; strips HTML; saves output as a dated `.md` file next to the original. Handles batch processing of whole folders.

### pdf-to-markdown

Converts presentation PDFs (slides) to structured Markdown where each slide becomes an H1 section. Detects image-only and partial-text slides, exports them as PNG, and fills in content via visual analysis. Includes a helper script `scripts/export_pdf_page.py` (requires PyMuPDF).

### process-meeting-transcript

Processes meeting transcripts and voice memos: creates a dated folder, renames the `.txt` file, optionally censors off-topic passages (with user confirmation), and produces a structured Markdown summary. Supports three output templates — client meeting, weekly/project meeting, and personal note.

### generate-images

Generates images via Google Gemini API. Accepts three input modes: an existing `brief.md` file, raw notes/dictation (AI creates the brief), or auto mode (no approval step). Produces a `generate.py` script from a template and runs it. Supports partial regeneration by filename pattern or category.
