// Variables de filtres
let selectedExpansion = 'toutes';
let selectedCategory = 'tous';
let selectedType = 'tous';
let selectedRarity = 'tous';
let searchValue = '';
let attackMin = 1, attackMax = 6;
let lifeMin = 1, lifeMax = 6;

// Récupération des éléments HTML & CSS 
const expansionWrap = document.getElementById('expansion-dropdown-wrap');
const expansionBtn = document.getElementById('expansion-btn');
const expansionMenu = document.getElementById('expansion-dropdown');
const categoryWrap = document.getElementById('category-dropdown-wrap');
const categoryBtn = document.getElementById('category-btn');
const categoryMenu = document.getElementById('category-dropdown');
const typeWrap = document.getElementById('type-dropdown-wrap');
const typeBtn = document.getElementById('type-btn');
const typeMenu = document.getElementById('type-dropdown');	
const rarityWrap = document.getElementById('rarity-dropdown-wrap');
const rarityBtn = document.getElementById('rarity-btn');
const rarityMenu = document.getElementById('rarity-dropdown');

// Filtres "Dropdown"
expansionBtn.addEventListener('click', (e) => {
	e.stopPropagation();
	expansionMenu.classList.toggle('active');
	categoryMenu.classList.remove('active');
	typeMenu.classList.remove('active');
	rarityMenu.classList.remove('active');
});
categoryBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    categoryMenu.classList.toggle('active');
    typeMenu.classList.remove('active');
    rarityMenu.classList.remove('active');
});
typeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    typeMenu.classList.toggle('active');
    categoryMenu.classList.remove('active');
    rarityMenu.classList.remove('active');
});
rarityBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    rarityMenu.classList.toggle('active');
    categoryMenu.classList.remove('active');
    typeMenu.classList.remove('active');
});

// Choix d'un option de filtrage
document.querySelectorAll('#expansion-dropdown a').forEach(a => {
	a.addEventListener('click', (e) => {
		e.preventDefault();
		selectedExpansion = a.dataset.expansion;
		const label = a.textContent;

		expansionBtn.textContent =
			selectedExpansion === 'toutes'
			? 'Set of Cards'
			: `${label}`;

		expansionMenu.classList.remove('active');
		applyFilters();
	});
});
document.querySelectorAll('#category-dropdown a').forEach(a => {
    a.addEventListener('click', (e) => {
        e.preventDefault();
        selectedCategory = a.dataset.category;
        const label = a.textContent;
        categoryBtn.textContent = selectedCategory === 'tous' ? 'Card Category' : `${label}`;
        categoryMenu.classList.remove('active');
        applyFilters();
    });
});
document.querySelectorAll('#type-dropdown a').forEach(a => {
    a.addEventListener('click', (e) => {
        e.preventDefault();
        selectedType = a.dataset.type;
        const label = a.textContent;
        typeBtn.textContent = selectedType === 'tous' ? 'Pet Type' : `${label}`;
        typeMenu.classList.remove('active');
        applyFilters();
    });
});
document.querySelectorAll('#rarity-dropdown a').forEach(a => {
    a.addEventListener('click', (e) => {
        e.preventDefault();
        selectedRarity = a.dataset.rarity;
        const label = a.textContent;
        rarityBtn.textContent = selectedRarity === 'tous' ? 'Pet Rarity' : `${label}`;
        rarityMenu.classList.remove('active');
        applyFilters();
    });
});

// Fermeture automatique du menu "Dropdown" 
document.addEventListener('click', (e) => {
    if (!categoryWrap.contains(e.target)) categoryMenu.classList.remove('active');
    if (!typeWrap.contains(e.target)) typeMenu.classList.remove('active');
    if (!rarityWrap.contains(e.target)) rarityMenu.classList.remove('active');
    if (!expansionWrap.contains(e.target)) expansionMenu.classList.remove('active');
});

// Filtres "Slider"
const attackMinInput = document.getElementById('attack-min');
const attackMaxInput = document.getElementById('attack-max');
const attackMinVal = document.getElementById('attack-min-val');
const attackMaxVal = document.getElementById('attack-max-val');

const lifeMinInput = document.getElementById('life-min');
const lifeMaxInput = document.getElementById('life-max');
const lifeMinVal = document.getElementById('life-min-val');
const lifeMaxVal = document.getElementById('life-max-val');

function setDoubleRangeBackground(wrapper, minV, maxV, minPossible = 1, maxPossible = 6) {
    if (!wrapper) return;
    const left = Math.round(((minV - minPossible) / (maxPossible - minPossible)) * 100);
    const right = Math.round(((maxV - minPossible) / (maxPossible - minPossible)) * 100);
    wrapper.style.setProperty('--left', left + '%');
    wrapper.style.setProperty('--right', right + '%');
}

