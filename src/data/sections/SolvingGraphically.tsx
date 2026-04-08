import { type ReactElement, useCallback } from "react";
import { Block } from "@/components/templates";
import { StackLayout, SplitLayout } from "@/components/layouts";
import {
    EditableH2,
    EditableParagraph,
    InlineScrubbleNumber,
    InlineClozeInput,
    InlineSpotColor,
    InlineFeedback,
    Cartesian2D,
} from "@/components/atoms";
import { FormulaBlock } from "@/components/molecules";
import { InteractionHintSequence } from "@/components/atoms/visual/InteractionHint";
import {
    getVariableInfo,
    numberPropsFromDefinition,
    clozePropsFromDefinition,
} from "../variables";
import { useVar, useSetVar } from "@/stores";

// ========================================
// REACTIVE VISUALIZATION COMPONENTS
// ========================================

function IsoProfitLineExplorer() {
    const setVar = useSetVar();
    const objectiveZ = useVar("objectiveZ", 120) as number;

    // Iso-profit line: 40x + 30y = Z
    // y = (Z - 40x) / 30
    const isoProfitFn = useCallback((x: number) => {
        return (objectiveZ - 40 * x) / 30;
    }, [objectiveZ]);

    // Calculate a point on the iso-profit line (use x=1.5 as a nice middle position)
    const pointX = 1.5;
    const pointY = (objectiveZ - 40 * pointX) / 30;

    // Handle dragging the iso-profit line - move perpendicular to line direction
    const handleLineDrag = useCallback((point: [number, number]) => {
        // Calculate new Z based on point position on the line 40x + 30y = Z
        const newZ = 40 * point[0] + 30 * point[1];
        const clampedZ = Math.max(0, Math.min(300, Math.round(newZ / 10) * 10));
        setVar("objectiveZ", clampedZ);
    }, [setVar]);

    // Find where iso-profit line intersects feasible region
    const lineIntersectsFeasible = objectiveZ <= 240;

    return (
        <div className="relative">
            <Cartesian2D
                height={400}
                viewBox={{ x: [-1, 8], y: [-1, 8] }}
                movablePoints={[
                    {
                        initial: [pointX, pointY],
                        position: [pointX, pointY],
                        color: "#22c55e",
                        onChange: handleLineDrag,
                    },
                ]}
                plots={[
                    // Feasible region edges
                    { type: "segment", point1: [0, 0], point2: [5, 0], color: "#64748b", weight: 2 },
                    { type: "segment", point1: [0, 0], point2: [0, 6], color: "#64748b", weight: 2 },
                    { type: "segment", point1: [0, 6], point2: [3, 4], color: "#F7B23B", weight: 2 },
                    { type: "segment", point1: [3, 4], point2: [5, 0], color: "#AC8BF9", weight: 2 },

                    // Feasible region fill approximation (using segments for shading effect)
                    { type: "circle", center: [2, 2.5], radius: 2.5, color: "#22c55e", fillOpacity: 0.1 },

                    // Corner points
                    { type: "point", x: 0, y: 0, color: "#64748b" },
                    { type: "point", x: 0, y: 6, color: "#64748b" },
                    { type: "point", x: 3, y: 4, color: lineIntersectsFeasible && objectiveZ === 240 ? "#ef4444" : "#64748b" },
                    { type: "point", x: 5, y: 0, color: "#64748b" },

                    // Iso-profit line
                    {
                        type: "function",
                        fn: isoProfitFn,
                        color: "#22c55e",
                        weight: 3,
                        domain: [-0.5, 8] as [number, number],
                    },
                ]}
            />
            <InteractionHintSequence
                hintKey="iso-profit-drag"
                steps={[
                    {
                        gesture: "drag",
                        label: "Drag the green point to slide the iso-profit line",
                        position: { x: "50%", y: "50%" },
                    },
                ]}
            />
            {/* Status display */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-md">
                <div className="text-sm text-slate-600">Profit Level</div>
                <div className="text-2xl font-bold text-[#22c55e]">Z = {objectiveZ}</div>
                <div className={`text-xs mt-1 ${lineIntersectsFeasible ? "text-green-600" : "text-red-500"}`}>
                    {lineIntersectsFeasible ? "✓ Achievable" : "✗ Not achievable"}
                </div>
                {objectiveZ === 240 && (
                    <div className="text-xs text-amber-600 font-medium mt-1">
                        ★ Maximum value!
                    </div>
                )}
            </div>
        </div>
    );
}

function SolutionVerificationViz() {
    const solutionX = useVar("solutionX", 4) as number;
    const solutionY = useVar("solutionY", 2) as number;
    const setVar = useSetVar();

    // Calculate values
    const profit = 40 * solutionX + 30 * solutionY;
    const laborUsed = 2 * solutionX + 3 * solutionY;
    const materialUsed = 4 * solutionX + 2 * solutionY;

    const laborOk = laborUsed <= 18;
    const materialOk = materialUsed <= 20;
    const isFeasible = laborOk && materialOk && solutionX >= 0 && solutionY >= 0;

    const handlePointDrag = useCallback((point: [number, number]) => {
        setVar("solutionX", Math.round(point[0] * 2) / 2);
        setVar("solutionY", Math.round(point[1] * 2) / 2);
    }, [setVar]);

    return (
        <div className="relative">
            <Cartesian2D
                height={350}
                viewBox={{ x: [-1, 8], y: [-1, 8] }}
                movablePoints={[
                    {
                        initial: [solutionX, solutionY],
                        color: isFeasible ? "#22c55e" : "#ef4444",
                        onChange: handlePointDrag,
                        position: [solutionX, solutionY],
                    },
                ]}
                plots={[
                    // Constraint lines
                    { type: "function", fn: (x: number) => (18 - 2*x) / 3, color: "#F7B23B", weight: 2, domain: [0, 9] as [number, number] },
                    { type: "function", fn: (x: number) => (20 - 4*x) / 2, color: "#AC8BF9", weight: 2, domain: [0, 5] as [number, number] },

                    // Axes
                    { type: "segment", point1: [0, -0.5], point2: [0, 8], color: "#64748b", weight: 1 },
                    { type: "segment", point1: [-0.5, 0], point2: [8, 0], color: "#64748b", weight: 1 },

                    // Corner points of feasible region
                    { type: "point", x: 0, y: 0, color: "#94a3b8" },
                    { type: "point", x: 0, y: 6, color: "#94a3b8" },
                    { type: "point", x: 3, y: 4, color: "#94a3b8" },
                    { type: "point", x: 5, y: 0, color: "#94a3b8" },
                ]}
            />
            <InteractionHintSequence
                hintKey="solution-verification-drag"
                steps={[
                    {
                        gesture: "drag",
                        label: "Drag the point to test different solutions",
                        position: { x: "55%", y: "40%" },
                    },
                ]}
            />
            {/* Info panel */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-md text-sm">
                <div className={`font-semibold ${isFeasible ? "text-green-600" : "text-red-500"}`}>
                    {isFeasible ? "✓ Feasible" : "✗ Infeasible"}
                </div>
                <div className="text-slate-600 mt-1">Profit: ${profit}</div>
                <div className={laborOk ? "text-slate-600" : "text-red-500"}>
                    Labor: {laborUsed}/18
                </div>
                <div className={materialOk ? "text-slate-600" : "text-red-500"}>
                    Material: {materialUsed}/20
                </div>
            </div>
        </div>
    );
}

// ========================================
// SECTION BLOCKS
// ========================================

export const solvingGraphicallyBlocks: ReactElement[] = [
    // Section heading
    <StackLayout key="layout-solving-title" maxWidth="xl">
        <Block id="solving-title" padding="lg">
            <EditableH2 id="h2-solving-title" blockId="solving-title">
                Solving the Problem Graphically
            </EditableH2>
        </Block>
    </StackLayout>,

    // Step-by-step process
    <StackLayout key="layout-solving-process" maxWidth="xl">
        <Block id="solving-process" padding="sm">
            <EditableParagraph id="para-solving-process" blockId="solving-process">
                Now let's put it all together with a systematic approach. To solve any LP problem graphically: (1) Graph each constraint as a line, (2) Identify the feasible region where all constraints overlap, (3) Find the corner points of this region, (4) Evaluate the objective function at each corner, and (5) Choose the corner that gives the best value.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Iso-profit line method
    <StackLayout key="layout-iso-profit-heading" maxWidth="xl">
        <Block id="iso-profit-heading" padding="md">
            <EditableParagraph id="para-iso-profit-heading" blockId="iso-profit-heading">
                <strong>The Iso-Profit Line Method.</strong> Another powerful way to find the optimum is to draw a line representing a certain profit level and slide it outward until it just touches the feasible region. That final touching point is your optimal solution.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <SplitLayout key="layout-iso-profit-explorer" ratio="2:1" gap="lg">
        <Block id="iso-profit-viz" padding="md" hasVisualization>
            <IsoProfitLineExplorer />
        </Block>
        <div className="space-y-4">
            <Block id="iso-profit-value" padding="sm">
                <EditableParagraph id="para-iso-profit-value" blockId="iso-profit-value">
                    Current profit level: Z ={" "}
                    <InlineScrubbleNumber
                        varName="objectiveZ"
                        {...numberPropsFromDefinition(getVariableInfo("objectiveZ"))}
                    />
                </EditableParagraph>
            </Block>
            <Block id="iso-profit-instruction" padding="sm">
                <EditableParagraph id="para-iso-profit-instruction" blockId="iso-profit-instruction">
                    Drag the green line outward (increase Z) to see how far you can push profit while staying in the feasible region. The maximum achievable is Z = 240 at point (3, 4).
                </EditableParagraph>
            </Block>
        </div>
    </SplitLayout>,

    // The optimal solution
    <StackLayout key="layout-optimal-heading" maxWidth="xl">
        <Block id="optimal-heading" padding="md">
            <EditableH2 id="h2-optimal" blockId="optimal-heading">
                The Optimal Solution
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-optimal-explanation" maxWidth="xl">
        <Block id="optimal-explanation" padding="sm">
            <EditableParagraph id="para-optimal-explanation" blockId="optimal-explanation">
                For our factory problem, the optimal solution is to produce <InlineSpotColor varName="solutionX" color="#62D0AD">x = 3</InlineSpotColor> units of Product A and <InlineSpotColor varName="solutionY" color="#8E90F5">y = 4</InlineSpotColor> units of Product B, yielding a maximum profit of $240. Let's verify this satisfies all constraints.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Verification formula
    <StackLayout key="layout-verification-formula" maxWidth="xl">
        <Block id="verification-formula" padding="md">
            <FormulaBlock
                latex="\begin{aligned}
\text{Labor: } 2(3) + 3(4) &= 6 + 12 = 18 \leq 18 \quad \checkmark \\
\text{Material: } 4(3) + 2(4) &= 12 + 8 = 20 \leq 20 \quad \checkmark \\
\text{Profit: } 40(3) + 30(4) &= 120 + 120 = 240
\end{aligned}"
                colorMap={{}}
            />
        </Block>
    </StackLayout>,

    // Solution verification interactive
    <StackLayout key="layout-solution-verification" maxWidth="xl">
        <Block id="solution-verification-intro" padding="sm">
            <EditableParagraph id="para-solution-verification" blockId="solution-verification-intro">
                <strong>Test different solutions yourself.</strong> Drag the point below to see how profit changes and whether different production plans are feasible. Try the corner points: (0,0), (0,6), (3,4), and (5,0). Which gives the highest profit?
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <SplitLayout key="layout-solution-explorer" ratio="2:1" gap="lg">
        <Block id="solution-verification-viz" padding="md" hasVisualization>
            <SolutionVerificationViz />
        </Block>
        <div className="space-y-4">
            <Block id="solution-coords" padding="sm">
                <EditableParagraph id="para-solution-coords" blockId="solution-coords">
                    Testing point: x ={" "}
                    <InlineScrubbleNumber
                        varName="solutionX"
                        {...numberPropsFromDefinition(getVariableInfo("solutionX"))}
                    />, y ={" "}
                    <InlineScrubbleNumber
                        varName="solutionY"
                        {...numberPropsFromDefinition(getVariableInfo("solutionY"))}
                    />
                </EditableParagraph>
            </Block>
        </div>
    </SplitLayout>,

    // Assessment questions
    <StackLayout key="layout-solving-assessment-heading" maxWidth="xl">
        <Block id="solving-assessment-heading" padding="md">
            <EditableParagraph id="para-solving-assessment-heading" blockId="solving-assessment-heading">
                <strong>Check your understanding:</strong>
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-solving-assessment-optimal" maxWidth="xl">
        <Block id="solving-assessment-optimal" padding="sm">
            <EditableParagraph id="para-solving-assessment-optimal" blockId="solving-assessment-optimal">
                If the profit per unit changes to $50 for Product A and $30 for Product B, the optimal solution at (3, 4) would yield a total profit of ${" "}
                <InlineFeedback
                    varName="answerOptimalProfit"
                    correctValue="270"
                    position="terminal"
                    successMessage="— correct! 50(3) + 30(4) = 150 + 120 = 270"
                    failureMessage="— not quite"
                    hint="Calculate: 50 × 3 + 30 × 4"
                >
                    <InlineClozeInput
                        varName="answerOptimalProfit"
                        correctAnswer="270"
                        {...clozePropsFromDefinition(getVariableInfo("answerOptimalProfit"))}
                    />
                </InlineFeedback>.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
