import { validateHeader, validateOperation } from '../utils/validators.js';
import { formatDateForDisplay, getSystemDescription, getCurrentDate } from '../utils/formatters.js';
import notifications from './notifications.js';

// State
let operations = [];
let fileType = 'mismo';
let selectAllCheckbox = null;
let deleteSelectedButton = null;

/**
 * Initialize operations module
 * @param {Function} generateTxtCallback - Callback to generate TXT file
 * @param {Function} generateExcelCallback - Callback to generate Excel file
 * @param {Function} importExcelCallback - Callback to import Excel file
 */
export const init = (generateTxtCallback, generateExcelCallback, importExcelCallback) => {
  // DOM elements
  const fileTypeRadios = document.querySelectorAll('input[name="fileType"]');
  const addOperationButton = document.getElementById('btnAddOperation');
  const generateTxtButton = document.getElementById('btnGenerateTxt');
  const generateExcelButton = document.getElementById('btnGenerateExcel');
  const importExcelButton = document.getElementById('btnImportExcel');
  selectAllCheckbox = document.getElementById('selectAllOperations');
  deleteSelectedButton = document.getElementById('btnDeleteSelected');
  
  // Event: Change file type
  fileTypeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      fileType = e.target.value;
      toggleFileType(fileType);
    });
  });
  
  // Event: Add operation
  if (addOperationButton) {
    addOperationButton.addEventListener('click', () => {
      addOperation();
    });
  }
  
  // Event: Generate TXT
  if (generateTxtButton && generateTxtCallback) {
    generateTxtButton.addEventListener('click', async () => {
      await generateTxtCallback(operations, fileType);
    });
  }
  
  // Event: Generate Excel
  if (generateExcelButton && generateExcelCallback) {
    generateExcelButton.addEventListener('click', async () => {
      await generateExcelCallback(operations, fileType);
    });
  }
  
  // Event: Import Excel
  if (importExcelButton && importExcelCallback) {
    importExcelButton.addEventListener('click', async () => {
      await importExcelCallback();
    });
  }
  
  // Event: Select all operations
  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener('change', (e) => {
      const checkboxes = document.querySelectorAll('.operation-checkbox');
      checkboxes.forEach(checkbox => {
        checkbox.checked = e.target.checked;
      });
      
      updateDeleteButton();
    });
  }
  
  // Event: Delete selected operations
  if (deleteSelectedButton) {
    deleteSelectedButton.addEventListener('click', () => {
      deleteSelectedOperations();
    });
  }
};

/**
 * Toggle file type display
 * @param {string} type - File type ('mismo' or 'otros')
 */
const toggleFileType = (type) => {
  const sameFields = document.querySelectorAll('.field-mismo');
  const otherFields = document.querySelectorAll('.field-otros');
  
  if (type === 'mismo') {
    sameFields.forEach(field => field.classList.remove('hidden'));
    otherFields.forEach(field => field.classList.add('hidden'));
    document.getElementById('col-account-cuit').textContent = 'Account Number';
    document.getElementById('col-text-cbu').textContent = 'Text';
    
    // Show judicial option
    const judicialOption = document.querySelector('.option-mismo');
    if (judicialOption) judicialOption.style.display = '';
  } else {
    sameFields.forEach(field => field.classList.add('hidden'));
    otherFields.forEach(field => field.classList.remove('hidden'));
    document.getElementById('col-account-cuit').textContent = 'CUIT/CUIL';
    document.getElementById('col-text-cbu').textContent = 'CBU';
    
    // Hide judicial option
    const judicialOption = document.querySelector('.option-mismo');
    if (judicialOption) judicialOption.style.display = 'none';
    
    // If system is judicial, change to current account
    const systemSelect = document.getElementById('system');
    if (systemSelect && systemSelect.value === '66') {
      systemSelect.value = '00';
    }
  }
};

/**
 * Add an operation
 */
