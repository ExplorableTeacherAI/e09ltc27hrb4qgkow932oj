import { type ReactElement, useCallback, useMemo } from "react";
import { Block } from "@/components/templates";
import { StackLayout, SplitLayout } from "@/components/layouts";
import {
    EditableH2,
    EditableParagraph,
    InlineScrubbleNumber,
    InlineClozeChoice,
    InlineTooltip,
    InlineSpotColor,
    InlineFeedback,
    Cartesian2D,
} from "@/components/atoms";
import { InteractionHintSequence } from "@/components/atoms/visual/InteractionHint";
import {
    getVariableInfo,
    numberPropsFromDefinition,
    choicePropsFromDefinition,
} from "../variables";
import { useVar, useSetVar } from "@/stores";

// ========================================
// REACTIVE VISUALIZATION COMPONENTS
// ========================================

function InteractiveConstraintBuilder() {
    const setVar = useSetVar();

    // Read constraint intercepts from store
    const c1Intercept = useVar("constraint1Intercept", 6) as number; // Labor: y-intercept
    const c2Intercept = useVar("constraint2Intercept", 10) as number; // Material: y-intercept
    const zoom = useVar("graphZoom", 10) as number; // Zoom level (max visible value)

    // Constraint 1 (Labor): 2x + 3y ≤ 18 → y = c1Intercept - (2/3)x
    // x-intercept: when y=0, x = c1Intercept * 1.5
    const c1XIntercept = c1Intercept * 1.5;

    // Constraint 2 (Material): 4x + 2y ≤ 20 → y = c2Intercept - 2x
    // x-intercept: when y=0, x = c2Intercept / 2
    const c2XIntercept = c2Intercept / 2;

    // Calculate feasible region vertices
    const vertices = useMemo(() => {
        // Intersection of the two constraint lines
        // Line 1: y = c1Intercept - (2/3)x
        // Line 2: y = c2Intercept - 2x
        // c1Intercept - (2/3)x = c2Intercept - 2x
        // 2x - (2/3)x = c2Intercept - c1Intercept
        // (4/3)x = c2Intercept - c1Intercept
        // x = (c2Intercept - c1Intercept) * 3/4
        const intersectionX = (c2Intercept - c1Intercept) * 3 / 4;
        const intersectionY = c1Intercept - (2/3) * intersectionX;

        // Determine the vertices of the feasible region (bounded by both constraints and axes)
        const yAxisIntercept = Math.min(c1Intercept, c2Intercept);
        const xAxisIntercept = Math.min(c1XIntercept, c2XIntercept);

        // Check if intersection is in first quadrant and within bounds
        const hasValidIntersection = intersectionX > 0 && intersectionY > 0 &&
            intersectionX < xAxisIntercept && intersectionY < yAxisIntercept;

        return {
            origin: [0, 0] as [number, number],
            yAxis: [0, yAxisIntercept] as [number, number],
            xAxis: [xAxisIntercept, 0] as [number, number],
            intersection: hasValidIntersection
                ? [intersectionX, intersectionY] as [number, number]
                : null,
        };
    }, [c1Intercept, c2Intercept, c1XIntercept, c2XIntercept]);

    // Handle dragging constraint lines via points
    const handleConstraint1Drag = useCallback((point: [number, number]) => {
        const newIntercept = Math.max(2, Math.min(10, point[1]));
        setVar("constraint1Intercept", Math.round(newIntercept * 2) / 2);
    }, [setVar]);

    const handleConstraint2Drag = useCallback((point: [number, number]) => {
        const newIntercept = Math.max(2, Math.min(12, point[1]));
        setVar("constraint2Intercept", Math.round(newIntercept * 2) / 2);
    }, [setVar]);

    // Build feasible region polygon points for shading
    const feasiblePolygon = useMemo(() => {
        const points: [number, number][] = [vertices.origin];
        points.push(vertices.yAxis);
        if (vertices.intersection) {
            points.push(vertices.intersection);
        }
        points.push(vertices.xAxis);
        return points;
    }, [vertices]);

    return (
        <div className="relative">
            <Cartesian2D
                height={400}
                viewBox={{ x: [-1, zoom], y: [-1, zoom] }}
                movablePoints={[
                    {
                        initial: [0, c1Intercept],
                        color: "#F7B23B",
                        constrain: "vertical",
                        onChange: handleConstraint1Drag,
                        position: [0, c1Intercept],
                    },
                    {
                        initial: [0, c2Intercept],
                        color: "#AC8BF9",
                        constrain: "vertical",
                        onChange: handleConstraint2Drag,
                        position: [0, c2Intercept],
                    },
                ]}
                plots={[
                    // Feasible region shading (proper filled polygon)
                    {
                        type: "polygon" as const,
                        points: feasiblePolygon,
                        color: "#22c55e",
                        fillOpacity: 0.2,
                        weight: 2,
                    },

                    // Non-negativity constraints (axes)
                    { type: "segment", point1: [0, 0], point2: [zoom, 0], color: "#94a3b8", weight: 2 },
                    { type: "segment", point1: [0, 0], point2: [0, zoom], color: "#94a3b8", weight: 2 },

                    // Constraint 1 line (Labor): y = c1Intercept - (2/3)x
                    {
                        type: "function",
                        fn: (x: number) => c1Intercept - (2/3) * x,
                        color: "#F7B23B",
                        weight: 3,
                        domain: [0, c1XIntercept] as [number, number],
                    },

                    // Constraint 2 line (Material): y = c2Intercept - 2x
                    {
                        type: "function",
                        fn: (x: number) => c2Intercept - 2 * x,
                        color: "#AC8BF9",
                        weight: 3,
                        domain: [0, c2XIntercept] as [number, number],
                    },

                    // Feasible region corner points
                    { type: "point", x: 0, y: 0, color: "#22c55e" },
                    { type: "point", x: vertices.yAxis[0], y: vertices.yAxis[1], color: "#22c55e" },
                    ...(vertices.intersection ? [{ type: "point" as const, x: vertices.intersection[0], y: vertices.intersection[1], color: "#22c55e" }] : []),
                    { type: "point", x: vertices.xAxis[0], y: vertices.xAxis[1], color: "#22c55e" },
                ]}
            />
            <InteractionHintSequence
                hintKey="constraint-builder-drag"
                steps={[
                    {
                        gesture: "drag-vertical",
                        label: "Drag the amber point to move the labor constraint",
                        position: { x: "12%", y: "25%" },
                    },
                ]}
            />
            {/* Zoom controls */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md">
                <button
                    onClick={() => setVar("graphZoom", Math.min(20, zoom + 2))}
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold transition-colors"
                    title="Zoom out"
                >
                    −
                </button>
                <span className="text-sm text-slate-600 min-w-[3rem] text-center">{zoom}</span>
                <button
                    onClick={() => setVar("graphZoom", Math.max(6, zoom - 2))}
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold transition-colors"
                    title="Zoom in"
                >
                    +
                </button>
            </div>
        </div>
    );
}

function CornerPointExplorer() {
    const setVar = useSetVar();
    const cornerX = useVar("cornerX", 0) as number;
    const cornerY = useVar("cornerY", 0) as number;

    // Objective function: Z = 40x + 30y
    const objectiveValue = 40 * cornerX + 30 * cornerY;

    // Define the feasible region corners
    const corners: [number, number][] = [
        [0, 0],      // Origin
        [0, 6],      // y-axis intercept
        [3, 4],      // Intersection point
        [5, 0],      // x-axis intercept
    ];

    // Constrain point to feasible region boundary
    const constrainToFeasible = useCallback((point: [number, number]): [number, number] => {
        const [x, y] = point;

        // Find closest point on feasible region boundary
        let closestPoint = corners[0];
        let minDist = Infinity;

        // Check corners
        for (const corner of corners) {
            const dist = Math.hypot(x - corner[0], y - corner[1]);
            if (dist < minDist) {
                minDist = dist;
                closestPoint = corner;
            }
        }

        // Snap to corner if very close
        if (minDist < 0.5) {
            return closestPoint;
        }

        // Otherwise, project onto nearest edge
        // Clamp to feasible region
        let clampedX = Math.max(0, Math.min(5, x));
        let clampedY = Math.max(0, Math.min(6, y));

        // Check labor constraint: 2x + 3y ≤ 18
        if (2 * clampedX + 3 * clampedY > 18) {
            clampedY = (18 - 2 * clampedX) / 3;
        }

        // Check material constraint: 4x + 2y ≤ 20
        if (4 * clampedX + 2 * clampedY > 20) {
            clampedY = (20 - 4 * clampedX) / 2;
        }

        return [clampedX, Math.max(0, clampedY)];
    }, []);

    const handlePointDrag = useCallback((point: [number, number]) => {
        const constrained = constrainToFeasible(point);
        setVar("cornerX", Math.round(constrained[0] * 10) / 10);
        setVar("cornerY", Math.round(constrained[1] * 10) / 10);
    }, [setVar, constrainToFeasible]);

    return (
        <div className="relative">
            <Cartesian2D
                height={400}
                viewBox={{ x: [-1, 8], y: [-1, 8] }}
                movablePoints={[
                    {
                        initial: [cornerX, cornerY],
                        color: "#ef4444",
                        onChange: handlePointDrag,
                        position: [cornerX, cornerY],
                    },
                ]}
                plots={[
                    // Feasible region edges
                    { type: "segment", point1: [0, 0], point2: [5, 0], color: "#64748b", weight: 2 },
                    { type: "segment", point1: [0, 0], point2: [0, 6], color: "#64748b", weight: 2 },
                    { type: "segment", point1: [0, 6], point2: [3, 4], color: "#F7B23B", weight: 2 },
                    { type: "segment", point1: [3, 4], point2: [5, 0], color: "#AC8BF9", weight: 2 },

                    // Corner points
                    { type: "point", x: 0, y: 0, color: "#22c55e" },
                    { type: "point", x: 0, y: 6, color: "#22c55e" },
                    { type: "point", x: 3, y: 4, color: "#22c55e" },
                    { type: "point", x: 5, y: 0, color: "#22c55e" },

                    // Objective function iso-profit line through current point
                    {
                        type: "function",
                        fn: (x: number) => (objectiveValue - 40 * x) / 30,
                        color: "#22c55e",
                        weight: 2,
                        domain: [-1, 8] as [number, number],
                    },
                ]}
            />
            <InteractionHintSequence
                hintKey="corner-explorer-drag"
                steps={[
                    {
                        gesture: "drag",
                        label: "Drag the red point to different corners",
                        position: { x: "55%", y: "45%" },
                    },
                ]}
            />
            {/* Objective value display */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-md">
                <div className="text-sm text-slate-600">Objective Value</div>
                <div className="text-2xl font-bold text-[#22c55e]">Z = {Math.round(objectiveValue)}</div>
                <div className="text-xs text-slate-500 mt-1">
                    at ({cornerX.toFixed(1)}, {cornerY.toFixed(1)})
                </div>
            </div>
        </div>
    );
}

// ========================================
// SECTION BLOCKS
// ========================================

export const graphicalMethodBlocks: ReactElement[] = [
    // Section heading
    <StackLayout key="layout-graphical-title" maxWidth="xl">
        <Block id="graphical-title" padding="lg">
            <EditableH2 id="h2-graphical-title" blockId="graphical-title">
                The Graphical Method
            </EditableH2>
        </Block>
    </StackLayout>,

    // Introduction to graphical method
    <StackLayout key="layout-graphical-intro" maxWidth="xl">
        <Block id="graphical-intro" padding="sm">
            <EditableParagraph id="para-graphical-intro" blockId="graphical-intro">
                For problems with two decision variables, we can visualize the entire problem on a 2D coordinate plane. Each constraint becomes a line that divides the plane into two regions: one that satisfies the constraint and one that violates it. The area where all constraints are satisfied simultaneously is called the <InlineTooltip id="tooltip-feasible" tooltip="The set of all points (x, y) that satisfy every constraint in the linear programming problem. Only solutions within this region are 'allowed'.">feasible region</InlineTooltip>.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Interactive constraint builder
    <StackLayout key="layout-graphical-builder-heading" maxWidth="xl">
        <Block id="graphical-builder-heading" padding="md">
            <EditableParagraph id="para-builder-heading" blockId="graphical-builder-heading">
                <strong>Explore how constraints shape the feasible region.</strong> The <InlineSpotColor varName="constraint1Intercept" color="#F7B23B">amber line</InlineSpotColor> represents the labor constraint (2x + 3y ≤ 18), and the <InlineSpotColor varName="constraint2Intercept" color="#AC8BF9">violet line</InlineSpotColor> represents the material constraint (4x + 2y ≤ 20). Drag the points on the y-axis to adjust each constraint and watch how the feasible region changes.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-graphical-builder" maxWidth="xl">
        <Block id="graphical-builder" padding="md" hasVisualization>
            <InteractiveConstraintBuilder />
        </Block>
    </StackLayout>,

    // Constraint values display
    <SplitLayout key="layout-constraint-values" ratio="1:1" gap="md">
        <Block id="constraint-labor-value" padding="sm">
            <EditableParagraph id="para-constraint-labor" blockId="constraint-labor-value">
                <InlineSpotColor varName="constraint1Intercept" color="#F7B23B">Labor constraint</InlineSpotColor> y-intercept:{" "}
                <InlineScrubbleNumber
                    varName="constraint1Intercept"
                    {...numberPropsFromDefinition(getVariableInfo("constraint1Intercept"))}
                />
            </EditableParagraph>
        </Block>
        <Block id="constraint-material-value" padding="sm">
            <EditableParagraph id="para-constraint-material" blockId="constraint-material-value">
                <InlineSpotColor varName="constraint2Intercept" color="#AC8BF9">Material constraint</InlineSpotColor> y-intercept:{" "}
                <InlineScrubbleNumber
                    varName="constraint2Intercept"
                    {...numberPropsFromDefinition(getVariableInfo("constraint2Intercept"))}
                />
            </EditableParagraph>
        </Block>
    </SplitLayout>,

    // Why corners matter
    <StackLayout key="layout-corners-heading" maxWidth="xl">
        <Block id="corners-heading" padding="md">
            <EditableH2 id="h2-corners" blockId="corners-heading">
                Why Corners Matter
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-corners-explanation" maxWidth="xl">
        <Block id="corners-explanation" padding="sm">
            <EditableParagraph id="para-corners-explanation" blockId="corners-explanation">
                Here's the key insight of linear programming: <strong>the optimal solution always occurs at a corner point</strong> of the feasible region. Why? Because the objective function is linear, it forms parallel lines of equal value (called iso-profit lines). As we push these lines outward to increase profit, the last point they touch in the feasible region will always be a corner.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Corner point explorer
    <StackLayout key="layout-corner-explorer-intro" maxWidth="xl">
        <Block id="corner-explorer-intro" padding="sm">
            <EditableParagraph id="para-corner-explorer-intro" blockId="corner-explorer-intro">
                <strong>Discover this yourself!</strong> Drag the <InlineSpotColor varName="cornerX" color="#ef4444">red point</InlineSpotColor> around the feasible region below. The green line shows all points with the same objective value. Notice how moving along edges changes the value gradually, but corners give the extreme values.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-corner-explorer" maxWidth="xl">
        <Block id="corner-explorer" padding="md" hasVisualization>
            <CornerPointExplorer />
        </Block>
    </StackLayout>,

    // Corner values table description
    <StackLayout key="layout-corner-values-desc" maxWidth="xl">
        <Block id="corner-values-desc" padding="sm">
            <EditableParagraph id="para-corner-values-desc" blockId="corner-values-desc">
                As you explore, compare the objective values at each corner: (0,0) gives Z=0, (0,6) gives Z=180, (3,4) gives Z=240, and (5,0) gives Z=200. The maximum occurs at (3,4) with Z=240. This is always how we solve LP problems graphically: identify the corners, evaluate the objective function at each, and pick the best.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Assessment question
    <StackLayout key="layout-graphical-assessment" maxWidth="xl">
        <Block id="graphical-assessment" padding="md">
            <EditableParagraph id="para-graphical-assessment" blockId="graphical-assessment">
                In linear programming, the optimal solution is always found at the{" "}
                <InlineFeedback
                    varName="answerWhyCorners"
                    correctValue="corners"
                    position="mid"
                    successMessage="✓ — corners (vertices) are where optimal solutions live"
                    failureMessage="✗"
                    hint="Think about where parallel iso-profit lines last touch the feasible region"
                >
                    <InlineClozeChoice
                        varName="answerWhyCorners"
                        correctAnswer="corners"
                        options={["center", "corners", "edges", "anywhere"]}
                        {...choicePropsFromDefinition(getVariableInfo("answerWhyCorners"))}
                    />
                </InlineFeedback>{" "}
                of the feasible region.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
