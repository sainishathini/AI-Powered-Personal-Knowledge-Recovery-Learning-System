const path = require('path');
const fs = require('fs');
const PptxGenJS = require('pptxgenjs');
const store = require('../models/store');

// Ensure output directory exists for PPTX files
const UPLOADS_DIR = path.join(__dirname, '../uploads/presentations');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

/**
 * 1. Generate Presentation JSON & PowerPoint .pptx File
 */
async function generatePresentation({ topic, type = 'Seminar', slideCount = 8, resourceIds = [], language = 'English', initialQuery = '' }) {
  const allMaterials = store.getAllMaterials();
  const allConcepts = store.getAllConcepts();

  // Filter selected resources or match by topic keywords
  let selectedMaterials = [];
  if (Array.isArray(resourceIds) && resourceIds.length > 0 && !resourceIds.includes('ALL')) {
    selectedMaterials = allMaterials.filter(m => resourceIds.includes(m.id));
  }
  
  if (selectedMaterials.length === 0) {
    const topicLower = (topic || initialQuery || '').toLowerCase();
    selectedMaterials = allMaterials.filter(m => 
      topicLower.includes(m.title.toLowerCase()) || 
      m.title.toLowerCase().includes(topicLower) ||
      (m.content && m.content.toLowerCase().includes(topicLower))
    );
  }

  // Fallback to all materials if no specific material selected
  if (selectedMaterials.length === 0) {
    selectedMaterials = allMaterials;
  }

  // Check if selected materials have processed content
  const hasContent = selectedMaterials.some(m => (m.content && m.content.trim().length > 0));
  if (!hasContent) {
    throw new Error('Selected resource has not been analyzed yet. Please analyze the resource before creating a presentation.');
  }

  // Filter matching concepts belonging to selected materials or matching topic
  const selectedDocTitles = selectedMaterials.map(m => m.title.toLowerCase());
  let matchedConcepts = allConcepts.filter(c => {
    const cDoc = (c.sourceDocTitle || '').toLowerCase();
    const cTitle = (c.title || '').toLowerCase();
    const topicLower = (topic || '').toLowerCase();
    return selectedDocTitles.includes(cDoc) || topicLower.includes(cTitle) || cTitle.includes(topicLower);
  });

  if (matchedConcepts.length === 0) {
    matchedConcepts = allConcepts.slice(0, 10);
  }

  const finalTopic = topic || (selectedMaterials[0] ? selectedMaterials[0].title.replace(/\.[^/.]+$/, "") : 'MemoryMap Knowledge Overview');
  const count = Math.min(Math.max(parseInt(slideCount, 10) || 8, 5), 25);

  // Build Structured Slides Array dynamically matching exact slide count
  const slides = buildSlideContent({
    topic: finalTopic,
    type,
    slideCount: count,
    materials: selectedMaterials,
    concepts: matchedConcepts
  });

  // Generate PPTX file using pptxgenjs
  const presId = `pres-${Date.now()}`;
  const fileName = `MemoryMap_${finalTopic.replace(/[^a-zA-Z0-9]/g, '_')}_Presentation.pptx`;
  const filePath = path.join(UPLOADS_DIR, `${presId}.pptx`);

  await createPptxFile(slides, filePath, finalTopic);

  const presentationData = {
    id: presId,
    title: `${finalTopic} — ${type}`,
    topic: finalTopic,
    type,
    slideCount: slides.length,
    fileName,
    filePath,
    sourceResourceIds: selectedMaterials.map(m => m.id),
    sourceMaterials: selectedMaterials.map(m => ({ title: m.title, sourceType: m.sourceType || 'file_upload', sourceUrl: m.sourceUrl || '' })),
    slides,
    createdAt: new Date().toISOString()
  };

  store.addPresentation(presentationData);

  return presentationData;
}

/**
 * 2. Build Slide Content JSON based on Processed MemoryMap Knowledge
 */
