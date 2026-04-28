import sys
import fitz

pdf_path = sys.argv[1]
page_num = int(sys.argv[2])  # 1-based
output_path = sys.argv[3]

doc = fitz.open(pdf_path)
page = doc[page_num - 1]
pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))
pix.save(output_path)
doc.close()
print(f"Exported page {page_num} -> {output_path}")
