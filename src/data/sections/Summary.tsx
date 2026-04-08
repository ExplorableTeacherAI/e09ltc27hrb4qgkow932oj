import { type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout, GridLayout } from "@/components/layouts";
import {
    EditableH2,
    EditableParagraph,
    InlineHyperlink,
} from "@/components/atoms";

// ========================================
// SECTION BLOCKS
// ========================================

export const summaryBlocks: ReactElement[] = [
    // Section heading
    <StackLayout key="layout-summary-title" maxWidth="xl">
        <Block id="summary-title" padding="lg">
            <EditableH2 id="h2-summary-title" blockId="summary-title">
                Summary: What You've Learned
            </EditableH2>
        </Block>
    </StackLayout>,

    // Key takeaways
    <StackLayout key="layout-summary-intro" maxWidth="xl">
        <Block id="summary-intro" padding="sm">
            <EditableParagraph id="para-summary-intro" blockId="summary-intro">
                You've now explored the fundamentals of linear programming, from understanding the basic components to solving problems both graphically and algebraically. Let's recap the key concepts.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Key concepts in grid
    <GridLayout key="layout-summary-grid" columns={2} gap="md">
        <Block id="summary-components" padding="md">
            <div className="bg-[#62D0AD]/10 rounded-lg p-4 h-full">
                <h3 className="font-semibold text-[#62D0AD] mb-2">LP Components</h3>
                <ul className="text-sm text-slate-700 space-y-1">
                    <li>• Decision variables (what to optimize)</li>
                    <li>• Objective function (what to maximize/minimize)</li>
                    <li>• Constraints (limitations to respect)</li>
                    <li>• Non-negativity conditions</li>
                </ul>
            </div>
        </Block>
        <Block id="summary-graphical" padding="md">
            <div className="bg-[#8E90F5]/10 rounded-lg p-4 h-full">
                <h3 className="font-semibold text-[#8E90F5] mb-2">Graphical Method</h3>
                <ul className="text-sm text-slate-700 space-y-1">
                    <li>• Works for 2-variable problems</li>
                    <li>• Constraints form the feasible region</li>
                    <li>• Optimal solutions at corner points</li>
                    <li>• Iso-profit lines find the maximum</li>
                </ul>
            </div>
        </Block>
        <Block id="summary-simplex" padding="md">
            <div className="bg-[#F7B23B]/10 rounded-lg p-4 h-full">
                <h3 className="font-semibold text-[#F7B23B] mb-2">Simplex Method</h3>
                <ul className="text-sm text-slate-700 space-y-1">
                    <li>• Works for any number of variables</li>
                    <li>• Convert to standard form with slack variables</li>
                    <li>• Pivot operations move between corners</li>
                    <li>• Stop when no negative coefficients remain</li>
                </ul>
            </div>
        </Block>
        <Block id="summary-key-insight" padding="md">
            <div className="bg-[#22c55e]/10 rounded-lg p-4 h-full">
                <h3 className="font-semibold text-[#22c55e] mb-2">Key Insight</h3>
                <ul className="text-sm text-slate-700 space-y-1">
                    <li>• Linear objectives + linear constraints</li>
                    <li>• Feasible region is always a polygon/polyhedron</li>
                    <li>• Optimal always at a vertex (corner)</li>
                    <li>• Simplex = smart corner-hopping</li>
                </ul>
            </div>
        </Block>
    </GridLayout>,

    // Where to go next
    <StackLayout key="layout-summary-next" maxWidth="xl">
        <Block id="summary-next" padding="md">
            <EditableH2 id="h2-summary-next" blockId="summary-next">
                Where to Go From Here
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-summary-next-text" maxWidth="xl">
        <Block id="summary-next-text" padding="sm">
            <EditableParagraph id="para-summary-next-text" blockId="summary-next-text">
                Linear programming is a vast field with many extensions. You might explore integer programming (when variables must be whole numbers), duality theory (every LP has a "mirror" problem), or sensitivity analysis (how solutions change when parameters shift). Software like Excel Solver, Python's scipy.optimize, or specialized tools like CPLEX can solve problems with thousands of variables in seconds.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Final encouragement
    <StackLayout key="layout-summary-encouragement" maxWidth="xl">
        <Block id="summary-encouragement" padding="md">
            <EditableParagraph id="para-summary-encouragement" blockId="summary-encouragement">
                The core ideas you've learned here apply to real-world problems in logistics, finance, manufacturing, and beyond. Whether you're scheduling flights, allocating budgets, or optimizing supply chains, linear programming provides a powerful framework for making the best decisions within constraints.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Review links
    <StackLayout key="layout-review-links" maxWidth="xl">
        <Block id="review-links" padding="sm">
            <EditableParagraph id="para-review-links" blockId="review-links">
                Need to review? Jump back to:{" "}
                <InlineHyperlink id="link-review-intro" targetBlockId="intro-title" showHint={false}>
                    Introduction
                </InlineHyperlink>{" "}
                |{" "}
                <InlineHyperlink id="link-review-graphical" targetBlockId="graphical-title" showHint={false}>
                    Graphical Method
                </InlineHyperlink>{" "}
                |{" "}
                <InlineHyperlink id="link-review-simplex" targetBlockId="simplex-intro-title" showHint={false}>
                    Simplex Method
                </InlineHyperlink>
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
