// ========================================
// Dr. Carlos E. Cortés - Timeline Application
// Interactive Bibliography Timeline with Modal Navigation
// ========================================

// Configuration
const CONFIG = {
    dataUrl: 'assets/data/timeline-data.json',
    decades: [
        { key: '1970s', range: '1970-1979', theme: 'Chicano Studies Pioneer', color: '#2C3E50' },
        { key: '1980s', range: '1980-1989', theme: 'Multicultural Education Leader', color: '#8E44AD' },
        { key: '1990s', range: '1990-1999', theme: 'Media & Diversity Scholar', color: '#2980B9' },
        { key: '2000s', range: '2000-2009', theme: 'Creative Consulting', color: '#27AE60' },
        { key: '2010s', range: '2010-2019', theme: 'Creative Works & Memoirs', color: '#E74C3C' },
        { key: '2020s', range: '2020-2025', theme: 'Anti-Racism & Renewal', color: '#C0392B' }
    ],
    categoryColors: {
        'Books - Scholarly': '#1976d2',
        'Books - Edited Works': '#0288d1',
        'Articles': '#00796b',
        'Blogs': '#f57c00',
        'Plays': '#c2185b',
        'Novels': '#7b1fa2',
        'Books - Poetry': '#512da8',
        'Biography/Memoir': '#d32f2f',
        'Consulting Projects': '#0097a7',
        'Curriculum Development': '#388e3c',
        'Videos': '#e64a19',
        'Teaching Materials': '#5d4037',
        'Administrative Work': '#455a64',
        'Papers': '#689f38',
        'Books - Textbook Contributions': '#00838f'
    }
};

// Global state
const state = {
    data: null,
    activeModal: null,
    selectedDecade: null,
    selectedWork: null,
    activeFilters: new Set()
};

// ========== DATA LOADER ==========
class DataLoader {
    async load() {
        try {
            const response = await fetch(CONFIG.dataUrl);
            if (!response.ok) {
                throw new Error(`Failed to load data: ${response.statusText}`);
            }
            const data = await response.json();
            state.data = data;
            return data;
        } catch (error) {
            console.error('Error loading data:', error);
            // Return mock data if file doesn't exist yet
            return this.getMockData();
        }
    }

