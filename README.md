# 🚗 Abe's Garage - Car Service Management

#done for school project with Selim Ahmed.much love to Evangadi to help us learn full unltimate full stack guide!! and collaborate with team.

A full-stack car service management application designed to streamline operations for a modern auto repair shop. Built with React, Node.js, and MySQL, this application provides a robust system for managing employees, customers, vehicles, and service orders.

## 📸 Admin Pages Screenshots

*(Please add your admin page screenshots here. You can drag and drop them into this README file on GitHub to generate a link.)*

![Admin Dashboard](placeholder.png)
![Order Management](placeholder.png)
![Customer List](placeholder.png)

## ✨ Features

- **Employee Management**: Add, view, and manage employee records.
- **Customer & Vehicle Management**: Keep track of customer information and their associated vehicles.
- **Service Order System**: Create, update, and track service orders from start to finish.
- **Service Catalog**: Manage a list of common services offered by the garage.
- **Secure Authentication**: Role-based access control and secure login for employees using JWT.
- **RESTful API**: A well-documented API for all backend services.
- **Responsive UI**: A user-friendly interface that works on various devices.

## 🛠️ Tech Stack

### Frontend
- **React 19** - A JavaScript library for building user interfaces.
- **Vite** - Next-generation frontend tooling.
- **TypeScript** - Typed superset of JavaScript.
- **React Router** - Declarative routing for React.
- **TanStack Query** - Powerful asynchronous state management.
- **Axios** - Promise-based HTTP client.
- **Styled Components** - Visual primitives for the component age.
- **React-Bootstrap** - The most popular front-end framework, rebuilt for React.

### Backend
- **Node.js** - JavaScript runtime environment.
- **Express.js** - Fast, unopinionated, minimalist web framework for Node.js.
- **TypeScript** - Typed superset of JavaScript.
- **MySQL2** - MySQL client for Node.js with focus on performance.
- **JWT (JSON Web Tokens)** - For secure user authentication.
- **bcrypt** - A library to help you hash passwords.
- **CORS** - Middleware for enabling Cross-Origin Resource Sharing.

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MySQL Server

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/abe-garage.git
    cd abe-garage
    ```

2.  **Database Setup**
    -   Connect to your MySQL server.
    -   Create a new database (e.g., `abes_garage`).
    -   Execute the queries in `abe-garage-queries.sql` to create the necessary tables.

3.  **Install dependencies**
    ```bash
    # Install server dependencies
    cd server
    npm install

    # Install client dependencies
    cd ../client
    npm install
    ```

4.  **Environment Setup**

    Create a `.env` file in the `server` directory:
    ```env
    DB_HOST=localhost
    DB_USER=your_mysql_user
    DB_PASSWORD=your_mysql_password
    DB_DATABASE=abes_garage
    DB_PORT=3306
    PORT=8080
    JWT_SECRET=your_super_secret_jwt_key
    ```

    Create a `.env` file in the `client` directory:
    ```env
    VITE_API_BASE_URL=http://localhost:8080/api
    ```

5.  **Run the application**
    ```bash
    # Start the server (from server directory)
    npm run start

    # Start the client (from client directory)
    npm run dev
    ```

6.  **Access the application**
    -   Frontend: `http://localhost:5173` (or whatever port Vite assigns)
    -   Backend API: `http://localhost:8080`

## 📁 Project Structure

```
Abe_Garage/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   └── ...
│   └── package.json
├── server/                 # Node.js backend
│   ├── controller/         # Route controllers
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   └── app.ts              # Express app entry point
├── abe-garage-queries.sql  # Database schema
└── README.md
```

## 🔧 API Endpoints

### Employees
- `GET /api/employees` - Get all employees.
- `GET /api/employee/:id` - Get a single employee.
- `POST /api/employee` - Add a new employee.
- `PUT /api/employee` - Update an employee.

### Customers
- `GET /api/customers` - Get all customers.
- `GET /api/customer/:id` - Get a single customer.
- `POST /api/customer` - Add a new customer.
- `PUT /api/customer` - Update a customer.

### Orders
- `GET /api/orders` - Get all orders.
- `GET /api/order/:id` - Get a single order.
- `POST /api/order` - Add a new order.
- `PUT /api/order` - Update an order.

### Services
- `GET /api/services` - Get all services.
- `GET /api/service/:id` - Get a single service.
- `POST /api/service` - Add a new service.

### Vehicles
- `GET /api/vehicles/:customer_id` - Get all vehicles for a customer.
- `POST /api/vehicle` - Add a new vehicle.
- `PUT /api/vehicle` - Update a vehicle.

## 🤝 Contributing

1.  Fork the project.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the `LICENSE` file for details.

## 👨‍💻 Author

**Salim Ahmed**

-   Email: contact@salimtech.com
-   GitHub: [@salim1334](https://github.com/salim1334)

---

⭐ If you found this project helpful, please give it a star on GitHub!