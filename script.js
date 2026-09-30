// Base de datos de productos de lujo
const PRODUCTS = [
    {
        id: '1',
        title: 'Baccarat Rouge 540 Extract',
        brand: 'Maison Francis Kurkdjian',
        category: 'nicho',
        priceMXN: 450,
        image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=600&auto=format&fit=crop',
        badge: 'Top Ventas',
        notes: {
            top: 'Jazmín Grandiflorum de Egipto, Azafrán',
            heart: 'Almendra Amarga de Marruecos, Madera de Cedro',
            base: 'Acorde Amaderado Ambarino, Ámbar Gris'
        },
        description: 'Una firma olfativa densa y brillante. Las facetas de la fragancia exudan un soplo de ámbar y notas florales amaderadas.'
    },
    {
        id: '2',
        title: 'Aventus',
        brand: 'Creed',
        category: 'hombre',
        priceMXN: 700,
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600&auto=format&fit=crop',
        badge: 'Emblemático',
        notes: {
            top: 'Piña, Bergamota, Grosella Negra, Manzana',
            heart: 'Abedul, Pachulí, Jazmín de Marruecos, Rosa',
            base: 'Almizcle, Musgo de Roble, Ámbar Gris, Vainilla'
        },
        description: 'Inspirado en la vida dramática de un emperador histórico, celebrando la fuerza, el poder y el éxito.'
    },
    {
        id: '3',
        title: 'Delina Exclusif',
        brand: 'Parfums de Marly',
        category: 'mujer',
        priceMXN: 200,
        image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=600&auto=format&fit=crop',
        badge: 'Nuevo',
        notes: {
            top: 'Lichi, Pera, Bergamota',
            heart: 'Rosa Turca, Incienso, Oud',
            base: 'Vainilla, Ámbar, Notas Amaderadas'
        },
        description: 'Un elixir sensual y de lujo supremo. Una sobredosis de rosa turca combinada con notas aterciopeladas de incienso.'
    },
    {
        id: '4',
        title: 'Oud Wood',
        brand: 'Tom Ford',
        category: 'unisex',
        priceMXN: 300,
        image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=600&auto=format&fit=crop',
        badge: 'Exclusivo',
        notes: {
            top: 'Madera de Oud, Palo de Rosa de Brasil',
            heart: 'Cardamomo, Pimienta de Sichuan, Sándalo',
            base: 'Habas Tonka, Vainilla, Ámbar'
        },
        description: 'Uno de los ingredientes más raros y valiosos en el arsenal de un perfumista, la madera de oud a menudo se quema en templos.'
    }
];

// Estado global de la aplicación
let cart = [];
let currentCurrency = 'MXN';
const EXCHANGE_RATE_USD = 0.055; // 1 MXN = 0.055 USD
let selectedCategory = 'all';
let quizAnswers = {};

// Inicialización cuando carga el documento
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar íconos Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    renderProducts();
    updateCartUI();
});

// Formatear precios según la moneda activa
function formatPrice(amountMXN) {
    if (currentCurrency === 'USD') {
        const usd = (amountMXN * EXCHANGE_RATE_USD).toFixed(0);
        return `$${usd} USD`;
    }
    return `$${amountMXN.toLocaleString('es-MX')} MXN`;
}

// Cambiar la moneda global de la tienda
function changeCurrency(currency) {
    currentCurrency = currency;
    
    // Actualizar precio en la sección Hero
    const heroPriceTag = document.getElementById('hero-price-tag');
    if (heroPriceTag) {
        heroPriceTag.innerText = formatPrice(6450);
    }

    renderProducts();
    updateCartUI();
}

