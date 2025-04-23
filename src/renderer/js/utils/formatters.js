/**
 * Pads a string with zeros to the left to reach specified length
 * @param {string|number} value - Value to pad
 * @param {number} length - Target length
 * @returns {string} - Padded string
 */
export const padWithZeros = (value, length) => {
    if (!value) return ''.padStart(length, '0');
    return String(value).padStart(length, '0');
  };
  
  /**
   * Pads a string with spaces to the right to reach specified length
   * @param {string|number} value - Value to pad
   * @param {number} length - Target length
   * @returns {string} - Padded string
   */
  export const padWithSpaces = (value, length) => {
    if (!value) return ''.padEnd(length, ' ');
    return String(value).padEnd(length, ' ');
  };
  
  /**
   * Formats an amount for TXT file (11 integers, 3 decimals, no dot)
   * @param {string|number} value - Amount to format
   * @returns {string} - Formatted amount
   */
  export const formatAmount = (value) => {
    if (!value) return '00000000000000';
    return parseFloat(value).toFixed(3).replace('.', '');
  };
  
  /**
   * Formats a date to YYYYMMDD format
   * @param {string|Date} date - Date to format
   * @returns {string} - Formatted date
   */
  export const formatDate = (date) => {
    if (!date) return '';
    
    const d = date instanceof Date ? date : new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    
    return `${year}${month}${day}`;
  };
  
  /**
   * Formats a date from YYYYMMDD to DD/MM/YYYY
   * @param {string} dateStr - Date string in YYYYMMDD format
   * @returns {string} - Formatted date
   */
  export const formatDateForDisplay = (dateStr) => {
    if (!dateStr || dateStr.length !== 8) return dateStr;
    
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    
    return `${day}/${month}/${year}`;
  };
  
  /**
   * Gets system description from code
   * @param {string} systemCode - System code
   * @returns {string} - System description
   */
  export const getSystemDescription = (systemCode) => {
    const systems = {
      '00': 'Cuenta corriente',
      '01': 'Caja de ahorros',
      '66': 'Judiciales'
    };
    
    return systems[systemCode] || systemCode;
  };
  
  /**
   * Gets current date in YYYYMMDD format
   * @returns {string} - Current date
   */
  export const getCurrentDate = () => {
    const now = new Date();
    return formatDate(now);
  };