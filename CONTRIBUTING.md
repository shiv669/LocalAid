# Contributing to LocalAid Connect

First off, thank you for considering contributing to LocalAid Connect! It's people like you that make LocalAid Connect such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct (see README.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* Use a clear and descriptive title
* Describe the exact steps which reproduce the problem
* Provide specific examples to demonstrate the steps
* Describe the behavior you observed after following the steps
* Explain which behavior you expected to see instead and why
* Include screenshots if possible

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* Use a clear and descriptive title
* Provide a step-by-step description of the suggested enhancement
* Provide specific examples to demonstrate the steps
* Describe the current behavior and explain which behavior you expected to see instead
* Explain why this enhancement would be useful

### Pull Requests

* Fill in the required template
* Do not include issue numbers in the PR title
* Follow the TypeScript and React coding standards
* Include thoughtfully-worded, well-structured tests
* Document new code
* End all files with a newline

## Development Process

1. Fork the repo
2. Create a new branch from \main\:
   \\\ash
   git checkout -b feature/my-feature
   \\\
3. Make your changes
4. Test your changes:
   \\\ash
   npm run dev
   npm run lint
   \\\
5. Commit your changes:
   \\\ash
   git commit -m "Add some feature"
   \\\
6. Push to your fork:
   \\\ash
   git push origin feature/my-feature
   \\\
7. Submit a pull request

## Styleguides

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line

### TypeScript Styleguide

* Use TypeScript for all new code
* Follow the existing code style
* Use meaningful variable names
* Add comments for complex logic
* Use type annotations

### React Component Styleguide

* Use functional components with hooks
* Keep components small and focused
* Use proper prop types
* Follow the single responsibility principle
* Use meaningful component and prop names

## Project Structure

Please maintain the existing project structure:

\\\
src/
 app/          # Next.js pages
 components/   # React components
 lib/          # Utility functions
 types/        # TypeScript types
\\\

## Questions?

Feel free to open an issue with your question or contact the maintainers directly.

Thank you for your contribution! 
