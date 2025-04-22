// Configuração e gerenciamento dos slides
class SlidesManager {
    constructor() {
        this.currentSlideIndex = 0;
        this.slides = [];
        this.isEditMode = false;
        this.slideContainer = document.getElementById('slide-container');
        this.slideCounter = document.getElementById('slide-counter');
        this.thumbnailsContainer = document.querySelector('.slide-thumbnails');
        
        // Botões de navegação
        document.getElementById('prev-slide').addEventListener('click', () => this.navigateSlide(-1));
        document.getElementById('next-slide').addEventListener('click', () => this.navigateSlide(1));
        
        // Alternar modo de edição
        document.getElementById('presentation-mode').addEventListener('change', (e) => {
            this.isEditMode = e.target.value === 'edit';
            document.body.classList.toggle('edit-mode', this.isEditMode);
            this.renderCurrentSlide();
        });
    }
    
    // Inicializa os slides a partir dos dados
    async init() {
        try {
            // Carregar dados dos slides (de um arquivo JSON ou localStorage)
            this.slides = await this.loadSlidesData();
            
            // Gerar miniaturas
            this.generateThumbnails();
            
            // Renderizar o primeiro slide
            this.renderCurrentSlide();
            
            console.log('Slides inicializados com sucesso');
        } catch (error) {
            console.error('Erro ao inicializar slides:', error);
        }
    }
    
    // Carrega os dados dos slides
    async loadSlidesData() {
        // Verificar se há dados salvos no localStorage
        const savedData = localStorage.getItem('cogex-slides');
        
        if (savedData) {
            return JSON.parse(savedData);
        }
        
        // Se não houver dados salvos, carrega do JSON padrão
        try {
            const response = await fetch('assets/data/slides.json');
            const data = await response.json();
            return data.slides;
        } catch (error) {
            console.error('Erro ao carregar dados dos slides:', error);
            return this.getDefaultSlides();
        }
    }
    
    // Slides padrão caso não seja possível carregar os dados
    getDefaultSlides() {
        return [
            {
                id: 1,
                title: "Corregedoria Geral do Foro Extrajudicial",
                subtitle: "Apresentação Institucional",
                content: "Des. José Jorge Figueiredo dos Anjos<br>Corregedor Geral do Foro Extrajudicial<br>GESTÃO 2024-2026",
                background: "slide1_bg.jpg",
                images: ["logo_cogex.png"],
                template: "cover"
            },
            // Mais slides padrão...
        ];
    }
    
    // Gera as miniaturas para navegação rápida
    generateThumbnails() {
        this.thumbnailsContainer.innerHTML = '';
        
        this.slides.forEach((slide, index) => {
            const thumb = document.createElement('div');
            thumb.classList.add('thumb');
            thumb.dataset.index = index;
            thumb.title = slide.title;
            
            // Adicionar imagem em miniatura (se disponível)
            if (slide.thumbnail) {
                thumb.style.backgroundImage = `url(${this.getAssetPath(slide.thumbnail)})`;
                thumb.style.backgroundSize = 'cover';
                thumb.style.backgroundPosition = 'center';
            } else {
                thumb.textContent = (index + 1);
            }
            
            thumb.addEventListener('click', () => {
                this.goToSlide(index);
            });
            
            this.thumbnailsContainer.appendChild(thumb);
        });
    }
    
    // Navega para um slide específico
    goToSlide(index) {
        if (index >= 0 && index < this.slides.length) {
            this.currentSlideIndex = index;
            this.renderCurrentSlide();
            this.updateThumbnailsActive();
        }
    }
    
    // Avança ou retrocede no slide atual
    navigateSlide(direction) {
        const newIndex = this.currentSlideIndex + direction;
        
        if (newIndex >= 0 && newIndex < this.slides.length) {
            this.currentSlideIndex = newIndex;
            this.renderCurrentSlide();
            this.updateThumbnailsActive();
        }
    }
    
    // Atualiza a miniatura ativa
    updateThumbnailsActive() {
        const thumbs = this.thumbnailsContainer.querySelectorAll('.thumb');
        thumbs.forEach((thumb, index) => {
            thumb.classList.toggle('active', index === this.currentSlideIndex);
        });
    }
    
    // Renderiza o slide atual
    renderCurrentSlide() {
        const slide = this.slides[this.currentSlideIndex];
        
        // Atualizar contador de slides
        this.slideCounter.textContent = `Slide ${this.currentSlideIndex + 1} de ${this.slides.length}`;
        
        // Limpar conteúdo atual
        this.slideContainer.innerHTML = '';
        
        // Criar elementos conforme o template do slide
        const slideContent = document.createElement('div');
        slideContent.classList.add('slide', `template-${slide.template}`);
        
        // Adicionar fundo (se especificado)
        if (slide.background) {
            slideContent.style.backgroundImage = `url(${this.getAssetPath(slide.background)})`;
            slideContent.style.backgroundSize = 'cover';
            slideContent.style.backgroundPosition = 'center';
        }
        
        // Criar conteúdo do slide baseado no template
        switch (slide.template) {
            case 'cover':
                this.createCoverSlide(slideContent, slide);
                break;
            case 'content':
                this.createContentSlide(slideContent, slide);
                break;
            case 'split':
                this.createSplitSlide(slideContent, slide);
                break;
            case 'gallery':
                this.createGallerySlide(slideContent, slide);
                break;
            case 'data':
                this.createDataSlide(slideContent, slide);
                break;
            default:
                this.createDefaultSlide(slideContent, slide);
        }
        
        // Adicionar à área de visualização
        this.slideContainer.appendChild(slideContent);
        
        // Aplicar animação de entrada
        slideContent.classList.add('animate-fadeIn');
    }
    
