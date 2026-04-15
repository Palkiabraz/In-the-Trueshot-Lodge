// Variables de filtres
let selectedExpansion = 'toutes';
let selectedCategory = 'tous';
let selectedType = 'tous';
let selectedRarity = 'tous';
let searchValue = '';
let attackMin = 1, attackMax = 6;
let lifeMin = 1, lifeMax = 6;

// Récupération d'éléments utilitaires
const $id = id => document.getElementById(id);
const expansionWrap = $id('expansion-dropdown-wrap');
const categoryWrap = $id('category-dropdown-wrap');
const typeWrap = $id('type-dropdown-wrap');
const rarityWrap = $id('rarity-dropdown-wrap');
const expansionBtn = $id('expansion-btn');
const categoryBtn = $id('category-btn');
const typeBtn = $id('type-btn');
const rarityBtn = $id('rarity-btn');
const expansionMenu = $id('expansion-dropdown');
const categoryMenu = $id('category-dropdown');
const typeMenu = $id('type-dropdown');
const rarityMenu = $id('rarity-dropdown');

// Helpers généraux
function setTextOrDefault(btn, selected, def) {
    if (!btn) return;
    btn.textContent = selected === 'toutes' || selected === 'tous' ? def : btn.dataset && btn.dataset.label ? btn.dataset.label : btn.textContent;
}

function setBtnTextFromAnchor(btn, selected, defaultLabel, label) {
    if (!btn) return;
    btn.textContent = (selected === 'toutes' || selected === 'tous') ? defaultLabel : label;
}

function setDisplay(el, show, displayIfTrue = 'grid') {
    if (!el) return;
    el.style.display = show ? displayIfTrue : 'none';
}

function setCardDisplay(img, show) {
    if (!img) return;
    const wrapper = img.closest('.card-wrapper');
    if (wrapper) wrapper.style.display = show ? 'flex' : 'none';
    else img.style.display = show ? 'block' : 'none';
}

function norm(s){ return normalizeStr(s); }

function getNumAttr(img, attr){
    const v = img.getAttribute(attr);
    const n = parseInt((v||'').trim(), 10);
    return isNaN(n) ? null : n;
}

function matchesRangeImg(img, attr, min, max){
    const v = getNumAttr(img, attr);
    return v === null ? (min === 1 && max === 6) : (v >= min && v <= max);
}

function matchesExpansion(img, selectedExpansion){
    if (!selectedExpansion || selectedExpansion === 'toutes') return true;
    const e = (img.dataset.expansion || '').toLowerCase();
    return e === selectedExpansion;
}

// Dropdowns: centralise l'attachement et la fermeture
const allMenus = [expansionMenu, categoryMenu, typeMenu, rarityMenu].filter(Boolean);
const wraps = [expansionWrap, categoryWrap, typeWrap, rarityWrap];

function setupDropdown(btn, menu){
    if (!btn || !menu) return;
    btn.addEventListener('click', e => {
        e.stopPropagation();
        menu.classList.toggle('active');
        allMenus.forEach(m => { if (m !== menu) m.classList.remove('active'); });
    });
}

setupDropdown(expansionBtn, expansionMenu);
setupDropdown(categoryBtn, categoryMenu);
setupDropdown(typeBtn, typeMenu);
setupDropdown(rarityBtn, rarityMenu);

// Fermer les menus si clic en dehors
document.addEventListener('click', e => {
    allMenus.forEach((m, i) => {
        const w = wraps[i];
        if (!w || !m) return;
        if (!w.contains(e.target)) m.classList.remove('active');
    });
});

function attachOptions(selector, setter, btn, defaultLabel){
    document.querySelectorAll(selector).forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const dataKeys = Object.keys(a.dataset);
            const key = dataKeys[0];
            const value = key ? a.dataset[key] : undefined;
            setter(value);
            const label = a.textContent;
            setBtnTextFromAnchor(btn, value, defaultLabel, label);
            const menu = a.closest('.dropdown');
            if (menu) menu.classList.remove('active');
            applyFilters();
        });
    });
}

function setSelectedExpansion(v){ selectedExpansion = v || 'toutes'; }
function setSelectedCategory(v){ selectedCategory = v || 'tous'; }
function setSelectedType(v){ selectedType = v || 'tous'; }
function setSelectedRarity(v){ selectedRarity = v || 'tous'; }

attachOptions('#expansion-dropdown a', setSelectedExpansion, expansionBtn, 'Ensemble de cartes');
attachOptions('#category-dropdown a', setSelectedCategory, categoryBtn, 'Catégorie de cartes');
attachOptions('#type-dropdown a', setSelectedType, typeBtn, 'Type de familiers');
attachOptions('#rarity-dropdown a', setSelectedRarity, rarityBtn, 'Rareté du familier');