// Renderizar tarjetas de productos en el Grid
function renderProducts() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    const filtered = selectedCategory === 'all' 
        ? PRODUCTS 
        : PRODUCTS.filter(p => p.category === selectedCategory);

    grid.innerHTML = filtered.map(product => `
        <div class="glass-card rounded-2xl overflow-hidden group flex flex-col justify-between">
            <div>
                <div class="relative aspect-[4/5] overflow-hidden">
                    <img src="${product.image}" alt="${product.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                    <div class="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-gold-300 text-[10px] font-semibold tracking-wider uppercase py-1 px-3 rounded-full border border-gold-500/30">
                        ${product.badge}
                    </div>
                    <button onclick="openProductModal('${product.id}')" class="absolute bottom-3 right-3 bg-black/70 hover:bg-gold-500 hover:text-black text-white p-2.5 rounded-full backdrop-blur-md transition-all">
                        <i data-lucide="eye" class="w-4 h-4"></i>
                    </button>
                </div>
                <div class="p-5 space-y-2">
                    <span class="text-[10px] uppercase tracking-widest text-gold-400 font-medium">${product.brand}</span>
                    <h3 class="font-serif text-lg font-medium text-white group-hover:text-gold-300 transition-colors">${product.title}</h3>
                    <p class="text-xs text-gray-400 line-clamp-2 font-light">${product.description}</p>
                </div>
            </div>
            <div class="p-5 pt-0 flex items-center justify-between border-t border-white/5 mt-2">
                <span class="font-serif font-bold text-gold-300 text-lg">${formatPrice(product.priceMXN)}</span>
                <button onclick="addToCart('${product.id}')" class="gold-gradient-bg text-black font-semibold text-xs px-4 py-2.5 rounded-full hover:shadow-lg hover:shadow-gold-500/20 transition-all flex items-center gap-1.5">
                    <i data-lucide="plus" class="w-3.5 h-3.5"></i>
                    <span>Añadir</span>
                </button>
            </div>
        </div>
    `).join('');

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Filtrar productos por categoría
function filterCategory(category) {
    selectedCategory = category;

    // Actualizar estilos de los botones de filtro
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('bg-gold-500', 'text-black', 'active');
        btn.classList.add('bg-white/5', 'text-gray-300');
    });

    const activeBtn = document.getElementById(`filter-${category}`);
    if (activeBtn) {
        activeBtn.classList.remove('bg-white/5', 'text-gray-300');
        activeBtn.classList.add('bg-gold-500', 'text-black', 'active');
    }

    renderProducts();
}

// Control del Menú Móvil
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}

// Control del Modal de Búsqueda
function toggleSearchModal() {
    const modal = document.getElementById('search-modal');
    modal.classList.toggle('hidden');
    if (!modal.classList.contains('hidden')) {
        document.getElementById('search-input').focus();
    }
}

function handleSearch() {
    const query = document.getElementById('search-input').value.toLowerCase().trim();
    const resultsContainer = document.getElementById('search-results');

    if (!query) {
        resultsContainer.innerHTML = '<p class="text-sm text-gray-400 text-center py-6">Escribe para encontrar tu fragancia insignia...</p>';
        return;
    }

    const matches = PRODUCTS.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.notes.top.toLowerCase().includes(query) ||
        p.notes.heart.toLowerCase().includes(query) ||
        p.notes.base.toLowerCase().includes(query)
    );

    if (matches.length === 0) {
        resultsContainer.innerHTML = '<p class="text-sm text-gray-400 text-center py-6">No se encontraron perfumes con esa nota o nombre.</p>';
        return;
    }

    resultsContainer.innerHTML = matches.map(p => `
        <div onclick="openProductModal('${p.id}'); toggleSearchModal();" class="py-3 flex items-center justify-between hover:bg-white/5 px-3 rounded-xl cursor-pointer transition-colors">
            <div class="flex items-center gap-3">
                <img src="${p.image}" alt="${p.title}" class="w-12 h-12 object-cover rounded-lg">
                <div>
                    <h4 class="text-sm font-serif text-white font-medium">${p.title}</h4>
                    <p class="text-xs text-gold-400">${p.brand}</p>
                </div>
            </div>
            <span class="text-xs font-bold text-gold-300">${formatPrice(p.priceMXN)}</span>
        </div>
    `).join('');
}

