import ExcelJS from 'exceljs';

/**
 * Generates an Excel file with accreditations data
 * @param {Object} header - Header data
 * @param {Array} operations - Operations data
 * @param {string} fileType - File type ('mismo' or 'otros')
 * @param {string} filePath - Path to save the Excel file
 */
export const generateExcelFile = async (header, operations, fileType, filePath) => {
  // Calculate total amount
  const totalAmount = operations.reduce((sum, op) => {
    return sum + (parseFloat(op.amount) || 0);
  }, 0);
  
  // Create a new workbook
  const workbook = new ExcelJS.Workbook();
  
  // Set metadata
  workbook.creator = 'Acreditaciones Automáticas';
  workbook.lastModifiedBy = 'Acreditaciones Automáticas';
  workbook.created = new Date();
  workbook.modified = new Date();
  
  // Create header worksheet
  const headerSheet = workbook.addWorksheet('Cabecera');
  
  // Header style
  const headerStyle = {
    font: { bold: true, color: { argb: 'FFFFFFFF' } },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF008736' } },
    border: {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    }
  };
  
  // Add header columns
  headerSheet.columns = [
    { header: 'Campo', key: 'field', width: 20 },
    { header: 'Cabecera', key: 'headerId', width: 15 },
    { header: 'Empresa', key: 'company', width: 15 },
    { header: 'Convenio', key: 'agreement', width: 15 },
    { header: 'Fecha de acreditación', key: 'accreditationDate', width: 15 },
    { header: 'Número de archivo', key: 'fileNumber', width: 15 },
    { header: 'Monto', key: 'amount', width: 15 },
    { header: 'Observaciones', key: 'observations', width: 30 }
  ];
  
  // Apply style to header row
  headerSheet.getRow(1).eachCell(cell => {
    Object.assign(cell.style, headerStyle);
  });
  
  // Add header data
  headerSheet.addRow({
    field: 'Valor',
    headerId: header.headerId || '9998',
    company: header.company || '',
    agreement: header.agreement || '',
    accreditationDate: header.accreditationDate || '',
    fileNumber: header.fileNumber || '',
    amount: totalAmount.toFixed(3),
    observations: header.observations || ''
  });
  
  // Create operations worksheet
  const operationsSheet = workbook.addWorksheet('Operaciones');
  
  // Define columns based on file type
  if (fileType === 'mismo') {
    operationsSheet.columns = [
      { header: 'Empresa', key: 'company', width: 10 },
      { header: 'Sistema', key: 'system', width: 10 },
      { header: 'Código Sucursal', key: 'branchCode', width: 15 },
      { header: 'Número Cuenta', key: 'accountNumber', width: 15 },
      { header: 'Código Operación', key: 'operationCode', width: 15 },
      { header: 'Importe', key: 'amount', width: 15 },
      { header: 'Fecha Imputación', key: 'imputationDate', width: 15 },
      { header: 'Nro. Comprobante', key: 'receiptNumber', width: 15 },
      { header: 'Convenio', key: 'agreement', width: 10 },
      { header: 'Afinidad', key: 'affinity', width: 10 },
      { header: 'Texto', key: 'text', width: 20 }
    ];
    
    // Add operations data
    operations.forEach(op => {
      operationsSheet.addRow({
        company: op.company,
        system: op.system,
        branchCode: op.branchCode,
        accountNumber: op.accountNumber,
        operationCode: op.operationCode,
        amount: op.amount,
        imputationDate: op.imputationDate,
        receiptNumber: op.receiptNumber,
        agreement: op.agreement,
        affinity: op.affinity,
        text: op.text
      });
    });
  } else {
    operationsSheet.columns = [
        { header: 'Empresa', key: 'company', width: 10 },
        { header: 'Sistema', key: 'system', width: 10 },
        { header: 'Código Sucursal', key: 'branchCode', width: 15 },
        { header: 'CUIT/CUIL', key: 'cuitCuil', width: 15 },
        { header: 'Código Operación', key: 'operationCode', width: 15 },
        { header: 'Importe', key: 'amount', width: 15 },
        { header: 'Fecha Imputación', key: 'imputationDate', width: 15 },
        { header: 'Nro. Comprobante', key: 'receiptNumber', width: 15 },
        { header: 'Convenio', key: 'agreement', width: 10 },
        { header: 'Afinidad', key: 'affinity', width: 10 },
        { header: 'CBU', key: 'cbu', width: 30 }
      ];
      
      // Add operations data
      operations.forEach(op => {
        operationsSheet.addRow({
          company: op.company,
          system: op.system,
          branchCode: op.branchCode,
          cuitCuil: op.cuitCuil,
          operationCode: op.operationCode,
          amount: op.amount,
          imputationDate: op.imputationDate,
          receiptNumber: op.receiptNumber,
          agreement: op.agreement,
          affinity: op.affinity,
          cbu: op.cbu
        });
      });
    }
    
    // Apply style to operations header row
    operationsSheet.getRow(1).eachCell(cell => {
      Object.assign(cell.style, headerStyle);
    });
    
    // Save the workbook
    await workbook.xlsx.writeFile(filePath);
  };