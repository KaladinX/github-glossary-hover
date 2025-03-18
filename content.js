// Wait for the document to be ready
function init() {
  // Create tooltip element
  const tooltip = document.createElement('div');
  tooltip.className = 'github-glossary-tooltip';
  document.body.appendChild(tooltip);

  // Cache for glossary definitions
  const glossaryCache = new Map();

  // Function to extract term from URL or text
  function extractTerm(href, text) {
    if (!href && !text) return null;
    
    // Try to get term from href first
    if (href) {
      const hashMatch = href.match(/#([^/]+)$/);
      if (hashMatch) return hashMatch[1].toLowerCase();
      
      const termMatch = href.match(/github-glossary\/?#?([^/]+)?$/);
      if (termMatch && termMatch[1]) return termMatch[1].toLowerCase();
    }
    
    // If no term found in href, try to extract from text
    if (text) {
      const commonTerms = ['repository', 'branch', 'clone', 'commit', 'fork', 'pull request', 'push', 'git'];
      const normalizedText = text.toLowerCase();
      for (const term of commonTerms) {
        if (normalizedText.includes(term)) return term.replace(/\s+/g, '-');
      }
    }
    return null;
  }

  // Function to fetch glossary definition
  async function fetchGlossaryDefinition(term) {
    if (!term) return null;
    if (glossaryCache.has(term)) {
      return glossaryCache.get(term);
    }

    try {
      const response = await fetch('https://docs.github.com/en/get-started/quickstart/github-glossary', {
        method: 'GET',
        mode: 'cors',
        credentials: 'omit'
      });
      
      if (!response.ok) return null;
      
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Try different selectors to find the definition
      const selectors = [
        `h2[id="${term}"]`,
        `[id="${term}"]`,
        `#${term}`,
        `[id="${term.toLowerCase()}"]`
      ];
      
      let definitionSection = null;
      for (const selector of selectors) {
        definitionSection = doc.querySelector(selector);
        if (definitionSection) break;
      }
      
      if (!definitionSection) return null;

      const title = definitionSection.textContent.trim();
      let description = '';
      let currentElement = definitionSection.nextElementSibling;
      
      while (currentElement && !currentElement.matches('h1, h2, h3, h4, h5, h6')) {
        if (currentElement.tagName === 'P') {
          description += currentElement.textContent.trim() + '\n\n';
        }
        currentElement = currentElement.nextElementSibling;
      }

      const definition = { 
        title, 
        description: description.trim() || 'No description available.'
      };
      glossaryCache.set(term, definition);
      return definition;
    } catch (error) {
      console.error('Error fetching glossary definition:', error);
      return null;
    }
  }

  // Function to show tooltip
  async function showTooltip(event, term) {
    const definition = await fetchGlossaryDefinition(term);
    if (!definition) return;

    tooltip.innerHTML = `<strong>${term}</strong><p>${definition.description}</p>`;
    tooltip.classList.add('visible');
    
    // Position tooltip near cursor
    const x = event.clientX + 10;
    const y = event.clientY + 10;
    
    // Keep tooltip within viewport
    const tooltipRect = tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let finalX = x;
    let finalY = y;
    
    if (x + tooltipRect.width > viewportWidth) {
        finalX = viewportWidth - tooltipRect.width - 10;
    }
    
    if (y + tooltipRect.height > viewportHeight) {
        finalY = viewportHeight - tooltipRect.height - 10;
    }
    
    tooltip.style.left = `${finalX}px`;
    tooltip.style.top = `${finalY}px`;
  }

  // Function to hide tooltip
  function hideTooltip() {
    tooltip.classList.remove('visible');
  }

  // Add event listeners to potential glossary terms
  function setupGlossaryLinks() {
    // Find all links that might be glossary terms
    const links = document.querySelectorAll('a[href*="github-glossary"], a[href*="#"]');
    links.forEach(link => {
      // Skip if we've already processed this link
      if (link.hasAttribute('data-glossary-processed')) return;
      
      const term = extractTerm(link.getAttribute('href'), link.textContent);
      if (!term) return;

      // Mark as processed
      link.setAttribute('data-glossary-processed', 'true');
      
      // Add our custom class
      link.classList.add('glossary-link');
      
      // Show tooltip on hover
      link.addEventListener('mouseenter', (event) => {
        showTooltip(event, term);
      });

      // Hide tooltip when mouse leaves
      link.addEventListener('mouseleave', hideTooltip);

      // Prevent default click behavior and show tooltip
      link.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        showTooltip(event, term);
      });
    });
  }

  // Run initial setup
  setupGlossaryLinks();

  // Watch for dynamic content changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        setupGlossaryLinks();
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Ensure the document is loaded before running
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
} 