const addOperation = () => {
  const errors = validateForm();
  
  if (errors.length > 0) {
    notifications.error(errors);
    return;
  }
  
  // Get form data
  const operation = getFormData();
  
  // Add to operations list
  operations.push(operation);
  
  // Clear form
  clearForm();
  
  // Update table
  updateTable();
};

/**
 * Validate operation form
 * @returns {Array} - Array of errors
 */
const validateForm = () => {
  const operation = getFormData();
  return validateOperation(operation, fileType);
};

/**
 * Get form data
 * @returns {Object} - Operation data
 */
const getFormData = () => {
  const operation = {
    company: document.getElementById('company').value,
    system: document.getElementById('system').value,
    branchCode: document.getElementById('branchCode').value,
    operationCode: document.getElementById('operationCode').value || '02',
    amount: document.getElementById('amount').value,
    imputationDate: document.getElementById('imputationDate').value,
    receiptNumber: document.getElementById('receiptNumber').value,
    agreement: document.getElementById('agreement').value,
    affinity: document.getElementById('affinity').value || '9999'
  };
  
  if (fileType === 'mismo') {
    operation.accountNumber = document.getElementById('accountNumber').value;
    operation.text = document.getElementById('text').value;
  } else {
    operation.cuitCuil = document.getElementById('cuitCuil').value;
    operation.cbu = document.getElementById('cbu').value;
  }
  
  return operation;
};

/**
 * Clear operation form
 */
const clearForm = () => {
  document.getElementById('company').value = '';
  document.getElementById('branchCode').value = '';
  document.getElementById('amount').value = '';
  document.getElementById('imputationDate').value = getCurrentDate();
  document.getElementById('receiptNumber').value = '';
  document.getElementById('agreement').value = '';
  
  if (fileType === 'mismo') {
    document.getElementById('accountNumber').value = '';
    document.getElementById('text').value = '';
  } else {
    document.getElementById('cuitCuil').value = '';
    document.getElementById('cbu').value = '';
  }
};

/**
 * Update operations table
 */
