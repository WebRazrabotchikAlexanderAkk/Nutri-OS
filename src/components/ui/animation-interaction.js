// Keep pointer and keyboard pauses independent so one event cannot clear another.
export function observeAnimationInteraction(section, onPause) {
  const regions = [...section.querySelectorAll('[data-animation-pause]')];
  const hovered = new Set();
  let keyboard = true;
  let focused = section.contains(document.activeElement);
  let lastPaused;

  function sync() {
    const paused = hovered.size > 0 || focused;
    if (paused === lastPaused) return;
    lastPaused = paused;
    onPause(paused);
  }

  function enter(event) {
    if (event.pointerType === 'touch') return;
    hovered.add(event.currentTarget);
    sync();
  }

  function leave(event) {
    if (event.pointerType === 'touch') return;
    hovered.delete(event.currentTarget);
    sync();
  }

  function focusIn() {
    focused = keyboard;
    sync();
  }

  function focusOut(event) {
    focused = keyboard && section.contains(event.relatedTarget);
    sync();
  }

  function keyDown(event) {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    keyboard = true;
    focused = section.contains(document.activeElement);
    sync();
  }

  function pointerDown() {
    keyboard = false;
    focused = false;
    sync();
  }

  for (const region of regions) {
    if (window.matchMedia('(hover: hover)').matches && region.matches(':hover')) hovered.add(region);
    region.addEventListener('pointerenter', enter);
    region.addEventListener('pointerleave', leave);
    region.addEventListener('pointercancel', leave);
  }
  section.addEventListener('focusin', focusIn);
  section.addEventListener('focusout', focusOut);
  document.addEventListener('keydown', keyDown, true);
  document.addEventListener('pointerdown', pointerDown, true);
  sync();

  return () => {
    for (const region of regions) {
      region.removeEventListener('pointerenter', enter);
      region.removeEventListener('pointerleave', leave);
      region.removeEventListener('pointercancel', leave);
    }
    section.removeEventListener('focusin', focusIn);
    section.removeEventListener('focusout', focusOut);
    document.removeEventListener('keydown', keyDown, true);
    document.removeEventListener('pointerdown', pointerDown, true);
  };
}
