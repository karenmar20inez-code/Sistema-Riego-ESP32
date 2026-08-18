let columns = 5;
let rows = 7;
let gap = 8;

const gridContainer = document.getElementById('gridContainer');
const colsValue = document.getElementById('cols-value');
const rowsValue = document.getElementById('rows-value');
const gapValue = document.getElementById('gap-value');

// Botones de Columns
document.getElementById('btn-cols-minus').addEventListener('click', () => {
    if (columns > 1) columns--;
    updateGrid();
});

document.getElementById('btn-cols-plus').addEventListener('click', () => {
    if (columns < 12) columns++;
    updateGrid();
});

// Botones de Rows
document.getElementById('btn-rows-minus').addEventListener('click', () => {
    if (rows > 1) rows--;
    updateGrid();
});

document.getElementById('btn-rows-plus').addEventListener('click', () => {
    if (rows < 12) rows++;
    updateGrid();
});

// Botones de Gap
document.getElementById('btn-gap-minus').addEventListener('click', () => {
    if (gap > 0) gap--;
    updateGrid();
});

document.getElementById('btn-gap-plus').addEventListener('click', () => {
    if (gap < 50) gap++;
    updateGrid();
});

function updateGrid() {
    // Actualizar valores mostrados
    colsValue.textContent = columns;
    rowsValue.textContent = rows;
    gapValue.textContent = gap;

    // Actualizar grid
    gridContainer.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    gridContainer.style.gap = `${gap}px`;
}

// Inicializar
updateGrid();
