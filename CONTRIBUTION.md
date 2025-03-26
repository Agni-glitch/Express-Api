# Contribution Guidelines

Thank you for considering contributing to the **Express-Api** project! Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

---

## How to Contribute

### 1. Fork the Repository
Start by forking the repository to your GitHub account. This will allow you to make changes without affecting the original project.

### 2. Clone the Repository
Clone the forked repository to your local machine:
```bash
git clone https://github.com/Agni-glitch/Express-Api.git
```

### 3. Create a New Branch
Create a new branch for your feature or bug fix:
```bash
git checkout -b feature/your-feature-name
```

### 4. Make Changes
Make your changes to the codebase. Ensure that your changes align with the project's coding standards and guidelines.

### 5. Test Your Changes
Run the project locally and test your changes to ensure they work as expected. Use the following commands:
- Start the server:
  ```bash
  npm start
  ```
- Run any existing test scripts (if applicable).

### 6. Commit Your Changes
Commit your changes with a meaningful commit message:
```bash
git commit -m "Add your meaningful commit message here"
```

### 7. Push to Your Branch
Push your changes to your forked repository:
```bash
git push origin feature/your-feature-name
```

### 8. Submit a Pull Request
Go to the original repository on GitHub and submit a pull request. Provide a clear description of your changes and why they should be merged.

---

## Code of Conduct
Please adhere to the following guidelines to maintain a positive and collaborative environment:
- Be respectful and considerate of others.
- Provide constructive feedback.
- Avoid using offensive or inappropriate language.

---

## Coding Standards
To maintain consistency across the codebase, please follow these coding standards:
- Use **camelCase** for variable and function names.
- Use **PascalCase** for class names.
- Use 2 spaces for indentation.
- Add comments to explain complex logic.
- Ensure your code is clean and free of unnecessary comments or unused variables.

---

## Issues and Bug Reports
If you encounter any issues or bugs, please report them by opening an issue in the repository. Provide as much detail as possible, including:
- Steps to reproduce the issue.
- Expected behavior.
- Actual behavior.
- Screenshots (if applicable).

---

## Feature Requests
If you have an idea for a new feature, feel free to open an issue and describe your idea in detail. Please include:
- The problem the feature solves.
- How the feature would work.
- Any alternatives you have considered.

---

## Testing
If you are adding new functionality, please include tests to ensure the feature works as expected. Use the existing project structure to add your tests.

---

## Development Scripts
Use the following scripts during development:
- **Delete all movies**:
  ```bash
  node data/import-dev-data.js --delete
  ```
- **Import movies from `movies.json`**:
  ```bash
  node data/import-dev-data.js --import
  ```

---

## License
By contributing to this project, you agree that your contributions will be licensed under the [MIT License](LICENSE).

---

Thank you for contributing to **Express-Api**! Your support and contributions are greatly appreciated.
