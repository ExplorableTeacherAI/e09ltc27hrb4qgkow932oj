/**
 * Variables Configuration
 * =======================
 *
 * Linear Programming Lesson Variables
 */

import { type VarValue } from '@/stores';

export interface VariableDefinition {
    defaultValue: VarValue;
    label?: string;
    description?: string;
    type?: 'number' | 'text' | 'boolean' | 'select' | 'array' | 'object' | 'spotColor' | 'linkedHighlight';
    unit?: string;
    min?: number;
    max?: number;
    step?: number;
    color?: string;
    options?: string[];
    placeholder?: string;
    correctAnswer?: string;
    caseSensitive?: boolean;
    bgColor?: string;
    schema?: string;
}

export const variableDefinitions: Record<string, VariableDefinition> = {
    // ========================================
    // INTRODUCTION SECTION
    // ========================================

    // Factory production example
    productA: {
        defaultValue: 4,
        type: 'number',
        label: 'Units of Product A',
        description: 'Number of units of product A to manufacture',
        min: 0,
        max: 10,
        step: 1,
        color: '#62D0AD',
    },
    productB: {
        defaultValue: 3,
        type: 'number',
        label: 'Units of Product B',
        description: 'Number of units of product B to manufacture',
        min: 0,
        max: 10,
        step: 1,
        color: '#8E90F5',
    },
    profitA: {
        defaultValue: 40,
        type: 'number',
        label: 'Profit per unit A',
        description: 'Profit earned per unit of product A',
        min: 10,
        max: 100,
        step: 5,
        color: '#62D0AD',
    },
    profitB: {
        defaultValue: 30,
        type: 'number',
        label: 'Profit per unit B',
        description: 'Profit earned per unit of product B',
        min: 10,
        max: 100,
        step: 5,
        color: '#8E90F5',
    },

    // ========================================
    // GRAPHICAL METHOD SECTION
    // ========================================

    // Constraint line parameters (for interactive builder)
    constraint1Intercept: {
        defaultValue: 8,
        type: 'number',
        label: 'Constraint 1 Y-Intercept',
        description: 'Y-intercept of the first constraint line',
        min: 4,
        max: 12,
        step: 0.5,
        color: '#F7B23B',
    },
    constraint2Intercept: {
        defaultValue: 6,
        type: 'number',
        label: 'Constraint 2 Y-Intercept',
        description: 'Y-intercept of the second constraint line',
        min: 3,
        max: 10,
        step: 0.5,
        color: '#AC8BF9',
    },

    // Corner point exploration
    cornerX: {
        defaultValue: 0,
        type: 'number',
        label: 'Corner X',
        description: 'X-coordinate of selected corner point',
        min: 0,
        max: 8,
        step: 0.1,
        color: '#ef4444',
    },
    cornerY: {
        defaultValue: 0,
        type: 'number',
        label: 'Corner Y',
        description: 'Y-coordinate of selected corner point',
        min: 0,
        max: 8,
        step: 0.1,
        color: '#ef4444',
    },

    // Objective function line
    objectiveZ: {
        defaultValue: 120,
        type: 'number',
        label: 'Objective Value Z',
        description: 'Current value of the objective function',
        min: 0,
        max: 300,
        step: 10,
        color: '#22c55e',
    },

    // ========================================
    // SOLVING GRAPHICALLY SECTION
    // ========================================

    // Solution point
    solutionX: {
        defaultValue: 4,
        type: 'number',
        label: 'Solution X',
        description: 'X-coordinate of the optimal solution',
        min: 0,
        max: 8,
        step: 0.5,
        color: '#62D0AD',
    },
    solutionY: {
        defaultValue: 2,
        type: 'number',
        label: 'Solution Y',
        description: 'Y-coordinate of the optimal solution',
        min: 0,
        max: 8,
        step: 0.5,
        color: '#8E90F5',
    },

    // ========================================
    // SIMPLEX METHOD SECTION
    // ========================================

    // Simplex tableau step
    simplexStep: {
        defaultValue: 0,
        type: 'number',
        label: 'Simplex Step',
        description: 'Current step in the Simplex algorithm',
        min: 0,
        max: 3,
        step: 1,
        color: '#62CCF9',
    },

    // Pivot element highlight
    pivotRow: {
        defaultValue: 1,
        type: 'number',
        label: 'Pivot Row',
        description: 'Row index of the pivot element',
        min: 0,
        max: 2,
        step: 1,
        color: '#F7B23B',
    },
    pivotCol: {
        defaultValue: 0,
        type: 'number',
        label: 'Pivot Column',
        description: 'Column index of the pivot element',
        min: 0,
        max: 4,
        step: 1,
        color: '#F7B23B',
    },

    // ========================================
    // LINKED HIGHLIGHT VARIABLES
    // ========================================

    activeHighlight: {
        defaultValue: '',
        type: 'text',
        label: 'Active Highlight',
        description: 'Currently highlighted element for linked highlighting',
        color: '#8E90F5',
        bgColor: 'rgba(142, 144, 245, 0.15)',
    },

    lpHighlight: {
        defaultValue: '',
        type: 'text',
        label: 'LP Highlight',
        description: 'Highlight for LP components visualization',
        color: '#62D0AD',
        bgColor: 'rgba(98, 208, 173, 0.15)',
    },

    // ========================================
    // ASSESSMENT VARIABLES
    // ========================================

    // Introduction quiz
    answerLPGoal: {
        defaultValue: '',
        type: 'select',
        label: 'LP Goal Answer',
        description: 'Student answer for LP goal question',
        placeholder: '???',
        correctAnswer: 'maximize or minimize',
        options: ['solve equations', 'maximize or minimize', 'graph functions', 'find derivatives'],
        color: '#8E90F5',
    },

    // Graphical method quiz
    answerWhyCorners: {
        defaultValue: '',
        type: 'select',
        label: 'Why Corners Answer',
        description: 'Student answer for why corners matter',
        placeholder: '???',
        correctAnswer: 'corners',
        options: ['center', 'corners', 'edges', 'anywhere'],
        color: '#62D0AD',
    },

    answerFeasibleRegion: {
        defaultValue: '',
        type: 'text',
        label: 'Feasible Region Answer',
        description: 'Student answer about feasible region',
        placeholder: '???',
        correctAnswer: 'intersection',
        color: '#F7B23B',
    },

    // Solving graphically quiz
    answerOptimalProfit: {
        defaultValue: '',
        type: 'text',
        label: 'Optimal Profit Answer',
        description: 'Student answer for optimal profit calculation',
        placeholder: '???',
        correctAnswer: '220',
        color: '#22c55e',
    },

    answerOptimalX: {
        defaultValue: '',
        type: 'text',
        label: 'Optimal X Answer',
        description: 'Student answer for optimal x value',
        placeholder: '???',
        correctAnswer: '4',
        color: '#62D0AD',
    },

    answerOptimalY: {
        defaultValue: '',
        type: 'text',
        label: 'Optimal Y Answer',
        description: 'Student answer for optimal y value',
        placeholder: '???',
        correctAnswer: '2',
        color: '#8E90F5',
    },

    // Simplex quiz
    answerSlackVariable: {
        defaultValue: '',
        type: 'select',
        label: 'Slack Variable Answer',
        description: 'Student answer about slack variables',
        placeholder: '???',
        correctAnswer: 'convert to equality',
        options: ['convert to equality', 'find the solution', 'draw the graph', 'calculate profit'],
        color: '#AC8BF9',
    },

    answerPivotPurpose: {
        defaultValue: '',
        type: 'select',
        label: 'Pivot Purpose Answer',
        description: 'Student answer about pivot operations',
        placeholder: '???',
        correctAnswer: 'move to better corner',
        options: ['solve the equation', 'move to better corner', 'find the center', 'draw the line'],
        color: '#F7B23B',
    },

    answerEnteringVariable: {
        defaultValue: '',
        type: 'select',
        label: 'Entering Variable Answer',
        description: 'Student answer for which variable enters the basis',
        placeholder: '???',
        correctAnswer: 'most negative coefficient',
        options: ['largest coefficient', 'most negative coefficient', 'smallest coefficient', 'zero coefficient'],
        color: '#62CCF9',
    },
};