if (attackMinInput && attackMaxInput) {
    attackMinInput.addEventListener('input', (e) => {
        attackMin = parseInt(e.target.value, 10) || 1;
        if (attackMin > attackMax) { attackMax = attackMin; attackMaxInput.value = attackMax; attackMaxVal.textContent = attackMax; }
        attackMinVal.textContent = attackMin;
        setDoubleRangeBackground(attackMinInput.parentElement, attackMin, attackMax);
        applyFilters();
    });
    attackMaxInput.addEventListener('input', (e) => {
        attackMax = parseInt(e.target.value, 10) || 6;
        if (attackMax < attackMin) { attackMin = attackMax; attackMinInput.value = attackMin; attackMinVal.textContent = attackMin; }
        attackMaxVal.textContent = attackMax;
        setDoubleRangeBackground(attackMinInput.parentElement, attackMin, attackMax);
        applyFilters();
    });
}

if (lifeMinInput && lifeMaxInput) {
    lifeMinInput.addEventListener('input', (e) => {
        lifeMin = parseInt(e.target.value, 10) || 1;
        if (lifeMin > lifeMax) { lifeMax = lifeMin; lifeMaxInput.value = lifeMax; lifeMaxVal.textContent = lifeMax; }
        lifeMinVal.textContent = lifeMin;
        setDoubleRangeBackground(lifeMinInput.parentElement, lifeMin, lifeMax);
        applyFilters();
    });
    lifeMaxInput.addEventListener('input', (e) => {
        lifeMax = parseInt(e.target.value, 10) || 6;
        if (lifeMax < lifeMin) { lifeMin = lifeMax; lifeMinInput.value = lifeMin; lifeMinVal.textContent = lifeMin; }
        lifeMaxVal.textContent = lifeMax;
        setDoubleRangeBackground(lifeMinInput.parentElement, lifeMin, lifeMax);
        applyFilters();
    });
}

if (attackMinInput && attackMaxInput) {
    attackMinInput.classList.remove('top');
    attackMaxInput.classList.add('top');
    setDoubleRangeBackground(attackMinInput.parentElement, attackMin, attackMax);
}
if (lifeMinInput && lifeMaxInput) {
    lifeMinInput.classList.remove('top');
    lifeMaxInput.classList.add('top');
    setDoubleRangeBackground(lifeMinInput.parentElement, lifeMin, lifeMax);
}

if (attackMinInput && attackMaxInput) {
    const attackWrapper = attackMinInput.parentElement;
    attackWrapper.addEventListener('pointerdown', (e) => {
        const rect = attackWrapper.getBoundingClientRect();
        const clickX = e.clientX;
        const leftPos = rect.left + ((attackMin - 1) / (6 - 1)) * rect.width;
        const rightPos = rect.left + ((attackMax - 1) / (6 - 1)) * rect.width;
        const mid = (leftPos + rightPos) / 2;
        const target = clickX < mid ? attackMinInput : attackMaxInput;
        attackMinInput.classList.remove('top');
        attackMaxInput.classList.remove('top');
        target.classList.add('top');
    }, { capture: true });
}
if (lifeMinInput && lifeMaxInput) {
    const lifeWrapper = lifeMinInput.parentElement;
    lifeWrapper.addEventListener('pointerdown', (e) => {
        const rect = lifeWrapper.getBoundingClientRect();
        const clickX = e.clientX;
        const leftPos = rect.left + ((lifeMin - 1) / (6 - 1)) * rect.width;
        const rightPos = rect.left + ((lifeMax - 1) / (6 - 1)) * rect.width;
        const mid = (leftPos + rightPos) / 2;
        const target = clickX < mid ? lifeMinInput : lifeMaxInput;
        lifeMinInput.classList.remove('top');
        lifeMaxInput.classList.remove('top');
        target.classList.add('top');
    }, { capture: true });
}

document.addEventListener('pointerup', () => {
    if (attackMinInput && attackMaxInput) { attackMinInput.classList.remove('top'); attackMaxInput.classList.remove('top'); }
    if (lifeMinInput && lifeMaxInput) { lifeMinInput.classList.remove('top'); lifeMaxInput.classList.remove('top'); }
});