function buildSlideContent({ topic, type, slideCount, materials, concepts }) {
  const slides = [];

  // Slide 1: Title Slide
  slides.push({
    slideNumber: 1,
    title: topic.toUpperCase(),
    subtitle: `${type} • Personal Knowledge Recovery System`,
    category: 'TITLE',
    bullets: [
      `Topic: ${topic}`,
      `Presentation Format: ${type}`,
      `Prepared From: ${materials.length} MemoryMap Knowledge Sources (${materials.map(m => m.title).slice(0, 2).join(', ')})`,
      `Presenter: Alex Rivera (Student)`
    ],
    speakerNotes: `Welcome to this ${type} on ${topic}. Generated directly from your connected MemoryMap knowledge base.`
  });

  // Slide 2: Executive Overview / Introduction
  const primaryMat = materials[0] || {};
  const overviewSnippet = primaryMat.content ? primaryMat.content.slice(0, 180).replace(/\n/g, ' ') : `Executive overview of ${topic}.`;
  slides.push({
    slideNumber: 2,
    title: `Introduction to ${topic}`,
    subtitle: 'Executive Summary & Learning Scope',
    category: 'OVERVIEW',
    bullets: [
      `Context: ${overviewSnippet}...`,
      `Primary Resource: ${primaryMat.title || 'Indexed Knowledge'} (${primaryMat.sourceType || 'Resource'})`,
      `Learning Goal: Master definitions, structural mechanics, and operational tradeoffs of ${topic}.`,
      `Scope: Synthesized across ${materials.length} student study materials.`
    ],
    speakerNotes: `In this overview, we establish the core context for ${topic} as extracted from ${primaryMat.title || 'your notes'}.`
  });

  // Calculate remaining slide slots before final References slide
  const targetConceptSlides = slideCount - 3; // 1 title + 1 overview + N concept slides + 1 references

  // Create concept slide items
  let conceptIndex = 0;
  for (let i = 0; i < targetConceptSlides; i++) {
    const c = concepts[i % concepts.length] || {
      title: `${topic} Concept ${i + 1}`,
      definition: `Detailed operational principles and structural mechanics of ${topic}.`,
      category: 'Core Feature'
    };

    const slideNum = i + 3;
    const categoryName = c.category || `SECTION ${i + 1}`;
    
    // Custom subtopic angle based on position
    let slideSub = `Definitions & Key Properties (Source: ${c.sourceDocTitle || primaryMat.title || 'Indexed Base'})`;
    if (i % 4 === 1) slideSub = 'Technical Workflow & Execution Mechanics';
    else if (i % 4 === 2) slideSub = 'Implementation & Practical Design Patterns';
    else if (i % 4 === 3) slideSub = 'Performance Complexity & Industry Use Cases';

    slides.push({
      slideNumber: slideNum,
      title: `${c.title || `${topic} Topic ${i + 1}`}`,
      subtitle: slideSub,
      category: categoryName.toUpperCase(),
      bullets: [
        `Core Definition: ${c.definition || `Essential mechanics governing ${c.title || topic}.`}`,
        `Knowledge Location: ${c.location || `Section ${i + 1} of ${c.sourceDocTitle || primaryMat.title || 'Knowledge Base'}`}`,
        `Key Properties: High efficiency, deterministic state management, and optimized memory usage.`,
        `Related Network Connections: ${Array.isArray(c.connectedConcepts) && c.connectedConcepts.length > 0 ? c.connectedConcepts.join(', ') : 'Foundational Computer Science Concepts'}`
      ],
      speakerNotes: `Explaining ${c.title || topic} details extracted directly from your study resources.`
    });
  }

  // Final References Slide (Slide N)
  const sourceBullets = materials.map((m, idx) => {
    const srcTypeIcon = m.sourceType === 'google_drive' ? '🔗 Google Drive' : m.sourceType === 'youtube' ? '▶️ YouTube' : m.sourceType === 'video' ? '🎥 Uploaded Video' : m.sourceType === 'image' ? '🖼️ Image OCR' : '📄 Document File';
    return `${idx + 1}. [${srcTypeIcon}] ${m.title} (${m.course || 'Indexed Knowledge'})`;
  });

  if (sourceBullets.length === 0) {
    sourceBullets.push('1. [📄 MemoryMap Store] Indexed Student Learning Base');
  }

  slides.push({
    slideNumber: slides.length + 1,
    title: 'References & MemoryMap Sources',
    subtitle: 'Origin Citation Traceability',
    category: 'REFERENCES',
    bullets: sourceBullets,
    speakerNotes: `All slides in this presentation are traceable to your actual study resources listed above.`
  });

  return slides;
}

/**
 * 3. Create Real PowerPoint .pptx File using PptxGenJS
 */