    getMockData() {
        return {
            biography: {
                name: "Dr. Carlos E. Cortés",
                title: "Edward A. Dickson Emeritus Professor of History",
                institution: "University of California, Riverside",
                bio: "Pioneering figure in multicultural education, ethnic studies, and diversity scholarship with a career spanning over five decades.",
                careerStart: 1968,
                totalWorks: "400+",
                awards: [
                    {
                        year: 1974,
                        award: "Hubert Herring Memorial Award",
                        description: "Pacific Coast Council on Latin American Studies for Gaúcho Politics in Brazil"
                    },
                    {
                        year: 2009,
                        award: "NAACP Image Award",
                        description: "Creative/Cultural Advisory work for Nickelodeon"
                    },
                    {
                        year: 2017,
                        award: "Honorable Mention - International Latino Book Awards",
                        description: "Best Book of Poetry for Fourth Quarter"
                    },
                    {
                        year: 2020,
                        award: "Constantine Panunzio Distinguished Emeriti Award",
                        description: "University of California (first from UCR)"
                    }
                ]
            },
            decades: {
                '1970s': {
                    theme: 'Chicano Studies Pioneer',
                    totalWorks: 8,
                    categories: {
                        'Books - Scholarly': [
                            {
                                title: "Gaúcho Politics in Brazil",
                                year: 1974,
                                category: "Books - Scholarly",
                                description: "Scholarly monograph examining regional politics in Rio Grande do Sul, Brazil.",
                                awards: "Hubert Herring Memorial Award",
                                isbn: "082630303X",
                                url: "https://www.amazon.com/Gaucho-Politics-Brazil-Grande-1930-1964/dp/082630303X"
                            },
                            {
                                title: "Three Perspectives on Ethnicity",
                                year: 1976,
                                category: "Books - Scholarly",
                                description: "Comparative analysis of Black, Chicano, and Native American ethnic experiences.",
                                isbn: "9780399503696"
                            }
                        ],
                        'Articles': [
                            {
                                title: "Teaching the Chicano Experience",
                                year: 1973,
                                category: "Articles",
                                description: "Foundational chapter on Chicano Studies pedagogy in James Banks' influential volume.",
                                url: "https://eric.ed.gov/?id=ED079204"
                            }
                        ]
                    }
                },
                '1980s': {
                    theme: 'Multicultural Education Leader',
                    totalWorks: 12,
                    categories: {
                        'Books - Edited Works': [
                            {
                                title: "Hispanics in the United States (30 volumes)",
                                year: 1980,
                                category: "Books - Edited Works",
                                description: "Monumental 30-volume series of Hispanic scholarship reprints.",
                                significance: "Major reference work in Hispanic studies"
                            }
                        ]
                    }
                },
                '1990s': {
                    theme: 'Media & Diversity Scholar',
                    totalWorks: 15,
                    categories: {
                        'Articles': [
                            {
                                title: "Media & Values Magazine Columns",
                                year: 1994,
                                category: "Articles",
                                description: "Series of articles on media treatment of diversity."
                            }
                        ]
                    }
                },
                '2000s': {
                    theme: 'Creative Consulting',
                    totalWorks: 10,
                    categories: {
                        'Books - Scholarly': [
                            {
                                title: "The Children Are Watching",
                                year: 2000,
                                category: "Books - Scholarly",
                                description: "Groundbreaking book analyzing how media teaches about diversity.",
                                isbn: "9780807739372",
                                url: "https://www.amazon.com/Children-Are-Watching-Diversity-Multicultural/dp/0807739375"
                            },
                            {
                                title: "The Making—and Remaking—of a Multiculturalist",
                                year: 2002,
                                category: "Books - Scholarly",
                                description: "Autobiographical educational memoir tracing the multicultural education movement.",
                                isbn: "9780807742518"
                            }
                        ]
                    }
                },
                '2010s': {
                    theme: 'Creative Works & Memoirs',
                    totalWorks: 8,
                    categories: {
                        'Biography/Memoir': [
                            {
                                title: "Rose Hill: An Intermarriage before Its Time",
                                year: 2012,
                                category: "Biography/Memoir",
                                description: "Memoir about growing up in an interracial, interfaith family in Kansas City.",
                                isbn: "9781597141888",
                                url: "https://www.heydaybooks.com/catalog/rose-hill-an-intermarriage-before-its-time/"
                            }
                        ],
                        'Books - Poetry': [
                            {
                                title: "Fourth Quarter: Reflections of a Cranky Old Man",
                                year: 2016,
                                category: "Books - Poetry",
                                description: "Poetry collection reflecting on aging and cultural change.",
                                awards: "Honorable Mention - 2017 International Latino Book Awards",
                                url: "https://www.amazon.com/Fourth-Quarter-Reflections-Cranky-Old/dp/1945378042"
                            }
                        ]
                    }
                },
                '2020s': {
                    theme: 'Anti-Racism & Renewal',
                    totalWorks: 4,
                    categories: {
                        'Novels': [
                            {
                                title: "Scouts' Honor",
                                year: 2025,
                                category: "Novels",
                                description: "Debut novel at age 91 - mystery set at Boy Scout Camp Matulia.",
                                significance: "First novel after career in academic scholarship"
                            }
                        ],
                        'Articles': [
                            {
                                title: "Renewing Multicultural Education: An Ancient Mariner's Manifesto",
                                year: 2025,
                                category: "Articles",
                                description: "Keynote address on three bad habits in multicultural education.",
                                url: "https://doi.org/10.1080/15210960.2025.2558492"
                            }
                        ]
                    }
                }
            }
        };
    }

    getAllWorks() {
        if (!state.data?.decades) return [];

        const works = [];
        for (const decade of Object.values(state.data.decades)) {
            if (decade.categories) {
                for (const category of Object.values(decade.categories)) {
                    works.push(...category);
                }
            }
        }
        return works;
    }

    searchWorks(query) {
        const allWorks = this.getAllWorks();
        const lowerQuery = query.toLowerCase();

        return allWorks.filter(work => {
            return (
                work.title.toLowerCase().includes(lowerQuery) ||
                work.category.toLowerCase().includes(lowerQuery) ||
                work.description.toLowerCase().includes(lowerQuery) ||
                work.year.toString().includes(query)
            );
        });
    }
}

