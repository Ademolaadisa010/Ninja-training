/**
 * Filters.js - Training Listings Filter Logic
 * Handles filtering, sorting, and search for training listings
 */

class TrainingFilters {
    constructor() {
        this.trainings = [];
        this.filteredTrainings = [];
        this.currentPage = 1;
        this.itemsPerPage = 6;
        this.init();
    }

    init() {
        // Load sample training data (in production, this would come from API/database)
        this.loadTrainings();
        
        // Initialize filter event listeners
        this.initEventListeners();
        
        // Initial render
        this.applyFilters();
    }

    loadTrainings() {
        // Sample training data - replace with API call in production
        this.trainings = [
            {
                id: 1,
                title: "Full Stack Web Development Bootcamp",
                category: "tech",
                type: "online",
                price: 150000,
                duration: "6 months",
                location: null,
                city: null,
                state: null,
                image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop",
                description: "Learn HTML, CSS, JavaScript, React, and Node.js with hands-on projects.",
                featured: true,
                provider: "TechPro Academy",
                rating: 4.8
            },
            {
                id: 2,
                title: "Digital Marketing Masterclass",
                category: "business",
                type: "online",
                price: 75000,
                duration: "3 months",
                location: null,
                city: null,
                state: null,
                image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
                description: "Master SEO, social media marketing, and paid advertising.",
                featured: true,
                provider: "Digital Masters NG",
                rating: 4.6
            },
            {
                id: 3,
                title: "Professional Fashion Design",
                category: "creative",
                type: "physical",
                price: 80000,
                duration: "4 months",
                location: "Abuja",
                city: "Abuja",
                state: "FCT",
                image: "https://images.unsplash.com/photo-1558769132-cb1aea1f1c1c?w=800&h=600&fit=crop",
                description: "Master pattern making, sewing techniques, and fashion illustration.",
                featured: false,
                provider: "Style Academy",
                rating: 4.7
            },
            {
                id: 4,
                title: "Data Science & Analytics",
                category: "tech",
                type: "online",
                price: 200000,
                duration: "5 months",
                location: null,
                city: null,
                state: null,
                image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop",
                description: "Master Python, SQL, machine learning, and data visualization.",
                featured: true,
                provider: "Data Science NG",
                rating: 4.9
            },
            {
                id: 5,
                title: "Professional Photography",
                category: "creative",
                type: "physical",
                price: 90000,
                duration: "5 months",
                location: "Ibadan",
                city: "Ibadan",
                state: "Oyo",
                image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&h=600&fit=crop",
                description: "Learn camera techniques, lighting, and editing.",
                featured: false,
                provider: "Lens Masters",
                rating: 4.5
            },
            {
                id: 6,
                title: "Professional Catering",
                category: "creative",
                type: "physical",
                price: 60000,
                duration: "3 months",
                location: "Port Harcourt",
                city: "Port Harcourt",
                state: "Rivers",
                image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=600&fit=crop",
                description: "Learn menu planning, food preparation, and event catering.",
                featured: false,
                provider: "Culinary Arts PH",
                rating: 4.4
            }
        ];

        this.filteredTrainings = [...this.trainings];
    }

