# Cat Food Store - Next.js CRUD Application

A comprehensive cat food store management system built with Next.js that integrates with a database.

## Overview

This is a full-featured cat food store application that allows customers to browse premium cat food products and administrators to manage the inventory. Built as part of the Jabar Istimewa Digital Academy (JADIG) Fullstack Development program.

## Features

- **Product Catalog**: Browse our curated selection of premium cat food products
- **Admin Dashboard**: Comprehensive management interface for inventory
- **Full CRUD Operations**: Create, Read, Update, and Delete cat food products
- **Image Support**: Upload and display product images
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Database Integration**: Persistent data storage with Neon Database

## Task Requirements Completed

### Task 1: Develop a Simple CRUD Application ✅
Created a complete CRUD application using Next.js for cat food store management.

### Task 2: Implement Full CRUD Functionality ✅
The application includes full CRUD capabilities:

- **Create**: Add new cat food products to the database
- **Read**: Display existing cat food products from the database  
- **Update**: Edit existing cat food product entries in the database
- **Delete**: Remove cat food product entries from the database

### Task 3: Ensure Data Persistence ✅
All cat food product data is stored persistently in a Neon PostgreSQL database, not in local storage or static variables.

## Technology Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Database**: Neon PostgreSQL
- **ORM**: Drizzle ORM
- **Image Upload**: Cloudinary
- **Deployment**: Vercel

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                 # Next.js app router pages
│   ├── admin/          # Admin dashboard and management
│   ├── products/       # Product catalog and details
│   └── api/            # API routes
├── components/         # Reusable React components
├── lib/               # Utilities and configurations
└── public/            # Static assets
```

## Database Schema

The application uses a PostgreSQL database with a `products` table containing:
- `id` (Primary Key)
- `name` (Product name)
- `price` (Product price)
- `description` (Product description)
- `image` (Product image URL)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

## API Endpoints

- `GET /api/products` - Fetch all cat food products
- `POST /api/products` - Create a new cat food product
- `GET /api/products/[id]` - Fetch a specific cat food product
- `PUT /api/products/[id]` - Update a cat food product
- `DELETE /api/products/[id]` - Delete a cat food product

## Contributing

This project was built as part of the JADIG Fullstack Development program to demonstrate proficiency in modern web development practices.

## License

This project is for educational purposes as part of the JADIG program.