// ========================================
// HELPER FUNCTIONS
// ========================================

export const getVariableNames = (): string[] => {
    return Object.keys(variableDefinitions);
};

export const getDefaultValue = (name: string): VarValue => {
    return variableDefinitions[name]?.defaultValue ?? 0;
};

export const getVariableInfo = (name: string): VariableDefinition | undefined => {
    return variableDefinitions[name];
};

export const getDefaultValues = (): Record<string, VarValue> => {
    const defaults: Record<string, VarValue> = {};
    for (const [name, def] of Object.entries(variableDefinitions)) {
        defaults[name] = def.defaultValue;
    }
    return defaults;
};

export function numberPropsFromDefinition(def: VariableDefinition | undefined): {
    defaultValue?: number;
    min?: number;
    max?: number;
    step?: number;
    color?: string;
} {
    if (!def || def.type !== 'number') return {};
    return {
        defaultValue: def.defaultValue as number,
        min: def.min,
        max: def.max,
        step: def.step,
        ...(def.color ? { color: def.color } : {}),
    };
}

export function choicePropsFromDefinition(def: VariableDefinition | undefined): {
    placeholder?: string;
    color?: string;
    bgColor?: string;
} {
    if (!def || def.type !== 'select') return {};
    return {
        ...(def.placeholder ? { placeholder: def.placeholder } : {}),
        ...(def.color ? { color: def.color } : {}),
        ...(def.bgColor ? { bgColor: def.bgColor } : {}),
    };
}

