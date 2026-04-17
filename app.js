import { createClient } from '@supabase/supabase-js'

// Pobierz te wartości z panelu Supabase (Settings > API)
const supabaseUrl = 'https://xfrmdatpjcjwfpgdtklf.supabase.co/'
const supabaseAnonKey = 'sb_publishable_O34fEUEcXoVfzvgjKQ5zDA_oIv1Ceyf'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Stwórz klienta
  const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  
  // Test połączenia (pobranie danych z tabeli 'test')
  async function test() {
    const { data, error } = await supabaseClient.from('test').select('*')
    console.log(data)
  }
  test()

// Initial books data
let books = [
    {
        id: 1,
        title: 'The Silent Forest',
        author: 'Emily Adams',
        year: 2001,
        publisher: 'Harbor Press',
        coverGradient: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
        isFavorite: false,
        description: 'A captivating mystery set deep within an ancient forest. When a young woman ventures into the woods in search of her missing brother, she uncovers long-hidden secrets and encounters unexpected dangers. A tale of suspense, discovery, and survival.'
    },
    {
        id: 2,
        title: 'Beyond the Stars',
        author: 'Mark Collins',
        year: 2019,
        publisher: 'Cosmos Publishing',
        coverGradient: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
        isFavorite: true,
        description: 'An epic space odyssey that explores the boundaries of human exploration. Follow a crew of astronauts as they venture into the unknown reaches of the galaxy, facing challenges that test their courage and determination.'
    },
    {
        id: 3,
        title: 'Ocean Depths',
        author: 'Sarah Lee',
        year: 2018,
        publisher: 'Marine Books',
        coverGradient: 'linear-gradient(135deg, #006064 0%, #004d40 100%)',
        isFavorite: false,
        description: 'Dive into the mysterious world beneath the waves. This thrilling adventure follows marine biologists as they discover new species and ancient secrets hidden in the deepest parts of the ocean.'
    },
    {
        id: 4,
        title: 'City Lights',
        author: 'Michael Brown',
        year: 2020,
        publisher: 'Urban Tales',
        coverGradient: 'linear-gradient(135deg, #e65100 0%, #bf360c 100%)',
        isFavorite: false,
        description: 'A contemporary novel set in the heart of a bustling metropolis. Experience the interconnected lives of diverse characters as they navigate love, loss, and the pursuit of their dreams in the city that never sleeps.'
    },
    {
        id: 5,
        title: 'Ancient Ruins',
        author: 'Laura White',
        year: 2017,
        publisher: 'History House',
        coverGradient: 'linear-gradient(135deg, #6d4c41 0%, #4e342e 100%)',
        isFavorite: true,
        description: 'An archaeological adventure that takes readers on a journey through time. Discover lost civilizations and unravel the mysteries of ancient structures that have stood for millennia.'
    },
    {
        id: 6,
        title: 'Into the Wild',
        author: 'James Turner',
        year: 2022,
        publisher: 'Adventure Press',
        coverGradient: 'linear-gradient(135deg, #33691e 0%, #1b5e20 100%)',
        isFavorite: false,
        description: 'A gripping tale of survival and self-discovery. Follow a young adventurer who leaves civilization behind to find themselves in the untamed wilderness, learning valuable lessons about life and nature.'
    }
];

// State
let currentFilter = 'all';
let searchQuery = '';

// DOM Elements
const booksGrid = document.getElementById('booksGrid');
const searchInput = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('.filter-btn');
const addBookBtn = document.getElementById('addBookBtn');
const addBookModal = document.getElementById('addBookModal');
const closeModal = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const addBookForm = document.getElementById('addBookForm');
const detailPanel = document.getElementById('detailPanel');
const closeDetail = document.getElementById('closeDetail');
const detailContent = document.getElementById('detailContent');

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    setupEventListeners();
    await loadBooksFromSupabase();
    renderBooks();
});

// Setup Event Listeners
function setupEventListeners() {
    // Search
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        renderBooks();
    });

    // Filter buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            renderBooks();
        });
    });

    // Add book modal
    addBookBtn.addEventListener('click', () => {
        addBookModal.classList.add('active');
    });

    closeModal.addEventListener('click', () => {
        addBookModal.classList.remove('active');
    });

    cancelBtn.addEventListener('click', () => {
        addBookModal.classList.remove('active');
    });

    // Close modal on background click
    addBookModal.addEventListener('click', (e) => {
        if (e.target === addBookModal) {
            addBookModal.classList.remove('active');
        }
    });

    // Add book form
    addBookForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addBook();
    });

    // Detail panel
    closeDetail.addEventListener('click', () => {
        detailPanel.classList.remove('active');
    });

    // Navigation items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            if (item.id !== 'addBookBtn') {
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
            }
        });
    });
}

