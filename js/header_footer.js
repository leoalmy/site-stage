document.addEventListener("DOMContentLoaded", () => {
    const includes = document.querySelectorAll('[data-include]');
    
    includes.forEach(el => {
        const file = el.getAttribute('data-include');
        
        fetch(file)
            .then(resp => {
                if (resp.ok) return resp.text();
                throw new Error('Erreur chargement');
            })
            .then(data => {
                el.innerHTML = data;

                if (file.includes('header.html')) {
                    initBurgerMenu();
                }
            })
            .catch(err => console.error(`Erreur lors du chargement de ${file} :`, err));
    });
});

function initBurgerMenu() {
    const burgerBtn = document.getElementById('burgerBtn');
    const navMenu = document.getElementById('navMenu');

    if (burgerBtn && navMenu) {
        burgerBtn.addEventListener('click', () => {
            burgerBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        document.querySelectorAll('.menu a').forEach(link => {
            link.addEventListener('click', () => {
                burgerBtn.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}