// ========== TIMELINE RENDERER ==========
class TimelineRenderer {
    constructor(svgElement) {
        this.svg = svgElement;
        this.width = 1400;
        this.height = 600;
    }

    render() {
        const padding = { left: 100, right: 100, top: 300, bottom: 300 };
        const timelineY = this.height / 2;
        const lineLength = this.width - padding.left - padding.right;
        const decadeSpacing = lineLength / (CONFIG.decades.length - 1);

        // Draw timeline line
        this.drawLine(padding.left, timelineY, lineLength);

        // Draw decade markers
        CONFIG.decades.forEach((decade, index) => {
            const x = padding.left + (index * decadeSpacing);
            this.drawDecadeMarker(x, timelineY, decade, index);
        });
    }

    drawLine(x, y, length) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x);
        line.setAttribute('y1', y);
        line.setAttribute('x2', x + length);
        line.setAttribute('y2', y);
        line.classList.add('timeline-line');

        this.svg.appendChild(line);

        // Animate line drawing
        const lineLength = length;
        line.style.strokeDasharray = lineLength;
        line.style.strokeDashoffset = lineLength;

        gsap.to(line, {
            strokeDashoffset: 0,
            duration: 2,
            delay: 1.2,
            ease: 'power2.inOut'
        });
    }

    drawDecadeMarker(x, y, decade, index) {
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.classList.add('decade-marker');
        group.setAttribute('data-decade', decade.key);

        // Circle
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', 30);
        circle.classList.add('decade-marker-circle');

        // Decade label
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x);
        text.setAttribute('y', y + 5);
        text.classList.add('decade-marker-text');
        text.textContent = decade.key;

        // Theme label
        const theme = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        theme.setAttribute('x', x);
        theme.setAttribute('y', y + 60);
        theme.classList.add('decade-theme-text');
        theme.textContent = decade.theme;

        // Category counts
        if (state.data?.decades?.[decade.key]) {
            const decadeData = state.data.decades[decade.key];
            const categoryCount = Object.keys(decadeData.categories || {}).length;
            const worksCount = decadeData.totalWorks || 0;

            const count = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            count.setAttribute('x', x);
            count.setAttribute('y', y - 50);
            count.classList.add('category-indicator');
            count.textContent = `${worksCount} works • ${categoryCount} categories`;
            group.appendChild(count);
        }

        group.appendChild(circle);
        group.appendChild(text);
        group.appendChild(theme);

        // Click handler
        group.addEventListener('click', () => {
            modalManager.openDecadeModal(decade.key);
        });

        this.svg.appendChild(group);

        // Animate in
        gsap.from(group, {
            scale: 0,
            opacity: 0,
            duration: 0.5,
            delay: 1.4 + (index * 0.1),
            ease: 'back.out(1.7)',
            transformOrigin: `${x}px ${y}px`
        });
    }
}

// ========== MODAL MANAGER ==========
class ModalManager {
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        // Close any open modal first
        this.closeModal();

        modal.classList.add('active');
        state.activeModal = modal;
        document.body.style.overflow = 'hidden';

