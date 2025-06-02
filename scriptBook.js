// Cargar libros desde localStorage
if (!localStorage.getItem('libros')) {
  localStorage.setItem('libros', JSON.stringify([
    { titulo: "Trono de Cristal", autor: "Sarah J. Maas", genero: "Fantasía", estado: "leído", imagen: "resources/trono.jpg", esManga: false },
    { titulo: "Harry Potter y la piedra filosofal", autor: "J.K. Rowling", genero: "Fantasía", estado: "leído", imagen: "resources/hp1.jpg", esManga: false },
    { titulo: "One Piece", autor: "Eiichiro Oda", genero: "Aventura", estado: "leído", imagen: "resources/onepiece.jpg", esManga: true },
    { titulo: "El Hobbit", autor: "J.R.R. Tolkien", genero: "Fantasía", estado: "leyendo", imagen: "resources/hobbit.jpg", esManga: false },
    { titulo: "Attack on Titan", autor: "Hajime Isayama", genero: "Fantasía oscura", estado: "leyendo", imagen: "resources/aot.jpg", esManga: true },
    { titulo: "Death Note", autor: "Tsugumi Ohba", genero: "Misterio", estado: "pendiente", imagen: "resources/deathnote.jpg", esManga: true },
    { titulo: "Fullmetal Alchemist", autor: "Hiromu Arakawa", genero: "Fantasía", estado: "pendiente", imagen: "resources/fma.jpg", esManga: true },
    { titulo: "El nombre del viento", autor: "Patrick Rothfuss", genero: "Fantasía épica", estado: "pendiente", imagen: "resources/nombreviento.jpg", esManga: false },
    { titulo: "Frieren", autor: "Kanehito Yamada", genero: "Fantasía", estado: "pendiente", imagen: "resources/frieren.jpg", esManga: true },
    { titulo: "El Camino de los Reyes", autor: "Brandon Sanderson", genero: "Fantasía", estado: "pendiente", imagen: "resources/camino.jpg", esManga: false },
  ]));
}
let libros = JSON.parse(localStorage.getItem('libros'));


// Guardar libros en localStorage
function guardarLibros() {
  localStorage.setItem('libros', JSON.stringify(libros));
}

// Mostrar libros
function mostrarLibros(arrayLibros) {
  document.getElementById('read-list').innerHTML = '';
  document.getElementById('reading-list').innerHTML = '';
  document.getElementById('to-read-list').innerHTML = '';

  arrayLibros.forEach(libro => {
    const div = document.createElement('div');
    div.className = 'book-item';
    const urlImagen = libro.imagen && libro.imagen.trim() !== '' ? libro.imagen : 'default.jpg';
    div.innerHTML = `
      <div class="image-container">
        <img src="${urlImagen}" alt="${libro.titulo}">
      </div>
      <div class="book-info">
        <h3>${libro.titulo}</h3>
        <p>Autor: ${libro.autor}</p>
        <p>Género: ${libro.genero}</p>
        <p>Estado: ${libro.estado}</p>
      </div>
    `;
    div.style.cursor = "pointer";
    div.addEventListener('click', () => {
      const params = new URLSearchParams({
        titulo: libro.titulo,
        autor: libro.autor,
        genero: libro.genero,
        estado: libro.estado,
        imagen: libro.imagen
      });
      window.location.href = `detalleLibro.html?${params.toString()}`;
    });

    if (libro.estado === 'leído') {
      document.getElementById('read-list').appendChild(div);
    } else if (libro.estado === 'leyendo') {
      document.getElementById('reading-list').appendChild(div);
    } else if (libro.estado === 'pendiente') {
      document.getElementById('to-read-list').appendChild(div);
    }
  });
}

// Añadir libro
function agregarLibro(nuevoLibro) {
  libros.push(nuevoLibro);
  guardarLibros();
  mostrarLibros(libros);
}

// Editar libro
function editarLibro(libroEditado) {
  const index = libros.findIndex(libro => libro.titulo === libroEditado.titulo);
  if (index !== -1) {
    libros[index] = libroEditado;
    guardarLibros();
    mostrarLibros(libros);
  }
}
// Filtrar libros
function filtrarLibros() {
  const genero = document.getElementById('filter-genre').value;
  const estado = document.getElementById('filter-status').value;
  const soloManga = document.getElementById('filter-manga').checked;
  const filtrados = libros.filter(libro => {
    const generoCoincide = genero === 'all' || libro.genero.toLowerCase() === genero.toLowerCase();
    const estadoCoincide = estado === 'all' || libro.estado === estado;
    const mangaCoincide = !soloManga || libro.esManga;
    return generoCoincide && estadoCoincide && mangaCoincide;
  });
  mostrarLibros(filtrados);
}

document.addEventListener('DOMContentLoaded', () => {
  mostrarLibros(libros);
  document.getElementById('filter-button').addEventListener('click', filtrarLibros);

  const form = document.getElementById('add-book-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const titulo = document.getElementById('book-title').value;
      const autor = document.getElementById('book-author').value;
      const genero = document.getElementById('book-genre').value;
      const estado = document.getElementById('reading-status').value;
      const urlImagen = document.getElementById('book-image').value;
      const inputArchivo = document.getElementById('book-image-file');
      const archivo = inputArchivo && inputArchivo.files[0];

      if (archivo) {
        const reader = new FileReader();
        reader.onload = function (event) {
          libros.push({ titulo, autor, genero, estado, imagen: event.target.result });
          mostrarLibros(libros);
        };
        reader.readAsDataURL(archivo);
      } else {
        libros.push({ titulo, autor, genero, estado, imagen: urlImagen });
        mostrarLibros(libros);
      }
      form.reset();
    });
  }
});