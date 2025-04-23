import { validateDate, validateDecimal } from '../utils/validators.js';
import { formatDateForDisplay, getCurrentDate } from '../utils/formatters.js';
import notifications from './notifications.js';

// Constants
const ITEMS_PER_PAGE = 20;

// State
let personnelList = [];
let filteredPersonnel = [];
let filterType = 'todos';
let filterText = '';
let currentPage = 1;

/**
 * Initialize personnel module
 * @param {Function} generateAccreditationsCallback - Callback to generate accreditations
 */
export const init = (generateAccreditationsCallback) => {
  // DOM elements
  const filterTypeSelect = document.getElementById('filterPersonnel');
  const searchInput = document.getElementById('searchPersonnel');
  const generateButton = document.getElementById('btnGenerateAccreditations');
  const importButton = document.getElementById('btnImportList');
  const personnelContainer = document.getElementById('personnelContainer');
  
  // Event: Import personnel list
  if (importButton) {
    importButton.addEventListener('click', async () => {
      await importPersonnelList();
    });
  }
  
  // Event: Filter by type
  if (filterTypeSelect) {
    filterTypeSelect.addEventListener('change', (e) => {
      filterType = e.target.value;
      currentPage = 1;
      filterAndDisplayPersonnel();
    });
  }
  
  // Event: Search
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      filterText = e.target.value.toLowerCase();
      currentPage = 1;
      filterAndDisplayPersonnel();
    });
  }
  
  // Event: Generate accreditations
  if (generateButton && generateAccreditationsCallback) {
    generateButton.addEventListener('click', () => {
      generateAccreditationsCallback(personnelList);
    });
  }
};

/**
 * Import personnel list from Excel
 */
const importPersonnelList = async () => {
  try {
    const result = await window.api.importPersonnelList();
    
    if (!result.success) {
      notifications.error(result.message || 'Error al importar la lista de personal');
      return;
    }
    
    // Save personnel list
    personnelList = result.personnel;
    
    // Display personnel
    currentPage = 1;
    filterAndDisplayPersonnel();
    
    // Show success message
    notifications.success(`Lista de personal importada correctamente (${personnelList.length} personas)`);
    
    // Show container
    const personnelContainer = document.getElementById('personnelContainer');
    if (personnelContainer) {
      personnelContainer.classList.remove('hidden');
    }
  } catch (error) {
    notifications.error(error.message || 'Error al importar la lista de personal');
  }
};

/**
 * Filter and display personnel
 */
const filterAndDisplayPersonnel = () => {
  // Apply filters
  filteredPersonnel = personnelList.filter(person => {
    // Filter by type
    if (filterType !== 'todos' && person.accreditationType !== filterType) {
      return false;
    }
    
    // Filter by text
    if (filterText) {
      const personText = `${person.fileNumber || ''} ${person.fullName || ''} ${person.documentNumber || ''}`.toLowerCase();
      if (!personText.includes(filterText)) {
        return false;
      }
    }
    
    return true;
  });
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredPersonnel.length / ITEMS_PER_PAGE);
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const end = Math.min(start + ITEMS_PER_PAGE, filteredPersonnel.length);
  const pagePersonnel = filteredPersonnel.slice(start, end);
  
  // Display personnel list
  const personnelTable = document.getElementById('personnelTable');
  if (personnelTable) {
    personnelTable.innerHTML = '';
    
    pagePersonnel.forEach((person, index) => {
      const realIndex = start + index;
      const row = document.createElement('tr');
      
      // Add class if has amount
      if (person.amount && parseFloat(person.amount) > 0) {
        row.classList.add('has-amount');
      }
      
      row.innerHTML = `
        <td>${person.fileNumber || '-'}</td>
        <td>${person.fullName || '-'}</td>
        <td>${person.documentNumber || '-'}</td>
        <td>${person.accreditationType === 'bancaria' ? 'Banco' : 'Efectivo'}</td>
        <td>${person.accreditationType === 'bancaria' ? (person.cbu || '-') : '-'}</td>
        <td>
          <input type="text" class="amount-input" data-index="${realIndex}" value="${person.amount || ''}" placeholder="0.00">
        </td>
      `;
      personnelTable.appendChild(row);
    });
    
    // Add events to amount inputs
    document.querySelectorAll('.amount-input').forEach(input => {
      input.addEventListener('change', (e) => {
        const index = parseInt(e.target.getAttribute('data-index'));
        const value = e.target.value;
        
        // Validate amount
        if (value && !validateDecimal(value)) {
          notifications.error('El monto debe ser de hasta 11 caracteres y 3 decimales');
          e.target.value = filteredPersonnel[index].amount || '';
          return;
        }
        
        filteredPersonnel[index].amount = value;
        
        // Update in original list
        const person = filteredPersonnel[index];
        const originalIndex = personnelList.findIndex(p => 
          p.fileNumber === person.fileNumber && 
          p.documentNumber === person.documentNumber
        );
        
        if (originalIndex !== -1) {
          personnelList[originalIndex].amount = value;
        }
        
        // Highlight row if has amount
        if (value && parseFloat(value) > 0) {
          e.target.closest('tr').classList.add('has-amount');
        } else {
          e.target.closest('tr').classList.remove('has-amount');
        }
      });
    });
    
    // Update pagination
    updatePagination(totalPages);
  }
};

/**
 * Update pagination controls
 * @param {number} totalPages - Total number of pages
 */
const updatePagination = (totalPages) => {
  const paginationContainer = document.getElementById('personnelPagination');
  if (!paginationContainer) return;
  
  paginationContainer.innerHTML = '';
  
  if (totalPages <= 1) return;
  
  // Previous button
  const prevButton = document.createElement('button');
  prevButton.textContent = 'Previous';
  prevButton.disabled = currentPage === 1;
  prevButton.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      filterAndDisplayPersonnel();
    }
  });
  paginationContainer.appendChild(prevButton);
  
  // Page buttons
  const maxButtons = 5;
  let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
  let end = Math.min(totalPages, start + maxButtons - 1);
  
  if (end - start < maxButtons - 1) {
    start = Math.max(1, end - maxButtons + 1);
  }
  
  for (let i = start; i <= end; i++) {
    const pageButton = document.createElement('button');
    pageButton.textContent = i;
    pageButton.classList.toggle('active', i === currentPage);
    pageButton.addEventListener('click', () => {
      currentPage = i;
      filterAndDisplayPersonnel();
    });
    paginationContainer.appendChild(pageButton);
  }
  
  // Next button
  const nextButton = document.createElement('button');
  nextButton.textContent = 'Next';
  nextButton.disabled = currentPage === totalPages;
  nextButton.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      filterAndDisplayPersonnel();
    }
  });
  paginationContainer.appendChild(nextButton);
};

/**
 * Get personnel with amount
 * @returns {Array} - Personnel with amount
 */
export const getPersonnelWithAmount = () => {
  return personnelList.filter(person => person.amount && parseFloat(person.amount) > 0);
};