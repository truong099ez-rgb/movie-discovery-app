// Dữ liệu mẫu (Yêu cầu đề bài)
const movies = [
    { id: 1, title: "Inception", year: 2010, genres: ["Hành động", "Khoa học"], director: "Christopher Nolan", desc: "Kẻ trộm bí mật qua giấc mơ.", poster: "https://via.placeholder.com/300x450" },
    { id: 2, title: "The Dark Knight", year: 2008, genres: ["Hành động", "Tội phạm"], director: "Christopher Nolan", desc: "Batman đối đầu Joker.", poster: "https://via.placeholder.com/300x450" },
    // ... Thêm phim vào đây
];

let currentFilters = { search: "", genres: [] };

// 1. Render Phim & Tự động phát hiện Thể loại (Bài 2.1 & 2.2)
function init() {
    renderMovies(movies);
    renderGenres();
}

function renderGenres() {
    const allGenres = [...new Set(movies.flatMap(m => m.genres))];
    const genreList = document.getElementById('genre-list');
    allGenres.forEach(genre => {
        const div = document.createElement('div');
        div.innerHTML = `<label><input type="checkbox" class="genre-cb" value="${genre}"> ${genre}</label>`;
        genreList.appendChild(div);
    });
}

function renderMovies(data) {
    const display = document.getElementById('movie-display');
    display.innerHTML = data.map(m => `
        <div class="movie-card" onclick="openModal(${m.id})">
            <img src="${m.poster}" style="width:100%">
            <div style="padding:10px">
                <h4>${m.title}</h4>
                <p>${m.year}</p>
            </div>
        </div>
    `).join('');
}

// 2. Logic Lọc & Debounce (Bài 2.3, 2.4, 2.5)
const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
};

const filterData = () => {
    const filtered = movies.filter(m => {
        const matchSearch = m.title.toLowerCase().includes(currentFilters.search.toLowerCase());
        const matchGenre = currentFilters.genres.length === 0 || 
                           m.genres.some(g => currentFilters.genres.includes(g));
        return matchSearch && matchGenre;
    });
    renderMovies(filtered);
};

document.getElementById('search-input').addEventListener('input', debounce((e) => {
    currentFilters.search = e.target.value;
    filterData();
}, 400));

document.addEventListener('change', (e) => {
    if (e.target.classList.contains('genre-cb')) {
        const val = e.target.value;
        if (e.target.checked) currentFilters.genres.push(val);
        else currentFilters.genres = currentFilters.genres.filter(g => g !== val);
        filterData();
    }
});

// 3. Modal & Dark Mode (Bài 3)
const openModal = (id) => {
    const movie = movies.find(m => m.id === id);
    const modal = document.getElementById('movie-modal');
    document.getElementById('modal-details').innerHTML = `
        <h2>${movie.title}</h2>
        <p><strong>Đạo diễn:</strong> ${movie.director}</p>
        <p>${movie.desc}</p>
    `;
    modal.style.display = "block";
};

document.querySelector('.close-modal').onclick = () => {
    document.getElementById('movie-modal').style.display = "none";
};

// Toggle Dark Mode
const toggleBtn = document.getElementById('checkbox');
toggleBtn.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
});

// Load LocalStorage
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    toggleBtn.checked = true;
}

init();