# Ecommerce Dashboard (Mini Store)

A dynamic e-commerce web application built with React and Vite that allows users to browse products, view detailed item pages, update add, edit and delete products as an admin, and manage an interactive shopping cart.

<img width="1917" height="906" alt="Mini Store Home" src="https://github.com/user-attachments/assets/800aa95b-e609-49e4-b732-6ec303ee8ac4" />

**Live Demo:** [View Project Live](https://ecommerce-dashboard-nu-smoky.vercel.app)

---

## Features

- **Browse Products:** Grid of products loaded from the Fake Store API
- **Product Details:** Dedicated pages at `/product/:id`
- **Cart:** Add products, increase or decrease quantities, and see the total
- **Admin view:** Click the Admin button at the top right. The username and password are shown as placeholders, so you can try add, edit and delete without an account.
- **Data Persistence:** Cart and admin product changes are saved in the browser with `localStorage`

---

## Tech Stack

- **Framework:** React + Vite
- **Routing:** React Router DOM
- **Styling:** Tailwind CSS
- **API:** Fake Store API
- **State & Storage:** React Hooks (`useState`, `useEffect`) & `LocalStorage`

---

## Limitations and Next Steps

The admin login is a front-end demo only and is not real security. A real version would use server-side authentication.

There is no backend, so cart and admin changes are saved only in the browser (`localStorage`). Next I plan to add tests and connect a real database with authentication.

---

## Run Locally

```bash
git clone https://github.com/MostafaOsman9439/Ecommerce-Dashboard.git
cd Ecommerce-Dashboard
npm install
npm run dev
```

## Preview

<img width="1917" height="902" alt="Product Grid" src="https://github.com/user-attachments/assets/021f57d1-693d-47a6-98c4-341f2083252f" />

---

<img width="1917" height="897" alt="Product Details" src="https://github.com/user-attachments/assets/a02479e1-e88f-43e8-b008-1730c99ea341" />

---

<img width="1917" height="901" alt="Cart View" src="https://github.com/user-attachments/assets/cd3b8381-45e5-433f-93a0-9ae00122e288" />

---

Built by Mostafa Osman · [GitHub](https://github.com/MostafaOsman9439) · [LinkedIn](https://www.linkedin.com/in/mostafa-osman-6ba36a43a/)
