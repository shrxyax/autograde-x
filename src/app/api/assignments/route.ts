import { NextResponse } from "next/server";
import { createAssignment,getAssignments } from "@/lib/assignments/service";

export async function GET() {
  try{
    const assignments = await getAssignments();
    return NextResponse.json(assignments);      
  }
  catch(error){
    console.error("Error fetching assignments:", error);
    return NextResponse.json({ error: "Failed to fetch assignments" }, { status: 500 });
  }
}
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const assignment = await createAssignment(data);
    return NextResponse.json(assignment, { status: 201 });
  } catch (error) {
    console.error("Error creating assignment:", error);
    return NextResponse.json({ error: "Failed to create assignment" }, { status: 500 });
  }
}