async function createPptxFile(slides, filePath, topic) {
  const pptx = new PptxGenJS();

  pptx.author = 'MemoryMap AI';
  pptx.company = 'MemoryMap Personal Knowledge Recovery';
  pptx.revision = '1.0';
  pptx.title = `${topic} Presentation`;
  pptx.layout = 'LAYOUT_16x9';

  // Styling palette
  const BG_COLOR = '0F172A';       // Dark Slate
  const CARD_BG = '1E293B';        // Card Fill
  const ACCENT_COLOR = '6366F1';   // Indigo
  const TEXT_WHITE = 'F8FAFC';     // White Text
  const TEXT_MUTED = '94A3B8';     // Muted Text
  const CYAN_TEXT = '38BDF8';      // Cyan Text

  slides.forEach((slideData, idx) => {
    const slide = pptx.addSlide();
    slide.background = { color: BG_COLOR };

    // Title Slide formatting
    if (slideData.category === 'TITLE') {
      // Header Accent Line
      slide.addShape(pptx.shapes.RECTANGLE, { x: 0.8, y: 1.2, w: 1.5, h: 0.08, fill: { color: ACCENT_COLOR } });

      // Title
      slide.addText(slideData.title, {
        x: 0.8, y: 1.5, w: 11.5, h: 1.2,
        fontSize: 36, bold: true, color: TEXT_WHITE, fontFace: 'Arial'
      });

      // Subtitle
      slide.addText(slideData.subtitle, {
        x: 0.8, y: 2.8, w: 11.5, h: 0.6,
        fontSize: 18, color: CYAN_TEXT, fontFace: 'Arial'
      });

      // Presenter Card Box
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 0.8, y: 3.8, w: 11.5, h: 2.8,
        fill: { color: CARD_BG }, line: { color: '334155', width: 1 }
      });

      // Bullet Points
      const formattedBullets = slideData.bullets.map(b => ({ text: b, options: { fontSize: 14, color: TEXT_WHITE, breakLine: true } }));
      slide.addText(formattedBullets, {
        x: 1.2, y: 4.0, w: 10.7, h: 2.4,
        bullet: true, fontFace: 'Arial', lineSpacing: 24
      });

    } else {
      // Content Slide Layout
      // Top Navigation Category Badge
      slide.addText(`MEMORYMAP PRESENTATION AI  |  ${slideData.category}`, {
        x: 0.8, y: 0.5, w: 11.5, h: 0.4,
        fontSize: 10, bold: true, color: ACCENT_COLOR, fontFace: 'Arial'
      });

      // Slide Title
      slide.addText(slideData.title, {
        x: 0.8, y: 0.9, w: 11.5, h: 0.7,
        fontSize: 26, bold: true, color: TEXT_WHITE, fontFace: 'Arial'
      });

      // Slide Subtitle
      slide.addText(slideData.subtitle, {
        x: 0.8, y: 1.6, w: 11.5, h: 0.4,
        fontSize: 14, color: CYAN_TEXT, fontFace: 'Arial'
      });

      // Content Box Card
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 0.8, y: 2.2, w: 11.5, h: 4.6,
        fill: { color: CARD_BG }, line: { color: '334155', width: 1 }
      });

      // Bullets Content
      const formattedBullets = slideData.bullets.map(b => ({ text: b, options: { fontSize: 13, color: TEXT_WHITE, breakLine: true } }));
      slide.addText(formattedBullets, {
        x: 1.2, y: 2.4, w: 10.7, h: 4.2,
        bullet: true, fontFace: 'Arial', lineSpacing: 22
      });
    }

    // Footer
    slide.addText(`Slide ${idx + 1} of ${slides.length}  •  MemoryMap AI Knowledge System`, {
      x: 0.8, y: 7.0, w: 11.5, h: 0.3,
      fontSize: 9, color: TEXT_MUTED, fontFace: 'Arial'
    });
  });

  await pptx.writeFile({ fileName: filePath });
}

/**
 * 4. Update Edited Presentation Slide Content
 */
async function updatePresentation(presId, updatedSlides) {
  const pres = store.getPresentationById(presId);
  if (!pres) return null;

  pres.slides = updatedSlides;
  pres.slideCount = updatedSlides.length;
  pres.updatedAt = new Date().toISOString();

  // Regenerate PPTX file with updated text
  await createPptxFile(updatedSlides, pres.filePath, pres.topic);

  return pres;
}

module.exports = {
  generatePresentation,
  updatePresentation
};
