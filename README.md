# Tasks Board --- Volodymyr Sirenko

Stack: React 19, TypeScript, Vite, Sass, React Hook Form, Yup.

The project was built entirely from scratch without any UI libraries.\
All UI components (buttons, inputs, checkboxes, textarea, etc.) are
fully custom.

------------------------------------------------------------------------

## 🚀 Features

-   Tasks board with multiple columns
-   Add columns
-   Add tasks
-   Edit tasks
-   Delete tasks
-   Move tasks between columns
-   Select individual tasks
-   Select all tasks in a column (with indeterminate state)
-   Search tasks by name
-   **Bulk actions**:
    -   delete selected tasks
    -   mark tasks as complete / incomplete
    -   move selected tasks to another column
-   Custom UI kit (Button, Input, Checkbox, Textarea, etc.)
-   Clean component architecture and logic separation

------------------------------------------------------------------------

## 📦 Tech Stack

-   React 19
-   TypeScript 5.9
-   Vite 7
-   Sass (SCSS Modules)
-   React Hook Form
-   Yup (via yupResolver)

------------------------------------------------------------------------

## 🛠 Installation & Scripts

### 1. Install dependencies

    npm install

Requires Node.js 22+.

### 2. Start development server

    npm run dev

### 3. Build production bundle

    npm run build

### 4. Preview production build

    npm run preview

### 5. Lint

    npm run lint

### 6. Format code

    npm run format

------------------------------------------------------------------------

## 📁 Project Structure

    src/
      assets/
      modules/
      shared/
      styles/
      ui-kit/
      App.tsx
      main.tsx

------------------------------------------------------------------------