// Filtres "Slider" factorisés
const attackMinInput = $id('attack-min');
const attackMaxInput = $id('attack-max');
const attackMinVal = $id('attack-min-val');
const attackMaxVal = $id('attack-max-val');
const lifeMinInput = $id('life-min');
const lifeMaxInput = $id('life-max');
const lifeMinVal = $id('life-min-val');
const lifeMaxVal = $id('life-max-val');

function setDoubleRangeBackground(wrapper, minV, maxV, minPossible = 1, maxPossible = 6) {
    if (!wrapper) return;
    const left = Math.round(((minV - minPossible) / (maxPossible - minPossible)) * 100);
    const right = Math.round(((maxV - minPossible) / (maxPossible - minPossible)) * 100);
    wrapper.style.setProperty('--left', left + '%');
    wrapper.style.setProperty('--right', right + '%');
}

function attachDoubleRange(minInput, maxInput, minValEl, maxValEl, getVals, setVals){
    if (!minInput || !maxInput) return;
    const wrapper = minInput.parentElement;
    function updateDisplay(){
        const {min, max} = getVals();
        if (minValEl) minValEl.textContent = min;
        if (maxValEl) maxValEl.textContent = max;
        setDoubleRangeBackground(wrapper, min, max);
    }
    minInput.addEventListener('input', e => {
        let v = parseInt(e.target.value, 10) || 1;
        const {min: curMin, max: curMax} = getVals();
        if (v > curMax) v = curMax;
        setVals({min: v, max: curMax});
        updateDisplay();
        applyFilters();
    });
    maxInput.addEventListener('input', e => {
        let v = parseInt(e.target.value, 10) || 6;
        const {min: curMin, max: curMax} = getVals();
        if (v < curMin) v = curMin;
        setVals({min: curMin, max: v});
        updateDisplay();
        applyFilters();
    });

    minInput.classList.remove('top');
    maxInput.classList.add('top');
    setDoubleRangeBackground(wrapper, getVals().min, getVals().max);

    wrapper.style.touchAction = 'none';
    let dragging = false, dragTarget = null;
    wrapper.addEventListener('pointerdown', e => {
        e.preventDefault();
        try { wrapper.setPointerCapture(e.pointerId); } catch (err) {}
        const rect = wrapper.getBoundingClientRect();
        const clickX = e.clientX;
        const leftPos = rect.left + ((getVals().min - 1) / (6 - 1)) * rect.width;
        const rightPos = rect.left + ((getVals().max - 1) / (6 - 1)) * rect.width;
        dragTarget = (clickX < (leftPos + rightPos) / 2) ? 'min' : 'max';
        dragging = true;
        minInput.classList.remove('top'); maxInput.classList.remove('top');
        (dragTarget === 'min' ? minInput : maxInput).classList.add('top');
        const rel = Math.min(1, Math.max(0, (clickX - rect.left) / rect.width));
        const val = Math.round(rel * (6 - 1) + 1);
        const {min: curMin, max: curMax} = getVals();
        if (dragTarget === 'min') setVals({min: Math.min(val, curMax), max: curMax});
        else setVals({min: curMin, max: Math.max(val, curMin)});
        updateDisplay();
        applyFilters();
    });
    wrapper.addEventListener('pointermove', e => {
        if (!dragging) return;
        const rect = wrapper.getBoundingClientRect();
        const rel = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
        const val = Math.round(rel * (6 - 1) + 1);
        const {min: curMin, max: curMax} = getVals();
        if (dragTarget === 'min') setVals({min: Math.min(val, curMax), max: curMax});
        else if (dragTarget === 'max') setVals({min: curMin, max: Math.max(val, curMin)});
        updateDisplay();
        applyFilters();
    });
    wrapper.addEventListener('pointerup', e => {
        dragging = false; dragTarget = null;
        try { wrapper.releasePointerCapture(e.pointerId); } catch (err) {}
        minInput.classList.remove('top'); maxInput.classList.remove('top');
    });
}

attachDoubleRange(attackMinInput, attackMaxInput, attackMinVal, attackMaxVal, () => ({min: attackMin, max: attackMax}), v => { attackMin = v.min; attackMax = v.max; if (attackMinInput) attackMinInput.value = attackMin; if (attackMaxInput) attackMaxInput.value = attackMax; });
attachDoubleRange(lifeMinInput, lifeMaxInput, lifeMinVal, lifeMaxVal, () => ({min: lifeMin, max: lifeMax}), v => { lifeMin = v.min; lifeMax = v.max; if (lifeMinInput) lifeMinInput.value = lifeMin; if (lifeMaxInput) lifeMaxInput.value = lifeMax; });

