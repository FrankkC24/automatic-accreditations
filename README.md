# Automatic Accreditations

An Electron desktop application for automating the generation of payment files for Banco Santa Fe (Argentina).

## Overview

This application simplifies the process of generating payment files required by Banco Santa Fe for automatic credit transfers. It helps convert Excel data into properly formatted bank transfer files, streamlining the payroll process.

## Features

- Import payment data from Excel files
- Generate properly formatted TXT files for bank submissions
- Export payment records as Excel files for record keeping
- Simple and intuitive user interface
- Portable application with no installation required

## Technologies

- **Electron**: Cross-platform desktop framework
- **JavaScript (ES Modules)**: Modern JavaScript syntax
- **Excel.js/XLSX**: Excel file processing libraries

## Requirements

- **Node.js**: v16 or higher
- **pnpm**: v7 or higher (recommended) or npm

## Installation

Clone the repository and install dependencies:

```bash
# Clone the repository
git clone https://github.com/FrankkC24/automatic-accreditations.git
cd acreditaciones-app

# Install dependencies using pnpm (recommended)
pnpm install

# Or using npm
npm install
```

## Development

To run the application in development mode:

```bash
# Using pnpm
pnpm dev

# Using npm
npm run dev
```

This will start the application with hot-reload enabled for easier development.

## Building

To build a portable executable for Windows:

```bash
# Using pnpm
pnpm build

# Using npm
npm run build
```

This will generate a portable `.exe` file in the `dist` directory that can be run on any Windows machine without installation.

## Project Structure

```
automatic-accreditations/
├── .npmrc              # npm/pnpm configuration
├── main.cjs            # Entry point for Electron (CommonJS)
├── package.json        # Project configuration
├── pnpm-lock.yaml      # pnpm lock file
├── node_modules
└── src/
    ├── main/           # Electron main process files
    │   ├── index.js    # Main application logic
    │   └── preload.js  # Preload script for renderer process
    ├── renderer/       # Frontend files
    │   ├── assets/     # Application assets
    │   │   └── icon.ico
    │   ├── index.html  # Main HTML file
    │   ├── js/         # Renderer JavaScript files
    │   │   ├── app.js  # Main renderer logic
    │   │   ├── ui/     # UI-related components
    │   │   │   ├── notifications.js
    │   │   │   ├── operations.js
    │   │   │   └── personnel.js
    │   │   └── utils/ # Utility functions
    │   │       ├── formatters.js
    │   │       └── validators.js
    │   └── styles/    # Stylesheets
    │       └── styles.css
    └── services/       # Application services
        ├── fileGenerators/ # File generation utilities
        │   ├── excelGenerator.js
        │   └── txtGenerator.js
        └── fileReaders/    # File reading utilities
            └── excelReader.js
```

## Scripts

- `pnpm start`: Run the application in production mode
- `pnpm dev`: Run the application in development mode with hot-reload
- `pnpm build`: Build the application as a portable Windows executable

## Notes for Windows 7 Compatibility

This application is compatible with Windows 7 and above. It uses Electron v21.4.4, which is the last version that maintains Windows 7 compatibility.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

FrankkC24

---

*This tool is designed specifically for Banco Santa Fe in Argentina and may require adjustments for other banking systems.*