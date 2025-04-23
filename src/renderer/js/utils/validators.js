/**
 * Validates a numeric value with a specific length
 * @param {string|number} value - Value to validate
 * @param {number} length - Maximum length
 * @returns {boolean} - Validation result
 */
export const validateNumeric = (value, length) => {
    if (!value) return false;
    const regex = new RegExp(`^\\d{1,${length}}$`);
    return regex.test(value);
  };
  
  /**
   * Validates a decimal value (11 integers, 3 decimals)
   * @param {string|number} value - Value to validate
   * @returns {boolean} - Validation result
   */
  export const validateDecimal = (value) => {
    if (!value) return false;
    const regex = /^\d{1,11}(\.\d{1,3})?$/;
    return regex.test(value);
  };
  
  /**
   * Validates a date in YYYYMMDD format
   * @param {string} value - Date to validate
   * @returns {boolean} - Validation result
   */
  export const validateDate = (value) => {
    if (!value) return false;
    
    // If in DD/MM/YYYY format, convert it
    let dateValue = value;
    if (value.includes('/')) {
      const parts = value.split('/');
      if (parts.length === 3) {
        dateValue = `${parts[2]}${parts[1]}${parts[0]}`;
      }
    }
    
    // Check YYYYMMDD format
    const regex = /^\d{8}$/;
    if (!regex.test(dateValue)) return false;
    
    // Validate if it's a valid date
    const year = parseInt(dateValue.substring(0, 4));
    const month = parseInt(dateValue.substring(4, 6)) - 1;
    const day = parseInt(dateValue.substring(6, 8));
    
    const date = new Date(year, month, day);
    return date.getFullYear() === year && 
           date.getMonth() === month && 
           date.getDate() === day;
  };
  
  /**
   * Validates a CBU
   * @param {string} cbu - CBU to validate
   * @returns {boolean} - Validation result
   */
  export const validateCBU = (cbu) => {
    if (!cbu) return false;
    if (cbu.length !== 22) return false;
    return /^\d{22}$/.test(cbu);
  };
  
  /**
   * Validates header data
   * @param {Object} header - Header data to validate
   * @returns {Array} - Array of errors
   */
  export const validateHeader = (header) => {
    const errors = [];
    
    // Validate required fields
    if (!header.headerId) {
      errors.push('Se requiere ID de cabecera');
    } else if (!validateNumeric(header.headerId, 4)) {
      errors.push('Debe ser numérico con un máximo de 4 dígitos');
    }
    
    if (!header.company) {
      errors.push('Se requiere empresa');
    } else if (!validateNumeric(header.company, 4)) {
      errors.push('Debe ser numérico con un máximo de 4 dígitos');
    }
    
    if (!header.agreement) {
      errors.push('Se requiere convenio');
    } else if (!validateNumeric(header.agreement, 4)) {
      errors.push('Debe ser numérico con un máximo de 4 dígitos');
    }
    
    if (!header.accreditationDate) {
      errors.push('Se requiere fecha de acreditación');
    } else if (!validateDate(header.accreditationDate)) {
      errors.push('Debe ser en formato AAAAMMDD');
    }
    
    if (!header.fileNumber) {
      errors.push('Se requiere número de archivo');
    } else if (!validateNumeric(header.fileNumber, 6)) {
      errors.push('El número de expediente debe ser numérico con un máximo de 6 dígitos');
    }
    
    // Observations is optional, just validate length
    if (header.observations && header.observations.length > 79) {
      errors.push('Las observaciones no deben exceder de 79 caracteres');
    }
    
    return errors;
  };
  
  /**
   * Validates operation data
   * @param {Object} operation - Operation data to validate
   * @param {string} fileType - File type ('mismo' or 'otros')
   * @returns {Array} - Array of errors
   */
  export const validateOperation = (operation, fileType) => {
    const errors = [];
    
    // Common validations
    if (!validateNumeric(operation.company, 4)) 
      errors.push('Debe ser numérico con un máximo de 4 dígitos');
    
    if (!validateNumeric(operation.branchCode, 4))
      errors.push('Debe ser numérico con un máximo de 4 dígitos');
    
    if (!validateNumeric(operation.operationCode, 2))
      errors.push('El código de operación debe ser numérico con un máximo de 2 dígitos');
    
    if (!validateDecimal(operation.amount))
      errors.push('El importe debe ser numérico con un máximo de 11 enteros y 3 decimales');
    
    if (!validateDate(operation.imputationDate))
      errors.push('La fecha de imputación debe tener el formato AAAAMMDD');
    
    if (operation.receiptNumber && !validateNumeric(operation.receiptNumber, 10))
      errors.push('El número de recibo debe ser numérico con un máximo de 10 dígitos');
    
    if (operation.agreement && !validateNumeric(operation.agreement, 4))
      errors.push('El convenio debe ser numérico con un máximo de 4 dígitos');
    
    if (operation.affinity && !validateNumeric(operation.affinity, 4))
      errors.push('Debe ser numérico con un máximo de 4 dígitos');
    
    // Specific validations by file type
    if (fileType === 'mismo') {
      if (!validateNumeric(operation.accountNumber, 12)) 
        errors.push('El número de cuenta debe ser numérico con un máximo de 12 dígitos');
    } else {
      if (!validateNumeric(operation.cuitCuil, 12)) 
        errors.push('CUIT/CUIL debe ser numérico con un máximo de 12 dígitos');
      
      if (operation.cbu && !validateCBU(operation.cbu))
        errors.push('CBU debe tener 22 dígitos numéricos');
    }
    
    return errors;
  };