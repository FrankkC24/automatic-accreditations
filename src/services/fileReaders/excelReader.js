import XLSX from 'xlsx';

/**
 * Reads an Excel file and extracts header and operations data
 * @param {string} filePath - Path to the Excel file
 * @returns {Object} - Object containing header, operations and fileType
 */
export const readExcelFile = async (filePath) => {
  // Read the file
  const workbook = XLSX.readFile(filePath);
  
  // Process header data
  let header = {};
  
  if (workbook.SheetNames.includes('Cabecera')) {
    const headerSheet = workbook.Sheets['Cabecera'];
    const headerData = XLSX.utils.sheet_to_json(headerSheet);
    
    if (headerData.length > 0) {
      header = {
        headerId: headerData[0]['Cabecera'] || '9998',
        company: headerData[0]['Empresa'] || '',
        agreement: headerData[0]['Convenio'] || '',
        accreditationDate: headerData[0]['Fecha de envío'] || '',
        fileNumber: headerData[0]['Número de archivo'] || '',
        observations: headerData[0]['Observaciones'] || ''
      };
    }
  }
  
  // Process operations data
  const operations = [];
  let fileType = 'mismo';
  
  if (workbook.SheetNames.includes('Operaciones')) {
    const operationsSheet = workbook.Sheets['Operaciones'];
    const operationsData = XLSX.utils.sheet_to_json(operationsSheet);
    
    // Determine file type based on headers
    if (operationsData.length > 0) {
      const headers = Object.keys(operationsData[0]);
      if (headers.includes('CBU') || headers.includes('CUIT/CUIL')) {
        fileType = 'otros';
      }
    }
    
    // Process operations
    operationsData.forEach(row => {
      if (fileType === 'mismo') {
        operations.push({
          company: row['Empresa'] || '',
          system: row['Sistema'] || '00',
          branchCode: row['Código Sucursal'] || '',
          accountNumber: row['Número Cuenta'] || '',
          operationCode: row['Código Operación'] || '02',
          amount: row['Importe'] || '',
          imputationDate: row['Fecha Imputación'] || '',
          receiptNumber: row['Nro. Comprobante'] || '',
          agreement: row['Convenio'] || '',
          affinity: row['Afinidad'] || '9999',
          text: row['Texto'] || ''
        });
      } else {
        operations.push({
          company: row['Empresa'] || '',
          system: row['Sistema'] || '00',
          branchCode: row['Código Sucursal'] || '',
          cuitCuil: row['CUIT/CUIL'] || '',
          operationCode: row['Código Operación'] || '02',
          amount: row['Importe'] || '',
          imputationDate: row['Fecha Imputación'] || '',
          receiptNumber: row['Nro. Comprobante'] || '',
          agreement: row['Convenio'] || '',
          affinity: row['Afinidad'] || '9999',
          cbu: row['CBU'] || ''
        });
      }
    });
  }
  
  return { header, operations, fileType };
};

/**
 * Reads an Excel file with personnel list
 * @param {string} filePath - Path to the Excel file
 * @returns {Array} - Array of personnel objects
 */
export const readPersonnelList = async (filePath) => {
  // Read the file using SheetJS
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0]; // First sheet
  const worksheet = workbook.Sheets[sheetName];
  
  // Convert to array of arrays
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
  
  const personnel = [];
  let isBankAccreditation = false;
  
  // Process each row
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const firstCellValue = row[0] || '';
    
    // Check if it's a section title
    if (firstCellValue === 'Acreditación Bancaria') {
      isBankAccreditation = true;
      continue;
    }
    
    // Skip headers and empty rows
    if (i === 0 || !firstCellValue || firstCellValue === 'Legajo' || 
        firstCellValue === 'Efectivo' || firstCellValue === 'Cantidad total :       persona/s') {
      continue;
    }
    
    // Extract person data
    const person = {
      fileNumber: row[0] || '',
      fullName: row[1] || '',
      documentType: row[5] || '',
      documentNumber: row[6] || '',
      bank: row[7] || '',
      branch: row[9] || '',
      account: row[11] || '',
      cbu: row[12] || '',
      accreditationType: isBankAccreditation ? 'bancaria' : 'efectivo',
      amount: '' // To be filled by user
    };
    
    personnel.push(person);
  }
  
  return personnel;
};