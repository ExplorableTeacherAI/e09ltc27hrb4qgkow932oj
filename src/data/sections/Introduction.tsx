import { type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout, SplitLayout } from "@/components/layouts";
import {
    EditableH1,
    EditableH2,
    EditableParagraph,
    InlineScrubbleNumber,
    InlineClozeChoice,
    InlineTooltip,
    InlineSpotColor,
    InlineFeedback,
} from "@/components/atoms";
import { FormulaBlock } from "@/components/molecules";
import {
    getVariableInfo,
    numberPropsFromDefinition,
    choicePropsFromDefinition,
} from "../variables";
import { useVar } from "@/stores";

// ========================================
// REACTIVE COMPONENTS
// ========================================

function ReactiveProfitCalculation() {
    const productA = useVar("productA", 4) as number;
    const productB = useVar("productB", 3) as number;
    const profitA = useVar("profitA", 40) as number;
    const profitB = useVar("profitB", 30) as number;

    const totalProfit = productA * profitA + productB * profitB;

    return (
        <span className="font-semibold text-[#22c55e]">
            ${totalProfit}
        </span>
    );
}

function ReactiveResourceUsage() {
    const productA = useVar("productA", 4) as number;
    const productB = useVar("productB", 3) as number;

    // Labor: 2 hours per A, 3 hours per B, max 18 hours
    const laborUsed = 2 * productA + 3 * productB;
    const laborMax = 18;
    const laborOk = laborUsed <= laborMax;

    // Material: 4 units per A, 2 units per B, max 20 units
    const materialUsed = 4 * productA + 2 * productB;
    const materialMax = 20;
    const materialOk = materialUsed <= materialMax;

    return (
        <div className="bg-slate-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center">
                <span>Labor hours:</span>
                <span className={laborOk ? "text-green-600 font-medium" : "text-red-500 font-medium"}>
                    {laborUsed} / {laborMax} {laborOk ? "✓" : "✗ Over limit!"}
                </span>
            </div>
            <div className="flex justify-between items-center">
                <span>Material units:</span>
                <span className={materialOk ? "text-green-600 font-medium" : "text-red-500 font-medium"}>
                    {materialUsed} / {materialMax} {materialOk ? "✓" : "✗ Over limit!"}
                </span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                <span className="font-medium">Status:</span>
                <span className={laborOk && materialOk ? "text-green-600 font-semibold" : "text-red-500 font-semibold"}>
                    {laborOk && materialOk ? "Feasible solution" : "Infeasible (violates constraints)"}
                </span>
            </div>
        </div>
    );
}

// ========================================
// SECTION BLOCKS
// ========================================

