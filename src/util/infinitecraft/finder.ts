// code based off of: https://github.com/vantezzen/infinite-craft-solver/blob/main/apps/web/lib/Finder.ts
// thanks to @vantezzen for such a cool algo
import fs from 'fs/promises'
import { ICFile, decompressRecipes } from './decompress.js';

export interface Recipe {
  first: string;
  second: string;
  result: string;
}

export enum FinderPhase {
  Search,
  Backtrack,
}

export interface FinderProgess {
  current: number;
  phase: FinderPhase;
}

export default class Finder {
  private DEFAULT_ITEMS = ["Water", "Fire", "Wind", "Earth"];
  private recipes: Recipe[] = []; // Array to store all recipes
  private recipeMap: Map<string, Recipe[]> = new Map(); // Map to store recipes for each item
  private recipesLoaded: boolean = false; // Flag to check if recipes are loaded
  public items = new Set<string>(this.DEFAULT_ITEMS);

  constructor(
    private onProgress: (progress: FinderProgess) => void = () => {}
  ) {}

  private async loadRecipes() {
    const file = JSON.parse(await fs.readFile("./assets/icRecipes.json", "utf-8")) as ICFile
    this.recipes = await decompressRecipes(file);
    this.items = new Set<string>(file.items);
    for (const recipe of this.recipes) {
        if (!this.recipeMap.has(recipe.result)) {
          this.recipeMap.set(recipe.result, []);
        }
        this.recipeMap.get(recipe.result)!.push(recipe);
    }
  
    this.recipesLoaded = true;  
  }

  async findItem(targetItem: string) {
    if (this.DEFAULT_ITEMS.includes(targetItem)) {
      return [];
    }

    if (!this.recipesLoaded) {
      await this.loadRecipes();
    }

    if (!this.items.has(targetItem)) {
      throw new Error("Item not found");
    }

    const path = await this.findShortestPath(targetItem);
    if (!path) {
      throw new Error("Item cannot be crafted");
    }

    return path;
    };

  private async findShortestPath(targetItem: string): Promise<Recipe[] | null> {
    const itemQueue: {
      item: string;
      recipe: Recipe | null;
    }[] = this.DEFAULT_ITEMS.map((item) => ({
      item,
      recipe: null,
    }));
    const recipesUsed = new Set<Recipe>();
    const discoveredItems = new Set<string>(this.DEFAULT_ITEMS);
    let itemsProcessed = 0;

    const updateInterval = setInterval(() => {
      this.onProgress({
        current: itemsProcessed,
        phase: FinderPhase.Search,
      });
    }, 100);

    let cleanedRecipes = this.recipes.filter((recipe) => {
      const isCircularRecipe =
        recipe.first === recipe.result || recipe.second === recipe.result;

      const containsNothing =
        recipe.first === "Nothing" ||
        recipe.second === "Nothing" ||
        recipe.result === "Nothing";

      return !isCircularRecipe && !containsNothing;
    });

    while (itemQueue.length > 0) {
      itemsProcessed++;
      const { item, recipe } = itemQueue.shift()!;

      if (item === targetItem) {
        // console.log("Found path", recipesUsed.size);
        clearInterval(updateInterval);
        return await this.backtrackPath(targetItem, recipe, [...recipesUsed]);
      }

      cleanedRecipes.forEach((recipe) => {
        const hasDiscoveredItems =
          discoveredItems.has(recipe.first) &&
          discoveredItems.has(recipe.second);
        if (!hasDiscoveredItems) return;

        const resultAlreadyDiscovered = discoveredItems.has(recipe.result);
        if (resultAlreadyDiscovered) return;

        discoveredItems.add(recipe.result);

        recipesUsed.add(recipe);
        itemQueue.push({
          item: recipe.result,
          recipe,
        });
      });

      cleanedRecipes = cleanedRecipes.filter(
        (r) => !recipesUsed.has(r) && !discoveredItems.has(r.result)
      );

      await new Promise((resolve) => setTimeout(resolve, 0));
    }

    clearInterval(updateInterval);
    return null;
  }

  private async backtrackPath(
    targetItem: string,
    recipe: Recipe | null,
    recipesUsed: Recipe[]
  ): Promise<Recipe[]> {
    if (!recipe) {
      return [];
    }
    // "recipesUsed" contains recipes that are not part of the shortest path to the target item
    // We want to backtrack from the target item to the source items (this.DEFAULT_ITEMS) to find the shortest path

    const recipes: Recipe[] = [recipe];
    const itemQueue = [recipe?.first, recipe?.second];
    const discoveredItems = new Set<string>([targetItem]);

    const updateInfo = () => {
      this.onProgress({
        current: recipes.length,
        phase: FinderPhase.Backtrack,
      });
    };

    const updateInterval = setInterval(() => {
      updateInfo();
    }, 50);
    updateInfo();
    await new Promise((resolve) => setTimeout(resolve, 0));

    while (itemQueue.length > 0) {
      const item = itemQueue.shift()!;

      if (this.DEFAULT_ITEMS.includes(item)) {
        continue;
      }

      const recipeUsedForItem = recipesUsed.find(
        (recipe) => recipe.result === item
      );
      if (!recipeUsedForItem) {
        continue;
      }

      recipes.push(recipeUsedForItem);
      discoveredItems.add(recipeUsedForItem.first);
      discoveredItems.add(recipeUsedForItem.second);
      itemQueue.push(recipeUsedForItem.first, recipeUsedForItem.second);

      await new Promise((resolve) => setTimeout(resolve, 0));
    }

    clearInterval(updateInterval);
    return this.removeDuplicates(recipes.reverse());
  }

  private removeDuplicates(path: Recipe[]): Recipe[] {
    const seen = new Set<string>();
    return path.filter((recipe) => {
      const key = `${recipe.first}-${recipe.second}-${recipe.result}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }
}