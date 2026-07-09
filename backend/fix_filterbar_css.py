from pathlib import Path
path = Path('../frontend/src/components/FilterBar.css')
text = path.read_text(encoding='utf-8')
text = text.replace('  overflow: hidden;\n}', '  overflow: visible;\n}')
text = text.replace('  max-height: 280px;\n  overflow-y: auto;', '  max-height: 280px;\n  min-height: 160px;\n  overflow-y: auto;')
path.write_text(text, encoding='utf-8')
print('updated')