export const introductionBlocks: ReactElement[] = [
    // Title
    <StackLayout key="layout-intro-title" maxWidth="xl">
        <Block id="intro-title" padding="lg">
            <EditableH1 id="h1-intro-title" blockId="intro-title">
                Introduction to Linear Programming
            </EditableH1>
        </Block>
    </StackLayout>,

    // Opening hook
    <StackLayout key="layout-intro-hook" maxWidth="xl">
        <Block id="intro-hook" padding="sm">
            <EditableParagraph id="para-intro-hook" blockId="intro-hook">
                Imagine you run a small factory that makes two products. Each product earns different profits, but you have limited workers and materials. How do you decide how many of each product to make to earn the most money? This is exactly the kind of problem that <InlineTooltip id="tooltip-lp" tooltip="A mathematical method for finding the best outcome (maximum profit, minimum cost) given a set of constraints expressed as linear equations or inequalities.">linear programming</InlineTooltip> solves beautifully.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Section heading
    <StackLayout key="layout-intro-what-heading" maxWidth="xl">
        <Block id="intro-what-heading" padding="md">
            <EditableH2 id="h2-intro-what" blockId="intro-what-heading">
                What is Linear Programming?
            </EditableH2>
        </Block>
    </StackLayout>,

    // Definition paragraph
    <StackLayout key="layout-intro-definition" maxWidth="xl">
        <Block id="intro-definition" padding="sm">
            <EditableParagraph id="para-intro-definition" blockId="intro-definition">
                Linear programming (LP) is a technique to find the best outcome in a mathematical model where the requirements are represented by linear relationships. The "best" usually means maximizing profit or minimizing cost. Every LP problem has three key components: <InlineSpotColor varName="productA" color="#62D0AD">decision variables</InlineSpotColor> (what you can control), an <InlineSpotColor varName="profitA" color="#22c55e">objective function</InlineSpotColor> (what you want to optimize), and <InlineSpotColor varName="constraint1Intercept" color="#F7B23B">constraints</InlineSpotColor> (the limitations you must work within).
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Interactive example heading
    <StackLayout key="layout-intro-example-heading" maxWidth="xl">
        <Block id="intro-example-heading" padding="md">
            <EditableH2 id="h2-intro-example" blockId="intro-example-heading">
                A Simple Factory Problem
            </EditableH2>
        </Block>
    </StackLayout>,

    // Problem setup
    <StackLayout key="layout-intro-problem" maxWidth="xl">
        <Block id="intro-problem" padding="sm">
            <EditableParagraph id="para-intro-problem" blockId="intro-problem">
                Let's explore a concrete example. Your factory makes two products: <InlineSpotColor varName="productA" color="#62D0AD">Product A</InlineSpotColor> earns ${" "}<InlineScrubbleNumber varName="profitA" {...numberPropsFromDefinition(getVariableInfo("profitA"))} /> profit per unit, while <InlineSpotColor varName="productB" color="#8E90F5">Product B</InlineSpotColor> earns ${" "}<InlineScrubbleNumber varName="profitB" {...numberPropsFromDefinition(getVariableInfo("profitB"))} /> per unit. You have two constraints: only 18 labor hours and 20 material units available daily.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Resource requirements
    <StackLayout key="layout-intro-resources" maxWidth="xl">
        <Block id="intro-resources" padding="sm">
            <EditableParagraph id="para-intro-resources" blockId="intro-resources">
                Each unit of Product A requires 2 labor hours and 4 material units. Each unit of Product B requires 3 labor hours and 2 material units. The question is: how many of each should you make?
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Interactive production explorer
    <SplitLayout key="layout-intro-interactive" ratio="1:1" gap="lg">
        <div className="space-y-4">
            <Block id="intro-interactive-text" padding="sm">
                <EditableParagraph id="para-intro-interactive" blockId="intro-interactive-text">
                    Try different production quantities. Make{" "}
                    <InlineScrubbleNumber
                        varName="productA"
                        {...numberPropsFromDefinition(getVariableInfo("productA"))}
                    />{" "}
                    units of Product A and{" "}
                    <InlineScrubbleNumber
                        varName="productB"
                        {...numberPropsFromDefinition(getVariableInfo("productB"))}
                    />{" "}
                    units of Product B. Your total profit would be <ReactiveProfitCalculation />.
                </EditableParagraph>
            </Block>
            <Block id="intro-resource-display" padding="sm">
                <ReactiveResourceUsage />
            </Block>
        </div>
        <Block id="intro-formula" padding="md">
            <FormulaBlock
                latex="\text{Maximize: } Z = \clr{profitA}{40}x + \clr{profitB}{30}y"
                colorMap={{
                    profitA: "#62D0AD",
                    profitB: "#8E90F5",
                }}
            />
        </Block>
    </SplitLayout>,

    // Constraints formula
    <StackLayout key="layout-intro-constraints-formula" maxWidth="xl">
        <Block id="intro-constraints-formula" padding="md">
            <FormulaBlock
                latex="\begin{aligned}
\text{Subject to:} \\
2x + 3y &\leq 18 \quad \text{(Labor)} \\
4x + 2y &\leq 20 \quad \text{(Material)} \\
x, y &\geq 0 \quad \text{(Non-negativity)}
\end{aligned}"
                colorMap={{}}
            />
        </Block>
    </StackLayout>,

    // Explanation of the challenge
    <StackLayout key="layout-intro-challenge" maxWidth="xl">
        <Block id="intro-challenge" padding="sm">
            <EditableParagraph id="para-intro-challenge" blockId="intro-challenge">
                Notice how increasing one product often means decreasing the other due to limited resources. Finding the sweet spot where profit is maximized while respecting all constraints is what linear programming is all about. There are two main methods to solve these problems: the graphical method for small problems, and the Simplex algorithm for larger ones.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Assessment question
    <StackLayout key="layout-intro-assessment" maxWidth="xl">
        <Block id="intro-assessment" padding="md">
            <EditableParagraph id="para-intro-assessment" blockId="intro-assessment">
                The primary goal of linear programming is to{" "}
                <InlineFeedback
                    varName="answerLPGoal"
                    correctValue="maximize or minimize"
                    position="terminal"
                    successMessage="— exactly! LP finds the best possible value (highest profit or lowest cost) within given constraints"
                    failureMessage="— not quite"
                    hint="Think about what 'optimize' means in business contexts"
                >
                    <InlineClozeChoice
                        varName="answerLPGoal"
                        correctAnswer="maximize or minimize"
                        options={["solve equations", "maximize or minimize", "graph functions", "find derivatives"]}
                        {...choicePropsFromDefinition(getVariableInfo("answerLPGoal"))}
                    />
                </InlineFeedback>{" "}
                an objective function.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
