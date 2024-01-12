 # CookingBlog

**A delicious collection of recipes to share and explore!**

This repository houses a Node.js application that showcases a variety of cooking recipes, powered by MongoDB, Express, and EJS. Dive in to discover culinary delights and share your own creations!

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/CookingBlog.git
   ```

2. **Install dependencies:**

   ```bash
   cd CookingBlog
   npm install
   ```

3. **Create a `.env` file:**

   - Create a file named `.env` in the root directory of the project.
   - Add the following environment variables, replacing placeholders with your MongoDB connection details:

     ```
     MONGODB_URI = mongodb+srv://<username>:<password>@cluster0.6m5cz.mongodb.net/Recipes?retryWrites=true&w=majority
     ```

4. **Import data (optional):**

   - If you want to import the provided recipe data, navigate to the `MongoDB Data` folder and follow the instructions within to populate your MongoDB database.

5. **Start the application:**

   ```bash
   npm start
   ```

## Usage

- Once the application is running, access it in your web browser at `http://localhost:3000` (or the specified port).
- Explore the recipes, add new ones, and share your culinary experiences!

## Technologies Used

- Node.js
- MongoDB
- Express
- EJS

## Contributing

Feel free to contribute to this project by adding new recipes, features, or enhancements!

## License

This project is licensed under the MIT License.