let attackDragging = false;
let attackDragTarget = null;
if (attackMinInput && attackMaxInput) {
    const wrapper = attackMinInput.parentElement;
    wrapper.style.touchAction = 'none';
    wrapper.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        wrapper.setPointerCapture(e.pointerId);
        const rect = wrapper.getBoundingClientRect();
        const clickX = e.clientX;
        const leftPos = rect.left + ((attackMin - 1) / (6 - 1)) * rect.width;
        const rightPos = rect.left + ((attackMax - 1) / (6 - 1)) * rect.width;
        attackDragTarget = (clickX < (leftPos + rightPos) / 2) ? 'min' : 'max';
        attackDragging = true;
        attackMinInput.classList.remove('top'); attackMaxInput.classList.remove('top');
        (attackDragTarget === 'min' ? attackMinInput : attackMaxInput).classList.add('top');
        const rel = Math.min(1, Math.max(0, (clickX - rect.left) / rect.width));
        const val = Math.round(rel * (6 - 1) + 1);
        if (attackDragTarget === 'min') {
            attackMin = Math.min(val, attackMax);
            attackMinInput.value = attackMin;
            attackMinVal.textContent = attackMin;
        } else {
            attackMax = Math.max(val, attackMin);
            attackMaxInput.value = attackMax;
            attackMaxVal.textContent = attackMax;
        }
        setDoubleRangeBackground(wrapper, attackMin, attackMax);
        applyFilters();
    });
    wrapper.addEventListener('pointermove', (e) => {
        if (!attackDragging) return;
        const rect = wrapper.getBoundingClientRect();
        const rel = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
        const val = Math.round(rel * (6 - 1) + 1);
        if (attackDragTarget === 'min') {
            attackMin = Math.min(val, attackMax);
            attackMinInput.value = attackMin;
            attackMinVal.textContent = attackMin;
        } else if (attackDragTarget === 'max') {
            attackMax = Math.max(val, attackMin);
            attackMaxInput.value = attackMax;
            attackMaxVal.textContent = attackMax;
        }
        setDoubleRangeBackground(wrapper, attackMin, attackMax);
        applyFilters();
    });
    wrapper.addEventListener('pointerup', (e) => {
        attackDragging = false;
        attackDragTarget = null;
        try { wrapper.releasePointerCapture(e.pointerId); } catch (err) {}
        attackMinInput.classList.remove('top'); attackMaxInput.classList.remove('top');
    });
}