export function togglePropsFromDefinition(def: VariableDefinition | undefined): {
    color?: string;
    bgColor?: string;
} {
    if (!def || def.type !== 'select') return {};
    return {
        ...(def.color ? { color: def.color } : {}),
        ...(def.bgColor ? { bgColor: def.bgColor } : {}),
    };
}

export function clozePropsFromDefinition(def: VariableDefinition | undefined): {
    placeholder?: string;
    color?: string;
    bgColor?: string;
    caseSensitive?: boolean;
} {
    if (!def || def.type !== 'text') return {};
    return {
        ...(def.placeholder ? { placeholder: def.placeholder } : {}),
        ...(def.color ? { color: def.color } : {}),
        ...(def.bgColor ? { bgColor: def.bgColor } : {}),
        ...(def.caseSensitive !== undefined ? { caseSensitive: def.caseSensitive } : {}),
    };
}

export function spotColorPropsFromDefinition(def: VariableDefinition | undefined): {
    color: string;
} {
    return {
        color: def?.color ?? '#8B5CF6',
    };
}

export function linkedHighlightPropsFromDefinition(def: VariableDefinition | undefined): {
    color?: string;
    bgColor?: string;
} {
    return {
        ...(def?.color ? { color: def.color } : {}),
        ...(def?.bgColor ? { bgColor: def.bgColor } : {}),
    };
}

export function scrubVarsFromDefinitions(
    varNames: string[],
): Record<string, { min?: number; max?: number; step?: number; color?: string }> {
    const result: Record<string, { min?: number; max?: number; step?: number; color?: string }> = {};
    for (const name of varNames) {
        const def = variableDefinitions[name];
        if (!def) continue;
        result[name] = {
            ...(def.min !== undefined ? { min: def.min } : {}),
            ...(def.max !== undefined ? { max: def.max } : {}),
            ...(def.step !== undefined ? { step: def.step } : {}),
            ...(def.color ? { color: def.color } : {}),
        };
    }
    return result;
}
