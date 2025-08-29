// Simulación de base de datos con localStorage
class ProductosTarifasService {
    constructor() {
        this.storageKey = 'productos_tarifas';
        this.currentUser = 'admin@cheetah-research.ai'; // Simulación de usuario actual
        this.initializeSampleData();
    }

    initializeSampleData() {
        // Solo inicializar si no existen datos
        if (!localStorage.getItem(this.storageKey)) {
            const sampleData = [
                {
                    id: 1,
                    descripcion: "Producto Básico",
                    valorDesde: 0,
                    valorHasta: 5000,
                    tarifa: 0.16200,
                    fechaIngreso: "2024-01-15",
                    usuarioIngreso: "admin@cheetah-research.ai",
                    fechaModificacion: "2024-01-15",
                    usuarioModificacion: "admin@cheetah-research.ai"
                },
                {
                    id: 2,
                    descripcion: "Paquete para estudios pequeños",
                    valorDesde: 5001,
                    valorHasta: 10000,
                    tarifa: 0.09084,
                    fechaIngreso: "2024-01-20",
                    usuarioIngreso: "admin@cheetah-research.ai",
                    fechaModificacion: "2024-01-26",
                    usuarioModificacion: "admin@cheetah-research.ai"
                }
            ];
            localStorage.setItem(this.storageKey, JSON.stringify(sampleData));
        }
    }

    getAll() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error al obtener productos:', error);
            return [];
        }
    }

    create(producto) {
        try {
            const productos = this.getAll();
            const newId = productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1;
            
            const newProducto = {
                ...producto,
                id: newId,
                fechaIngreso: new Date().toISOString().split('T')[0],
                usuarioIngreso: this.currentUser,
                fechaModificacion: new Date().toISOString().split('T')[0],
                usuarioModificacion: this.currentUser
            };

            productos.push(newProducto);
            localStorage.setItem(this.storageKey, JSON.stringify(productos));
            return newProducto;
        } catch (error) {
            console.error('Error al crear producto:', error);
            throw error;
        }
    }

    update(id, producto) {
        try {
            const productos = this.getAll();
            const index = productos.findIndex(p => p.id === id);
            
            if (index === -1) {
                throw new Error('Producto no encontrado');
            }

            productos[index] = {
                ...productos[index],
                ...producto,
                id: id,
                fechaModificacion: new Date().toISOString().split('T')[0],
                usuarioModificacion: this.currentUser
            };

            localStorage.setItem(this.storageKey, JSON.stringify(productos));
            return productos[index];
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            throw error;
        }
    }

    delete(id) {
        try {
            const productos = this.getAll();
            const filteredProductos = productos.filter(p => p.id !== id);
            localStorage.setItem(this.storageKey, JSON.stringify(filteredProductos));
            return true;
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            throw error;
        }
    }

    getById(id) {
        try {
            const productos = this.getAll();
            return productos.find(p => p.id === id);
        } catch (error) {
            console.error('Error al obtener producto por ID:', error);
            return null;
        }
    }
}

// Instancia global del servicio
const productosService = new ProductosTarifasService();

// Funciones de la interfaz de usuario
function showAlert(message, type = 'success') {
    const alertContainer = document.getElementById('alertContainer');
    const alertHtml = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    alertContainer.innerHTML = alertHtml;

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        const alert = alertContainer.querySelector('.alert');
        if (alert) {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }
    }, 5000);
}