// Supprime les accents et met en minuscule 
function normalizeStr(s) {
    if (!s) return '';
    try {
        return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    } catch (e) {
        return s.replace(/[\u0300-\u036f]/g, '').toLowerCase();
    }
}

// Mots-clés supplémentaires
const extraKeywords = {
    'hound': 'arrow shot',
    'bear': 'trap',
    'fox': 'aspect',
    'rodent': 'bite sting'
};

// Bouton "Recherche"
function filterCards(value) {
    searchValue = value || '';
    applyFilters();
}

// Fonction de recherche et d'affichage des cartes
function applyFilters() {
    const familiersCatalogue = $id("familiers-catalogue");
    const armesCatalogue = $id("armes-catalogue");
    const sortsCatalogue = $id("sorts-catalogue");
    const nourritureCatalogue = $id("nourriture-catalogue");
    const familiersTitle = $id("familiers-title");
    const armesTitle = $id("armes-title");
    const sortsTitle = $id("sorts-title");
    const nourritureTitle = $id("nourriture-title");

    let effectiveCategory = selectedCategory;
    if (selectedCategory === 'tous') {
        if (selectedType !== 'tous' || selectedRarity !== 'tous') effectiveCategory = 'familiers';
        else if (attackMin !== 1 || attackMax !== 6 || lifeMin !== 1 || lifeMax !== 6) effectiveCategory = 'familiers-armes';
    }

    // Initial display selon catégorie effective
    const config = {
        'tous': {f: true, a: true, s: true, n: true},
        'familiers-armes': {f: true, a: true, s: false, n: false},
        'familiers': {f: true, a: false, s: false, n: false},
        'armes': {f: false, a: true, s: false, n: false},
        'sorts': {f: false, a: false, s: true, n: false},
        'nourriture': {f: false, a: false, s: false, n: true}
    }[effectiveCategory] || {f:true,a:true,s:true,n:true};

    if (familiersCatalogue) setDisplay(familiersCatalogue, config.f, 'grid');
    if (armesCatalogue) setDisplay(armesCatalogue, config.a, 'grid');
    if (sortsCatalogue) setDisplay(sortsCatalogue, config.s, 'grid');
    if (nourritureCatalogue) setDisplay(nourritureCatalogue, config.n, 'grid');

    const normSearch = norm(searchValue);

    function matchesName(img){
        const name = norm(img.alt);
        const extra = extraKeywords[name] || img.dataset.keywords || '';
        return name.includes(normSearch) || norm(extra).includes(normSearch);
    }

    function matchesType(img){
        if (selectedType === 'tous') return true;
        const t = (img.dataset.type || '').toLowerCase();
        return selectedType === 'aucun' ? (t === '' || t === 'aucun') : (t === selectedType);
    }

    function matchesRarity(img){
        if (selectedRarity === 'tous') return true;
        const r = (img.dataset.rarity || '').toLowerCase();
        return r === selectedRarity;
    }

    function processContainer(container, predicate, titleEl){
        if (!container || container.style.display === 'none') {
            if (titleEl) titleEl.style.display = 'none';
            if (container) setDisplay(container, false);
            return 0;
        }
        const cards = container.querySelectorAll('.catalogue-card');
        let visible = 0;
        cards.forEach(img => {
            const show = predicate(img);
            setCardDisplay(img, show);
            if (show) visible++;
        });
        if (titleEl) titleEl.style.display = visible > 0 ? 'block' : 'none';
        setDisplay(container, visible > 0, 'grid');
        return visible;
    }

    let totalVisible = 0;

    totalVisible += processContainer(familiersCatalogue, img => {
        return matchesName(img) && matchesType(img) && matchesRarity(img) && matchesExpansion(img, selectedExpansion) && matchesRangeImg(img, 'data-attack', attackMin, attackMax) && matchesRangeImg(img, 'data-life', lifeMin, lifeMax);
    }, familiersTitle);

    totalVisible += processContainer(armesCatalogue, img => {
        return matchesName(img) && matchesRangeImg(img, 'data-attack', attackMin, attackMax) && matchesRangeImg(img, 'data-life', lifeMin, lifeMax) && matchesExpansion(img, selectedExpansion);
    }, armesTitle);

    totalVisible += processContainer(sortsCatalogue, img => {
        return matchesExpansion(img, selectedExpansion) && matchesName(img);
    }, sortsTitle);

    totalVisible += processContainer(nourritureCatalogue, img => {
        return matchesExpansion(img, selectedExpansion) && matchesName(img);
    }, nourritureTitle);

    const searchResults = $id('search-results');
    if (searchResults) searchResults.textContent = totalVisible === 1 ? "1 card found using the search filters" : `${totalVisible} cards found using the search filters`;
}
applyFilters();

