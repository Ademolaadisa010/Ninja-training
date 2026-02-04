/**
 * Admin Trainings Management
 * Full CRUD operations for training programs
 */

class AdminTrainings {
    constructor() {
        this.trainings = [];
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.filteredTrainings = [];
        this.editingId = null;
        this.init();
    }

    init() {
        // Load trainings from localStorage (simulating database)
        this.loadTrainings();
        
        // Initialize event listeners
        this.initEventListeners();
        
        // Render trainings table
        this.renderTrainings();
    }

    loadTrainings() {
        // Check if trainings exist in localStorage
        const stored = localStorage.getItem('naijatrainings_data');
        
        if (stored) {
            this.trainings = JSON.parse(stored);
        } else {
            // Sample data
            this.trainings = [
                {
                    id: 1,
                    title: "Full Stack Web Development Bootcamp",
                    description: "Learn HTML, CSS, JavaScript, React, Node.js and build real-world projects with job placement support.",
                    category: "tech",
                    type: "online",
                    price: 150000,
                    duration: "6 months",
                    provider: "TechPro Academy",
                    location: null,
                    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800",
                    status: "active",
                    featured: true,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    title: "Digital Marketing Masterclass",
                    description: "Master SEO, social media marketing, content creation, and paid advertising.",
                    category: "business",
                    type: "online",
                    price: 75000,
                    duration: "3 months",
                    provider: "Digital Masters NG",
                    location: null,
                    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
                    status: "active",
                    featured: true,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 3,
                    title: "Professional Fashion Design",
                    description: "Master pattern making, sewing techniques, and fashion illustration.",
                    category: "creative",
                    type: "physical",
                    price: 80000,
                    duration: "4 months",
                    provider: "Style Academy",
                    location: "Abuja, FCT",
                    image: "https://images.unsplash.com/photo-1558769132-cb1aea1f1c1c?w=800",
                    status: "pending",
                    featured: false,
                    createdAt: new Date().toISOString()
                }
            ];
            this.saveTrainings();
        }
        
        this.filteredTrainings = [...this.trainings];
    }

    saveTrainings() {
        localStorage.setItem('naijatrainings_data', JSON.stringify(this.trainings));
    }

