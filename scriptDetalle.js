window.onload = function () {
    const params = new URLSearchParams(window.location.search);
    const titulo = params.get('titulo');
    let libros = JSON.parse(localStorage.getItem('libros')) || [];
    let libro = libros.find(l => l.titulo.trim().toLowerCase() === titulo.trim().toLowerCase());

    if (!libro) {
        alert("No se ha encontrado el libro. Puede que el título no coincida exactamente.");
        return;
    }

    // Mostrar los datos del libro en la página
    function mostrarDatosLibro() {
        document.getElementById('book-title').textContent = libro.titulo;
        document.querySelector('#book-author span').textContent = libro.autor || "";
        document.querySelector('#book-genre span').textContent = libro.genero || "";
        document.querySelector('#reading-date span').textContent = libro.fechaLectura || "";
        document.querySelector('#reading-status span').textContent = libro.estado || "";
        document.getElementById('book-image').src = libro.imagen || "";
        document.querySelector('#book-sinopsis span').textContent = libro.sinopsis || "";
        document.querySelector('#book-stars span').innerHTML = libro.estrellas ? mostrarEstrellas(libro.estrellas) : "";
        document.querySelector('#book-lagrimas span').innerHTML = libro.lagrimas ? '😭'.repeat(libro.lagrimas) + '😐'.repeat(5 - libro.lagrimas) : "";
        document.querySelector('#book-recomienda span').textContent = libro.recomienda ? (libro.recomienda === "si" ? "Sí" : "No") : "";
        document.querySelector('#book-notas span').textContent = libro.notas || "";
    }

    // Función para mostrar estrellas
    function mostrarEstrellas(valor) {
        const enteras = Math.floor(valor);
        const media = valor % 1 >= 0.5 ? 1 : 0;
        return '★'.repeat(enteras) + (media ? '½' : '') + '☆'.repeat(5 - enteras - media);
    }

    mostrarDatosLibro();

    // Botón "Volver"
    if (document.getElementById('back-button')) {
        document.getElementById('back-button').onclick = function () {
            window.location.href = "book.html";
        };
    }

    // Botón "Eliminar Libro"
    if (document.getElementById('delete-book-button')) {
        document.getElementById('delete-book-button').onclick = function () {
            if (confirm("¿Seguro que quieres eliminar este libro?")) {
                libros = libros.filter(l => l.titulo.trim().toLowerCase() !== libro.titulo.trim().toLowerCase());
                localStorage.setItem('libros', JSON.stringify(libros));
                window.location.href = "book.html";
            }
        };
    }

    // Botón "Editar Libro"
    if (document.getElementById('edit-book-button')) {
        document.getElementById('edit-book-button').onclick = function () {
            const modal = document.getElementById('edit-modal');
            const form = document.getElementById('edit-book-form');

            // Generar el formulario dentro del modal
            form.innerHTML = `
                <div class="form-group full-width">
                    <label for="edit-titulo">Título:</label>
                    <input id="edit-titulo" value="${libro.titulo || ''}" required>
                </div>
                
                <div class="form-group">
                    <label for="edit-autor">Autor:</label>
                    <input id="edit-autor" value="${libro.autor || ''}" required>
                </div>
                
                <div class="form-group">
                    <label for="edit-genero">Género:</label>
                    <input id="edit-genero" value="${libro.genero || ''}" required>
                </div>
                
                <div class="form-group">
                    <label for="edit-estado">Estado:</label>
                    <select id="edit-estado">
                        <option value="leído" ${libro.estado === 'leído' ? 'selected' : ''}>Leído</option>
                        <option value="leyendo" ${libro.estado === 'leyendo' ? 'selected' : ''}>Leyendo</option>
                        <option value="pendiente" ${libro.estado === 'pendiente' ? 'selected' : ''}>Pendiente</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label>Valoración:</label>
                    <div class="star-rating-container">
                        <div class="star-rating">
                            ${Array.from({ length: 10 }, (_, i) => {
                const value = (i + 1) * 0.5;
                return `
                                    <input type="radio" id="star-${value}" name="rating" value="${value}" 
                                        ${libro.estrellas === value ? 'checked' : ''}>
                                    <label for="star-${value}" 
                                        class="${value % 1 === 0 ? 'full-star' : 'half-star'}" 
                                        title="${value} estrellas">
                                        ${value % 1 === 0 ? '★' : '½'}
                                    </label>
                                `;
            }).join('')}
                        </div>
                        <div class="rating-value">${libro.estrellas || 0} estrellas</div>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="edit-lagrimas">Lágrimas:</label>
                    <select id="edit-lagrimas">
                        ${[0, 1, 2, 3, 4, 5].map(n =>
                `<option value="${n}" ${libro.lagrimas == n ? 'selected' : ''}>${'😭'.repeat(n)}${n < 5 ? '😐'.repeat(5 - n) : ''}</option>`
            ).join('')}
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="edit-recomienda">Recomendación:</label>
                    <select id="edit-recomienda">
                        <option value="si" ${libro.recomienda === 'si' ? 'selected' : ''}>Sí</option>
                        <option value="no" ${libro.recomienda === 'no' ? 'selected' : ''}>No</option>
                    </select>
                </div>
                
                <div class="form-group full-width">
                    <label for="edit-sinopsis">Sinopsis:</label>
                    <textarea id="edit-sinopsis" rows="4">${libro.sinopsis || ''}</textarea>
                </div>
                
                <div class="form-group full-width">
                    <label for="edit-notas">Notas:</label>
                    <textarea id="edit-notas" rows="4">${libro.notas || ''}</textarea>
                </div>
                
                <div class="form-actions">
                    <button type="button" id="cancelar-edicion" class="btn-secondary">Cancelar</button>
                    <button type="submit" class="btn-primary">Guardar Cambios</button>
                </div>
            `;

            // Mostrar el modal
            modal.style.display = 'block';

            // Actualizar visualización en tiempo real
            document.querySelectorAll('input[name="rating"]').forEach(radio => {
                radio.addEventListener('change', (e) => {
                    document.querySelector('.rating-value').textContent = `${e.target.value} estrellas`;
                });
            });

            // Cerrar modal al hacer clic en la "X" o en "Cancelar"
            document.querySelector('.close-modal').onclick =
                document.getElementById('cancelar-edicion').onclick = function () {
                    modal.style.display = 'none';
                };

            // Guardar cambios al enviar el formulario
            form.onsubmit = function (e) {
                e.preventDefault();

                // Actualizar los datos del libro
                libro.titulo = document.getElementById('edit-titulo').value.trim();
                libro.autor = document.getElementById('edit-autor').value.trim();
                libro.genero = document.getElementById('edit-genero').value.trim();
                libro.estado = document.getElementById('edit-estado').value;
                libro.sinopsis = document.getElementById('edit-sinopsis').value;
                libro.estrellas = parseFloat(document.querySelector('input[name="rating"]:checked')?.value || 0);
                libro.lagrimas = parseInt(document.getElementById('edit-lagrimas').value);
                libro.recomienda = document.getElementById('edit-recomienda').value;
                libro.notas = document.getElementById('edit-notas').value;

                // Actualizar en localStorage
                const index = libros.findIndex(l => l.titulo.trim().toLowerCase() === titulo.trim().toLowerCase());
                if (index !== -1) {
                    libros[index] = libro;
                    localStorage.setItem('libros', JSON.stringify(libros));
                }

                // Actualizar la vista y cerrar el modal
                mostrarDatosLibro();
                modal.style.display = 'none';

                // Si cambió el título, actualizar la URL
                if (libro.titulo.trim().toLowerCase() !== titulo.trim().toLowerCase()) {
                    window.location.search = `?titulo=${encodeURIComponent(libro.titulo)}`;
                }
            };
        };
    }
};