        // Focus trap
        modal.querySelector('.modal-close')?.focus();
    }

    closeModal() {
        if (state.activeModal) {
            state.activeModal.classList.remove('active');
            document.body.style.overflow = '';
            state.activeModal = null;
        }
    }

    openBiographyModal() {
        const content = document.getElementById('bio-content');
        const bio = state.data?.biography;

        if (!bio) return;

        content.innerHTML = `
            <div class="bio-section">
                <p>${bio.bio}</p>
            </div>

            <div class="bio-section">
                <h3>Career Highlights</h3>
                <p>Career Span: ${bio.careerStart}-present (${new Date().getFullYear() - bio.careerStart}+ years)</p>
                <p>Total Literary Works: ${bio.totalWorks}</p>
            </div>

            <div class="bio-section">
                <h3>Major Awards & Recognition</h3>
                <div class="awards-list">
                    ${bio.awards.map(award => `
                        <div class="award-item">
                            <div class="award-year">${award.year}</div>
                            <div class="award-title"><strong>${award.award}</strong></div>
                            <div class="award-description">${award.description}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        this.openModal('modal-biography');
    }

    openDecadeModal(decadeKey) {
        const decade = state.data?.decades?.[decadeKey];
        const decadeConfig = CONFIG.decades.find(d => d.key === decadeKey);

        if (!decade || !decadeConfig) return;

        state.selectedDecade = decadeKey;

        // Update header
        document.getElementById('decade-title').textContent = decadeConfig.range;
        document.getElementById('decade-theme').textContent = decadeConfig.theme;

        // Update stats
        const statsHtml = `
            <div class="decade-stat">
                <span class="decade-stat-number">${decade.totalWorks}</span>
                <span class="decade-stat-label">Works</span>
            </div>
            <div class="decade-stat">
                <span class="decade-stat-number">${Object.keys(decade.categories || {}).length}</span>
                <span class="decade-stat-label">Categories</span>
            </div>
        `;
        document.getElementById('decade-stats').innerHTML = statsHtml;

        // Render works grid
        const grid = document.getElementById('works-grid');
        grid.innerHTML = '';

        if (decade.categories) {
            for (const [categoryName, works] of Object.entries(decade.categories)) {
                works.forEach((work, index) => {
                    const card = this.createWorkCard(work);
                    grid.appendChild(card);

                    // Stagger animation
                    gsap.from(card, {
                        opacity: 0,
                        y: 20,
                        duration: 0.3,
                        delay: index * 0.05,
                        ease: 'power2.out'
                    });
                });
            }
        }

        this.openModal('modal-decade');
    }

    createWorkCard(work) {
        const card = document.createElement('div');
        card.classList.add('work-card');

        const categoryColor = CONFIG.categoryColors[work.category] || '#1976d2';
        card.style.setProperty('--card-color', categoryColor);

        card.innerHTML = `
            <div class="work-card-category">${work.category}</div>
            <h3 class="work-card-title">${work.title}</h3>
            <div class="work-card-year">${work.year}</div>
            <div class="work-card-description">${work.description || ''}</div>
        `;

        card.addEventListener('click', () => {
            this.openWorkModal(work);
        });

        return card;
    }

    openWorkModal(work) {
        state.selectedWork = work;

        const categoryColor = CONFIG.categoryColors[work.category] || '#1976d2';
        const content = document.getElementById('work-detail');

        content.innerHTML = `
            <div class="work-category-badge" style="background: ${categoryColor}">
                ${work.category}
            </div>
            <h2 class="work-title">${work.title}</h2>

            <div class="work-meta">
                <div class="work-meta-item">
                    <span class="work-meta-label">Year:</span>
                    <span class="work-meta-value">${work.year}</span>
                </div>
                ${work.isbn ? `
                    <div class="work-meta-item">
                        <span class="work-meta-label">ISBN:</span>
                        <span class="work-meta-value">${work.isbn}</span>
                    </div>
                ` : ''}
                ${work.significance ? `
                    <div class="work-meta-item">
                        <span class="work-meta-label">Significance:</span>
                        <span class="work-meta-value">${work.significance}</span>
                    </div>
                ` : ''}
            </div>

            <div class="work-description">
                ${work.description || 'No description available.'}
            </div>

            ${work.awards ? `
                <div class="work-awards">
                    <div class="work-awards-title">Awards & Recognition</div>
                    <div>${work.awards}</div>
                </div>
            ` : ''}

            ${work.url ? `
                <div class="work-links">
                    <a href="${work.url}" target="_blank" class="work-link">
                        View External Link →
                    </a>
                </div>
            ` : ''}
        `;

        this.openModal('modal-work');
    }

    openSearchModal() {
        this.openModal('modal-search');

        const searchInput = document.getElementById('search-input');
        const resultsContainer = document.getElementById('search-results');

        searchInput.value = '';
        resultsContainer.innerHTML = '';

        // Focus input
        setTimeout(() => searchInput.focus(), 100);

        // Live search
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();

            if (query.length < 2) {
                resultsContainer.innerHTML = '<p style="color: var(--color-text-secondary); text-align: center; padding: 2rem;">Type at least 2 characters to search...</p>';
                return;
            }

            const results = dataLoader.searchWorks(query);

            if (results.length === 0) {
                resultsContainer.innerHTML = '<p style="color: var(--color-text-secondary); text-align: center; padding: 2rem;">No results found.</p>';
                return;
            }

            resultsContainer.innerHTML = results.map(work => `
                <div class="search-result-item" data-work-title="${work.title}">
                    <div class="search-result-title">${work.title}</div>
                    <div class="search-result-meta">${work.year} • ${work.category}</div>
                </div>
            `).join('');

            // Add click handlers
            resultsContainer.querySelectorAll('.search-result-item').forEach((item, index) => {
                item.addEventListener('click', () => {
                    this.openWorkModal(results[index]);
                });
            });
        });
    }

    openFilterModal() {
        this.openModal('modal-filter');

        const container = document.getElementById('filter-categories');
        const allWorks = dataLoader.getAllWorks();

        // Count works per category
        const categoryCounts = {};
        allWorks.forEach(work => {
            categoryCounts[work.category] = (categoryCounts[work.category] || 0) + 1;
        });

        // Render categories
        container.innerHTML = Object.keys(CONFIG.categoryColors).map(category => `
            <div class="filter-category" data-category="${category}">
                <div class="filter-checkbox ${state.activeFilters.has(category) ? 'checked' : ''}"></div>
                <div class="filter-label">${category}</div>
                <div class="filter-count">${categoryCounts[category] || 0}</div>
            </div>
        `).join('');

        // Add toggle handlers
        container.querySelectorAll('.filter-category').forEach(item => {
            item.addEventListener('click', () => {
                const checkbox = item.querySelector('.filter-checkbox');
                const category = item.dataset.category;

                checkbox.classList.toggle('checked');

                if (state.activeFilters.has(category)) {
                    state.activeFilters.delete(category);
                } else {
                    state.activeFilters.add(category);
                }
            });
        });
    }
}

