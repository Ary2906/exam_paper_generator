# Exam Paper Generator - React Application

A comprehensive offline-first React application for managing exam question banks and generating immutable question papers with the "Snapshot" logic.

## Features

### 🔐 User Authentication & Role-Based Access
- **Admin**: Full system control, subject management, user overview
- **Examiner**: Question bank management, paper creation and editing
- **Student**: View published papers

### 📚 Question Bank Management
- Create, Read, Update, Delete (CRUD) questions
- Organize questions by subject
- Question types: MCQ, Short Answer, Long Answer, True/False
- Public vs. Personal visibility control
- Difficulty levels: Easy, Medium, Hard
- Question explanations and options

### 📄 Question Paper Management
- Create question papers from question bank
- **Snapshot Logic**: Papers become immutable copies when generated
  - Even if original questions are modified/deleted, papers retain original content
  - Ensures data integrity for exam administration
  
### 📊 Paper State Management
- **Saved**: Initial draft state
- **In Review**: Assigned to reviewer examiner
- **Published**: Final, immutable state for distribution

### 💾 Local Data Storage
- JSON-based localStorage persistence
- No backend required (offline-first)
- Automatic data persistence on all operations
- Complete data export capability

### 🖨️ Export & Printability
- Print question papers with answer keys
- Export questions by examiner
- Export complete system database (Admin only)

## Project Structure

```
src/
├── types/
│   └── index.ts              # TypeScript interfaces and types
├── store/
│   └── dataStore.ts          # JSON-based data management
├── contexts/
│   └── AuthContext.tsx       # Authentication and user state
├── pages/
│   ├── LoginPage.tsx         # Login interface
│   ├── AdminDashboard.tsx    # Admin panel
│   ├── ExaminerDashboard.tsx # Examiner panel with paper editing
│   └── StudentDashboard.tsx  # Student panel
├── components/
│   └── PaperEditor.tsx       # Modal for editing papers and adding questions
├── styles/
│   └── pages.css             # Comprehensive styling
├── App.tsx                   # Main app component with routing
└── main.tsx                  # React entry point
```

## Data Schema

### Users Table
- id, username, email, password, role
- Roles: Admin, Examiner, Student

### Subjects
- id, name, description, createdBy (Admin)

### Questions (Live Repository)
- id, subjectId, text, type, options
- correctAnswer, explanation, difficulty
- visibility (Personal/Public), createdBy (Examiner)

### Question Papers (Metadata)
- id, title, subjectId, totalMarks
- createdBy, status (Saved/In Review/Published)
- publishedAt

### Paper Snapshots (Immutable Copy)
- id, paperId, questionId (reference)
- snapshotText, snapshotOptions, snapshotCorrectAnswer
- snapshotExplanation, snapshotDifficulty
- order, marks

## Demo Credentials

### Admin
- Username: `admin`
- Password: `admin123`

### Examiner
- Username: `examiner1`
- Password: `examiner123`

### Student
- Username: `student1`
- Password: `student123`

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser at `http://localhost:5173/`

## Available Scripts

### Development
```bash
npm run dev
```
Starts the Vite development server with hot module reloading.

### Build
```bash
npm run build
```
Creates an optimized production build.

### Preview
```bash
npm run preview
```
Serves the production build locally.

### Lint
```bash
npm run lint
```
Runs ESLint to check code quality.

## Key Workflows

### Creating a Question Paper with Snapshots

1. **Login as Examiner**: Use examiner1/examiner123
2. **Navigate to Question Papers**: Click the "Question Papers" tab
3. **Create Paper**: Click "Create Paper" and fill in details
4. **Edit Paper**: Click "Edit" to open the paper editor
5. **Add Questions**: Select questions from the available list
6. **Set Marks**: Assign marks to each question
7. **Generate Snapshots**: This creates immutable copies of questions
8. **Publish**: Make the paper final and immutable

### The Snapshot Logic

When you generate snapshots:
- All question content (text, options, answers) is copied
- Questions are indexed by order in the paper
- If original questions are later modified/deleted, the paper remains unchanged
- This ensures exam integrity

### Publishing Papers

Once published:
- Papers become read-only
- Students can view published papers
- Answer keys are visible in admin/examiner view
- Papers can be printed with formatted answer keys

## Technical Details

### State Management
- Uses React Context API for authentication
- DataStore class manages all data persistence
- localStorage for offline storage

### Data Persistence
All data is stored in browser's localStorage under the key: `exam_paper_generator_data`

### Styling
- CSS Grid and Flexbox layouts
- Responsive design (works on mobile, tablet, desktop)
- Print-friendly styles for question papers
- Professional color scheme with accessibility focus

## Browser Support
- Chrome/Edge (latest)
- Firefox (latest)  
- Safari (latest)
- All modern browsers with localStorage support

## Security Considerations

⚠️ **This is a development version**:
- Passwords are stored in plain text (use hashing in production)
- localStorage is not encrypted (use encrypted local storage in production)
- No backend authentication (implement server-side auth in production)
- No rate limiting or input sanitization (add in production)

## Future Enhancements

- [ ] Backend API integration for cloud sync
- [ ] User role management (Admin can create examiners)
- [ ] Reviewer workflow with comments
- [ ] Randomized question order for papers
- [ ] Question tagging and advanced filtering
- [ ] PDF generation and email delivery
- [ ] Bulk import/export of questions
- [ ] Question analytics and usage tracking
- [ ] Multi-institution support
- [ ] Mobile app version

## Troubleshooting

### Data Not Persisting
- Check browser's localStorage is enabled
- Try clearing browser cache and reloading
- Check browser console for errors

### Login Issues
- Make sure you're using exact credentials
- User accounts are stored in localStorage

### Questions Not Appearing
- Ensure questions are marked as "Public" or created by the current examiner
- Check the subject filter matches the question's subject

## License
MIT

## Support
For issues or questions, please refer to the documentation.

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
