import { type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout, SplitLayout } from "@/components/layouts";
import {
    EditableH2,
    EditableParagraph,
    InlineClozeChoice,
    InlineTooltip,
    InlineSpotColor,
    InlineFeedback,
} from "@/components/atoms";
import { FormulaBlock } from "@/components/molecules";
import { FlowDiagram } from "@/components/atoms";
import {
    getVariableInfo,
    choicePropsFromDefinition,
} from "../variables";

// ========================================
// SECTION BLOCKS
// ========================================

export const simplexIntroBlocks: ReactElement[] = [
    // Section heading
    <StackLayout key="layout-simplex-intro-title" maxWidth="xl">
        <Block id="simplex-intro-title" padding="lg">
            <EditableH2 id="h2-simplex-intro-title" blockId="simplex-intro-title">
                Introduction to the Simplex Method
            </EditableH2>
        </Block>
    </StackLayout>,

    // Why we need Simplex
    <StackLayout key="layout-simplex-why" maxWidth="xl">
        <Block id="simplex-why" padding="sm">
            <EditableParagraph id="para-simplex-why" blockId="simplex-why">
                The graphical method works beautifully for two variables, but real-world problems often have dozens or hundreds of decision variables. You can't draw a 50-dimensional graph! The <InlineTooltip id="tooltip-simplex" tooltip="An algorithm developed by George Dantzig in 1947 that efficiently finds optimal solutions to linear programming problems by systematically moving from corner to corner of the feasible region.">Simplex method</InlineTooltip>, developed by George Dantzig in 1947, provides an algebraic approach that handles problems of any size.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Core idea
    <StackLayout key="layout-simplex-core-idea" maxWidth="xl">
        <Block id="simplex-core-idea" padding="sm">
            <EditableParagraph id="para-simplex-core-idea" blockId="simplex-core-idea">
                The key insight remains the same: optimal solutions occur at corners. The Simplex method cleverly jumps from corner to corner, always improving the objective value, until no better adjacent corner exists. It's like hiking uphill in a fog: you can't see the peak, but you can always find a direction that goes up, and when no uphill direction exists, you've reached the top.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Flow diagram of Simplex process
    <StackLayout key="layout-simplex-flow" maxWidth="xl">
        <Block id="simplex-flow" padding="md" hasVisualization>
            <FlowDiagram
                height={280}
                nodes={[
                    {
                        id: "start",
                        type: "input",
                        position: { x: 50, y: 100 },
                        data: { label: "Start at\na corner" },
                        style: { background: "#62D0AD", color: "white", border: "none" },
                    },
                    {
                        id: "check",
                        position: { x: 220, y: 100 },
                        data: { label: "Any better\nadjacent corner?" },
                        style: { background: "#F7B23B", color: "white", border: "none" },
                    },
                    {
                        id: "move",
                        position: { x: 400, y: 40 },
                        data: { label: "Move to\nbetter corner" },
                        style: { background: "#8E90F5", color: "white", border: "none" },
                    },
                    {
                        id: "done",
                        type: "output",
                        position: { x: 400, y: 160 },
                        data: { label: "Optimal\nfound!" },
                        style: { background: "#22c55e", color: "white", border: "none" },
                    },
                ]}
                edges={[
                    { id: "e1", source: "start", target: "check", animated: true },
                    { id: "e2", source: "check", target: "move", label: "Yes", style: { stroke: "#8E90F5" } },
                    { id: "e3", source: "check", target: "done", label: "No", style: { stroke: "#22c55e" } },
                    { id: "e4", source: "move", target: "check", animated: true, style: { stroke: "#8E90F5" } },
                ]}
                fitView
            />
        </Block>
    </StackLayout>,

    // Standard form heading
    <StackLayout key="layout-standard-form-heading" maxWidth="xl">
        <Block id="standard-form-heading" padding="md">
            <EditableH2 id="h2-standard-form" blockId="standard-form-heading">
                Converting to Standard Form
            </EditableH2>
        </Block>
    </StackLayout>,

    // Standard form explanation
    <StackLayout key="layout-standard-form-explanation" maxWidth="xl">
        <Block id="standard-form-explanation" padding="sm">
            <EditableParagraph id="para-standard-form-explanation" blockId="standard-form-explanation">
                Before applying Simplex, we convert the problem to <InlineTooltip id="tooltip-standard-form" tooltip="A standardized way of writing LP problems where all constraints are equalities (using slack variables) and all variables are non-negative.">standard form</InlineTooltip>. This means turning inequalities into equalities by adding <InlineSpotColor varName="pivotCol" color="#AC8BF9">slack variables</InlineSpotColor>. A slack variable represents "unused" resources. If we have 18 labor hours available and use only 14, the slack is 4.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Original constraints
    <SplitLayout key="layout-constraints-comparison" ratio="1:1" gap="md">
        <Block id="constraints-inequality" padding="md">
            <FormulaBlock
                latex="\text{Inequality Form:} \\[0.5em]
2x + 3y \leq 18 \\
4x + 2y \leq 20"
                colorMap={{}}
            />
        </Block>
        <Block id="constraints-equality" padding="md">
            <FormulaBlock
                latex="\text{Standard Form:} \\[0.5em]
2x + 3y + \clr{slack}{s_1} = 18 \\
4x + 2y + \clr{slack}{s_2} = 20"
                colorMap={{ slack: "#AC8BF9" }}
            />
        </Block>
    </SplitLayout>,

    // Slack variable meaning
    <StackLayout key="layout-slack-meaning" maxWidth="xl">
        <Block id="slack-meaning" padding="sm">
            <EditableParagraph id="para-slack-meaning" blockId="slack-meaning">
                Here, <InlineSpotColor varName="pivotCol" color="#AC8BF9">s₁</InlineSpotColor> represents unused labor hours and <InlineSpotColor varName="pivotCol" color="#AC8BF9">s₂</InlineSpotColor> represents unused material units. At the origin (x=0, y=0), we have s₁=18 and s₂=20, meaning all resources are unused. As we produce more, slack decreases. At the optimal solution (x=3, y=4), both s₁=0 and s₂=0, meaning we use exactly all available resources.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // The Simplex tableau heading
    <StackLayout key="layout-tableau-heading" maxWidth="xl">
        <Block id="tableau-heading" padding="md">
            <EditableH2 id="h2-tableau" blockId="tableau-heading">
                The Simplex Tableau
            </EditableH2>
        </Block>
    </StackLayout>,

    // Tableau explanation
    <StackLayout key="layout-tableau-explanation" maxWidth="xl">
        <Block id="tableau-explanation" padding="sm">
            <EditableParagraph id="para-tableau-explanation" blockId="tableau-explanation">
                The Simplex method uses a table (called a <InlineTooltip id="tooltip-tableau" tooltip="A tabular arrangement of the coefficients in a linear programming problem that allows systematic application of the Simplex algorithm.">tableau</InlineTooltip>) to organize all the coefficients. Each row represents a constraint, and each column represents a variable. The algorithm performs row operations on this table, similar to solving systems of equations in linear algebra.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Initial tableau display
    <StackLayout key="layout-initial-tableau" maxWidth="xl">
        <Block id="initial-tableau" padding="md">
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse bg-white rounded-lg overflow-hidden shadow">
                    <thead>
                        <tr className="bg-slate-100">
                            <th className="border border-slate-200 px-4 py-2 text-left font-semibold text-slate-700">Basis</th>
                            <th className="border border-slate-200 px-4 py-2 text-center font-semibold text-[#62D0AD]">x</th>
                            <th className="border border-slate-200 px-4 py-2 text-center font-semibold text-[#8E90F5]">y</th>
                            <th className="border border-slate-200 px-4 py-2 text-center font-semibold text-[#AC8BF9]">s₁</th>
                            <th className="border border-slate-200 px-4 py-2 text-center font-semibold text-[#AC8BF9]">s₂</th>
                            <th className="border border-slate-200 px-4 py-2 text-center font-semibold text-slate-700">RHS</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-slate-200 px-4 py-2 font-medium text-[#AC8BF9]">s₁</td>
                            <td className="border border-slate-200 px-4 py-2 text-center">2</td>
                            <td className="border border-slate-200 px-4 py-2 text-center">3</td>
                            <td className="border border-slate-200 px-4 py-2 text-center">1</td>
                            <td className="border border-slate-200 px-4 py-2 text-center">0</td>
                            <td className="border border-slate-200 px-4 py-2 text-center font-medium">18</td>
                        </tr>
                        <tr>
                            <td className="border border-slate-200 px-4 py-2 font-medium text-[#AC8BF9]">s₂</td>
                            <td className="border border-slate-200 px-4 py-2 text-center">4</td>
                            <td className="border border-slate-200 px-4 py-2 text-center">2</td>
                            <td className="border border-slate-200 px-4 py-2 text-center">0</td>
                            <td className="border border-slate-200 px-4 py-2 text-center">1</td>
                            <td className="border border-slate-200 px-4 py-2 text-center font-medium">20</td>
                        </tr>
                        <tr className="bg-green-50">
                            <td className="border border-slate-200 px-4 py-2 font-medium text-[#22c55e]">Z</td>
                            <td className="border border-slate-200 px-4 py-2 text-center text-red-500 font-medium">-40</td>
                            <td className="border border-slate-200 px-4 py-2 text-center text-red-500 font-medium">-30</td>
                            <td className="border border-slate-200 px-4 py-2 text-center">0</td>
                            <td className="border border-slate-200 px-4 py-2 text-center">0</td>
                            <td className="border border-slate-200 px-4 py-2 text-center font-bold text-[#22c55e]">0</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </Block>
    </StackLayout>,

    // Tableau interpretation
    <StackLayout key="layout-tableau-interpretation" maxWidth="xl">
        <Block id="tableau-interpretation" padding="sm">
            <EditableParagraph id="para-tableau-interpretation" blockId="tableau-interpretation">
                This initial tableau represents the origin corner (x=0, y=0). The "Basis" column shows which variables have non-zero values at this corner: s₁=18 and s₂=20. The bottom row shows the objective function, with <span className="text-red-500 font-medium">negative coefficients</span> indicating how much Z would increase if we raised that variable by 1. Since -40 is the most negative, increasing x will improve our solution the most.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Assessment
    <StackLayout key="layout-simplex-intro-assessment" maxWidth="xl">
        <Block id="simplex-intro-assessment" padding="md">
            <EditableParagraph id="para-simplex-intro-assessment" blockId="simplex-intro-assessment">
                The purpose of adding slack variables is to{" "}
                <InlineFeedback
                    varName="answerSlackVariable"
                    correctValue="convert to equality"
                    position="terminal"
                    successMessage="— exactly! Slack variables turn ≤ inequalities into = equations, which is required for the Simplex method"
                    failureMessage="— not quite"
                    hint="Slack variables change the form of constraints, not solve the problem directly"
                >
                    <InlineClozeChoice
                        varName="answerSlackVariable"
                        correctAnswer="convert to equality"
                        options={["convert to equality", "find the solution", "draw the graph", "calculate profit"]}
                        {...choicePropsFromDefinition(getVariableInfo("answerSlackVariable"))}
                    />
                </InlineFeedback>{" "}
                constraints.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
