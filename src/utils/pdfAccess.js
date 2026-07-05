export const MAX_FREE_PDF_PAGES = 5;

export function getPdfGuestAccessState({ pageNum, isAuthenticated, maxFreePages = MAX_FREE_PDF_PAGES }) {
  if (isAuthenticated) {
    return { isLocked: false, effectivePage: pageNum };
  }

  if (pageNum > maxFreePages) {
    return { isLocked: true, effectivePage: maxFreePages };
  }

  return { isLocked: false, effectivePage: pageNum };
}
