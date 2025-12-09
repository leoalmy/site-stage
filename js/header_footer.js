document.addEventListener("DOMContentLoaded", () => {
    const includes = document.querySelectorAll('[data-include]');
    
    includes.forEach(el => {
        const fileName = el.getAttribute('data-include');
        const file = `view/${fileName}.html`;
        
        fetch(file)
            .then(resp => {
                if (resp.ok) return resp.text();
                throw new Error('Erreur chargement');
            })
            .then(data => {
                el.innerHTML = data;

                if (fileName.includes('header')) {
                    initBurgerMenu();
                    document.dispatchEvent(new Event('menuReady'));
                }
            })
            .catch(err => console.error(`Erreur lors du chargement de ${file} :`, err));
    });
});

function initBurgerMenu() {
    const burgerBtn = document.getElementById('burgerBtn');
    const navMenu = document.getElementById('navMenu');

    if (burgerBtn && navMenu) {
        burgerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            burgerBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Gérer les clics sur les liens (sauf dropdown)
        const links = navMenu.querySelectorAll('a:not(.dropdown-toggle)');
        links.forEach(link => {
            link.addEventListener('click', () => {
                burgerBtn.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Gérer le dropdown sur mobile
        const dropdownToggle = navMenu.querySelector('.dropdown-toggle');
        if (dropdownToggle) {
            dropdownToggle.addEventListener('click', (e) => {
                // Sur mobile, prevent la fermeture et laisse Bootstrap gérer le dropdown
                if (window.innerWidth <= 610) {
                    e.stopPropagation();
                }
            });
        }

        // Gérer les clics sur les items du dropdown
        const dropdownItems = navMenu.querySelectorAll('.dropdown-item');
        dropdownItems.forEach(item => {
            item.addEventListener('click', () => {
                burgerBtn.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !burgerBtn.contains(e.target)) {
                burgerBtn.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}