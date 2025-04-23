import notifications from './ui/notifications.js';
import * as operations from './ui/operations.js';
import * as personnel from './ui/personnel.js';
import { getCurrentDate } from './utils/formatters.js';

/**
 * Main application controller
 */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize components
  initializeComponents();
  
  // Setup event listeners
  setupEventListeners();
});

/**
 * Initialize all application components
 */
const initializeComponents = () => {
  // Initialize notification system
  notifications.init();
  
  // Initialize operations module with callbacks
  operations.init(
    generateTxtFile,      // Generate TXT callback
    generateExcelFile,    // Generate Excel callback
    importExcelFile       // Import Excel callback
  );
  
  // Initialize personnel module with callback
  personnel.init(
    generateAccreditations // Generate accreditations callback
  );
  
  // Setup agreement field toggle
  const agreementSelect = document.getElementById('agreementHeader');
  const customAgreementContainer = document.getElementById('customAgreementContainer');
  
  if (agreementSelect && customAgreementContainer) {
    agreementSelect.addEventListener('change', () => {
      if (agreementSelect.value === 'other') {
        customAgreementContainer.classList.remove('hidden');
        customAgreementContainer.classList.add('visible');
        document.getElementById('customAgreement').focus();
      } else {
        customAgreementContainer.classList.add('hidden');
        customAgreementContainer.classList.remove('visible');
      }
    });
  }
};

/**
 * Setup global event listeners
 */
const setupEventListeners = () => {
  // Remove error highlighting when field changes
  const headerFields = ['headerId', 'companyHeader', 'agreementHeader', 'customAgreement', 'accreditationDate', 'fileNumber'];
  headerFields.forEach(id => {
    const field = document.getElementById(id);
    if (field) {
      field.addEventListener('input', () => {
        field.classList.remove('field-error');
      });
      
      // For selects
      if (field.tagName === 'SELECT') {
        field.addEventListener('change', () => {
          field.classList.remove('field-error');
        });
      }
    }
  });
};

/**
 * Generate accreditations from personnel list
 * @param {Array} personnelList - Complete personnel list
 */
const generateAccreditations = () => {
  // Get personnel with amount
  const personnelWithAmount = personnel.getPersonnelWithAmount();
  
  if (personnelWithAmount.length === 0) {
    notifications.error('No hay personal con importe para acreditar');
    return;
  }
  
  // Get header data
  const headerData = operations.getHeaderData();
  
  // Add operations from personnel
  operations.addOperationsFromPersonnel(personnelWithAmount, headerData);
};

/**
 * Generate TXT file
 * @param {Array} operationsList - Operations list
 * @param {string} fileType - File type ('mismo' or 'otros')
 */
const generateTxtFile = async (operationsList, fileType) => {
  if (operationsList.length === 0) {
    notifications.error('Se debe añadir al menos una operación para hacer esto');
    return;
  }
  
  try {
    // Get header data
    const headerData = operations.getHeaderData();
    
    // Validate header data
    const headerErrors = operations.validateHeaderData();
    if (headerErrors.length > 0) {
      // Highlight error fields
      operations.highlightErrorFields();
      notifications.error(headerErrors);
      return;
    }
    
    // Generate TXT file
    const result = await window.api.generateTxt({ 
      header: headerData, 
      operations: operationsList, 
      fileType 
    });
    
    if (result.success) {
      // Remove error highlighting
      operations.removeErrorHighlighting();
      notifications.success(`Archivo TXT generado correctamente en: ${result.filePath}`);
    } else {
      notifications.error(result.message || 'Error al generar el archivo TXT');
    }
  } catch (error) {
    notifications.error(error.message || 'Error al generar el archivo TXT');
  }
};

/**
 * Generate Excel file
 * @param {Array} operationsList - Operations list
 * @param {string} fileType - File type ('mismo' or 'otros')
 */
const generateExcelFile = async (operationsList, fileType) => {
  if (operationsList.length === 0) {
    notifications.error('Se debe añadir al menos una operación para hacer esto');
    return;
  }
  
  try {
    // Get header data
    const headerData = operations.getHeaderData();
    
    // Validate header data
    const headerErrors = operations.validateHeaderData();
    if (headerErrors.length > 0) {
      // Highlight error fields
      operations.highlightErrorFields();
      notifications.error(headerErrors);
      return;
    }
    
    // Generate Excel file
    const result = await window.api.generateExcel({ 
      header: headerData, 
      operations: operationsList, 
      fileType 
    });
    
    if (result.success) {
      // Remove error highlighting
      operations.removeErrorHighlighting();
      notifications.success(`Archivo Excel generado correctamente en: ${result.filePath}`);
    } else {
      notifications.error(result.message || 'Error al generar el archivo Excel');
    }
  } catch (error) {
    notifications.error(error.message || 'Error al generar el archivo Excel');
  }
};

/**
 * Import Excel file
 */
const importExcelFile = async () => {
  try {
    // Import Excel file
    const result = await window.api.importExcel();
    
    if (!result.success) {
      notifications.error(result.message || 'Error importando el archivo Excel');
      return;
    }
    
    // Get data
    const { header, operations: importedOperations, fileType } = result.data;
    
    // Set header data
    operations.setHeaderData(header);
    
    // Set operations
    operations.setOperations(importedOperations, fileType);
    
    notifications.success('Archivo Excel importado correctamente');
  } catch (error) {
    notifications.error(error.message || 'Error importando el archivo Excel');
  }
};