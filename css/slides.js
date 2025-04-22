class SlidesManager {
    constructor() {
        this.currentSlideIndex = 0;
        this.slides = presentationData.slides;
        this.isEditMode = false;
        this.slideContainer = document.getElementById('slide-container');
        this.slideCounter = document.getElementById('slide-counter');
        this.thumbnailsContainer = document.getElementById('slide-thumbnails');
        
        // Botões de navegação
        document.getElementById('prev-slide').addEventListener('click', () => this.navigateSlide(-1));
        document.getElementById('next-slide').addEventListener('click', () => this.navigateSlide(1));
        
        // Alternar modo de edição
        document.getElementById('presentation-mode').addEventListener('change', (e) => {
            this.isEditMode = e.target.value === 'edit';
            document.body.classList.toggle('edit-mode', this.isEditMode);
            this.renderCurrentSlide();
        });

        // Inicializar
        this.init();
    }
    
    // Inicializa os slides
    init() {
        try {
            // Carregar dados salvos do localStorage, se existirem
            const savedSlides = localStorage.getItem('cogex-slides');
            if (savedSlides) {
                this.slides = JSON.parse(savedSlides);
            }
            
            // Gerar miniaturas
            this.generateThumbnails();
            
            // Renderizar o primeiro slide
            this.renderCurrentSlide();
            
            console.log('Slides inicializados com sucesso');
        } catch (error) {
            console.error('Erro ao inicializar slides:', error);
        }
    }
    
    // Gera as miniaturas para navegação rápida
    generateThumbnails() {
        this.thumbnailsContainer.innerHTML = '';
        
        this.slides.forEach((slide, index) => {
            const thumb = document.createElement('div');
            thumb.classList.add('thumbnail');
            thumb.dataset.index = index;
            
            // Adicionar número do slide
            const number = document.createElement('div');
            number.classList.add('thumbnail-number');
            number.textContent = index + 1;
            thumb.appendChild(number);
            
            // Adicionar título
            const title = document.createElement('div');
            title.classList.add('thumbnail-title');
            title.textContent = slide.title;
            thumb.appendChild(title);
            
            // Marcar como ativo se for o slide atual
            if (index === this.currentSlideIndex) {
                thumb.classList.add('active');
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
        const thumbs = this.thumbnailsContainer.querySelectorAll('.thumbnail');
        thumbs.forEach((thumb, index) => {
            thumb.classList.toggle('active', index === this.currentSlideIndex);
        });
        
        // Atualizar o contador de slides
        this.slideCounter.textContent = `Slide ${this.currentSlideIndex + 1} de ${this.slides.length}`;
    }
    
    // Renderiza o slide atual
    renderCurrentSlide() {
        const slide = this.slides[this.currentSlideIndex];
        
        // Limpar conteúdo atual
        this.slideContainer.innerHTML = '';
        
        // Criar elemento do slide
        const slideElement = document.createElement('div');
        slideElement.classList.add('slide', `template-${slide.type}`);
        slideElement.style.backgroundColor = slide.background || '#1E1E1E';
        
        // Criar conteúdo do slide baseado no tipo
        switch (slide.type) {
            case 'cover':
                this.createCoverSlide(slideElement, slide);
                break;
            case 'content':
                this.createContentSlide(slideElement, slide);
                break;
            case 'split':
                this.createSplitSlide(slideElement, slide);
                break;
            case 'list':
                this.createListSlide(slideElement, slide);
                break;
            case 'chart':
                this.createChartSlide(slideElement, slide);
                break;
            case 'content-overlay':
                this.createContentOverlaySlide(slideElement, slide);
                break;
            case 'end':
                this.createEndSlide(slideElement, slide);
                break;
            default:
                this.createDefaultSlide(slideElement, slide);
        }
        
        // Adicionar à área de visualização com animação
        this.slideContainer.appendChild(slideElement);
        slideElement.classList.add('active');
        
        // Adicionar animações aos elementos do slide
        this.animateSlideElements(slideElement);
    }
    
    // Adiciona animações aos elementos do slide
    animateSlideElements(slideElement) {
        // Animar título
        const title = slideElement.querySelector('.slide-title');
        if (title) {
            title.classList.add('animate-fadeIn');
            setTimeout(() => title.classList.add('animate-slideUp'), 100);
        }
        
        // Animar subtítulo
        const subtitle = slideElement.querySelector('.slide-subtitle');
        if (subtitle) {
            subtitle.classList.add('animate-fadeIn');
            setTimeout(() => subtitle.classList.add('animate-slideUp'), 300);
        }
        
        // Animar conteúdo
        const content = slideElement.querySelector('.slide-content');
        if (content) {
            content.classList.add('animate-fadeIn');
            setTimeout(() => content.classList.add('animate-slideUp'), 500);
        }
        
        // Animar imagens
        const images = slideElement.querySelectorAll('.slide-image');
        images.forEach((img, index) => {
            img.classList.add('animate-fadeIn');
            setTimeout(() => img.classList.add('animate-zoomIn'), 700 + (index * 200));
        });
        
        // Animar itens de lista
        const listItems = slideElement.querySelectorAll('.list-item');
        listItems.forEach((item, index) => {
            item.classList.add('animate-fadeIn');
            setTimeout(() => item.classList.add('animate-slideInRight'), 500 + (index * 100));
        });
    }
    
    // Cria um slide de capa
    createCoverSlide(container, slide) {
        const title = this.createEditableElement('h1', slide.title, 'slide-title');
        const subtitle = this.createEditableElement('h2', slide.content.subtitle, 'slide-subtitle');
        const author = this.createEditableElement('p', slide.content.author, 'slide-author');
        const role = this.createEditableElement('p', slide.content.role, 'slide-role');
        const period = this.createEditableElement('p', slide.content.period, 'slide-period');
        
        container.appendChild(title);
        container.appendChild(subtitle);
        container.appendChild(author);
        container.appendChild(role);
        container.appendChild(period);
        
        // Adicionar logo
        if (slide.image) {
            const logo = document.createElement('img');
            logo.src = `assets/img/${slide.image}`;
            logo.alt = "COGEX";
            logo.classList.add('slide-logo');
            container.appendChild(logo);
        }
    }
    
    // Cria um slide de conteúdo
    createContentSlide(container, slide) {
        const title = this.createEditableElement('h1', slide.title, 'slide-title');
        const content = this.createEditableElement('div', slide.content.text, 'slide-content');
        
        container.appendChild(title);
        container.appendChild(content);
        
        // Adicionar imagem (se houver)
        if (slide.image) {
            const img = document.createElement('img');
            img.src = `assets/img/${slide.image}`;
            img.alt = slide.title;
            img.classList.add('slide-image');
            container.appendChild(img);
        }
    }
    
    // Cria um slide dividido
    createSplitSlide(container, slide) {
        const title = this.createEditableElement('h1', slide.title, 'slide-title');
        container.appendChild(title);
        
        const splitContainer = document.createElement('div');
        splitContainer.classList.add('split-container');
        
        // Coluna de texto
        const textColumn = document.createElement('div');
        textColumn.classList.add('split-text');
        const content = this.createEditableElement('div', slide.content.text, 'slide-content');
        textColumn.appendChild(content);
        
        // Coluna de imagem
        const imageColumn = document.createElement('div');
        imageColumn.classList.add('split-image');
        if (slide.image) {
            const img = document.createElement('img');
            img.src = `assets/img/${slide.image}`;
            img.alt = slide.title;
            img.classList.add('slide-image');
            imageColumn.appendChild(img);
        }
        
        splitContainer.appendChild(textColumn);
        splitContainer.appendChild(imageColumn);
        container.appendChild(splitContainer);
    }
    
    // Cria um slide de lista
    createListSlide(container, slide) {
        const title = this.createEditableElement('h1', slide.title, 'slide-title');
        container.appendChild(title);
        
        const listContainer = document.createElement('div');
        listContainer.classList.add('list-container');
        
        // Coluna de lista
        const list = document.createElement('ul');
        list.classList.add('list-items');
        
        slide.content.items.forEach(item => {
            const listItem = document.createElement('li');
            listItem.classList.add('list-item');
            const itemContent = this.createEditableElement('span', item, 'item-content');
            listItem.appendChild(itemContent);
            list.appendChild(listItem);
        });
        
        listContainer.appendChild(list);
        
        // Imagem (se houver)
        if (slide.image) {
            const imgContainer = document.createElement('div');
            imgContainer.classList.add('list-image-container');
            const img = document.createElement('img');
            img.src = `assets/img/${slide.image}`;
            img.alt = slide.title;
            img.classList.add('slide-image');
            imgContainer.appendChild(img);
            listContainer.appendChild(imgContainer);
        }
        
        container.appendChild(listContainer);
    }
    
    // Cria um slide de gráfico
    createChartSlide(container, slide) {
        const title = this.createEditableElement('h1', slide.title, 'slide-title');
        const chartTitle = this.createEditableElement('h2', slide.content.chartTitle, 'chart-title');
        const description = this.createEditableElement('div', slide.content.description, 'slide-content');
        
        container.appendChild(title);
        container.appendChild(chartTitle);
        
        // Contêiner para os gráficos
        const chartContainer = document.createElement('div');
        chartContainer.classList.add('chart-container');
        
        // Adicionar imagens dos gráficos
        if (slide.images && slide.images.length > 0) {
            slide.images.forEach(image => {
                const img = document.createElement('img');
                img.src = `assets/img/${image}`;
                img.alt = "Gráfico";
                img.classList.add('chart-image');
                chartContainer.appendChild(img);
            });
        }
        
        container.appendChild(chartContainer);
        container.appendChild(description);
    }
    
    // Cria um slide de conteúdo com sobreposição
    createContentOverlaySlide(container, slide) {
        if (slide.image) {
            container.style.backgroundImage = `url(assets/img/${slide.image})`;
            container.style.backgroundSize = 'cover';
            container.style.backgroundPosition = 'center';
        }
        
        const overlayDiv = document.createElement('div');
        overlayDiv.classList.add('content-overlay');
        
        const title = this.createEditableElement('h1', slide.title, 'slide-title');
        const content = this.createEditableElement('div', slide.content.text, 'slide-content');
        
        overlayDiv.appendChild(title);
        overlayDiv.appendChild(content);
        container.appendChild(overlayDiv);
    }
    
    // Cria um slide de encerramento
    createEndSlide(container, slide) {
        const content = this.createEditableElement('div', slide.content.text, 'end-text');
        const author = this.createEditableElement('p', slide.content.author, 'end-author');
        const role = this.createEditableElement('p', slide.content.role, 'end-role');
        
        container.appendChild(content);
        container.appendChild(author);
        container.appendChild(role);
        
        // Adicionar logo
        if (slide.image) {
            const logo = document.createElement('img');
            logo.src = `assets/img/${slide.image}`;
            logo.alt = "COGEX";
            logo.classList.add('end-logo');
            container.appendChild(logo);
        }
    }
    
    // Cria um slide padrão
    createDefaultSlide(container, slide) {
        const title = this.createEditableElement('h1', slide.title, 'slide-title');
        const content = document.createElement('div');
        content.classList.add('default-content');
        
        // Adicionar conteúdo genérico
        if (slide.content) {
            const text = this.createEditableElement('div', 
                typeof slide.content === 'string' ? slide.content : JSON.stringify(slide.content), 
                'slide-content');
            content.appendChild(text);
        }
        
        container.appendChild(title);
        container.appendChild(content);
        
        // Adicionar imagem (se houver)
        if (slide.image) {
            const img = document.createElement('img');
            img.src = `assets/img/${slide.image}`;
            img.alt = slide.title;
            img.classList.add('slide-image');
            container.appendChild(img);
        }
    }
    
    // Cria um elemento editável
    createEditableElement(tag, content, className) {
        const element = document.createElement(tag);
        element.innerHTML = content;
        element.classList.add(className);
        
        if (this.isEditMode) {
            element.classList.add('editable');
            element.setAttribute('contenteditable', 'true');
            element.addEventListener('blur', () => {
                this.saveSlideChanges();
            });
        }
        
        return element;
    }
    
    // Salva as alterações nos slides
    saveSlideChanges() {
        if (!this.isEditMode) return;
        
        const currentSlide = this.slides[this.currentSlideIndex];
        
        // Capturar título
        const titleEl = this.slideContainer.querySelector('.slide-title');
        if (titleEl) {
            currentSlide.title = titleEl.innerHTML;
        }
        
        // Capturar conteúdo baseado no tipo de slide
        switch (currentSlide.type) {
            case 'cover':
                this.saveCoverSlideChanges(currentSlide);
                break;
            case 'content':
            case 'content-overlay':
                this.saveContentSlideChanges(currentSlide);
                break;
            case 'split':
                this.saveSplitSlideChanges(currentSlide);
                break;
            case 'list':
                this.saveListSlideChanges(currentSlide);
                break;
            case 'chart':
                this.saveChartSlideChanges(currentSlide);
                break;
            case 'end':
                this.saveEndSlideChanges(currentSlide);
                break;
        }
        
        // Salvar no localStorage
        localStorage.setItem('cogex-slides', JSON.stringify(this.slides));
        console.log('Alterações salvas');
        
        // Atualizar miniaturas
        this.generateThumbnails();
    }
    
    // Salva alterações em um slide de capa
    saveCoverSlideChanges(slide) {
        const subtitleEl = this.slideContainer.querySelector('.slide-subtitle');
        const authorEl = this.slideContainer.querySelector('.slide-author');
        const roleEl = this.slideContainer.querySelector('.slide-role');
        const periodEl = this.slideContainer.querySelector('.slide-period');
        
        if (!slide.content) slide.content = {};
        
        if (subtitleEl) slide.content.subtitle = subtitleEl.innerHTML;
        if (authorEl) slide.content.author = authorEl.innerHTML;
        if (roleEl) slide.content.role = roleEl.innerHTML;
        if (periodEl) slide.content.period = periodEl.innerHTML;
    }
    
    // Salva alterações em um slide de conteúdo
    saveContentSlideChanges(slide) {
        const contentEl = this.slideContainer.querySelector('.slide-content');
        
        if (!slide.content) slide.content = {};
        
        if (contentEl) slide.content.text = contentEl.innerHTML;
    }
    
    // Salva alterações em um slide dividido
    saveSplitSlideChanges(slide) {
        const contentEl = this.slideContainer.querySelector('.slide-content');
        
        if (!slide.content) slide.content = {};
        
        if (contentEl) slide.content.text = contentEl.innerHTML;
    }
    
    // Salva alterações em um slide de lista
    saveListSlideChanges(slide) {
        const listItems = this.slideContainer.querySelectorAll('.item-content');
        
        if (!slide.content) slide.content = {};
        slide.content.items = [];
        
        listItems.forEach(item => {
            slide.content.items.push(item.innerHTML);
        });
    }
    
    // Salva alterações em um slide de gráfico
    saveChartSlideChanges(slide) {
        const chartTitleEl = this.slideContainer.querySelector('.chart-title');
        const descriptionEl = this.slideContainer.querySelector('.slide-content');
        
        if (!slide.content) slide.content = {};
        
        if (chartTitleEl) slide.content.chartTitle = chartTitleEl.innerHTML;
        if (descriptionEl) slide.content.description = descriptionEl.innerHTML;
    }
    
    // Salva alterações em um slide de encerramento
    saveEndSlideChanges(slide) {
        const textEl = this.slideContainer.querySelector('.end-text');
        const authorEl = this.slideContainer.querySelector('.end-author');
        const roleEl = this.slideContainer.querySelector('.end-role');
        
        if (!slide.content) slide.content = {};
        
        if (textEl) slide.content.text = textEl.innerHTML;
        if (authorEl) slide.content.author = authorEl.innerHTML;
        if (roleEl) slide.content.role = roleEl.innerHTML;
    }
}
