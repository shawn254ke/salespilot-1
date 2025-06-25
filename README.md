# SalesPilot

-Streamlining sales- management one lead at a time-

SalesPilot is a full-stack CRM (Customer Relationship Management) application designed to empower sales teams to efficiently manage leads, contacts, and performance insights. With an intuitive dashboard and robust authentication, SalesPilot provides a seamless experience for users ranging from administrators to sales representatives.



## Main Features

### User Management

- User Registration & Login:** Secure sign-up and sign-in flows.
- Role-Based Access:** Assign roles such as `admin` and `sales_rep` for tailored access.
- JWT Authentication:** Uses JSON Web Tokens for secure authentication and authorization.
- Profile Management:** Users can edit their profiles and delete accounts.

### Leads & Contacts
- CRUD Operations:Add, view, update, and delete leads and contacts.
- Lead Status Tracking: Manage leads through statuses like New, In Progress, and Closed.
- Contact Management:Link contacts directly to specific leads.

### Dashboard & Insights
- Visual Charts:** Interactive lead status chart 
- Lead Activity:** Track lead activity and performance trends over time.
- Enhanced UX:** Status badges and user avatars for improved usability.

### Routing & Access
- Protected Routes:Only authenticated users can access sensitive routes.
- Modular Components: Clean, maintainable code with reusable components and route-based rendering.

---

## Technologies Used

### Frontend (React)
- ReactJs for dynamic UI
- React Route for client-side routing
- Tailwind CSS for styling and responsive design

### Backend (Flask)
- Flask -web framework
- Flask-JWT-Extended for JWT authentication
- SQLAlchemy ORM for database modeling
- Flask-Migrate for database migrations
- Flask-CORS to enable cross-origin requests
- SQLite as the default development database

---

## Getting Started

### Prerequisites
- Node.js i.e npm for frontend
- Python 3.8 for backend

### Frontend Setup
```
cd client/salespilot
npm install
npm run dev
```

### Backend Setup
```
cd server
pip install -r requirements.txt
flask db upgrade
flask run
```


##  License

MIT License. 