    // Cria um slide de capa
    createCoverSlide(container, slideData) {
        const titleEl = this.createEditableElement('h1', slideData.title, 'slide-title');
        const subtitleEl = this.createEditableElement('h2', slideData.subtitle, 'slide-subtitle');
        const contentEl = this.createEditableElement('div', slideData.content, 'slide-content');
        
        container.appendChild(titleEl);
        container.appendChild(subtitleEl);
        container.appendChild(contentEl);
        
        // Adicionar imagens
        if (slideData.images && slideData.images.length > 0) {
            const imageContainer = document.createElement('div');
            imageContainer.classList.add('slide-images');
            
            slideData.images.forEach(img => {
                const imgEl = document.createElement('img');
                imgEl.src = this.getAssetPath(img);
                imgEl.alt = slideData.title;
                imgEl.classList.add('slide-image');
                
                if (this.isEditMode) {
                    this.makeImageDraggable(imgEl);
                }
                
                imageContainer.appendChild(imgEl);
            });
            
            container.appendChild(imageContainer);
        }
        
        // Adicionar área para soltar imagens no modo de edição
        if (this.isEditMode) {
            this.addImageDropzone(container);
        }
    }
    
    // Método auxiliar para criar elementos editáveis
    createEditableElement(tag, content, className) {
        const element = document.createElement(tag);
        element.innerHTML = content;
        element.classList.add(className);
        
        if (this.isEditMode) {
            element.classList.add('editable');
            element.setAttribute('contenteditable', 'true');
            element.addEventListener('blur', () => {
                // Salvar alterações quando o usuário terminar de editar
                this.saveSlideChanges();
            });
        }
        
        return element;
    }
    
    // Métodos para outros templates de slide seriam implementados aqui...
    createContentSlide(container, slideData) {
        // Implementação do template de conteúdo...
    }
    
    createSplitSlide(container, slideData) {
        // Implementação do template dividido...
    }
    
    createGallerySlide(container, slideData) {
        // Implementação do template de galeria...
    }
    
    createDataSlide(container, slideData) {
        // Implementação do template de dados/gráficos...
    }
    
    createDefaultSlide(container, slideData) {
        // Implementação do template padrão...
    }
    
    // Adiciona funcionalidade de arrastar e soltar para imagens
    makeImageDraggable(imageElement) {
        imageElement.draggable = true;
        
        imageElement.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', e.target.src);
            e.target.classList.add('dragging');
        });
        
        imageElement.addEventListener('dragend', (e) => {
            e.target.classList.remove('dragging');
        });
    }
    
    // Adiciona área para soltar imagens
    addImageDropzone(container) {
        const dropzone = document.createElement('div');
        dropzone.classList.add('image-dropzone');
        dropzone.textContent = 'Arraste e solte imagens aqui';
        
        // Eventos de arrastar e soltar
        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.classList.add('dragover');
        });
        
        dropzone.addEventListener('dragleave', () => {
            dropzone.classList.remove('dragover');
        });
        
        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.classList.remove('dragover');
            
            const imgSrc = e.dataTransfer.getData('text/plain');
            if (imgSrc) {
                // Extrair o nome do arquivo da URL
                const fileName = imgSrc.split('/').pop();
                
                // Adicionar a imagem ao slide atual
                const currentSlide = this.slides[this.currentSlideIndex];
                if (!currentSlide.images) {
                    currentSlide.images = [];
                }
                
                // Evitar duplicatas
                if (!currentSlide.images.includes(fileName)) {
                    currentSlide.images.push(fileName);
                    this.saveSlideChanges();
                    this.renderCurrentSlide();
                }
            }
        });
        
        container.appendChild(dropzone);
    }
    
    // Salva as alterações nos slides no localStorage
    saveSlideChanges() {
        // Capturar os valores atualizados dos elementos editáveis
        const titleEl = this.slideContainer.querySelector('.slide-title');
        const subtitleEl = this.slideContainer.querySelector('.slide-subtitle');
        const contentEl = this.slideContainer.querySelector('.slide-content');
        
        if (titleEl && subtitleEl && contentEl) {
            const currentSlide = this.slides[this.currentSlideIndex];
            
            currentSlide.title = titleEl.innerHTML;
            currentSlide.subtitle = subtitleEl.innerHTML;
            currentSlide.content = contentEl.innerHTML;
            
            // Salvar no localStorage
            localStorage.setItem('cogex-slides', JSON.stringify(this.slides));
            console.log('Alterações salvas');
        }
    }
    
    // Retorna o caminho para um asset
    getAssetPath(fileName) {
        // Você pode ajustar isso para apontar para seu repositório GitHub
        return `https://raw.githubusercontent.com/seu-usuario/seu-repo/main/assets/img/${fileName}`;
    }
}

// Inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    const slidesManager = new SlidesManager();
    slidesManager.init();
    
    // Expor para uso global
    window.slidesManager = slidesManager;
});
