import Search from './models/Search';
import List from './models/List';
import Recipe from './models/Recipe';
import { elements, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import Likes from './models/Likes';

const state = {};

//////////////////SEARCH CONTROLER///////////////////////

const controlSearch = async () => {
  const query = searchView.getInput();

  if (query) {
    state.search = new Search(query);

    //Prepare UI for results
    searchView.clearInput();
    //Clearing results__form from the previuos search
    searchView.clearResuls();
    //Circle animation. Renders the loader;
    renderLoader(elements.searchRes);
    try {
      await state.search.getResults();
      clearLoader();

      searchView.renderResults(state.search.result);
    } catch (err) {
      console.log(err);
      clearLoader();
    }
  }
};

elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
  const btn = e.target.closest('.btn-inline');

  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);

    searchView.clearResuls();

    searchView.renderResults(state.search.result, goToPage);
  }
});

//////////////////RECIPE CONTROLER///////////////////////

const controlRecipe = async () => {
  const id = window.location.hash.replace('#', '');

  if (id) {
    recipeView.clearRecipeResults();
    renderLoader(elements.recipe);
    if (state.search) {
      recipeView.highlightSelected(id);
    }
    state.recipe = new Recipe(id);

    try {
      await state.recipe.getRecipe();

      state.recipe.parseIngredients();

      state.recipe.calcTime();
      state.recipe.calcServings();

      clearLoader();
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
    } catch (err) {
      alert('Error processing recipe!');
    }
  }
};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

//*********LIST CONTROLLER ******/

const controlList = () => {
  if (!state.list) state.list = new List();

  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
};

elements.shopping.addEventListener('click', e => {
  const id = e.target.closest('.shopping__item').dataset.itemid;

  if (e.target.matches('.shopping__delete, .shopping__delete *')) {
    state.list.deleteItem(id);

    listView.deleteItem(id);
  } else if (e.target.matches('.shopping__count-value')) {
    const val = parseFloat(e.target.value, 10);
    state.list.updateCount(id, val);
  }
});

//*********LIKE CONTROLLER ******/
//TESTING
const controlLike = () => {
  if (!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;

  if (!state.likes.isLiked(currentID)) {
    const newLike = state.likes.addLike(currentID, state.recipe.title, state.recipe.author, state.recipe.img);

    likesView.toggleLikeButton(true);

    likesView.renderLike(newLike);
    console.log(state.likes);
  } else {
    //remove like from the state
    state.likes.deleteLike(currentID);

    //toggle the like button
    likesView.toggleLikeButton(false);

    //remove like from UI list
    likesView.deleteLikeMenu(currentID);
    console.log(state.likes);
  }
  likesView.toggleLikeMenu(state.likes.getNumLikes());
};

window.addEventListener('load', () => {
  //each time when the page loads we want to start by creating the new likes object
  state.likes = new Likes();

  //restore likes
  state.likes.readStorage();

  //toggle like menu button
  likesView.toggleLikeMenu(state.likes.getNumLikes());

  //render the existing likes;
  state.likes.likes.forEach(likes => likesView.renderLike(likes));
});

elements.recipe.addEventListener('click', e => {
  if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    controlList();
  } else if (e.target.matches('.recipe__love, .recipe__love *')) {
    controlLike();
  }
});