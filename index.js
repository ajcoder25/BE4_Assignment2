const mongoose = require("mongoose");
const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const Recipe = require("./model/recipe.model");
app.use(express.json());
const cors = require("cors");
app.use(cors());

const connection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB);
    console.log("Connected sucessfully");
  } catch (error) {
    console.log(error.message);
  }
};

connection();

//Create a new recipe

const saveRecipe = async (newItem) => {
  try {
    const saveIt = new Recipe(newItem);
    const saveRecipe = await saveIt.save();
    return saveRecipe;
  } catch (error) {
    console.log(error.message);
  }
};

app.post("/recipes", async (req, res) => {
  try {
    const recipeSave = await saveRecipe(req.body);
    if (recipeSave) {
      res.status(201).send(recipeSave, { newRecipe: recipeSave });
    } else {
      res.status(404).json({ error: "Something is wrong in recipe Data" });
    }
  } catch (error) {
    res.status(404).json({ error: "Something is wrong in the API " });
  }
});

// get all the all the data

const getAllBooks = async () => {
  try {
    const findAllRecipe = await Recipe.find();
    return findAllRecipe;
  } catch (error) {
    console.log(error.message);
  }
};

app.get("/recipes", async (req, res) => {
  try {
    const getBooks = await getAllBooks();
    if (getBooks && getBooks.length > 0) {
      res.send(getBooks);
    } else {
      res.status(404).json({ error: "Unable to get the data " });
    }
  } catch (error) {
    res.status(404).json({ error: "Unable to fetch the data" });
  }
});

// get the recipe detials by its' title

const getRecipeDetails = async (titleDetail) => {
  try {
    const findRecipe = await Recipe.find({ title: titleDetail });
    return findRecipe;
  } catch (error) {
    console.log(error.message);
  }
};
app.get("/recipes/:recipedetail", async (req, res) => {
  try {
    const getDetail = await getRecipeDetails(req.params.recipedetail);
    if (getDetail) {
      res
        .status(201)
        .json({ message: "Here is the requested Data", recipe: getDetail });
    } else {
      res.status(404).json({ error: "unable to get the data " });
    }
  } catch (error) {
    res.status(404).json({ error: "Something is wrong " });
  }
});

const getRecipeByAuthor = async (value) => {
  try {
    const findRecipe = await Recipe.find({ difficulty: value });
    return findRecipe;
  } catch (error) {
    console.log(error.message);
  }
};

app.get("/recipes/difficulty/:Easy", async (req, res) => {
  try {
    const checkRecipe = await getRecipeByAuthor(req.params.Easy);

    if (checkRecipe) {
      res
        .status(201)
        .json({ Message: "Here is the data", recipe: checkRecipe });
    } else {
      res.status(400).json({ error: "not able to find the data " });
    }
  } catch {
    res.status(404).json({ error: "Something is wrong in the API" });
  }
});

// 10  update the difficulty level with the help of its id

const updateById = async (id, update) => {
  try {
    const getById = await Recipe.findByIdAndUpdate(id, update, { new: true });
    return getById;
  } catch (error) {
    console.log(error.message);
  }
};

app.post("/recipes/recipeId/:id", async (req, res) => {
  try {
    const updateDifficulty = await updateById(req.params.id, req.body);

    if (updateDifficulty) {
      res
        .status(201)
        .json({ message: "Sucessfully Updated", Updated: updateDifficulty });
    } else {
      res.status(400).json({ error: "Recipe not found" });
    }
  } catch {
    res.status(404).json({ error: "Something is wrong in API" });
  }
});

// 11. Update it using title

const updateRecipeByTitle = async (recipetitle, update) => {
  try {
    const getRecipe = await Recipe.findOneAndUpdate(
      { title: recipetitle },
      update,
      { new: true }
    );
    return getRecipe;
  } catch (error) {
    console.log(error.message);
  }
};

app.post("/recipes/recipeName/:recipetitle", async (req, res) => {
  try {
    const updateByTitle = await updateRecipeByTitle(
      req.params.recipetitle,
      req.body
    );

    if (updateByTitle) {
      res
        .status(201)
        .json({ message: "updated sucessfully", newValue: updateByTitle });
    } else {
      res.status(404).json({ error: "Recipe not found " });
    }
  } catch {
    res.status(400).json({ error: "something is wrong with the API" });
  }
});

// 12 delete the recipe by id

const deleteRecipe = async (recipeId) => {
  try {
    const selectRecipe = await Recipe.findByIdAndDelete(recipeId);
    return selectRecipe;
  } catch (error) {
    console.log(error.message);
  }
};

app.delete("/recipes/:recipeId", async (req, res) => {
  try {
    const recipeDetail = await deleteRecipe(req.params.recipeId);

    if (recipeDetail) {
      res
        .status(201)
        .json({ message: "Deleted Sucessfully", recipe: recipeDetail });
    } else {
      res.status(404).json({ error: "recipe not found " });
    }
  } catch (error) {
    res.status(404).json({ error: "Recipe not found " });
  }
});

// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`You are connected to the ${PORT} sucessfully`);
// });
