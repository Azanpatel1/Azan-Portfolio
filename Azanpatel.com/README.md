# Engineering Portfolio Website

A modern, futuristic and academic portfolio website for showcasing engineering projects and skills.

## Features

- **Responsive Design**: Fully responsive design that works on all devices
- **Modern UI**: Sleek, futuristic interface with a professional academic aesthetic
- **Project Showcase**: Display engineering projects with filterable categories
- **Skills Section**: Visualize technical, software, and soft skills
- **Contact Form**: Interactive contact form for visitor messages
- **About Section**: Share your background, education, and expertise

## Technologies Used

- **React**: Frontend library for building the user interface
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework for styling
- **React Router**: For page navigation
- **Vite**: Next generation frontend tooling

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/engineering-portfolio.git
cd engineering-portfolio
```

2. Install dependencies
```bash
npm install
# or
yarn
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Customization

### Personal Information

Update your personal information in the following files:
- `src/components/home/Hero.tsx`: Main introduction
- `src/components/home/About.tsx`: Biography and details
- `src/components/home/Skills.tsx`: Your skills and expertise
- `src/components/home/Contact.tsx`: Contact information

### Projects

Add or modify projects in:
- `src/components/projects/ProjectsGrid.tsx`: Update the `SAMPLE_PROJECTS` array

### Colors and Theme

Customize the color scheme in:
- `tailwind.config.js`: Modify the color palette in the theme section

## Building for Production

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` directory.

## License

MIT

## Acknowledgments

- Icons from Heroicons
- Fonts from Google Fonts (Inter, JetBrains Mono)
