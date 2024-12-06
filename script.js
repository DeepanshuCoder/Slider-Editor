const swiper = new Swiper('.swiper-container', {
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
});


const undoStack = [];
const redoStack = [];

document.getElementById('undo').addEventListener('click', () => {
    if (undoStack.length > 0) {
        const action = undoStack.pop();
        redoStack.push(action);
        action.undo();
    }
});

document.getElementById('redo').addEventListener('click', () => {
    if (redoStack.length > 0) {
        const action = redoStack.pop();
        undoStack.push(action);
        action.redo();
    }
});

let currentContainer = document.getElementById('canvas-container-1');

swiper.on('slideChange', () => {
    currentContainer = document.getElementById(`canvas-container-${swiper.activeIndex + 1}`);
});

// Add Image
document.getElementById('addImage').addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.position = 'absolute';
                img.style.top = '0';
                img.style.left = '0';
                img.style.pointerEvents = 'none';
                currentContainer.innerHTML = '';
                currentContainer.appendChild(img);
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
});

// Add Text
document.getElementById('addText').addEventListener('click', () => {
    const text = document.createElement('div');
    text.className = 'text-element';
    text.contentEditable = true;
    text.innerText = 'New Text';
    text.style.fontSize = '20px';
    text.style.fontFamily = 'Arial';
    text.style.lineHeight = '1.5';
    text.style.left = '100px';
    text.style.top = '100px';

    currentContainer.appendChild(text);

    makeElementDraggable(text);
});

// Text Customization
document.getElementById('fontFamily').addEventListener('change', (e) => {
    applyStyle('fontFamily', e.target.value);
});
document.getElementById('fontSize').addEventListener('input', (e) => {
    applyStyle('fontSize', `${e.target.value}px`);
});
document.getElementById('textColor').addEventListener('input', (e) => {
    applyStyle('color', e.target.value);
});
document.getElementById('bold').addEventListener('click', () => {
    toggleStyle('fontWeight', 'bold');
});
document.getElementById('italic').addEventListener('click', () => {
    toggleStyle('fontStyle', 'italic');
});
document.getElementById('underline').addEventListener('click', () => {
    toggleStyle('textDecoration', 'underline');
});
document.getElementById('lineHeight').addEventListener('input', (e) => {
    applyStyle('lineHeight', e.target.value);
});
document.getElementById('textAlignment').addEventListener('change', (e) => {
    applyStyle('textAlign', e.target.value);
});

function applyStyle(styleProp, value) {
    const selectedText = document.querySelector('.text-element.selected');
    if (selectedText) {
        selectedText.style[styleProp] = value;
    }
}

function toggleStyle(styleProp, value) {
    const selectedText = document.querySelector('.text-element.selected');
    if (selectedText) {
        selectedText.style[styleProp] =
            selectedText.style[styleProp] === value ? '' : value;
    }
}

// Dragging and Resizing functionality
function makeElementDraggable(element) {
    element.addEventListener('mousedown', (e) => {
        const rect = currentContainer.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        let offsetX = e.clientX - elementRect.left;
        let offsetY = e.clientY - elementRect.top;

        const mouseMoveHandler = (e) => {
            let newX = e.clientX - offsetX - rect.left;
            let newY = e.clientY - offsetY - rect.top;

            newX = Math.max(0, Math.min(newX, rect.width - element.offsetWidth));
            newY = Math.max(0, Math.min(newY, rect.height - element.offsetHeight));

            element.style.left = `${newX}px`;
            element.style.top = `${newY}px`;
        };

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', () => {
            document.removeEventListener('mousemove', mouseMoveHandler);
        });
    });

    // Allow resizing
    element.style.resize = 'both';
    element.style.overflow = 'hidden';

    element.addEventListener('mousemove', (e) => {
        const rect = currentContainer.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();

        if (elementRect.right > rect.right) {
            element.style.width = `${rect.width - parseInt(element.style.left)}px`;
        }
        if (elementRect.bottom > rect.bottom) {
            element.style.height = `${rect.height - parseInt(element.style.top)}px`;
        }
    });

    // Select the text element when clicked
    element.addEventListener('click', () => {
        document.querySelectorAll('.text-element').forEach((el) => el.classList.remove('selected'));
        element.classList.add('selected');
    });
}

