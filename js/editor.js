class SlideEditor {
    constructor(slidesManager) {
        this.slidesManager = slidesManager;
        this.isDragging = false;
        this.draggedImage = null;
        
        // Inicializar funcionalidades de edição
        this.initDragAndDrop();
    }
    
    // Inicializa funcionalidades de arrastar e soltar
    initDragAndDrop() {
        // Habilitar arrastar e soltar apenas no modo de edição
        document.addEventListener('dragover', (e) => {
            if (!this.slidesManager.isEditMode) return;
            e.preventDefault();
        });
        
        document.addEventListener('drop', (e) => {
            if (!this.slidesManager.isEditMode) return;
            e.preventDefault();
        });
        
        // Delegar eventos para elementos futuros
        document.addEventListener('dragstart', (e) => {
            if (!this.slidesManager.isEditMode) return;
            if (e.target.classList.contains('slide-image') || e.target.classList.contains('chart-image')) {
                this.isDragging = true;
                this.draggedImage = e.target;
                e.dataTransfer.setData('text/plain', e.target.src);
                e.target.classList.add('dragging');
            }
        });
        
        document.addEventListener('dragend', (e) => {
            if (!this.slidesManager.isEditMode) return;
            this.isDragging = false;
            if (e.target.classList.contains('dragging')) {
                e.target.classList.remove('dragging');
            }
        });
        
        // Adicionar evento para duplo clique em texto (edição direta)
        document.addEventListener('dblclick', (e) => {
            if (!this.slidesManager.isEditMode) return;
            
            if (e.target.classList.contains('editable')) {
                e.target.focus();
                
                // Selecionar todo o texto para facilitar a edição
                const selection = window.getSelection();
                const range = document.createRange();
                range.selectNodeContents(e.target);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        });
    }
    
    // Cria uma área para soltar imagens
    createDropZone() {
        const dropZone = document.createElement('div');
        dropZone.classList.add('image-dropzone');
        dropZone.textContent = 'Arraste e solte imagens aqui';
        
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });
        
        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
        });
        
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            
            const imgSrc = e.dataTransfer.getData('text/plain');
            if (imgSrc) {
                // Extrair o nome do arquivo da URL
                const fileName = imgSrc.split('/').pop();
                
                // Adicionar a imagem ao slide atual
                const currentSlide = this.slidesManager.slides[this.slidesManager.currentSlideIndex];
                
                // Verificar o tipo de slide e adicionar a imagem adequadamente
                if (currentSlide.type === 'chart') {
                    if (!currentSlide.images) {
                        currentSlide.images = [];
                    }
                    // Evitar duplicatas
                    if (!currentSlide.images.includes(fileName)) {
                        currentSlide.images.push(fileName);
                    }
                } else {
                    currentSlide.image = fileName;
                }
                
                // Salvar alterações e renderizar
                this.slidesManager.saveSlideChanges();
                this.slidesManager.renderCurrentSlide();
            }
        });
        
        return dropZone;
    }
    
    // Adiciona recursos de edição a um slide
    enhanceSlideForEditing(slideElement, slide) {
        // Adicionar área para soltar imagens
        const dropZone = this.createDropZone();
        slideElement.appendChild(dropZone);
        
        // Tornar imagens arrastáveis
        const images = slideElement.querySelectorAll('.slide-image, .chart-image, .slide-logo, .end-logo');
        images.forEach(img => {
            img.draggable = true;
            img.title = "Arraste para reposicionar";
        });
        
        // Adicionar botões de edição
        const editControls = document.createElement('div');
        editControls.classList.add('edit-controls');
        
        // Botão para adicionar imagem
        const addImageBtn = document.createElement('button');
        addImageBtn.classList.add('edit-btn', 'add-image');
        addImageBtn.textContent = "Adicionar Imagem";
        addImageBtn.addEventListener('click', () => {
            // Simular clique em input file (nas limitações do ambiente atual)
            alert("Selecione uma imagem da lista de assets para adicionar ao slide");
            // Aqui idealmente abriríamos um seletor de arquivos
        });
        
        // Botão para remover imagem
        const removeImageBtn = document.createElement('button');
        removeImageBtn.classList.add('edit-btn', 'remove-image');
        removeImageBtn.textContent = "Remover Imagem";
        removeImageBtn.addEventListener('click', () => {
            const currentSlide = this.slidesManager.slides[this.slidesManager.currentSlideIndex];
            
            if (currentSlide.type === 'chart') {
                currentSlide.images = [];
            } else {
                currentSlide.image = null;
            }
            
            // Salvar alterações e renderizar
            this.slidesManager.saveSlideChanges();
            this.slidesManager.renderCurrentSlide();
        });
        
        editControls.appendChild(addImageBtn);
        editControls.appendChild(removeImageBtn);
        slideElement.appendChild(editControls);
        
        return slideElement;
    }
}
