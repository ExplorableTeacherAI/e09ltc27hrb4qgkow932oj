import { type ReactElement } from "react";

// Initialize variables and their colors from this file's variable definitions
import { useVariableStore, initializeVariableColors } from "@/stores";
import { getDefaultValues, variableDefinitions } from "./variables";
useVariableStore.getState().initialize(getDefaultValues());
initializeVariableColors(variableDefinitions);

// Import all sections
import { introductionBlocks } from "./sections/Introduction";
import { graphicalMethodBlocks } from "./sections/GraphicalMethod";
import { solvingGraphicallyBlocks } from "./sections/SolvingGraphically";
import { simplexIntroBlocks } from "./sections/SimplexIntro";
import { simplexInActionBlocks } from "./sections/SimplexInAction";
import { summaryBlocks } from "./sections/Summary";

/**
 * ------------------------------------------------------------------
 * LINEAR PROGRAMMING LESSON
 * ------------------------------------------------------------------
 *
 * This lesson covers:
 * 1. Introduction to Linear Programming - What is LP and key components
 * 2. The Graphical Method - Visualizing constraints and feasible regions
 * 3. Solving Graphically - Step-by-step graphical solution process
 * 4. Introduction to Simplex - Standard form and tableau setup
 * 5. Simplex in Action - Walking through pivot operations
 * 6. Summary - Key takeaways and review
 *
 * Target audience: Post-Secondary (ages 17-20)
 * Prerequisites: No prior knowledge of linear programming
 *
 * Learning objectives:
 * - Understand the components of an LP problem
 * - Solve 2-variable problems graphically
 * - Understand why optimal solutions occur at corners
 * - Understand how the Simplex algorithm works
 * - Perform basic pivot operations
 */

export const blocks: ReactElement[] = [
    // Section 1: Introduction to Linear Programming
    ...introductionBlocks,

    // Section 2: The Graphical Method
    ...graphicalMethodBlocks,

    // Section 3: Solving Graphically
    ...solvingGraphicallyBlocks,

    // Section 4: Introduction to Simplex Method
    ...simplexIntroBlocks,

    // Section 5: Simplex Algorithm in Action
    ...simplexInActionBlocks,

    // Section 6: Summary
    ...summaryBlocks,
];
