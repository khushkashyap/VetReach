import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Report from "@/models/Report"; // Ensure the model is defined properly

// GET request to fetch all rescue reports
export async function GET() {
    try {
        await connectDB();
        const reports = await Report.find(); // Fetch all reports

        return NextResponse.json(reports, { status: 200 });
    } catch (error) {
        console.error("Error fetching reports:", error);
        return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
    }
}

// POST request to create a new report
export async function POST(req) {
    try {
        await connectDB();
        const data = await req.json();
        const newReport = new Report(data);
        await newReport.save();

        return NextResponse.json({ message: "Report submitted successfully!" }, { status: 201 });
    } catch (error) {
        console.error("Error submitting report:", error);
        return NextResponse.json({ error: "Failed to submit report" }, { status: 500 });
    }
}