// Lógica del Carrito de Compras
function toggleCart() {
    const drawer = document.getElementById('cart-drawer');
    const panel = document.getElementById('cart-panel');
    const backdrop = document.getElementById('cart-backdrop');

    if (panel.classList.contains('translate-x-full')) {
        drawer.classList.remove('pointer-events-none');
        panel.classList.remove('translate-x-full');
        backdrop.classList.remove('opacity-0', 'pointer-events-none');
    } else {
        panel.classList.add('translate-x-full');
        backdrop.classList.add('opacity-0', 'pointer-events-none');
        setTimeout(() => {
            drawer.classList.add('pointer-events-none');
        }, 300);
    }
}

function addToCart(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    toggleCart();
}

function updateCartQuantity(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== productId);
    }
    updateCartUI();
}

function updateCartUI() {
    const badge = document.getElementById('cart-badge');
    const itemsContainer = document.getElementById('cart-items');
    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total');

    const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    const totalAmountMXN = cart.reduce((acc, item) => acc + (item.priceMXN * item.quantity), 0);

    // Actualizar badge flotante
    if (badge) {
        badge.innerText = totalCount;
        if (totalCount > 0) {
            badge.classList.remove('opacity-0', 'scale-90');
            badge.classList.add('opacity-100', 'scale-100');
        } else {
            badge.classList.add('opacity-0', 'scale-90');
            badge.classList.remove('opacity-100', 'scale-100');
        }
    }

    // Renderizar lista vacía o con productos
    if (cart.length === 0) {
        itemsContainer.innerHTML = `
            <div class="text-center py-12 space-y-3">
                <i data-lucide="shopping-bag" class="w-12 h-12 text-gray-600 mx-auto"></i>
                <p class="text-sm text-gray-400 font-serif">Tu bolsa de compras está vacía.</p>
                <button onclick="toggleCart()" class="text-xs text-gold-400 underline">Explorar Catálogo</button>
            </div>
        `;
    } else {
        itemsContainer.innerHTML = cart.map(item => `
            <div class="flex items-center gap-4 p-3 bg-black/40 rounded-xl border border-white/5">
                <img src="${item.image}" alt="${item.title}" class="w-16 h-16 object-cover rounded-lg">
                <div class="flex-1">
                    <h4 class="text-xs font-serif text-white font-medium">${item.title}</h4>
                    <span class="text-[10px] text-gold-400">${item.brand}</span>
                    <div class="text-xs font-bold text-gold-300 mt-1">${formatPrice(item.priceMXN)}</div>
                </div>
                <div class="flex items-center gap-2 bg-surfaceDark px-2 py-1 rounded-lg border border-white/10">
                    <button onclick="updateCartQuantity('${item.id}', -1)" class="text-gray-400 hover:text-white text-xs">-</button>
                    <span class="text-xs font-bold">${item.quantity}</span>
                    <button onclick="updateCartQuantity('${item.id}', 1)" class="text-gray-400 hover:text-white text-xs">+</button>
                </div>
            </div>
        `).join('');
    }

    subtotalEl.innerText = formatPrice(totalAmountMXN);
    totalEl.innerText = formatPrice(totalAmountMXN);

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Modal de Detalle de Producto
function openProductModal(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById('product-modal');
    const content = document.getElementById('modal-content');

    content.innerHTML = `
        <div class="aspect-square relative overflow-hidden">
            <img src="${product.image}" alt="${product.title}" class="w-full h-full object-cover">
        </div>
        <div class="p-6 sm:p-8 space-y-4 flex flex-col justify-between">
            <div>
                <span class="text-xs uppercase tracking-widest text-gold-400 font-medium">${product.brand}</span>
                <h2 class="font-serif text-2xl font-bold text-white mt-1">${product.title}</h2>
                <div class="text-xl font-serif font-bold text-gold-300 mt-2">${formatPrice(product.priceMXN)}</div>
                <p class="text-xs text-gray-300 mt-3 leading-relaxed font-light">${product.description}</p>

                <!-- Pirámide Olfativa -->
                <div class="mt-6 space-y-2 pt-4 border-t border-white/10 text-xs">
                    <h4 class="font-serif text-gold-400 font-semibold uppercase tracking-wider text-[10px]">Pirámide Olfativa</h4>
                    <div class="bg-black/30 p-2.5 rounded-lg">
                        <strong class="text-white">Salida:</strong> <span class="text-gray-400">${product.notes.top}</span>
                    </div>
                    <div class="bg-black/30 p-2.5 rounded-lg">
                        <strong class="text-white">Corazón:</strong> <span class="text-gray-400">${product.notes.heart}</span>
                    </div>
                    <div class="bg-black/30 p-2.5 rounded-lg">
                        <strong class="text-white">Fondo:</strong> <span class="text-gray-400">${product.notes.base}</span>
                    </div>
                </div>
            </div>

            <button onclick="addToCart('${product.id}'); closeProductModal();" class="w-full gold-gradient-bg text-black font-semibold py-3 rounded-full text-sm hover:shadow-lg hover:shadow-gold-500/20 transition-all flex items-center justify-center gap-2 mt-4">
                <i data-lucide="shopping-bag" class="w-4 h-4"></i>
                <span>Agregar al Carrito</span>
            </button>
        </div>
    `;

    modal.classList.remove('hidden');
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function closeProductModal() {
    document.getElementById('product-modal').classList.add('hidden');
}

// Simulador de Proceso de Pago
/* function checkout() {
    if (cart.length === 0) {
        alert('Agrega al menos una fragancia a tu carrito para proceder.');
        return;
    }

    toggleCart();
    const orderNum = `#LUMI-${Math.floor(10000 + Math.random() * 90000)}`;
    document.getElementById('order-number-display').innerText = `N° DE ORDEN: ${orderNum}`;
    document.getElementById('order-success-modal').classList.remove('hidden');

    // Vaciar carrito tras la compra exitosa
    cart = [];
    updateCartUI();
}
*/
// INICIA Enlace directo de Checkout por WhatsApp
// Enlace directo de Checkout por WhatsApp con datos de transferencia
function checkout() {
    if (cart.length === 0) {
        alert('Agrega al menos una fragancia a tu carrito para proceder.');
        return;
    }

    // 1. Configura tu teléfono de WhatsApp (incluye código de país, ej. 52 para México)
    const phoneNumber = "529624505235"; // <-- CAMBIA ESTE NÚMERO POR EL TUYO

    // 2. Definir datos de transferencia bancaria
    const bankDetails = {
        banco: "BBVA",
        titular: "Iszaro Parfums S.A. de C.V.",
        clabe: "012180000000000000",
        cuenta: "1234567890"
    };

    // 3. Construir el resumen del pedido
    let message = "✨ *NUEVO PEDIDO - Iszaro PARFUMS* ✨\n\n";
    message += "Hola, me gustaría solicitar la compra de los siguientes productos:\n\n";

    let totalAmountMXN = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.priceMXN * item.quantity;
        totalAmountMXN += itemTotal;
        message += `*${index + 1}. ${item.title}* (${item.brand})\n`;
        message += `   • Cantidad: ${item.quantity}\n`;
        message += `   • Precio: ${formatPrice(item.priceMXN)}\n\n`;
    });

    message += `*TOTAL A PAGAR:* ${formatPrice(totalAmountMXN)}\n`;
    message += `-----------------------------------\n\n`;

    // 4. Agregar los datos bancarios al mensaje
    message += "💳 *DATOS PARA TRANSFERENCIA BANCARIA (SPEI):*\n";
    message += `• *Banco:* ${bankDetails.banco}\n`;
    message += `• *Titular:* ${bankDetails.titular}\n`;
    message += `• *CLABE:* ${bankDetails.clabe}\n`;
    message += `• *N° Cuenta:* ${bankDetails.cuenta}\n\n`;

    message += "📌 *Nota:* Una vez realizada la transferencia, enviaré el comprobante por este medio. ¡Gracias!";

    // 5. Crear enlace encodeado y abrir WhatsApp
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    // 6. Mostrar modal de confirmación en la web
    toggleCart();
    const orderNum = `#Iszaro-${Math.floor(10000 + Math.random() * 90000)}`;
    
    // Opcional: mostrar CLABE en el modal si tienes el contenedor HTML
    const orderDisplay = document.getElementById('order-number-display');
    if (orderDisplay) {
        orderDisplay.innerText = `N° DE ORDEN: ${orderNum}`;
    }

    document.getElementById('order-success-modal').classList.remove('hidden');

    // Vaciar carrito
    cart = [];
    updateCartUI();
}

