/* Standalone-harness navigation opt-in. The composition owns all scene motion. */
(async function () {
  await Promise.all([
    customElements.whenDefined('hyperframes-player'),
    customElements.whenDefined('hyperframes-slideshow')
  ]);
  const deck = document.querySelector('hyperframes-slideshow');
  const player = deck.querySelector('hyperframes-player');
  let wiredFrame = null;
  function wireFrame() {
    const frame = player.iframeElement;
    if (!frame || frame === wiredFrame) return;
    wiredFrame = frame;
    function enableNavigationMotion() {
      try {
        frame.contentWindow.__hfCameraTransitionsEnabled = true;
      } catch (error) {
        console.warn('Standalone motion requires a same-origin composition.', error);
      }
    }
    frame.addEventListener('load', enableNavigationMotion);
    enableNavigationMotion();
  }
  wireFrame();
  new MutationObserver(wireFrame).observe(player, { childList: true, subtree: true });
  deck.focus({ preventScroll: true });
})();
