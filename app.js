// Referencias al DOM
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const searchInput = document.getElementById('searchInput');
const loadingState = document.getElementById('loadingState');


let tasks = [];

function saveToLocalStorage() {
    localStorage.setItem('tareas_adso', JSON.stringify(tasks));
}

function getFromLocalStorage() {
    const storedTasks = localStorage.getItem('tareas_adso');
    return storedTasks ? JSON.parse(storedTasks) : [];
}


const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


async function initApp() {
    try {
       
        loadingState.style.display = 'block';
        taskList.style.display = 'none';

        
        await delay(1000);

     
        tasks = getFromLocalStorage();

        
        loadingState.style.display = 'none';
        taskList.style.display = 'block';

        renderTasks();
    } catch (error) {
        console.error("Error al cargar los datos: ", error);
        loadingState.textContent = "Hubo un error al cargar las tareas.";
    }
}


function renderTasks(filterText = '') {
    taskList.innerHTML = '';

    // Filtrar tareas según la búsqueda
    const filteredTasks = tasks.filter(task => 
        task.text.toLowerCase().includes(filterText.toLowerCase())
    );

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task.text;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Eliminar';
        deleteBtn.className = 'delete-btn';
        deleteBtn.onclick = () => deleteTask(task.id);

        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}


taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = taskInput.value.trim();
    
    if (text !== '') {
        const newTask = {
            id: Date.now(),
            text: text
        };
        tasks.push(newTask);
        saveToLocalStorage();
        renderTasks(searchInput.value); // Mantener el filtro actual
        taskInput.value = '';
    }
});

// Eliminar tarea
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveToLocalStorage();
    renderTasks(searchInput.value);
}


function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(this, args);
        }, wait);
    };
}


searchInput.addEventListener('input', debounce((e) => {
    const searchText = e.target.value;
    renderTasks(searchText);
}, 400));


document.addEventListener('DOMContentLoaded', initApp);