    initEventListeners() {
        // Form submission
        const form = document.getElementById('trainingForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveTraining();
            });
        }

        // Search
        const searchInput = document.getElementById('searchTraining');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTrainings(e.target.value);
            });
        }

        // Category filter
        const categoryFilter = document.getElementById('filterCategory');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => {
                this.applyFilters();
            });
        }

        // Status filter
        const statusFilter = document.getElementById('filterStatus');
        if (statusFilter) {
            statusFilter.addEventListener('change', () => {
                this.applyFilters();
            });
        }
    }

    renderTrainings() {
        const tbody = document.getElementById('trainingsTableBody');
        if (!tbody) return;

        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        const pageTrainings = this.filteredTrainings.slice(start, end);

        if (pageTrainings.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                        <i class="fas fa-inbox text-4xl mb-2"></i>
                        <p>No trainings found</p>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = pageTrainings.map(training => this.createTrainingRow(training)).join('');
        this.renderPagination();
    }

    createTrainingRow(training) {
        const statusColors = {
            active: 'bg-green-100 text-green-600',
            pending: 'bg-yellow-100 text-yellow-600',
            inactive: 'bg-red-100 text-red-600'
        };

        return `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4">
                    <div class="flex items-center space-x-3">
                        <img src="${training.image || 'https://via.placeholder.com/60'}" alt="${training.title}" class="w-12 h-12 rounded-lg object-cover">
                        <div>
                            <p class="font-semibold text-gray-900">${training.title}</p>
                            <p class="text-sm text-gray-500">${training.provider}</p>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4">
                    <span class="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs font-semibold uppercase">${training.category}</span>
                </td>
                <td class="px-6 py-4">
                    <span class="px-2 py-1 ${training.type === 'online' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'} rounded text-xs font-semibold uppercase">${training.type}</span>
                </td>
                <td class="px-6 py-4 font-semibold text-gray-900">₦${training.price.toLocaleString()}</td>
                <td class="px-6 py-4">
                    <span class="px-2 py-1 ${statusColors[training.status]} rounded text-xs font-semibold uppercase">${training.status}</span>
                </td>
                <td class="px-6 py-4">
                    <div class="flex items-center space-x-2">
                        <button onclick="adminTrainings.editTraining(${training.id})" class="p-2 text-blue-600 hover:bg-blue-50 rounded" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="adminTrainings.deleteTraining(${training.id})" class="p-2 text-red-600 hover:bg-red-50 rounded" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                        ${training.status === 'pending' ? `
                        <button onclick="adminTrainings.approveTraining(${training.id})" class="p-2 text-green-600 hover:bg-green-50 rounded" title="Approve">
                            <i class="fas fa-check"></i>
                        </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `;
    }

    renderPagination() {
        const totalPages = Math.ceil(this.filteredTrainings.length / this.itemsPerPage);
        const pagination = document.getElementById('pagination');
        
        if (!pagination || totalPages <= 1) {
            if (pagination) pagination.innerHTML = '';
            return;
        }

        let html = `
            <button onclick="adminTrainings.goToPage(${this.currentPage - 1})" 
                    class="px-3 py-2 border rounded-lg ${this.currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}"
                    ${this.currentPage === 1 ? 'disabled' : ''}>
                <i class="fas fa-chevron-left"></i>
            </button>
        `;

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
                html += `
                    <button onclick="adminTrainings.goToPage(${i})" 
                            class="px-4 py-2 rounded-lg ${i === this.currentPage ? 'bg-green-600 text-white' : 'border hover:bg-gray-50'}">
                        ${i}
                    </button>
                `;
            } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
                html += `<span class="px-2">...</span>`;
            }
        }

        html += `
            <button onclick="adminTrainings.goToPage(${this.currentPage + 1})" 
                    class="px-3 py-2 border rounded-lg ${this.currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}"
                    ${this.currentPage === totalPages ? 'disabled' : ''}>
                <i class="fas fa-chevron-right"></i>
            </button>
        `;

        pagination.innerHTML = html;
    }

    goToPage(page) {
        const totalPages = Math.ceil(this.filteredTrainings.length / this.itemsPerPage);
        if (page < 1 || page > totalPages) return;
        
        this.currentPage = page;
        this.renderTrainings();
    }

    searchTrainings(query) {
        query = query.toLowerCase();
        this.filteredTrainings = this.trainings.filter(training => 
            training.title.toLowerCase().includes(query) ||
            training.description.toLowerCase().includes(query) ||
            training.provider.toLowerCase().includes(query)
        );
        this.currentPage = 1;
        this.renderTrainings();
    }

    applyFilters() {
        const category = document.getElementById('filterCategory')?.value;
        const status = document.getElementById('filterStatus')?.value;

        this.filteredTrainings = this.trainings.filter(training => {
            const matchCategory = !category || training.category === category;
            const matchStatus = !status || training.status === status;
            return matchCategory && matchStatus;
        });

        this.currentPage = 1;
        this.renderTrainings();
    }

    saveTraining() {
        const form = document.getElementById('trainingForm');
        const trainingData = {
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            category: document.getElementById('category').value,
            type: document.getElementById('type').value,
            price: parseFloat(document.getElementById('price').value),
            duration: document.getElementById('duration').value,
            provider: document.getElementById('provider').value,
            location: document.getElementById('location').value || null,
            image: document.getElementById('image').value || null,
            status: document.getElementById('status').value,
            featured: document.getElementById('featured').checked
        };

        if (this.editingId) {
            // Update existing training
            const index = this.trainings.findIndex(t => t.id === this.editingId);
            this.trainings[index] = {
                ...this.trainings[index],
                ...trainingData,
                updatedAt: new Date().toISOString()
            };
            this.showNotification('Training updated successfully!', 'success');
        } else {
            // Add new training
            const newTraining = {
                id: Date.now(),
                ...trainingData,
                createdAt: new Date().toISOString()
            };
            this.trainings.unshift(newTraining);
            this.showNotification('Training added successfully!', 'success');
        }

        this.saveTrainings();
        this.filteredTrainings = [...this.trainings];
        this.renderTrainings();
        this.closeModal();
    }

    editTraining(id) {
        const training = this.trainings.find(t => t.id === id);
        if (!training) return;

        this.editingId = id;
        
        // Populate form
        document.getElementById('trainingId').value = training.id;
        document.getElementById('title').value = training.title;
        document.getElementById('description').value = training.description;
        document.getElementById('category').value = training.category;
        document.getElementById('type').value = training.type;
        document.getElementById('price').value = training.price;
        document.getElementById('duration').value = training.duration;
        document.getElementById('provider').value = training.provider;
        document.getElementById('location').value = training.location || '';
        document.getElementById('image').value = training.image || '';
        document.getElementById('status').value = training.status;
        document.getElementById('featured').checked = training.featured;

        document.getElementById('modalTitle').textContent = 'Edit Training';
        this.showModal();
    }

    deleteTraining(id) {
        if (!confirm('Are you sure you want to delete this training? This action cannot be undone.')) {
            return;
        }

        this.trainings = this.trainings.filter(t => t.id !== id);
        this.saveTrainings();
        this.filteredTrainings = [...this.trainings];
        this.renderTrainings();
        this.showNotification('Training deleted successfully!', 'success');
    }

    approveTraining(id) {
        const training = this.trainings.find(t => t.id === id);
        if (training) {
            training.status = 'active';
            this.saveTrainings();
            this.renderTrainings();
            this.showNotification('Training approved!', 'success');
        }
    }

    showModal() {
        const modal = document.getElementById('trainingModal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }
    }

    closeModal() {
        const modal = document.getElementById('trainingModal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
        
        // Reset form
        document.getElementById('trainingForm').reset();
        this.editingId = null;
        document.getElementById('modalTitle').textContent = 'Add New Training';
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        const colors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            info: 'bg-blue-500'
        };
        
        notification.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-fade-in`;
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Global functions for inline onclick handlers
let adminTrainings;

function showAddModal() {
    adminTrainings.editingId = null;
    document.getElementById('modalTitle').textContent = 'Add New Training';
    adminTrainings.showModal();
}

function closeModal() {
    adminTrainings.closeModal();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!localStorage.getItem('adminLoggedIn')) {
        window.location.href = 'login.html';
        return;
    }
    
    adminTrainings = new AdminTrainings();
});