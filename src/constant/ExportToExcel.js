import * as XLSX from 'xlsx';

const exportToExcel = (data, fileName = 'MasterSheet_Export.xlsx') =>{
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Grades");

    XLSX.writeFile(workbook, fileName);
};