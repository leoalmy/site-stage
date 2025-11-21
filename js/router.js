// Configuration
const CONFIG = {
    folder: 'view/',   // Ton dossier où sont les fichiers
    extension: '.html', // L'extension des fichiers
    defaultPage: 'home' // La page d'accueil par défaut
};

function router() {
    let pageName = window.location.hash.slice(1);

    if (!pageName) {
        pageName = CONFIG.defaultPage;
    }

    const filePath = CONFIG.folder + pageName + CONFIG.extension;

    loadPage(filePath, pageName);
}

function loadPage(url, pageNameForError) {
    const mainContent = document.querySelector('main');
    
    mainContent.style.opacity = '0.3';

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
                if (typeof initScrollAnimations === "function") {
                    initScrollAnimations();
                }
            }, 50);
        })
        .catch(error => {
            console.error("Erreur chargement:", error);
            
            let displayName = pageNameForError.charAt(0).toUpperCase() + pageNameForError.slice(1);

            mainContent.innerHTML = `
                <div style="text-align:center; padding:80px 20px;">
                    <h1 style="color:#e74c3c;">Oups !</h1>
                    <p>La page <strong>${displayName}</strong> est introuvable.</p>
                    <a href="#home" style="color:#1abc9c; text-decoration:none; border-bottom:1px solid #1abc9c;">Retour à l'accueil</a>
                </div>
            `;
            mainContent.style.opacity = '1';
        });
}

// Écouteurs
window.addEventListener('DOMContentLoaded', router);
window.addEventListener('hashchange', router);