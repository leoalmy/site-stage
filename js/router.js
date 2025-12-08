const CONFIG = {
    folder: 'view/',
    extension: '.html',
    defaultPage: 'home'
};

function router() {
    let pageName = window.location.hash.slice(1);

    if (!pageName) {
        pageName = CONFIG.defaultPage;
    }

    loadPageCSS(pageName);

    const mainElement = document.querySelector('main');
    if (pageName === 'home') {
        mainElement.classList.add('full-width');
    } else {
        mainElement.classList.remove('full-width');
    }

    const filePath = CONFIG.folder + pageName + CONFIG.extension;

    loadPageHTML(filePath, pageName);

    if (document.querySelector('header .nav')) {
    updateMenuState();
    } else {
        document.addEventListener('menuReady', updateMenuState); 
    }
}

function updateMenuState() {
    const currentHash = window.location.hash || '#' + CONFIG.defaultPage;

    const allLinks = document.querySelectorAll('header .nav-link, header .dropdown-item');
    allLinks.forEach(link => {
        link.classList.remove('active');
        if(link.classList.contains('dropdown-toggle')) {
             link.classList.remove('active');
        }
    });

    const activeLink = document.querySelector(`#navMenu a[href="${currentHash}"]`);

    if (activeLink) {
        activeLink.classList.add('active');

        const mobileTitle = document.getElementById('mobileTitle');
        if (mobileTitle) {
            mobileTitle.innerText = activeLink.innerText;
        }

        if (activeLink.classList.contains('dropdown-item')) {
            const parentDropdown = activeLink.closest('.nav-item.dropdown');
            
            if (parentDropdown) {
                const parentToggle = parentDropdown.querySelector('.dropdown-toggle');
                if (parentToggle) {
                    parentToggle.classList.add('active');
                }
            }
        }
    }
}

//Fonction de chargement du CSS du contenu
function loadPageCSS(pageName) {
    const head = document.getElementsByTagName('head')[0];
    const newCssPath = `style/${pageName}.css`;
    const existingCssId = 'page-specific-css';
    
    const oldLink = document.getElementById(existingCssId);
    if (oldLink) {
        oldLink.remove();
    }
    
    fetch(newCssPath, { method: 'HEAD' })
        .then(response => {
            if (response.ok) {
                const newLink = document.createElement('link');
                newLink.rel = 'stylesheet';
                newLink.type = 'text/css';
                newLink.href = newCssPath;
                newLink.id = existingCssId;
                
                head.appendChild(newLink);
            }
        })
        .catch(error => {
        });
}

// Fonction de chargement du contenu
function loadPageHTML(url, pageNameForError) {
    const mainContent = document.querySelector('main');
    const loader = document.getElementById('page-loader');
    
    if (loader) loader.classList.add('active');
    mainContent.style.opacity = '0';

    fetch(url)
        .then(response => {
            if (response.ok) return response.text();
            throw new Error(`Page introuvable`);
        })
        .then(html => {
            mainContent.innerHTML = html;
            window.scrollTo(0, 0);

            setTimeout(() => {
                mainContent.style.opacity = '1';
                
                if (loader) loader.classList.remove('active');
                
                if (typeof initScrollAnimations === "function") {
                    initScrollAnimations();
                }
            }, 300);
        })
        .catch(error => {
            console.error("Erreur chargement:", error);
            
            if (loader) loader.classList.remove('active'); 
            
            let displayName = pageNameForError ? pageNameForError.charAt(0).toUpperCase() + pageNameForError.slice(1) : "Inconnue";

            mainContent.innerHTML = `
                <div style="text-align:center; padding:80px 20px;">
                    <h1 style="color:#e74c3c;">Oups !</h1>
                    <p>La page <strong>${displayName}</strong> est introuvable.</p>
                    <a href="#home" style="color:#D63085; text-decoration:none; border-bottom:1px solid #D63085;">Retour à l'accueil</a>
                </div>
            `;
            mainContent.style.opacity = '1';
        });
}

window.addEventListener('DOMContentLoaded', router);
window.addEventListener('hashchange', router);