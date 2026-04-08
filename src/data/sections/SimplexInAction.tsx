import { type ReactElement, useMemo } from "react";
import { Block } from "@/components/templates";
import { StackLayout, SplitLayout } from "@/components/layouts";
import {
    EditableH2,
    EditableParagraph,
    InlineScrubbleNumber,
    InlineClozeChoice,
    InlineSpotColor,
    InlineFeedback,
    Cartesian2D,
} from "@/components/atoms";
import {
    getVariableInfo,
    numberPropsFromDefinition,
    choicePropsFromDefinition,
} from "../variables";
import { useVar, useVariableStore } from "@/stores";

// ========================================
// INTERACTIVE SIMPLEX TABLEAU COMPONENT
// ========================================

function InteractiveSimplexTableau() {
    const step = useVar("simplexStep", 0) as number;
    const setVar = useVariableStore((s) => s.setVariable);

    // Define tableaux for each step
    const tableaux = useMemo(() => [
        // Step 0: Initial tableau (at origin)
        {
            title: "Initial Tableau (at origin: x=0, y=0)",
            basis: ["s₁", "s₂"],
            data: [
                [2, 3, 1, 0, 18],
                [4, 2, 0, 1, 20],
                [-40, -30, 0, 0, 0],
            ],
            pivot: null as null | { row: number; col: number },
            currentCorner: [0, 0] as [number, number],
            z: 0,
            explanation: "We start at the origin. The negative values in the bottom row (-40, -30) indicate we can improve by increasing x or y. The most negative is -40, so x enters the basis.",
        },
        // Step 1: After first pivot (x enters, s₂ leaves)
        {
            title: "After First Pivot (x enters basis)",
            basis: ["s₁", "x"],
            data: [
                [0, 2, 1, -0.5, 8],
                [1, 0.5, 0, 0.25, 5],
                [0, -10, 0, 10, 200],
            ],
            pivot: { row: 1, col: 0 },
            currentCorner: [5, 0] as [number, number],
            z: 200,
            explanation: "We moved to corner (5, 0). Z improved from 0 to 200! But -10 in the y column means we can still improve by increasing y.",
        },
        // Step 2: After second pivot (y enters, s₁ leaves)
        {
            title: "After Second Pivot (y enters basis)",
            basis: ["y", "x"],
            data: [
                [0, 1, 0.5, -0.25, 4],
                [1, 0, -0.25, 0.375, 3],
                [0, 0, 5, 7.5, 240],
            ],
            pivot: { row: 0, col: 1 },
            currentCorner: [3, 4] as [number, number],
            z: 240,
            explanation: "We reached corner (3, 4). Z improved to 240. All values in the bottom row are now non-negative (0, 0, 5, 7.5), meaning no improvement is possible. This is optimal!",
        },
    ], []);

    const currentTableau = tableaux[Math.min(step, tableaux.length - 1)];
    const headers = ["x", "y", "s₁", "s₂", "RHS"];

    return (
        <div className="space-y-4">
            {/* Step indicator */}
            <div className="flex items-center gap-3">
                {tableaux.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setVar("simplexStep", i)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm cursor-pointer transition-all hover:scale-110
                            ${i === step ? "bg-[#62D0AD] text-white ring-2 ring-[#62D0AD] ring-offset-2" : i < step ? "bg-[#62D0AD]/60 text-white hover:bg-[#62D0AD]" : "bg-slate-200 text-slate-500 hover:bg-slate-300"}`}
                    >
                        {i + 1}
                    </button>
                ))}
                <span className="text-sm text-slate-600 ml-2">
                    {step < tableaux.length - 1 ? "In progress..." : "Optimal found!"}
                </span>
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-slate-800">{currentTableau.title}</h3>

            {/* Tableau */}
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse bg-white rounded-lg overflow-hidden shadow">
                    <thead>
                        <tr className="bg-slate-100">
                            <th className="border border-slate-200 px-4 py-2 text-left font-semibold text-slate-700">Basis</th>
                            {headers.map((h, i) => (
                                <th
                                    key={h}
                                    className={`border border-slate-200 px-4 py-2 text-center font-semibold
                                        ${i === 0 ? "text-[#62D0AD]" : i === 1 ? "text-[#8E90F5]" : i < 4 ? "text-[#AC8BF9]" : "text-slate-700"}
                                        ${currentTableau.pivot?.col === i ? "bg-amber-100" : ""}`}
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {currentTableau.data.slice(0, -1).map((row, rowIdx) => (
                            <tr key={rowIdx} className={currentTableau.pivot?.row === rowIdx ? "bg-amber-50" : ""}>
                                <td className="border border-slate-200 px-4 py-2 font-medium text-[#AC8BF9]">
                                    {currentTableau.basis[rowIdx]}
                                </td>
                                {row.map((val, colIdx) => (
                                    <td
                                        key={colIdx}
                                        className={`border border-slate-200 px-4 py-2 text-center
                                            ${currentTableau.pivot?.row === rowIdx && currentTableau.pivot?.col === colIdx
                                                ? "bg-amber-200 font-bold text-amber-800"
                                                : ""}`}
                                    >
                                        {Number.isInteger(val) ? val : val.toFixed(2)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        {/* Z row */}
                        <tr className="bg-green-50">
                            <td className="border border-slate-200 px-4 py-2 font-medium text-[#22c55e]">Z</td>
                            {currentTableau.data[currentTableau.data.length - 1].map((val, colIdx) => (
                                <td
                                    key={colIdx}
                                    className={`border border-slate-200 px-4 py-2 text-center
                                        ${val < 0 ? "text-red-500 font-medium" : ""}
                                        ${colIdx === headers.length - 1 ? "font-bold text-[#22c55e]" : ""}`}
                                >
                                    {Number.isInteger(val) ? val : val.toFixed(1)}
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Explanation */}
            <div className="bg-slate-50 rounded-lg p-4 text-slate-700">
                {currentTableau.explanation}
            </div>

            {/* Current solution summary */}
            <div className="flex gap-6 items-center bg-white rounded-lg p-4 shadow-sm">
                <div>
                    <span className="text-sm text-slate-500">Current Corner:</span>
                    <span className="ml-2 font-semibold">({currentTableau.currentCorner[0]}, {currentTableau.currentCorner[1]})</span>
                </div>
                <div>
                    <span className="text-sm text-slate-500">Objective Value:</span>
                    <span className="ml-2 font-bold text-[#22c55e]">Z = {currentTableau.z}</span>
                </div>
            </div>
        </div>
    );
}

function SimplexPathVisualization() {
    const step = useVar("simplexStep", 0) as number;

    const corners = [
        [0, 0],   // Step 0
        [5, 0],   // Step 1
        [3, 4],   // Step 2 (optimal)
    ];

    const currentCorner = corners[Math.min(step, corners.length - 1)];

    // Build path segments up to current step
    const pathSegments: Array<{ point1: [number, number]; point2: [number, number] }> = [];
    for (let i = 0; i < Math.min(step, corners.length - 1); i++) {
        pathSegments.push({
            point1: corners[i] as [number, number],
            point2: corners[i + 1] as [number, number],
        });
    }

    return (
        <div className="relative">
            <Cartesian2D
                height={350}
                viewBox={{ x: [-1, 8], y: [-1, 8] }}
                plots={[
                    // Feasible region
                    { type: "segment", point1: [0, 0], point2: [5, 0], color: "#64748b", weight: 2 },
                    { type: "segment", point1: [0, 0], point2: [0, 6], color: "#64748b", weight: 2 },
                    { type: "segment", point1: [0, 6], point2: [3, 4], color: "#F7B23B", weight: 2 },
                    { type: "segment", point1: [3, 4], point2: [5, 0], color: "#AC8BF9", weight: 2 },

                    // All corners (hollow style via smaller filled)
                    { type: "point", x: 0, y: 0, color: "#94a3b8" },
                    { type: "point", x: 0, y: 6, color: "#94a3b8" },
                    { type: "point", x: 3, y: 4, color: "#94a3b8" },
                    { type: "point", x: 5, y: 0, color: "#94a3b8" },

                    // Path taken by Simplex
                    ...pathSegments.map((seg, i) => ({
                        type: "segment" as const,
                        point1: seg.point1,
                        point2: seg.point2,
                        color: "#22c55e",
                        weight: 4,
                        style: "solid" as const,
                    })),

                    // Current position
                    { type: "point", x: currentCorner[0], y: currentCorner[1], color: "#ef4444" },
                ]}
            />
            {/* Labels */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 text-xs">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-[#ef4444]"></div>
                    <span>Current position</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-1 bg-[#22c55e] rounded"></div>
                    <span>Path taken</span>
                </div>
            </div>
            {/* Corner labels */}
            <div className="absolute" style={{ top: "75%", left: "10%" }}>
                <span className="text-xs bg-white/80 px-1 rounded">(0,0)</span>
            </div>
            <div className="absolute" style={{ top: "75%", left: "58%" }}>
                <span className="text-xs bg-white/80 px-1 rounded">(5,0)</span>
            </div>
            <div className="absolute" style={{ top: "35%", left: "42%" }}>
                <span className="text-xs bg-white/80 px-1 rounded">(3,4)</span>
            </div>
        </div>
    );
}

// ========================================
// SECTION BLOCKS
// ========================================

export const simplexInActionBlocks: ReactElement[] = [
    // Section heading
    <StackLayout key="layout-simplex-action-title" maxWidth="xl">
        <Block id="simplex-action-title" padding="lg">
            <EditableH2 id="h2-simplex-action-title" blockId="simplex-action-title">
                The Simplex Algorithm in Action
            </EditableH2>
        </Block>
    </StackLayout>,

    // Introduction
    <StackLayout key="layout-simplex-action-intro" maxWidth="xl">
        <Block id="simplex-action-intro" padding="sm">
            <EditableParagraph id="para-simplex-action-intro" blockId="simplex-action-intro">
                Let's watch the Simplex method solve our factory problem step by step. Each iteration performs a <InlineSpotColor varName="pivotRow" color="#F7B23B">pivot operation</InlineSpotColor> that moves us from one corner to an adjacent better corner. Use the step control below to walk through the algorithm.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Step control
    <StackLayout key="layout-step-control" maxWidth="xl">
        <Block id="step-control" padding="sm">
            <EditableParagraph id="para-step-control" blockId="step-control">
                <strong>Current step:</strong>{" "}
                <InlineScrubbleNumber
                    varName="simplexStep"
                    {...numberPropsFromDefinition(getVariableInfo("simplexStep"))}
                    formatValue={(v) => `${v + 1} of 3`}
                />
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Split layout: Tableau and visualization
    <SplitLayout key="layout-simplex-interactive" ratio="3:2" gap="lg">
        <Block id="simplex-tableau-interactive" padding="md">
            <InteractiveSimplexTableau />
        </Block>
        <Block id="simplex-path-viz" padding="md" hasVisualization>
            <SimplexPathVisualization />
        </Block>
    </SplitLayout>,

    // Pivot rules heading
    <StackLayout key="layout-pivot-rules-heading" maxWidth="xl">
        <Block id="pivot-rules-heading" padding="md">
            <EditableH2 id="h2-pivot-rules" blockId="pivot-rules-heading">
                The Pivot Rules
            </EditableH2>
        </Block>
    </StackLayout>,

    // Entering variable rule
    <StackLayout key="layout-entering-rule" maxWidth="xl">
        <Block id="entering-rule" padding="sm">
            <EditableParagraph id="para-entering-rule" blockId="entering-rule">
                <strong>Choosing the entering variable:</strong> Look at the bottom row (the objective row). The variable with the <InlineSpotColor varName="pivotCol" color="#F7B23B">most negative coefficient</InlineSpotColor> enters the basis. This is the variable that will increase profit the fastest. In our first iteration, x has coefficient -40 (more negative than y's -30), so x enters.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Leaving variable rule
    <StackLayout key="layout-leaving-rule" maxWidth="xl">
        <Block id="leaving-rule" padding="sm">
            <EditableParagraph id="para-leaving-rule" blockId="leaving-rule">
                <strong>Choosing the leaving variable:</strong> For each constraint row with a positive entry in the entering column, compute the ratio: RHS ÷ entry. The row with the <InlineSpotColor varName="pivotRow" color="#F7B23B">smallest positive ratio</InlineSpotColor> determines which variable leaves. This ensures we don't violate any constraint.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // The pivot operation
    <StackLayout key="layout-pivot-operation" maxWidth="xl">
        <Block id="pivot-operation" padding="sm">
            <EditableParagraph id="para-pivot-operation" blockId="pivot-operation">
                <strong>The pivot operation:</strong> Once we identify the <InlineSpotColor varName="pivotRow" color="#F7B23B">pivot element</InlineSpotColor> (the intersection of entering column and leaving row), we perform row operations to make that element 1 and all other entries in that column 0. This is exactly like Gaussian elimination! The result is a new tableau representing a better corner point.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // When to stop
    <StackLayout key="layout-stopping-condition" maxWidth="xl">
        <Block id="stopping-condition" padding="sm">
            <EditableParagraph id="para-stopping-condition" blockId="stopping-condition">
                <strong>When to stop:</strong> When all coefficients in the bottom row are non-negative (≥0), no variable can improve the objective. We have found the optimal solution! In our problem, this happens at step 3, where the bottom row is [0, 0, 5, 7.5, 240].
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Assessment question
    <StackLayout key="layout-simplex-assessment" maxWidth="xl">
        <Block id="simplex-assessment" padding="md">
            <EditableParagraph id="para-simplex-assessment" blockId="simplex-assessment">
                In the Simplex method, we select the entering variable by finding the{" "}
                <InlineFeedback
                    varName="answerEnteringVariable"
                    correctValue="most negative coefficient"
                    position="terminal"
                    successMessage="— correct! The most negative coefficient indicates the direction of fastest improvement"
                    failureMessage="— not quite"
                    hint="We want to improve the objective as quickly as possible"
                >
                    <InlineClozeChoice
                        varName="answerEnteringVariable"
                        correctAnswer="most negative coefficient"
                        options={["largest coefficient", "most negative coefficient", "smallest coefficient", "zero coefficient"]}
                        {...choicePropsFromDefinition(getVariableInfo("answerEnteringVariable"))}
                    />
                </InlineFeedback>{" "}
                in the objective row.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Purpose of pivot
    <StackLayout key="layout-pivot-purpose-assessment" maxWidth="xl">
        <Block id="pivot-purpose-assessment" padding="md">
            <EditableParagraph id="para-pivot-purpose-assessment" blockId="pivot-purpose-assessment">
                Each pivot operation in the Simplex method essentially{" "}
                <InlineFeedback
                    varName="answerPivotPurpose"
                    correctValue="move to better corner"
                    position="terminal"
                    successMessage="— exactly! Each pivot moves us to an adjacent corner with a better (or equal) objective value"
                    failureMessage="— not quite"
                    hint="Think about what happens geometrically when we pivot"
                >
                    <InlineClozeChoice
                        varName="answerPivotPurpose"
                        correctAnswer="move to better corner"
                        options={["solve the equation", "move to better corner", "find the center", "draw the line"]}
                        {...choicePropsFromDefinition(getVariableInfo("answerPivotPurpose"))}
                    />
                </InlineFeedback>{" "}
                of the feasible region.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