let lifeDragging = false;
let lifeDragTarget = null;
if (lifeMinInput && lifeMaxInput) {
    const wrapper = lifeMinInput.parentElement;
    wrapper.style.touchAction = 'none';
    wrapper.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        wrapper.setPointerCapture(e.pointerId);
        const rect = wrapper.getBoundingClientRect();
        const clickX = e.clientX;
        const leftPos = rect.left + ((lifeMin - 1) / (6 - 1)) * rect.width;
        const rightPos = rect.left + ((lifeMax - 1) / (6 - 1)) * rect.width;
        lifeDragTarget = (clickX < (leftPos + rightPos) / 2) ? 'min' : 'max';
        lifeDragging = true;
        lifeMinInput.classList.remove('top'); lifeMaxInput.classList.remove('top');
        (lifeDragTarget === 'min' ? lifeMinInput : lifeMaxInput).classList.add('top');
        const rel = Math.min(1, Math.max(0, (clickX - rect.left) / rect.width));
        const val = Math.round(rel * (6 - 1) + 1);
        if (lifeDragTarget === 'min') {
            lifeMin = Math.min(val, lifeMax);
            lifeMinInput.value = lifeMin;
            lifeMinVal.textContent = lifeMin;
        } else {
            lifeMax = Math.max(val, lifeMin);
            lifeMaxInput.value = lifeMax;
            lifeMaxVal.textContent = lifeMax;
        }
        setDoubleRangeBackground(wrapper, lifeMin, lifeMax);
        applyFilters();
    });
    wrapper.addEventListener('pointermove', (e) => {
        if (!lifeDragging) return;
        const rect = wrapper.getBoundingClientRect();
        const rel = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
        const val = Math.round(rel * (6 - 1) + 1);
        if (lifeDragTarget === 'min') {
            lifeMin = Math.min(val, lifeMax);
            lifeMinInput.value = lifeMin;
            lifeMinVal.textContent = lifeMin;
        } else if (lifeDragTarget === 'max') {
            lifeMax = Math.max(val, lifeMin);
            lifeMaxInput.value = lifeMax;
            lifeMaxVal.textContent = lifeMax;
        }
        setDoubleRangeBackground(wrapper, lifeMin, lifeMax);
        applyFilters();
    });
    wrapper.addEventListener('pointerup', (e) => {
        lifeDragging = false;
        lifeDragTarget = null;
        try { wrapper.releasePointerCapture(e.pointerId); } catch (err) {}
        lifeMinInput.classList.remove('top'); lifeMaxInput.classList.remove('top');
    });
}
function parseAttackCondition(condition) {
    if (!condition) return null;
    const s = condition.trim();
    const m = s.match(/^(<=|>=|<|>|=)?\s*(\d+)$/);
    if (!m) return null;
    return { op: m[1] || '=', val: parseInt(m[2], 10) };
}

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
    const familiersCatalogue = document.getElementById("familiers-catalogue");
    const armesCatalogue = document.getElementById("armes-catalogue");
    const sortsCatalogue = document.getElementById("sorts-catalogue");
    const familiersTitle = document.getElementById("familiers-title");
    const armesTitle = document.getElementById("armes-title");
    const sortsTitle = document.getElementById("sorts-title");
    let effectiveCategory = selectedCategory;
    if (selectedCategory === 'tous') {
        if (selectedType !== 'tous' || selectedRarity !== 'tous') {
            effectiveCategory = 'familiers';
        } else if (attackMin !== 1 || attackMax !== 6 || lifeMin !== 1 || lifeMax !== 6) {
            effectiveCategory = 'familiers-armes';
        }
    }
    if (effectiveCategory === 'tous') {
        familiersCatalogue.style.display = "grid";
        armesCatalogue.style.display = "grid";
        sortsCatalogue.style.display = "grid";
        familiersTitle.style.display = "block";
        armesTitle.style.display = "block";
        sortsTitle.style.display = "block";
    } else if (effectiveCategory === 'familiers-armes') {
        familiersCatalogue.style.display = "grid";
        armesCatalogue.style.display = "grid";
        sortsCatalogue.style.display = "none";
        familiersTitle.style.display = "block";
        armesTitle.style.display = "block";
        sortsTitle.style.display = "none";
    } else if (effectiveCategory === 'familiers') {
        familiersCatalogue.style.display = "grid";
        armesCatalogue.style.display = "none";
        sortsCatalogue.style.display = "none";
        familiersTitle.style.display = "block";
        armesTitle.style.display = "none";
        sortsTitle.style.display = "none";
    } else if (effectiveCategory === 'armes') {
        familiersCatalogue.style.display = "none";
        armesCatalogue.style.display = "grid";
        sortsCatalogue.style.display = "none";
        familiersTitle.style.display = "none";
        armesTitle.style.display = "block";
        sortsTitle.style.display = "none";
    } else if (effectiveCategory === 'sorts') {
        familiersCatalogue.style.display = "none";
        armesCatalogue.style.display = "none";
        sortsCatalogue.style.display = "grid";
        familiersTitle.style.display = "none";
        armesTitle.style.display = "none";
        sortsTitle.style.display = "block";
    }
    let totalVisible = 0;

    // Bloc "Familiers"
    if (familiersCatalogue.style.display !== "none") {
        const cards = familiersCatalogue.querySelectorAll(".catalogue-card");
        let visible = 0;
        cards.forEach(img => {
            const normSearch = normalizeStr(searchValue);
            const cardNameNorm = normalizeStr(img.alt);
            const extra = extraKeywords[cardNameNorm] || img.dataset.keywords || '';
            const nameMatch = cardNameNorm.includes(normSearch) || normalizeStr(extra).includes(normSearch);
            let typeMatch = true;
            if (selectedType !== 'tous') {
                const t = (img.dataset.type || '').toLowerCase();
                typeMatch = (selectedType === 'aucun')
                    ? (t === '' || t === 'aucun')
                    : (t === selectedType);
            }
            let rarityMatch = true;
            if (selectedRarity !== 'tous') {
                const r = (img.dataset.rarity || '').toLowerCase();
                rarityMatch = r === selectedRarity;
            }
            let expansionMatch = true;
            if (selectedExpansion !== 'toutes') {
                const e = (img.dataset.expansion || '').toLowerCase();
                expansionMatch = e === selectedExpansion;
            }
            const atkAttr = img.getAttribute('data-attack');
            const atk = parseInt((atkAttr || '').trim(), 10);
            let attackMatch;
            if (isNaN(atk)) {
                attackMatch = (attackMin === 1 && attackMax === 6);
            } else {
                attackMatch = (atk >= attackMin && atk <= attackMax);
            }
            const lpAttr = img.getAttribute('data-life');
            const lp = parseInt((lpAttr || '').trim(), 10);
            let lifeMatch;
            if (isNaN(lp)) {
                lifeMatch = (lifeMin === 1 && lifeMax === 6);
            } else {
                lifeMatch = (lp >= lifeMin && lp <= lifeMax);
            }
            const show = nameMatch && typeMatch && rarityMatch && expansionMatch && attackMatch && lifeMatch;
            const wrapper = img.closest('.card-wrapper');
            if (wrapper) {
                wrapper.style.display = show ? 'flex' : 'none';
            } else {
                img.style.display = show ? 'block' : 'none';
            }
            if (show) visible++;
        });
        familiersTitle.style.display = visible > 0 ? "block" : "none";
        familiersCatalogue.style.display = visible > 0 ? "grid" : "none";
        totalVisible += visible;
    }

    // Bloc "Armes"
    if (armesCatalogue.style.display !== "none") {
        const cards = armesCatalogue.querySelectorAll(".catalogue-card");
        let visible = 0;
        cards.forEach(img => {
            const normSearch = normalizeStr(searchValue);
            const cardNameNorm = normalizeStr(img.alt);
            const extra = extraKeywords[cardNameNorm] || img.dataset.keywords || '';
            const nameMatch = cardNameNorm.includes(normSearch) || normalizeStr(extra).includes(normSearch);
            const atkAttr = img.getAttribute('data-attack');
            const atk = parseInt((atkAttr || '').trim(), 10);
            let attackMatch;
            if (isNaN(atk)) {
                attackMatch = (attackMin === 1 && attackMax === 6);
            } else {
                attackMatch = (atk >= attackMin && atk <= attackMax);
            }
            const lpAttr = img.getAttribute('data-life');
            const lp = parseInt((lpAttr || '').trim(), 10);
            let lifeMatch;
            if (isNaN(lp)) {
                lifeMatch = (lifeMin === 1 && lifeMax === 6);
            } else {
                lifeMatch = (lp >= lifeMin && lp <= lifeMax);
            }
            let expansionMatch = true;
            if (selectedExpansion !== 'toutes') {
                const e = (img.dataset.expansion || '').toLowerCase();
                expansionMatch = e === selectedExpansion;
            }
            const show = nameMatch && attackMatch && lifeMatch && expansionMatch;
            const wrapper = img.closest('.card-wrapper');
            if (wrapper) {
                wrapper.style.display = show ? 'flex' : 'none';
            } else {
                img.style.display = show ? 'block' : 'none';
            }
            if (show) visible++;
        });
        armesTitle.style.display = visible > 0 ? "block" : "none";
        armesCatalogue.style.display = visible > 0 ? "grid" : "none";
        totalVisible += visible;
    }

    // Bloc "Sorts"
    if (sortsCatalogue.style.display !== "none") { 
        const cards = sortsCatalogue.querySelectorAll(".catalogue-card");
        let visible = 0;

        cards.forEach(img => {
            const normSearch = normalizeStr(searchValue);
            const cardNameNorm = normalizeStr(img.alt);
            const extra = extraKeywords[cardNameNorm] || img.dataset.keywords || '';

            let expansionMatch = true;
            if (selectedExpansion !== 'toutes') {
                const e = (img.dataset.expansion || '').toLowerCase();
                expansionMatch = e === selectedExpansion;
            }

            const show =
                expansionMatch &&
                (cardNameNorm.includes(normSearch) || normalizeStr(extra).includes(normSearch));

            const wrapper = img.closest('.card-wrapper');

            if (wrapper) {
             wrapper.style.display = show ? 'flex' : 'none';
            } else {
                img.style.display = show ? 'block' : 'none';
            }

            if (show) visible++;
        });
    sortsTitle.style.display = visible > 0 ? "block" : "none";
    sortsCatalogue.style.display = visible > 0 ? "grid" : "none";
    totalVisible += visible;
}

// Compteur de résultats
    const searchResults = document.getElementById("search-results");
    searchResults.textContent = totalVisible === 1 ? "1 card found using the search filters" : `${totalVisible} cards found using the search filters`;
}
applyFilters();

// Fonction de zoom et de légende des cartes
(function(){
    let current = null;

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

        // Affiche une légende en fonction de l'extension
        const expansion = img.dataset.expansion || '';

        if (expansion === 'core') {
            cap.textContent = "Available in the base game";
        } else {
            const formattedExpansion = expansion.charAt(0).toUpperCase() + expansion.slice(1).toLowerCase();
            cap.textContent = "Available in the " + formattedExpansion + " Expansion";
        }
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

            const expansion = img.dataset.expansion || '';
            if (expansion === 'core') {
                cap.textContent = "Available in the base game";
            } else {
                const formattedExpansion = expansion.charAt(0).toUpperCase() + expansion.slice(1).toLowerCase();
                cap.textContent = "Available in the " + formattedExpansion + " Expansion";
            }
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