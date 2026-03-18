// utils/CSVExportService.ts

export interface CSVColumn {
  key: string;           // JSON object ki key
  label: string;         // CSV header mein dikhane wala naam
  format?: (value: any) => string;  // Optional: value ko format karne ke liye
}

export interface CSVExportOptions {
  filename?: string;     // File ka naam (default: export_DATE.csv)
  columns?: CSVColumn[]; // Custom columns with labels
  includeHeaders?: boolean; // Headers include karne hain ya nahi (default: true)
}

export class CSVExportService {
  
  /**
   * JSON data ko CSV mein convert karke download kare
   */
  static exportToCSV(data: any[], options: CSVExportOptions = {}): void {
    if (!data || data.length === 0) {
      console.warn('Koi data nahi hai export karne ke liye');
      return;
    }

    // Default options
    const {
      filename = `export_${new Date().toISOString().split('T')[0]}.csv`,
      columns,
      includeHeaders = true
    } = options;

    let csvContent = '';
    let selectedColumns: CSVColumn[];

    // Agar custom columns nahi diye to sab keys use kar
    if (columns && columns.length > 0) {
      selectedColumns = columns;
    } else {
      // First object se keys nikaal kar default columns bana
      const keys = Object.keys(data[0]);
      selectedColumns = keys.map(key => ({ key, label: key }));
    }

    // Headers add kar (agar chahiye)
    if (includeHeaders) {
      const headers = selectedColumns.map(col => col.label);
      csvContent += headers.join(',') + '\n';
    }

    // Data rows add kar
    data.forEach(row => {
      const values = selectedColumns.map(col => {
        let value = row[col.key];
        
        // Format kar agar formatter hai
        if (col.format) {
          value = col.format(value);
        }

        // CSV escaping kar (commas, quotes, newlines handle kar)
        return this.escapeCSVValue(value);
      });
      
      csvContent += values.join(',') + '\n';
    });

    // Download kar
    this.downloadCSV(csvContent, filename);
  }

  /**
   * CSV value ko properly escape kar
   */
  private static escapeCSVValue(value: any): string {
    if (value === null || value === undefined) {
      return '';
    }

    const strValue = String(value);
    
    // Agar value mein comma, quote, ya newline hai to quotes mein wrap kar
    if (strValue.includes(',') || strValue.includes('"') || strValue.includes('\n')) {
      // Quotes ko double kar (CSV standard)
      return `"${strValue.replace(/"/g, '""')}"`;
    }
    
    return strValue;
  }

  /**
   * CSV file download kar
   */
  private static downloadCSV(csvContent: string, filename: string): void {
    // BOM add kar UTF-8 encoding ke liye (Excel mein properly open ho)
    const bom = '\uFEFF';
    const blob = new Blob([bom + csvContent], { 
      type: 'text/csv;charset=utf-8;' 
    });

    // Download link create kar
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    // DOM mein add kar, click kar, remove kar
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Memory cleanup
    URL.revokeObjectURL(url);
    
    console.log(`✅ CSV file download ho gayi: ${filename}`);
  }

  /**
   * Quick export - sirf data pass kar, baki sab default
   */
  static quickExport(data: any[], filename?: string): void {
    this.exportToCSV(data, { filename });
  }

  /**
   * Helper functions for common formatting
   */
  static formatters = {
    // Date formatting
    date: (value: any) => {
      if (!value) return '';
      const date = new Date(value);
      return isNaN(date.getTime()) ? value : date.toLocaleDateString('en-GB'); // DD/MM/YYYY
    },

    // Currency formatting
    currency: (value: any) => {
      if (!value || isNaN(value)) return '';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(value);
    },

    // Number with commas
    number: (value: any) => {
      if (!value || isNaN(value)) return '';
      return new Intl.NumberFormat('en-US').format(value);
    },

    // Percentage
    percentage: (value: any) => {
      if (!value || isNaN(value)) return '';
      return `${(value * 100).toFixed(2)}%`;
    },

    // Yes/No for boolean
    yesNo: (value: any) => {
      if (typeof value === 'boolean') return value ? 'Yes' : 'No';
      return value;
    },

    // Uppercase
    uppercase: (value: any) => {
      return value ? String(value).toUpperCase() : '';
    },

    // First letter capital
    capitalize: (value: any) => {
      if (!value) return '';
      const str = String(value);
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }
  };
}