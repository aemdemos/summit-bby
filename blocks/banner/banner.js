export default function decorate(block) {
  const rows = [...block.children];

  // Single-row: image + text in one cell — extract image into background layer
  if (rows.length === 1) {
    const cell = rows[0].firstElementChild || rows[0];
    const picture = cell.querySelector('picture');
    const imgEl = picture || cell.querySelector('img');
    if (!imgEl) return;

    const imgP = imgEl.closest('p');
    const bgDiv = document.createElement('div');
    bgDiv.append(imgEl);
    block.prepend(bgDiv);

    if (imgP && imgP.textContent.trim() === '' && !imgP.querySelector('picture, img')) {
      imgP.remove();
    }
  }
}
