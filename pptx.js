// Builds a .pptx from a Slidex document. Slide size 960x540 px = 13.333x7.5 in (72 px per inch).
const PptxGenJS = require('pptxgenjs');
const hex = c => String(c).replace('#', '');
function buildPptx(doc) {
  const p = new PptxGenJS(); p.layout = 'LAYOUT_WIDE'; const k = 1 / 72;
  doc.slides.forEach(s => {
    const sl = p.addSlide(); sl.background = { color: hex(s.bg || doc.theme.bg) };
    s.els.forEach(e => {
      const pos = { x: e.x * k, y: e.y * k, w: e.w * k, h: e.h * k };
      if (e.t === 'text') sl.addText(e.s || ' ', { ...pos, fontSize: e.size * 0.75, bold: !!e.b, italic: !!e.i, color: hex(e.c || doc.theme.fg), align: e.al, fontFace: e.f, valign: 'top', margin: 6 });
      else if (e.t === 'img') sl.addImage({ data: e.src.replace(/^data:/, ''), ...pos });
      else { const col = hex(e.fill || doc.theme.ac); sl.addShape(e.t === 'ellipse' ? p.ShapeType.ellipse : p.ShapeType.rect, { ...pos, fill: { color: col }, line: { color: col } }); }
    });
  });
  return p;
}
module.exports = { buildPptx };