// Filter books
function getFilteredBooks() {
    let filtered = books;

    // Apply search filter
    if (searchQuery) {
        filtered = filtered.filter(book =>
            book.title.toLowerCase().includes(searchQuery) ||
            book.author.toLowerCase().includes(searchQuery)
        );
    }

    // Apply category filter
    if (currentFilter === 'favorites') {
        filtered = filtered.filter(book => book.isFavorite);
    } else if (currentFilter === 'recent') {
        filtered = filtered.filter(book => book.year >= 2020);
    }

    return filtered;
}

// Render books
function renderBooks() {
    const filteredBooks = getFilteredBooks();
    booksGrid.innerHTML = '';

    if (filteredBooks.length === 0) {
        booksGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #6b7280; padding: 40px;">No books found</p>';
        return;
    }

    filteredBooks.forEach(book => {
        const bookCard = createBookCard(book);
        booksGrid.appendChild(bookCard);
    });

    // Show/hide "Show More" button
    const showMoreContainer = document.getElementById('showMoreContainer');
    if (filteredBooks.length > 6) {
        showMoreContainer.style.display = 'flex';
    } else {
        showMoreContainer.style.display = 'none';
    }
}

// Create book card
function createBookCard(book) {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.onclick = () => showBookDetail(book);

    card.innerHTML = `
        <div class="book-cover" style="background: ${book.coverGradient}">
            <div class="book-title">${book.title}</div>
            <div class="book-author">${book.author}</div>
            <div class="book-year">${book.year}</div>
        </div>
    `;

    return card;
}

// Show book detail
function showBookDetail(book) {
    detailContent.innerHTML = `
        <div class="detail-book-info">
            <div class="detail-cover" style="background: ${book.coverGradient}">
                <div class="book-title">${book.title}</div>
                <div class="book-author">${book.author}</div>
            </div>
            <div class="detail-info">
                <h2>${book.title}</h2>
                <div class="author-name">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    ${book.author}
                </div>
                <div class="detail-meta">
                    <div class="detail-meta-item">
                        <strong>Author:</strong>
                        <span>${book.author}</span>
                    </div>
                    <div class="detail-meta-item">
                        <strong>Year:</strong>
                        <span>${book.year}</span>
                    </div>
                    <div class="detail-meta-item">
                        <strong>Publisher:</strong>
                        <span>${book.publisher}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="detail-description">
            <h3>Description</h3>
            <p>${book.description}</p>
        </div>
        <button class="detail-edit-btn" onclick="toggleFavorite(${book.id})">
            ${book.isFavorite ? '★' : '☆'} ${book.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </button>
    `;

    detailPanel.classList.add('active');
}

// Add new book
async function addBook() {
    const title = document.getElementById('bookTitle').value;
    const author = document.getElementById('bookAuthor').value;
    const year = parseInt(document.getElementById('bookYear').value);
    const publisher = document.getElementById('bookPublisher').value;
    const description = document.getElementById('bookDescription').value;

    const gradients = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
        'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
    ];

    const newBook = {
        title,
        author,
        year,
        publisher,
        description: description || 'No description available.',
        cover_gradient: gradients[Math.floor(Math.random() * gradients.length)],
        is_favorite: false
    };

    const { data, error } = await supabase
        .from('ksiazki')
        .insert([newBook])
        .select()
        .single();

    if (error) {
        console.error('Błąd podczas zapisu książki:', error);
        alert('Nie udało się zapisać książki.');
        return;
    }

    ksiazki.push({
        id: data.id,
        title: data.title,
        author: data.author,
        year: data.year,
        publisher: data.publisher,
        description: data.description,
        coverGradient: data.cover_gradient,
        isFavorite: data.is_favorite
    });

    renderBooks();
    addBookForm.reset();
    addBookModal.classList.remove('active');
}

// Toggle favorite
async function toggleFavorite(bookId) {
    const book = ksiazki.find(b => b.id === bookId);
    if (!book) return;

    const newValue = !book.isFavorite;

    const { error } = await supabase
        .from('ksiazki')
        .update({ is_favorite: newValue })
        .eq('id', bookId);

    if (error) {
        console.error('Błąd podczas aktualizacji ulubionych:', error);
        alert('Nie udało się zaktualizować książki.');
        return;
    }

    book.isFavorite = newValue;
    renderBooks();
    showBookDetail(book);
}

// Local Storage
// function saveToLocalStorage() {
//     localStorage.setItem('books', JSON.stringify(books));
// }

async function loadBooksFromSupabase() {
    const { data, error } = await supabase
        .from('ksiazki')
        .select('*')
        .order('id', { ascending: true });

    if (error) {
        console.error('Błąd podczas pobierania książek:', error);
        return;
    }

    ksiazki = data.map(ksiazki => ({
        id: ksiazki.id,
        title: ksiazki.tytul,
        year: ksiazki.rok_wydania,
        publisher: ksiazki.created_at,
        description: ksiazki.update_at || 'No description available.',
    }));
}

// Make toggleFavorite available globally
window.toggleFavorite = toggleFavorite;
