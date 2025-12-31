const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const INPUT_CSV = path.join(__dirname, '..', 'Dr_Carlos_Cortes_Comprehensive_Database.csv');
const OUTPUT_JSON = path.join(__dirname, '..', 'assets', 'data', 'timeline-data.json');

// Initialize output structure
const output = {
    biography: {
        name: "Dr. Carlos E. Cortés",
        title: "Edward A. Dickson Emeritus Professor of History",
        institution: "University of California, Riverside",
        birthYear: 1934,
        careerStart: 1968,
        totalWorks: "400+",
        bio: "Pioneering figure in multicultural education, ethnic studies, and diversity scholarship with a career spanning over five decades. Dr. Cortés has produced more than four hundred literary works covering Chicano studies, Latin American history, diversity in media, intercultural communication, and anti-racism education. His career includes groundbreaking scholarship, creative writing, and extensive consulting work for media and educational institutions.",
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
                description: "Best Book of Poetry for Fourth Quarter: Reflections of a Cranky Old Man"
            },
            {
                year: 2020,
                award: "Constantine Panunzio Distinguished Emeriti Award",
                description: "University of California (first faculty member from UCR to receive this honor)"
            }
        ]
    },
    decades: {
        "1970s": {
            theme: "Chicano Studies Pioneer",
            totalWorks: 0,
            categories: {}
        },
        "1980s": {
            theme: "Multicultural Education Leader",
            totalWorks: 0,
            categories: {}
        },
        "1990s": {
            theme: "Media & Diversity Scholar",
            totalWorks: 0,
            categories: {}
        },
        "2000s": {
            theme: "Creative Consulting",
            totalWorks: 0,
            categories: {}
        },
        "2010s": {
            theme: "Creative Works & Memoirs",
            totalWorks: 0,
            categories: {}
        },
        "2020s": {
            theme: "Anti-Racism & Renewal",
            totalWorks: 0,
            categories: {}
        }
    }
};

const works = [];

console.log('Reading CSV file...');

// Read and parse CSV
fs.createReadStream(INPUT_CSV)
    .pipe(csv())
    .on('data', (row) => {
        works.push(row);
    })
    .on('end', () => {
        console.log(`✓ Loaded ${works.length} works from CSV`);

        // Process each work
        let processedCount = 0;
        let skippedCount = 0;

        works.forEach(work => {
            const year = parseInt(work.Year);

            // Skip works without a valid year
            if (!year || isNaN(year)) {
                skippedCount++;
                return;
            }

            // Determine decade
            let decadeKey;
            if (year >= 1970 && year < 1980) decadeKey = "1970s";
            else if (year >= 1980 && year < 1990) decadeKey = "1980s";
            else if (year >= 1990 && year < 2000) decadeKey = "1990s";
            else if (year >= 2000 && year < 2010) decadeKey = "2000s";
            else if (year >= 2010 && year < 2020) decadeKey = "2010s";
            else if (year >= 2020 && year <= 2025) decadeKey = "2020s";
            else {
                skippedCount++;
                return; // Skip works outside the date range
            }

            const category = work.Category || "Uncategorized";

            // Initialize category array if it doesn't exist
            if (!output.decades[decadeKey].categories[category]) {
                output.decades[decadeKey].categories[category] = [];
            }

            // Create work object
            const workObj = {
                title: work.Title || "Untitled",
                year: year,
                category: category,
                description: work.Description || "",
                awards: work.Awards_Recognition || null,
                isbn: work.ISBN_DOI || null,
                url: work.URL || null,
                significance: work.Historical_Significance || null
            };

            // Add to decade/category
            output.decades[decadeKey].categories[category].push(workObj);
            output.decades[decadeKey].totalWorks++;
            processedCount++;
        });

        // Create output directory if it doesn't exist
        const outputDir = path.dirname(OUTPUT_JSON);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
            console.log(`✓ Created directory: ${outputDir}`);
        }

        // Write output JSON
        fs.writeFileSync(OUTPUT_JSON, JSON.stringify(output, null, 2));

        console.log(`\n========== BUILD COMPLETE ==========`);
        console.log(`✓ Generated: ${OUTPUT_JSON}`);
        console.log(`✓ Works processed: ${processedCount}`);
        console.log(`✓ Works skipped: ${skippedCount}`);
        console.log(`\nDecade Breakdown:`);

        Object.entries(output.decades).forEach(([decade, data]) => {
            const categoriesCount = Object.keys(data.categories).length;
            console.log(`  ${decade}: ${data.totalWorks} works, ${categoriesCount} categories`);
        });

        console.log(`\n====================================\n`);
    })
    .on('error', (error) => {
        console.error('Error reading CSV:', error);
        process.exit(1);
    });