// ========== STATS COUNTER ==========
function animateStatsCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');

    statNumbers.forEach(stat => {
        const target = parseInt(stat.dataset.target);

        gsap.to(stat, {
            textContent: target,
            duration: 2,
            ease: 'power2.out',
            snap: { textContent: 1 },
            delay: 1
        });
    });
}

// ========== DECADE NAVIGATION ==========
function setupDecadeNav() {
    const nav = document.querySelector('.decade-nav');

    CONFIG.decades.forEach(decade => {
        const dot = document.createElement('div');
        dot.classList.add('decade-dot');
        dot.setAttribute('data-decade', decade.key);
        dot.addEventListener('click', () => {
            modalManager.openDecadeModal(decade.key);
        });
        nav.appendChild(dot);
    });
}

// ========== EVENT HANDLERS ==========
function setupEventHandlers() {
    // Navigation buttons
    document.getElementById('btn-about')?.addEventListener('click', () => {
        modalManager.openBiographyModal();
    });

    document.getElementById('btn-search')?.addEventListener('click', () => {
        modalManager.openSearchModal();
    });

    document.getElementById('btn-filter')?.addEventListener('click', () => {
        modalManager.openFilterModal();
    });

    // Modal close buttons and overlays
    document.querySelectorAll('.modal-close, .modal-overlay').forEach(el => {
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            modalManager.closeModal();
        });
    });

    // Prevent modal container clicks from closing
    document.querySelectorAll('.modal-container').forEach(container => {
        container.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && state.activeModal) {
            modalManager.closeModal();
        }
    });
}

// ========== INITIALIZATION ==========
const dataLoader = new DataLoader();
const modalManager = new ModalManager();

async function init() {
    try {
        // Load data
        await dataLoader.load();

        // Initialize timeline
        const timelineSvg = document.getElementById('timeline-svg');
        const timelineRenderer = new TimelineRenderer(timelineSvg);
        timelineRenderer.render();

        // Setup navigation
        setupDecadeNav();

        // Setup event handlers
        setupEventHandlers();

        // Animate stats counters
        animateStatsCounters();

        // Hide loading screen
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            loadingScreen.classList.add('hidden');
        }, 1500);

    } catch (error) {
        console.error('Failed to initialize application:', error);
    }
}

// Start application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
