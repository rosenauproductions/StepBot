# StepBot

A customizable help bot with step by step options for Canvas LMS.

## Description

This project is a standalone help bot designed for embedding in Canvas LMS. It uses a text file for help content, provides memory for students to resume interrupted sessions, and offers a creator tool for admins to edit the help content.

## Features

- Parses user questions and offers 2-6 related questions
- "Thinking" indicator for a more interactive feel
- Ticket-based session memory with enforced copying: generates a unique ticket for multi-step sessions to resume across devices/sessions
- Improved UI with modern styling, animations, and responsive design
- Single-step and multi-step answers with interactive buttons
- Easy-to-edit text file format for content management
- Admin panel at `/admin` with question editor and theme generator
- Theme support with customizable colors, fonts, logo, and title
- Multi-site deployment: supports custom content per subdirectory or via GitHub forks for separate deployments
- Downloadable tools for admins to customize and export content/themes
- HTML formatting support in answers and steps

## Text File Format

### Welcome Message (optional):
```
Welcome>: Your welcome message here.
```

### Single Step Answer:
```
Question>: Question title
Key>: keyword1,keyword2,phrase
Answer>: Answer text with <b>HTML</b> formatting.
```

### Multi Step Answer:
```
Question>: Question title
Key>: keyword1,keyword2
Multi-Answer>: Intro text with <i>HTML</i>.
Step 1 of 3>: Step one text.
Step 2 of 3>: Step two text.
Step 3 of 3>: Final step text.
```

## Getting Started

1. Clone the repository
2. Edit `help.txt` with your content or use the creator tool
3. For local testing: Run a local server (e.g., `python -m http.server 8000`) and open `http://localhost:8000/index.html`
4. For production: Deploy to Vercel or Netlify for embedding in Canvas LMS

## Creator Tool

- Open `creator.html` in a browser (requires a local server or hosting for fetch to work)
- Click "Load Current Help Content" to populate the editor
- Add, edit, or delete help items
- Click "Download Updated Help.txt" to save changes

## Deployment

### Vercel (Recommended)

1. Sign up/login at [vercel.com](https://vercel.com) with GitHub
2. Import the StepBot repository
3. Deploy automatically
4. Use the provided URL to embed in Canvas LMS

### Netlify

1. Sign up/login at [netlify.com](https://netlify.com) with GitHub
2. Create new site from Git and select StepBot
3. Deploy automatically
4. Use the site URL for embedding

For Canvas embedding, use the deployment URL in an iframe.

## Multi-Site Deployment with GitHub Forks

For easy management of multiple StepBot instances with different content:

1. **Fork the Repository:**
   - Go to https://github.com/rosenauproductions/StepBot
   - Click "Fork" in the top right
   - Create a new repository (e.g., `my-school-stepbot`)

2. **Customize Your Fork:**
   - Clone your forked repository
   - Edit `help.txt` with your custom questions
   - Edit `theme.css` with your custom theme (generate via `/admin/themes.html`)
   - Commit and push changes

3. **Deploy Your Fork:**
   - Connect your forked repository to Vercel or Netlify
   - Deploy as a separate site
   - Use the unique URL for your Canvas course

4. **Benefits:**
   - Each site has its own repository and deployment
   - Easy updates by merging from the main repository
   - Isolated customizations per site

## Contributing

Feel free to contribute by opening issues or pull requests.

## License

MIT License
