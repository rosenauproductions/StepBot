# StepBot

A customizable help bot with step by step options for Canvas LMS.

## Description

This project is a standalone help bot designed for embedding in Canvas LMS. It uses a text file for help content, provides memory for students to resume interrupted sessions, and offers a creator tool for admins to edit the help content.

## Features

- Parses user questions and offers 2-6 related questions
- Memory system with "continue where you left off" option
- Single-step and multi-step answers with interactive buttons
- Easy-to-edit text file format for content management
- Downloadable creator tool for admins to add/edit/delete help items
- HTML formatting support in answers and steps

## Text File Format

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
3. Open `index.html` in a browser or embed in Canvas

## Creator Tool

- Open `creator.html` in a browser
- Load the current `help.txt`
- Add, edit, or delete help items
- Download the updated file

## Contributing

Feel free to contribute by opening issues or pull requests.

## License

MIT License