export const updateTable = () => {
  const operationsTable = document.getElementById('operationsTable');
  const operationsContainer = document.getElementById('operationsContainer');
  const operationsCount = document.getElementById('operationsCount');
  
  if (!operationsTable) return;
  
  operationsTable.innerHTML = '';
  operations.forEach((op, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="select-column">
        <input type="checkbox" class="operation-checkbox custom-checkbox" data-index="${index}">
      </td>
      <td>${op.company || '-'}</td>
      <td>${getSystemDescription(op.system)}</td>
      <td>${fileType === 'mismo' ? (op.accountNumber || '-') : (op.cuitCuil || '-')}</td>
      <td>${op.amount || '-'}</td>
      <td>${formatDateForDisplay(op.imputationDate) || '-'}</td>
      <td>${fileType === 'mismo' ? (op.text || '-') : (op.cbu || '-')}</td>
    `;
    operationsTable.appendChild(row);
  });
  
  // Update operations count
  if (operationsCount) {
    operationsCount.textContent = operations.length;
  }
  
  // Show/hide container
  if (operationsContainer) {
    if (operations.length > 0) {
      operationsContainer.classList.remove('hidden');
    } else {
      operationsContainer.classList.add('hidden');
    }
  }
  
  // Add events to checkboxes
  document.querySelectorAll('.operation-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      // Update select all checkbox
      const checkboxes = document.querySelectorAll('.operation-checkbox');
      const checkedCheckboxes = document.querySelectorAll('.operation-checkbox:checked');
      
      if (selectAllCheckbox) {
        selectAllCheckbox.checked = checkboxes.length > 0 && checkboxes.length === checkedCheckboxes.length;
      }
      
      // Update delete button
      updateDeleteButton();
    });
  });
  
  // Update delete button state
  updateDeleteButton();
};

/**
 * Update delete button state
 */
const updateDeleteButton = () => {
  if (deleteSelectedButton) {
    const checkedCheckboxes = document.querySelectorAll('.operation-checkbox:checked');
    deleteSelectedButton.disabled = checkedCheckboxes.length === 0;
  }
};

/**
 * Delete selected operations
 */
const deleteSelectedOperations = () => {
  const selectedOperations = Array.from(document.querySelectorAll('.operation-checkbox:checked'))
    .map(checkbox => parseInt(checkbox.getAttribute('data-index')))
    .sort((a, b) => b - a); // Sort descending to remove from the end
  
  if (selectedOperations.length === 0) return;
  
  // Confirm deletion
  if (confirm(`¿Estás seguro de eliminar ${selectedOperations.length} operación(nes)?`)) {
    // Delete operations
    selectedOperations.forEach(index => {
      operations.splice(index, 1);
    });
    
    // Update table
    updateTable();
    
    // Uncheck select all
    if (selectAllCheckbox) {
      selectAllCheckbox.checked = false;
    }
  }
};

/**
 * Set operations data
 * @param {Array} newOperations - New operations data
 * @param {string} newFileType - New file type
 */
export const setOperations = (newOperations, newFileType) => {
  operations = newOperations;
  fileType = newFileType;
  
  // Update radio button
  const radioButton = document.querySelector(`input[name="fileType"][value="${fileType}"]`);
  if (radioButton) {
    radioButton.checked = true;
  }
  
  // Toggle fields
  toggleFileType(fileType);
  
  // Update table
  updateTable();
};

/**
 * Add operations from personnel list
 * @param {Array} personnel - Personnel list with amounts
 * @param {Object} headerData - Header data
 */
export const addOperationsFromPersonnel = (personnel, headerData) => {
  if (!personnel || personnel.length === 0) {
    notifications.error('No personnel with amount to accredit');
    return;
  }
  
  // Clear operations
  operations = [];
  
  // Separate by accreditation type
  const cashPersonnel = personnel.filter(p => p.accreditationType === 'efectivo');
  const bankPersonnel = personnel.filter(p => p.accreditationType === 'bancaria');
  
  // Set file type based on bank personnel with CBU
  const bankWithCBU = bankPersonnel.filter(p => p.cbu && p.cbu.length === 22);
  
  if (bankWithCBU.length > 0) {
    fileType = 'otros';
    const radioButton = document.querySelector('input[name="fileType"][value="otros"]');
    if (radioButton) radioButton.checked = true;
  } else {
    fileType = 'mismo';
    const radioButton = document.querySelector('input[name="fileType"][value="mismo"]');
    if (radioButton) radioButton.checked = true;
  }
  
  toggleFileType(fileType);
  
  // Convert personnel to operations
  personnel.forEach(person => {
    // Common data
    const operation = {
      company: headerData.company || '3307',
      system: person.accreditationType === 'bancaria' ? '00' : '01', // 00=Current account, 01=Savings account
      branchCode: person.branch || '0001',
      operationCode: '02',
      amount: person.amount,
      imputationDate: headerData.accreditationDate || getCurrentDate(),
      receiptNumber: person.fileNumber || '',
      agreement: headerData.agreement || '',
      affinity: '9999'
    };
    
    // Specific data by type
    if (person.accreditationType === 'bancaria' && person.cbu) {
      // If has valid CBU, it's for other banks
      if (person.cbu.length === 22) {
        operation.cuitCuil = person.documentNumber || '';
        operation.cbu = person.cbu;
      } else {
        // If doesn't have valid CBU, it's for same bank
        operation.accountNumber = person.account || '';
        operation.text = `ACREDITACIÓN ${person.fullName}`;
      }
    } else {
      // Cash - same bank
      operation.accountNumber = person.account || '';
      operation.text = `ACREDITACIÓN ${person.fullName}`;
    }
    
    // Add operation
    operations.push(operation);
  });
  
  // Update table
  updateTable();
  
  // Show message
  notifications.success(`${operations.length} operaciones generadas desde la lista de personal`);
};

/**
 * Get header data from form
 * @returns {Object} - Header data
 */
export const getHeaderData = () => {
  const agreementSelect = document.getElementById('agreementHeader');
  let agreementValue = agreementSelect.value;
  
  // If agreement is "other", get custom value
  if (agreementValue === 'other') {
    const customAgreement = document.getElementById('customAgreement').value;
    if (customAgreement) {
      agreementValue = customAgreement;
    }
  }
  
  return {
    headerId: document.getElementById('headerId').value || '9998',
    company: document.getElementById('companyHeader').value || '',
    agreement: agreementValue,
    accreditationDate: document.getElementById('accreditationDate').value,
    fileNumber: document.getElementById('fileNumber').value,
    observations: document.getElementById('observations').value
};
};

/**
* Set header data to form
* @param {Object} headerData - Header data
*/
export const setHeaderData = (headerData) => {
document.getElementById('headerId').value = headerData.headerId || '9998';
document.getElementById('companyHeader').value = headerData.company || '';

// Set agreement
const agreementSelect = document.getElementById('agreementHeader');
const customAgreementField = document.getElementById('customAgreement');

if (headerData.agreement) {
  // Check if agreement is in predefined options
  const options = Array.from(agreementSelect.options).map(option => option.value);
  if (options.includes(headerData.agreement)) {
    agreementSelect.value = headerData.agreement;
    
    // Hide custom field
    if (customAgreementField) {
      const customContainer = document.getElementById('customAgreementContainer');
      if (customContainer) customContainer.classList.add('hidden');
      customAgreementField.value = '';
    }
  } else {
    // Set to "other" and fill custom field
    agreementSelect.value = 'other';
    
    // Show and fill custom field
    if (customAgreementField) {
      const customContainer = document.getElementById('customAgreementContainer');
      if (customContainer) {
        customContainer.classList.remove('hidden');
        customContainer.classList.add('visible');
      }
      customAgreementField.value = headerData.agreement;
    }
  }
}

document.getElementById('accreditationDate').value = headerData.accreditationDate || '';
document.getElementById('fileNumber').value = headerData.fileNumber || '';
document.getElementById('observations').value = headerData.observations || '';
};

/**
* Validate header data
* @returns {Array} - Array of validation errors
*/
export const validateHeaderData = () => {
return validateHeader(getHeaderData());
};

/**
* Highlight fields with errors
*/
export const highlightErrorFields = () => {
// Remove previous highlighting
removeErrorHighlighting();

// Check each required field
const fields = [
  { id: 'headerId', value: document.getElementById('headerId').value },
  { id: 'companyHeader', value: document.getElementById('companyHeader').value },
  { 
    id: 'agreementHeader', 
    value: document.getElementById('agreementHeader').value === 'other' 
      ? document.getElementById('customAgreement').value 
      : document.getElementById('agreementHeader').value 
  },
  { id: 'accreditationDate', value: document.getElementById('accreditationDate').value },
  { id: 'fileNumber', value: document.getElementById('fileNumber').value }
];

// Highlight empty fields
fields.forEach(field => {
  if (!field.value) {
    document.getElementById(field.id).classList.add('field-error');
    
    // If agreement is "other", highlight custom field
    if (field.id === 'agreementHeader' && document.getElementById('agreementHeader').value === 'other') {
      document.getElementById('customAgreement').classList.add('field-error');
    }
  }
});

// Scroll to first error field
const firstErrorField = document.querySelector('.field-error');
if (firstErrorField) {
  firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
  firstErrorField.focus();
}
};

/**
* Remove error highlighting
*/
export const removeErrorHighlighting = () => {
document.querySelectorAll('.field-error').forEach(field => {
  field.classList.remove('field-error');
});
};

/**
* Get operations
* @returns {Array} - Operations array
*/
export const getOperations = () => operations;