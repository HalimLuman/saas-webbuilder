const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/lib/section-blocks.ts');
let code = fs.readFileSync(filePath, 'utf8');

// 1. Fix two-col and three-col
code = code.replace(/type:\s*"two-col"/g, 'type: "container"');
code = code.replace(/type:\s*"three-col"/g, 'type: "container"');

// 2. Safely add responsive overrides to lines with giant padded container styles
let lines = code.split('\n');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Massive Hero Fonts
  if (line.includes('fontSize: "') && (line.includes('64px') || line.includes('72px') || line.includes('80px'))) {
    if (!line.includes('_responsive') && line.includes('props: {')) {
      lines[i] = line.replace('props: {', 'props: { _responsive: { mobile: { fontSize: "42px", lineHeight: "1.15" }, tablet: { fontSize: "56px" } },');
    } else if (!line.includes('_responsive') && line.includes('styles: {')) {
      lines[i] = line.replace('styles: {', 'props: { _responsive: { mobile: { fontSize: "42px", lineHeight: "1.15" }, tablet: { fontSize: "56px" } } }, styles: {');
    }
  }
  
  // Subheaders or large h2
  if (line.includes('fontSize: "') && (line.includes('48px') || line.includes('56px'))) {
    if (!line.includes('_responsive') && line.includes('props: {')) {
      lines[i] = line.replace('props: {', 'props: { _responsive: { mobile: { fontSize: "36px", lineHeight: "1.2" }, tablet: { fontSize: "42px" } },');
    } else if (!line.includes('_responsive') && line.includes('styles: {')) {
      lines[i] = line.replace('styles: {', 'props: { _responsive: { mobile: { fontSize: "36px", lineHeight: "1.2" }, tablet: { fontSize: "42px" } } }, styles: {');
    }
  }

  // Giant Paddings
  if (line.includes('padding: "') && (line.includes('120px') || line.includes('140px') || line.includes('160px') || line.includes('100px'))) {
    if (!line.includes('_responsive') && line.includes('props: {')) {
      lines[i] = line.replace('props: {', 'props: { _responsive: { mobile: { padding: "64px 24px" }, tablet: { padding: "80px 32px" } },');
    } else if (!line.includes('_responsive') && line.includes('styles: {')) {
      lines[i] = line.replace('styles: {', 'props: { _responsive: { mobile: { padding: "64px 24px" }, tablet: { padding: "80px 32px" } } }, styles: {');
    }
  }
  
  // Specific fix for desktop row layouts that wrap awkwardly
  // If it's a generic two-col looking grid:
  if (line.includes('gap: "80px"') || line.includes('gap: "64px"')) {
      if (!line.includes('_responsive') && line.includes('styles: {')) {
         lines[i] = line.replace('styles: {', 'props: { _responsive: { mobile: { _childLayout: "column", _childGap: "xl" }, tablet: { _childLayout: "column", _childGap: "xl" } } }, styles: {');
      }
  }
  
  // If it has gridTemplateColumns (for features matrix)
  if (line.includes('gridTemplateColumns')) {
      if (!line.includes('_responsive') && line.includes('styles: {')) {
          lines[i] = line.replace('styles: {', 'props: { _responsive: { mobile: { gridTemplateColumns: "1fr", _childLayout: "column" }, tablet: { gridTemplateColumns: "1fr", _childLayout: "column" } } }, styles: {');
      }
  }
}

fs.writeFileSync(filePath, lines.join('\n'));
console.log("Refactoring complete");
