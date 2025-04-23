import { formatAmount, padWithZeros, padWithSpaces } from '../../renderer/js/utils/formatters.js';

/**
 * Generates TXT file content according to specifications
 * @param {Object} header - Header data
 * @param {Array} operations - Operations data
 * @param {string} fileType - File type ('mismo' or 'otros')
 * @returns {string} - Generated TXT content
 */
export const generateTxtFile = (header, operations, fileType) => {
  let content = '';
  
  // Calculate total amount
  const totalAmount = operations.reduce((sum, op) => {
    return sum + (parseFloat(op.amount) || 0);
  }, 0);
  
  // Generate header line
  content += generateHeaderLine(header, totalAmount) + '\n';
  
  // Generate operation lines
  operations.forEach(operation => {
    content += generateOperationLine(operation, fileType) + '\n';
  });
  
  return content;
};

/**
 * Generates header line for TXT file
 * @param {Object} header - Header data
 * @param {number} totalAmount - Total amount of operations
 * @returns {string} - Generated header line
 */
const generateHeaderLine = (header, totalAmount) => {
  const formattedAmount = formatAmount(totalAmount);
  
  return padWithZeros(header.headerId || '9998', 4) +
         padWithZeros(header.company || '', 4) +
         padWithZeros(header.agreement || '', 4) +
         padWithZeros(header.accreditationDate || '', 8) +
         padWithZeros(header.fileNumber || '', 6) +
         padWithZeros(formattedAmount, 14) +
         padWithSpaces(header.observations || '', 79);
};

/**
 * Generates operation line for TXT file
 * @param {Object} operation - Operation data
 * @param {string} fileType - File type ('mismo' or 'otros')
 * @returns {string} - Generated operation line
 */
const generateOperationLine = (operation, fileType) => {
  const formattedAmount = formatAmount(operation.amount);
  
  if (fileType === 'mismo') {
    // Same bank accreditation
    return padWithZeros(operation.company, 4) +
           padWithZeros(operation.system, 2) +
           padWithZeros(operation.branchCode, 4) +
           padWithZeros(operation.accountNumber, 12) +
           padWithZeros(operation.operationCode, 2) +
           padWithZeros(formattedAmount, 14) +
           padWithZeros(operation.imputationDate, 8) +
           '00' + // Padding
           padWithZeros(operation.receiptNumber, 10) +
           padWithZeros(operation.agreement, 4) +
           padWithZeros(operation.affinity, 4) +
           padWithSpaces(operation.text, 30) +
           padWithSpaces('', 10) + // Reserve
           padWithSpaces('', 8) + // Internal use
           padWithZeros('', 5); // Response
  } else {
    // Other banks accreditation
    return padWithZeros(operation.company, 4) +
           padWithZeros(operation.system, 2) +
           padWithZeros(operation.branchCode, 4) +
           padWithZeros(operation.cuitCuil, 12) +
           padWithZeros(operation.operationCode, 2) +
           padWithZeros(formattedAmount, 14) +
           padWithZeros(operation.imputationDate, 8) +
           '00' + // Padding
           padWithZeros(operation.receiptNumber, 10) +
           padWithZeros(operation.agreement, 4) +
           padWithZeros(operation.affinity, 4) +
           padWithSpaces(operation.cbu, 30) + // CBU
           padWithSpaces('', 10) + // Reserve
           padWithSpaces('', 8) + // Internal use
           padWithZeros('', 5); // Response
  }
};