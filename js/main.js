// Inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar gerenciador de slides
    const slidesManager = new SlidesManager();
    
    // Inicializar editor (apenas para modo de edição)
    const slideEditor = new SlideEditor(slidesManager);
    
    // Adicionar eventos de teclado para navegação
    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowLeft':
                slidesManager.navigateSlide(-1);
                break;
            case 'ArrowRight':
                slidesManager.navigateSlide(1);
                break;
            case 'Escape':
                // Sair do modo de edição
                if (slidesManager.isEditMode) {
                    document.getElementById('presentation-mode').value = 'auto';
                    slidesManager.isEditMode = false;
                    document.body.classList.remove('edit-mode');
                    slidesManager.renderCurrentSlide();
                }
                break;
        }
    });
    
    // Atualizar métricas com dados reais
    updateDashboardMetrics();
    
    // Carregar recursos adicionais (ícones, etc.)
    loadExternalResources();
    
    console.log('Aplicação da COGEX inicializada');
});

// Atualiza as métricas do dashboard com dados reais
function updateDashboardMetrics() {
    const metrics = {
        arrecadacao: 'R$125,6M',
        crescimento: '+17%',
        serventias: '309',
        projetos: '9'
    };
    
    // Atualizar valores no dashboard
    const metricValues = document.querySelectorAll('.metric-value');
    metricValues.forEach(value => {
        const metricType = value.nextElementSibling.textContent.toLowerCase();
        
        if (metricType.includes('arrecadação')) {
            value.textContent = metrics.arrecadacao;
        } else if (metricType.includes('crescimento')) {
            value.textContent = metrics.crescimento;
        } else if (metricType.includes('serventias')) {
            value.textContent = metrics.serventias;
        } else if (metricType.includes('projetos')) {
            value.textContent = metrics.projetos;
        }
    });
}

// Carrega recursos externos (ícones, etc.)
function loadExternalResources() {
    // Aqui poderíamos carregar bibliotecas ou recursos adicionais
    console.log('Recursos externos carregados');
}
