// Per il desktop troviamo gli elementi e leggiamo la larghezza
const navigationButton = document.querySelector('.navigation-toggle');
const navigationLabel = document.querySelector('.navigation-label');
const navigationPanel = document.querySelector('.navigation-panel');
const desktopMedia = window.matchMedia('(min-width: 1000px)');
const supportsNavigation = 'popover' in HTMLElement.prototype &&
  CSS.supports('top', 'anchor(bottom)') &&
  CSS.supports('width', 'anchor-size(width)');

// Scegliamo la modalità di navigazione al caricamento (il popover funziona già in HTML)
function updateNavigationLabel() {
  const text = navigationPanel.matches(':popover-open') ? 'Chiudi menu' : 'Apri menu';
  navigationButton.setAttribute('aria-label', text);
  navigationLabel.textContent = text;
}
function updateNavigationLayout() {
  if (desktopMedia.matches) { // Siamo su desktop, disattiva il popover!
    navigationButton.removeAttribute('popovertarget');
    navigationPanel.removeAttribute('popover');
    navigationButton.hidden = true;
  } else { // Non siamo su desktop, riattiva il popover!
    navigationPanel.setAttribute('popover', 'auto');
    navigationButton.setAttribute('popovertarget', navigationPanel.id);
    navigationButton.hidden = false;
  }
  updateNavigationLabel();
}
if (supportsNavigation) {
  navigationPanel.addEventListener('toggle', updateNavigationLabel);
  updateNavigationLayout();
} else {
  // Qui si può eventualmente inserire un ripiego per i browser privi delle funzionalità richieste.
  navigationButton.removeAttribute('popovertarget');
  navigationPanel.removeAttribute('popover');
  navigationButton.hidden = true;
}

// Chiudiamo il popover se clicchiamo fuori (ad eccezione di alcuni casi) e lasciamo al link HTML la navigazione al capitolo
navigationPanel.addEventListener('click', function (event) {
  const link = event.target.closest('a[href^="#"]');
  if (!link || event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  const target = document.getElementById(link.hash.slice(1));
  if (!target) return;
  if (supportsNavigation && navigationPanel.matches(':popover-open')) navigationPanel.hidePopover();
  // Il link continua ad aggiornare il frammento e a scorrere con il comportamento HTML.
});
document.querySelector('.skip-link').addEventListener('click', function () {
  document.querySelector('#top').focus();
});

// Bonus accessibilità: se cambia il breakpoint, manteniamo il focus dove serve
desktopMedia.addEventListener('change', function () {
  if (!supportsNavigation) return;
  const focused = document.activeElement;
  const focusInNavigation = navigationPanel.contains(focused);
  const focusOnButton = focused === navigationButton;
  updateNavigationLayout();
  if (desktopMedia.matches && focusInNavigation) focused.focus();
  else if (desktopMedia.matches && focusOnButton) navigationPanel.querySelector('a').focus();
  else if (!desktopMedia.matches && focusInNavigation) navigationButton.focus();
});


/* CODICE JAVASCRIPT PER BREAKDOWN */

/* Passo 1 */
const breakdownTabs = document.querySelector(".breakdownTabs");
const breakdownTabsItems = document.querySelectorAll(".breakdownTabs-item");
const breakdownTabsButton = document.querySelectorAll(".breakdownTabs-button");

/* Passo 2 */

breakdownTabs.classList.add("breakdownTabs-ready");

/* Passo 2.5 - considero e verifico la media query mobile */
const mobilequery = window.matchMedia('(max-width: 999px)'); /* da cambiare quando risolvo problema breakpoint */

/* Passo 3 */

function selectBreakdownTabs(selectedIndex) {
  for (let i = 0; i < breakdownTabsItems.length; i++) {
    let element = breakdownTabsButton[i];
    let toggle = breakdownTabsItems[i].querySelector('.breakdownTabs-toggle');
    
    const isSelected = i === selectedIndex;

    if (i === selectedIndex) {
      breakdownTabsItems[i].classList.add('is-selected'); /* QUANDO E' CLICCATO */
      element.style.color = 'var(--color-black)'; /* cambia il colore in nero quando è cliccata la scheda */
      toggle.style.transform = 'rotate(180deg)';/* gira il triangolino di 180 gradi */
    }

    else {
      breakdownTabsItems[i].classList.remove('is-selected'); /* QUANDO NON E' CLICCATO... */
      element.style.color = 'var(--color-muted)'; /* cambia il colore in "disabled" quando non è cliccato */
      toggle.style.transform = 'rotate(0deg)'; /* gira il triangolino a come era prima */
    }

    if(mobilequery.matches){ /* se la query e' true */
      element.style.color = 'var(--color-black)';
    }

    else if (isSelected){ /* se la condizione seleziona la scheda */
      element.style.color = 'var(--color-black)'; /* DESKTOP: DOVREBBE FARE I TITOLI NERI */
     
    }

    else if (!isSelected) {
      element.style.color = 'var(--color-muted)'; /* DESKTOP NON SELEZIONATI GRIGI*/
    }
  }
}

/* Passo 4 */
for (let i = 0; i < breakdownTabsButton.length; i++) {
  breakdownTabsButton[i].addEventListener('click', function() {
    selectBreakdownTabs(i);
  });
}



/* Passo 5: aggiorno i colori quando cambia la media query */
mobilequery.addEventListener('change', function() {
  
  const selectedItem = document.querySelector(
    '.breakdownTabs-item.is-selected'
  );
  
  
  const selectedIndex = Array.from(breakdownTabsItems).indexOf(selectedItem);
  
  selectBreakdownTabs(selectedIndex);
  
});

selectBreakdownTabs(0); /* Permette di quando si carica la pagina di partire con la prima scheda cliccata */

/* COMMENTO DELL' AI CHE VORREI APPROFONDIRE:

4. Ci sono problemi di prestazioni?

Nel tuo progetto, con tre schede, il costo è praticamente trascurabile.
window.matchMedia() è uno strumento nativo del browser e verificare .matches è un'operazione molto leggera. Non stai creando un processo pesante né ricaricando la pagina.
L'unica accortezza è non aggiungere inutilmente molti ascoltatori resize o change: nel tuo caso ne basta uno per gestire il passaggio tra mobile e desktop.
Il mio consiglio finale
Per il tuo accordion, continuerei tranquillamente con JavaScript, dato che vuoi mantenere la logica che hai già sviluppato. Assicurati soltanto che lo script venga eseguito dopo che gli elementi HTML delle schede sono stati caricati, ad esempio posizionandolo prima della chiusura di </body> oppure usando defer se si trova in un file esterno.
Così eviti che querySelectorAll() venga eseguito prima che i titoli esistano nel DOM.

*/