// FIN Enlace directo de Checkout por WhatsApp

function closeOrderSuccessModal() {
    document.getElementById('order-success-modal').classList.add('hidden');
}

// Asesor Olfativo (Quiz)
function nextQuizStep(type, value) {
    quizAnswers[type] = value;

    if (type === 'ocasion') {
        document.getElementById('quiz-step-1').classList.add('hidden');
        document.getElementById('quiz-step-2').classList.remove('hidden');
    } else if (type === 'familia') {
        document.getElementById('quiz-step-2').classList.add('hidden');
        
        // Recomendar perfume basado en respuestas
        let recommended = PRODUCTS[0]; // Por defecto Baccarat
        if (value === 'amaderado') {
            recommended = PRODUCTS.find(p => p.id === '4') || PRODUCTS[0];
        } else if (value === 'fresco') {
            recommended = PRODUCTS.find(p => p.id === '2') || PRODUCTS[0];
        } else if (value === 'dulce') {
            recommended = PRODUCTS.find(p => p.id === '3') || PRODUCTS[0];
        }

        const resContainer = document.getElementById('quiz-recommended-product');
        resContainer.innerHTML = `
            <img src="${recommended.image}" alt="${recommended.title}" class="w-20 h-20 object-cover rounded-xl mx-auto mb-3">
            <span class="text-[10px] text-gold-400 uppercase tracking-widest">${recommended.brand}</span>
            <h4 class="font-serif text-base text-white font-bold">${recommended.title}</h4>
            <p class="text-xs text-gold-300 font-bold mt-1">${formatPrice(recommended.priceMXN)}</p>
            <button onclick="addToCart('${recommended.id}')" class="mt-3 w-full gold-gradient-bg text-black font-semibold text-xs py-2 rounded-full">Comprar Ahora</button>
        `;

        document.getElementById('quiz-result').classList.remove('hidden');
    }
}

function resetQuiz() {
    quizAnswers = {};
    document.getElementById('quiz-result').classList.add('hidden');
    document.getElementById('quiz-step-1').classList.remove('hidden');
}

// INICIA CODIGO PARA QUE NO PUEDAN HACER CLIC DERECHO Y VER EL CODIGO FUENTE
// 1. Desactivar Clic Derecho
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});

// 2. Desactivar atajos de teclado para ver inspeccionar o ver código fuente
document.addEventListener('keydown', function (e) {
    // Evitar F12
    if (e.key === 'F12') {
        e.preventDefault();
    }
    // Evitar Ctrl+U (Ver código fuente)
    if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
    }
    // Evitar Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C (Inspeccionar elemento)
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
        e.preventDefault();
    }
});
// FIN CODIGO PARA QUE NO PUEDAN HACER CLIC DERECHO Y VER EL CODIGO FUENTE