// Fonction de zoom et de légende des cartes
(function(){
    let current = null;

    // Noms d'extensions
    const expansionNames = {
        'core': 'Core',
        'shadowlands': 'Shadowlands',
        'rassasie_et_hydrate': 'Rassasié et Hydraté'
    };

    // Légendes d'extensions
    const extensionCaptions = {
        'core': 'Available in the base game',
        'shadowlands': 'Available in the minor expansion "Shadowlands"',
        'dire_diets': 'Available in the major expansion "Dire Diets"'
    };

    function expansionCaptionFallback(expansion){
        if (!expansion) return '';
        if (expansion === 'core') return 'Available in the base game';
        if (expansionNames[expansion]) return 'Available in the ' + expansionNames[expansion];
        const formattedExpansion = expansion.replace(/_/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        return 'Available in the ' + formattedExpansion;
    }

    function captionForImage(img){
        if (!img) return '';
        const dataCaption = (img.dataset && img.dataset.caption) ? img.dataset.caption : null;
        if (dataCaption) return dataCaption;
        const expansion = (img.dataset.expansion || '').toLowerCase();
        if (expansion && extensionCaptions[expansion]) return extensionCaptions[expansion];
        return expansionCaptionFallback(expansion);
    }

    function getBaseName(src) {
        try {
            const parts = src.split('/');
            const name = parts[parts.length-1];
            return name.split('.').slice(0, -1).join('.') || name;
        } catch (e) { return src; }
    }

    function getExtensionForImage(img) {
        let extension = img.dataset.extension || img.getAttribute('data-extension') || '';
        if (extension) return extension;
        const src = img.getAttribute('src') || img.src || '';
        const m = src.match(/Cartes\/(?:([^\/]+))/i);
        return (m && m[1]) ? m[1] : 'Fondamental';
    }

    function openZoom(img) {
        if (current) return;
        const overlay = document.createElement('div');
        overlay.className = 'catalogue-overlay active';
        const clone = img.cloneNode(true);
        clone.classList.add('zoomed');
        clone.style.maxWidth = '';
        clone.style.maxHeight = '';

        const content = document.createElement('div');
        content.className = 'overlay-content';
        content.appendChild(clone);

        const extension = getExtensionForImage(img);
        const cap = document.createElement('div');
        cap.className = 'card-caption';

        cap.textContent = captionForImage(img);
        content.appendChild(cap);

        overlay.appendChild(content);
        document.body.appendChild(overlay);

        current = { overlay, clone };

        requestAnimationFrame(()=> clone.classList.add('show'));

        function resetFromClick(e){
            e.stopPropagation();
            resetZoom();
        }

        overlay.addEventListener('click', resetFromClick);
        clone.addEventListener('click', resetFromClick);
    }

    function resetZoom(){
        if (!current) return;
        try { current.overlay.parentElement.removeChild(current.overlay); } catch(e){}
        current = null;
    }

    function ensureCaptions(root = document) {
        root.querySelectorAll('.catalogue-card').forEach(img => {
            const parent = img.parentElement;
            if (parent && parent.classList && parent.classList.contains('card-wrapper')) return;

            const wrapper = document.createElement('div');
            wrapper.className = 'card-wrapper';
            parent.replaceChild(wrapper, img);
            wrapper.appendChild(img);

            let extension = img.dataset.extension || img.getAttribute('data-extension') || '';
            if (!extension) {
                const src = img.getAttribute('src') || img.src || '';
                const m = src.match(/Cartes\/(?:([^\/]+))/i);
                extension = (m && m[1]) ? m[1] : 'Fondamental';
            }
            const cap = document.createElement('div');
            cap.className = 'card-caption';

            cap.textContent = captionForImage(img);
            wrapper.appendChild(cap);
        });
    }

    function attachHandlers(root=document){
        root.querySelectorAll('.catalogue-card').forEach(img => {
            if (img.__zoomBound) return;
            img.__zoomBound = true;
            img.addEventListener('click', (e) => {
                if (current) { resetZoom(); return; }
                openZoom(img);
            });
        });
    }

    ensureCaptions(document);
    attachHandlers(document);

    const origApply = applyFilters;
    window.applyFilters = function(){ origApply(); attachHandlers(document); };

    window.resetCatalogueZoom = resetZoom;
})();