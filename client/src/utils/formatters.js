/**
 * UI formatting utilities for MemoryMap.
 */

export function formatDate(dateString) {
  if (!dateString) return 'Recent';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch (e) {
    return dateString;
  }
}

export function truncateText(text, maxLength = 100) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function getFileTypeBadgeClass(type) {
  switch ((type || '').toUpperCase()) {
    case 'PDF':
      return 'bg-red-500/10 text-red-400 border-red-500/20';
    case 'PPT':
    case 'PPTX':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case 'NOTES':
    case 'TEXT':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    case 'URL':
    case 'WEB':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    default:
      return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
  }
}
