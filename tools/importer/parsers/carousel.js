/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel block.
 * Source: .carousel-component inside .carousel.panelcontainer
 * Leaders podcast carousel with dark background episode cards.
 * Carousel format: 2 columns per slide [image | text content].
 */
export default function parse(element, { document }) {
  const cells = [];

  // Find all slides (carousel items)
  // Found: <div class="swiper-slide"> containing <box-card-component>
  //   with .bg-black-base, image, subtitle (date), h4 title, p description
  const slides = element.querySelectorAll('.swiper-slide');
  const slideEls = slides.length ? slides : [element];

  slideEls.forEach((slide) => {
    const card = slide.querySelector('box-card-component, a.box-card-component') || slide;
    const link = card.querySelector('a[href]') || card;
    const href = link.getAttribute?.('href') || '#';

    // Column 1: Image
    // Found: <img class="box-card-component_img" src="...Corp_0226_Andrew...">
    const image = slide.querySelector('img.box-card-component_img, picture');
    const pic = image?.closest('picture') || image;

    // Column 2: Text content
    const contentCell = [];

    // Found: <div class="box-card-component_content_subtitle...">Feb 17, 2026</div>
    const date = slide.querySelector('.box-card-component_content_subtitle');
    if (date) contentCell.push(date);

    // Found: <h4 class="box-card-component_content_title...">Inside PIMCO: Andrew Balls...</h4>
    const heading = slide.querySelector('.box-card-component_content_title, h4, h3');
    if (heading) contentCell.push(heading);

    // Found: <p class="box-card-component_content_desc...">In this episode...</p>
    const desc = slide.querySelector('.box-card-component_content_desc');
    if (desc) contentCell.push(desc);

    // Add link
    if (href && href !== '#') {
      const a = document.createElement('a');
      a.href = href;
      a.textContent = 'Listen Now';
      contentCell.push(a);
    }

    if (pic || contentCell.length) {
      cells.push([pic || '', contentCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel', cells });
  element.replaceWith(block);
}
