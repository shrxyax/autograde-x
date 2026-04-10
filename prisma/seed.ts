import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { assignmentStatuses, roles } from "@/lib/domain";

const prisma = new PrismaClient();

async function main() {
  await prisma.submission.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash("DemoPass123", 12);

  const [student, faculty, admin] = await Promise.all([
    prisma.user.create({
      data: {
        name: "Shreya Chakraborty",
        email: "student@autogradex.local",
        password,
        role: roles.STUDENT,
      },
    }),
    prisma.user.create({
      data: {
        name: "Prof. Shobha Rekh",
        email: "faculty@autogradex.local",
        password,
        role: roles.FACULTY,
      },
    }),
    prisma.user.create({
      data: {
        name: "Platform Admin",
        email: "admin@autogradex.local",
        password,
        role: roles.ADMIN,
      },
    }),
  ]);

  await prisma.assignment.create({
    data: {
      title: "AutoGradeX Lean Canvas Review",
      topic: "Software Engineering course project evaluation",
      description: "Submit a structured project report describing the product scope, architecture, workflow, and evaluation plan.",
      rubric: "Problem framing 20%, architecture 25%, implementation quality 25%, documentation 15%, testing and scalability 15%",
      difficulty: "Medium",
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      maxScore: 100,
      status: assignmentStatuses.PUBLISHED,
      createdById: faculty.id,
    },
  });

  console.log("Seeded demo users:");
  console.log(`Student: ${student.email} / DemoPass123`);
  console.log(`Faculty: ${faculty.email} / DemoPass123`);
  console.log(`Admin: ${admin.email} / DemoPass123`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