function loadProductos() {
    try {
        const productos = productosService.getAll();
        const tableBody = document.getElementById('productosTableBody');
        
        if (productos.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="9" class="text-center text-muted">
                        <i class="fas fa-inbox fa-2x mb-2"></i>
                        <p>No hay productos registrados</p>
                    </td>
                </tr>
            `;
            return;
        }

        tableBody.innerHTML = productos.map(producto => `
            <tr>
                <td>${producto.descripcion}</td>
                <td>${producto.valorDesde.toLocaleString()}</td>
                <td>${producto.valorHasta.toLocaleString()}</td>
                <td>$${producto.tarifa.toFixed(5)}</td>
                <td>${producto.fechaIngreso}</td>
                <td>${producto.usuarioIngreso}</td>
                <td>${producto.fechaModificacion}</td>
                <td>${producto.usuarioModificacion}</td>
                <td>
                    <button class="btn btn-warning btn-sm me-2" onclick="editProducto(${producto.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteProducto(${producto.id})">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error al cargar productos:', error);
        showAlert('Error al cargar los productos', 'danger');
    }
}

function createProducto(event) {
    event.preventDefault();
    
    try {
        const formData = new FormData(event.target);
        const producto = {
            descripcion: formData.get('descripcion'),
            valorDesde: parseInt(formData.get('valorDesde')),
            valorHasta: parseInt(formData.get('valorHasta')),
            tarifa: parseFloat(formData.get('tarifa'))
        };

        // Validaciones
        if (producto.valorDesde >= producto.valorHasta) {
            showAlert('El valor "Desde" debe ser menor que el valor "Hasta"', 'warning');
            return;
        }

        if (producto.tarifa < 0) {
            showAlert('La tarifa no puede ser negativa', 'warning');
            return;
        }

        // Verificar solapamiento de rangos
        const productos = productosService.getAll();
        const hasOverlap = productos.some(p => 
            (producto.valorDesde <= p.valorHasta && producto.valorHasta >= p.valorDesde)
        );

        if (hasOverlap) {
            showAlert('El rango de valores se solapa con un producto existente', 'warning');
            return;
        }

        productosService.create(producto);
        showAlert('Producto creado exitosamente', 'success');
        event.target.reset();
        loadProductos();
    } catch (error) {
        console.error('Error al crear producto:', error);
        showAlert('Error al crear el producto', 'danger');
    }
}

function editProducto(id) {
    try {
        const producto = productosService.getById(id);
        if (!producto) {
            showAlert('Producto no encontrado', 'danger');
            return;
        }

        // Llenar el modal con los datos del producto
        document.getElementById('editId').value = producto.id;
        document.getElementById('editDescripcion').value = producto.descripcion;
        document.getElementById('editValorDesde').value = producto.valorDesde;
        document.getElementById('editValorHasta').value = producto.valorHasta;
        document.getElementById('editTarifa').value = producto.tarifa;

        // Mostrar el modal
        const modal = new bootstrap.Modal(document.getElementById('editModal'));
        modal.show();
    } catch (error) {
        console.error('Error al editar producto:', error);
        showAlert('Error al cargar datos del producto', 'danger');
    }
}

function updateProducto() {
    try {
        const id = parseInt(document.getElementById('editId').value);
        const producto = {
            descripcion: document.getElementById('editDescripcion').value,
            valorDesde: parseInt(document.getElementById('editValorDesde').value),
            valorHasta: parseInt(document.getElementById('editValorHasta').value),
            tarifa: parseFloat(document.getElementById('editTarifa').value)
        };

        // Validaciones
        if (producto.valorDesde >= producto.valorHasta) {
            showAlert('El valor "Desde" debe ser menor que el valor "Hasta"', 'warning');
            return;
        }

        if (producto.tarifa < 0) {
            showAlert('La tarifa no puede ser negativa', 'warning');
            return;
        }

        // Verificar solapamiento de rangos (excluyendo el producto actual)
        const productos = productosService.getAll();
        const hasOverlap = productos.some(p => 
            p.id !== id && (producto.valorDesde <= p.valorHasta && producto.valorHasta >= p.valorDesde)
        );

        if (hasOverlap) {
            showAlert('El rango de valores se solapa con un producto existente', 'warning');
            return;
        }

        productosService.update(id, producto);
        showAlert('Producto actualizado exitosamente', 'success');
        
        // Cerrar modal y recargar tabla
        const modal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
        modal.hide();
        loadProductos();
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        showAlert('Error al actualizar el producto', 'danger');
    }
}

function deleteProducto(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        try {
            productosService.delete(id);
            showAlert('Producto eliminado exitosamente', 'success');
            loadProductos();
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            showAlert('Error al eliminar el producto', 'danger');
        }
    }
}

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Cargar productos iniciales
    loadProductos();

    // Configurar el formulario de creación
    const form = document.getElementById('productoForm');
    if (form) {
        form.addEventListener('submit', createProducto);
    }

    // Configurar validaciones en tiempo real
    const valorDesdeInput = document.getElementById('valorDesde');
    const valorHastaInput = document.getElementById('valorHasta');

    if (valorDesdeInput && valorHastaInput) {
        valorHastaInput.addEventListener('input', function() {
            const desde = parseInt(valorDesdeInput.value);
            const hasta = parseInt(this.value);
            
            if (desde && hasta && desde >= hasta) {
                this.setCustomValidity('El valor debe ser mayor que el valor "Desde"');
            } else {
                this.setCustomValidity('');
            }
        });
    }

    console.log('Sistema de Productos y Tarifas inicializado');
});
