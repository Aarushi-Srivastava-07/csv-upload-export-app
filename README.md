# CSV Upload, Processing, and Export Application

## Project Overview

This project is a **web-based CSV processing application** that allows users to upload a CSV file, process its contents on the backend, and export the processed results as a **clean, flattened CSV file**.

The application is designed to handle structured CSV data, compute summary statistics (like averages), extract categorical distributions, and present everything in an Excel-friendly format.

---

## Features

* Upload CSV files from the frontend
* Backend processing and validation of CSV data
* Automatic calculation of:

  * Averages (e.g., flowrate, pressure, temperature)
  * Type distribution (e.g., Pump, Sensor, Valve)
* Export processed results as a **flattened CSV**
* Clean and readable CSV output compatible with Excel

---

## Tech Stack

### Frontend

* React.js
* JavaScript
* HTML / CSS

### Backend

* Python (Django / Django REST Framework)
* CSV processing using Python libraries

### Tools

* Git & GitHub
* GitHub Desktop
* VS Code

---

## Project Structure

```
csv-project/
├── backend/        # Backend API and CSV processing logic
├── frontend/       # React frontend application
├── README.md
└── .git
```

---

## How It Works

1. User uploads a CSV file from the frontend UI
2. File is sent to the backend API
3. Backend:

   * Reads and validates CSV
   * Computes averages for numeric columns
   * Calculates type/category distributions
   * Stores and returns processed data as JSON
4. Frontend:

   * Displays results
   * Allows exporting processed data as a flattened CSV file

---

## Sample Output (Exported CSV)

```
success, rows, columns, column_names, message, flowrate, pressure, temperature, Pump, Sensor, Valve
TRUE, 5, 5, equipment_name, type, flowrate, pressure, temperature, CSV file processed successfully, 96, 23.4, 62, 2, 2, 1
```

---

## Status

Project completed successfully

---

## Setup Instructions

Follow these steps to run the application locally:

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd <your-repo-folder>
```

### 2. Backend Setup

```bash
cd backend
# Optional: create virtual environment
python -m venv venv
# Activate virtual environment
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run backend server
python manage.py runserver
```

* The backend will run on `http://127.0.0.1:8000`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

* The frontend will run on `http://localhost:3000`

### 4. Using the App

1. Open the frontend in your browser
2. Upload a CSV file
3. View processed results
4. Export the flattened CSV file

---

## Future Improvements

* Add file size/type validation on frontend
* Improve UI with loaders and notifications
* Add authentication for upload history
* Deploy application online