    initEventListeners() {
        // Category checkboxes
        document.querySelectorAll('input[type="checkbox"][value]').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.applyFilters());
        });

        // Price radio buttons
        document.querySelectorAll('input[name="price"]').forEach(radio => {
            radio.addEventListener('change', () => this.applyFilters());
        });

        // State/City selects
        const stateSelect = document.querySelector('select[name="state"]');
        const citySelect = document.querySelector('select[name="city"]');
        
        if (stateSelect) {
            stateSelect.addEventListener('change', () => this.applyFilters());
        }
        
        if (citySelect) {
            citySelect.addEventListener('change', () => this.applyFilters());
        }

        // Search input
        const searchInput = document.querySelector('input[type="text"][placeholder*="Search"]');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTrainings(e.target.value);
            });
        }

        // Sort dropdown
        const sortSelect = document.querySelector('select');
        if (sortSelect && sortSelect.options[0].text === 'Latest') {
            sortSelect.addEventListener('change', (e) => {
                this.sortTrainings(e.target.value);
            });
        }

        // Apply filters button
        const applyBtn = document.querySelector('button:contains("Apply Filters")');
        if (applyBtn) {
            applyBtn.addEventListener('click', () => this.applyFilters());
        }

        // Reset filters button
        const resetBtn = document.getElementById('reset-filters');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetFilters());
        }

        // Type filter buttons (All/Online/Physical)
        document.querySelectorAll('button[class*="px-4 py-2"]').forEach(btn => {
            if (btn.textContent.includes('All Trainings') || 
                btn.textContent.includes('Online Only') || 
                btn.textContent.includes('Physical Only')) {
                btn.addEventListener('click', (e) => {
                    this.filterByType(e.target);
                });
            }
        });
    }

    applyFilters() {
        let filtered = [...this.trainings];

        // Filter by category
        const selectedCategories = this.getSelectedCategories();
        if (selectedCategories.length > 0) {
            filtered = filtered.filter(training => 
                selectedCategories.includes(training.category)
            );
        }

        // Filter by price
        const priceRange = this.getSelectedPriceRange();
        if (priceRange) {
            filtered = this.filterByPrice(filtered, priceRange);
        }

        // Filter by duration
        const selectedDurations = this.getSelectedDurations();
        if (selectedDurations.length > 0) {
            filtered = this.filterByDuration(filtered, selectedDurations);
        }

        // Filter by state/location (for physical trainings)
        const selectedState = this.getSelectedState();
        if (selectedState) {
            filtered = filtered.filter(training => 
                training.state === selectedState
            );
        }

        const selectedCity = this.getSelectedCity();
        if (selectedCity) {
            filtered = filtered.filter(training => 
                training.city === selectedCity
            );
        }

        this.filteredTrainings = filtered;
        this.currentPage = 1;
        this.renderTrainings();
        this.updateResultsCount();
    }

    getSelectedCategories() {
        const categories = [];
        document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
            if (checkbox.value && checkbox.value !== 'on') {
                categories.push(checkbox.value);
            }
        });
        return categories;
    }

    getSelectedPriceRange() {
        const selectedPrice = document.querySelector('input[name="price"]:checked');
        return selectedPrice ? selectedPrice.value : null;
    }

    filterByPrice(trainings, priceRange) {
        switch(priceRange) {
            case 'free':
                return trainings.filter(t => t.price === 0);
            case 'paid':
                return trainings.filter(t => t.price > 0);
            case '0-50000':
                return trainings.filter(t => t.price <= 50000);
            case '50000-100000':
                return trainings.filter(t => t.price > 50000 && t.price <= 100000);
            case '100000+':
                return trainings.filter(t => t.price > 100000);
            default:
                return trainings;
        }
    }

    getSelectedDurations() {
        const durations = [];
        document.querySelectorAll('input[type="checkbox"][value*="month"]:checked').forEach(checkbox => {
            durations.push(checkbox.value);
        });
        return durations;
    }

    filterByDuration(trainings, selectedDurations) {
        return trainings.filter(training => {
            const duration = training.duration.toLowerCase();
            return selectedDurations.some(selected => {
                if (selected === '1month') return duration.includes('1 month') || duration.includes('weeks');
                if (selected === '1-3months') {
                    const months = parseInt(duration);
                    return months >= 1 && months <= 3;
                }
                if (selected === '3-6months') {
                    const months = parseInt(duration);
                    return months > 3 && months <= 6;
                }
                if (selected === '6months') {
                    const months = parseInt(duration);
                    return months > 6;
                }
                return false;
            });
        });
    }

    getSelectedState() {
        const stateSelect = document.querySelector('select[name="state"]');
        return stateSelect ? stateSelect.value : null;
    }

    getSelectedCity() {
        const citySelect = document.querySelector('select[name="city"]');
        return citySelect ? citySelect.value : null;
    }

    filterByType(button) {
        const text = button.textContent;
        
        // Update button styles
        document.querySelectorAll('button[class*="px-4 py-2"]').forEach(btn => {
            if (btn.textContent.includes('Trainings') || btn.textContent.includes('Only')) {
                btn.classList.remove('bg-green-600', 'text-white');
                btn.classList.add('bg-gray-100', 'text-gray-700');
            }
        });
        button.classList.remove('bg-gray-100', 'text-gray-700');
        button.classList.add('bg-green-600', 'text-white');

        // Filter trainings
        if (text.includes('Online Only')) {
            this.filteredTrainings = this.trainings.filter(t => t.type === 'online');
        } else if (text.includes('Physical Only')) {
            this.filteredTrainings = this.trainings.filter(t => t.type === 'physical');
        } else {
            this.filteredTrainings = [...this.trainings];
        }

        this.currentPage = 1;
        this.renderTrainings();
        this.updateResultsCount();
    }

    searchTrainings(query) {
        if (!query || query.trim() === '') {
            this.applyFilters();
            return;
        }

        query = query.toLowerCase();
        this.filteredTrainings = this.trainings.filter(training => {
            return training.title.toLowerCase().includes(query) ||
                   training.description.toLowerCase().includes(query) ||
                   training.category.toLowerCase().includes(query) ||
                   (training.location && training.location.toLowerCase().includes(query));
        });

        this.currentPage = 1;
        this.renderTrainings();
        this.updateResultsCount();
    }

    sortTrainings(sortBy) {
        switch(sortBy) {
            case 'Latest':
                this.filteredTrainings.sort((a, b) => b.id - a.id);
                break;
            case 'Price: Low to High':
                this.filteredTrainings.sort((a, b) => a.price - b.price);
                break;
            case 'Price: High to Low':
                this.filteredTrainings.sort((a, b) => b.price - a.price);
                break;
            case 'Duration':
                this.filteredTrainings.sort((a, b) => {
                    const durationA = parseInt(a.duration);
                    const durationB = parseInt(b.duration);
                    return durationA - durationB;
                });
                break;
            case 'Nearest to Me':
                // In production, use geolocation API
                console.log('Geolocation sorting not implemented');
                break;
        }
        this.renderTrainings();
    }

    renderTrainings() {
        const container = document.querySelector('.grid.grid-cols-1.lg\\:grid-cols-2');
        if (!container) return;

        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        const pageTrainings = this.filteredTrainings.slice(start, end);

        if (pageTrainings.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <i class="fas fa-search text-gray-400 text-6xl mb-4"></i>
                    <h3 class="text-xl font-bold text-gray-900 mb-2">No trainings found</h3>
                    <p class="text-gray-600 mb-6">Try adjusting your filters or search criteria</p>
                    <button onclick="trainingFilters.resetFilters()" class="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition">
                        Reset Filters
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = pageTrainings.map(training => this.createTrainingCard(training)).join('');
        this.renderPagination();
    }

    createTrainingCard(training) {
        const typeLabel = training.type === 'online' ? 'ONLINE' : 'PHYSICAL';
        const typeBgColor = training.type === 'online' ? 'bg-green-600' : 'bg-orange-600';
        const locationInfo = training.type === 'physical' 
            ? `<i class="fas fa-map-marker-alt mr-1 text-green-600"></i><span>${training.location}</span>`
            : `<i class="fas fa-clock mr-1"></i><span>${training.duration}</span>`;

        return `
            <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
                <div class="flex flex-col sm:flex-row">
                    <div class="sm:w-40 h-40 sm:h-auto bg-gradient-to-br from-blue-500 to-blue-700 relative flex-shrink-0">
                        <img src="${training.image}" alt="${training.title}" class="w-full h-full object-cover">
                        <span class="absolute top-2 left-2 ${typeBgColor} text-white px-2 py-1 rounded text-xs font-bold">${typeLabel}</span>
                    </div>
                    <div class="p-4 flex-1">
                        <h3 class="text-lg font-bold text-gray-900 mb-2">${training.title}</h3>
                        <p class="text-gray-600 text-sm mb-3 line-clamp-2">${training.description}</p>
                        <div class="flex items-center justify-between mb-3">
                            <div class="flex items-center text-gray-500 text-xs">
                                ${locationInfo}
                            </div>
                            <div class="text-green-600 font-bold">₦${training.price.toLocaleString()}</div>
                        </div>
                        <div class="flex gap-2">
                            <a href="training-details.html?id=${training.id}" class="flex-1 bg-green-600 text-white text-center py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition">
                                View Details
                            </a>
                            <a href="https://wa.me/2349076956531?text=I'm interested in ${encodeURIComponent(training.title)}" target="_blank" class="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition">
                                <i class="fab fa-whatsapp text-green-600"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderPagination() {
        const totalPages = Math.ceil(this.filteredTrainings.length / this.itemsPerPage);
        if (totalPages <= 1) return;

        const paginationContainer = document.querySelector('nav.flex.items-center');
        if (!paginationContainer) return;

        let paginationHTML = `
            <button onclick="trainingFilters.goToPage(${this.currentPage - 1})" 
                    class="px-3 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 ${this.currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}"
                    ${this.currentPage === 1 ? 'disabled' : ''}>
                <i class="fas fa-chevron-left"></i>
            </button>
        `;

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
                paginationHTML += `
                    <button onclick="trainingFilters.goToPage(${i})" 
                            class="px-4 py-2 ${i === this.currentPage ? 'bg-green-600 text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'} rounded-lg font-semibold">
                        ${i}
                    </button>
                `;
            } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
                paginationHTML += `<span class="px-3 py-2 text-gray-500">...</span>`;
            }
        }

        paginationHTML += `
            <button onclick="trainingFilters.goToPage(${this.currentPage + 1})" 
                    class="px-3 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 ${this.currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}"
                    ${this.currentPage === totalPages ? 'disabled' : ''}>
                <i class="fas fa-chevron-right"></i>
            </button>
        `;

        paginationContainer.innerHTML = paginationHTML;
    }

    goToPage(page) {
        const totalPages = Math.ceil(this.filteredTrainings.length / this.itemsPerPage);
        if (page < 1 || page > totalPages) return;
        
        this.currentPage = page;
        this.renderTrainings();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    updateResultsCount() {
        const countElement = document.querySelector('p.text-gray-700');
        if (countElement) {
            countElement.innerHTML = `<span class="font-semibold">${this.filteredTrainings.length}</span> ${this.filteredTrainings.length === 1 ? 'training' : 'trainings'} found`;
        }
    }

    resetFilters() {
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });

        // Reset radio buttons
        const allPriceRadio = document.querySelector('input[name="price"][value="all"]');
        if (allPriceRadio) allPriceRadio.checked = true;

        // Reset selects
        document.querySelectorAll('select').forEach(select => {
            select.selectedIndex = 0;
        });

        // Reset search
        const searchInput = document.querySelector('input[type="text"][placeholder*="Search"]');
        if (searchInput) searchInput.value = '';

        this.filteredTrainings = [...this.trainings];
        this.currentPage = 1;
        this.renderTrainings();
        this.updateResultsCount();
    }
}

let trainingFilters;
document.addEventListener('DOMContentLoaded', function() {
    trainingFilters = new TrainingFilters();
});