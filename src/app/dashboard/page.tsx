export default function DashboardHome() {

  return (

    <div>

      <h1 className="text-3xl font-bold mb-6">
        Dashboard
      </h1>

      <p className="text-gray-700">
        Welcome to AutoGradeX — AI assisted project evaluation system.
      </p>

      <div className="grid grid-cols-3 gap-6 mt-8">

        <div className="border p-6 rounded bg-white shadow">
          <h2 className="font-semibold text-lg">
            Assignments
          </h2>
          <p>Create and manage assignments.</p>
        </div>

        <div className="border p-6 rounded bg-white shadow">
          <h2 className="font-semibold text-lg">
            Submissions
          </h2>
          <p>Review student submissions.</p>
        </div>

        <div className="border p-6 rounded bg-white shadow">
          <h2 className="font-semibold text-lg">
            AI Evaluation
          </h2>
          <p>AI automatically evaluates assignments.</p>
        </div>

      </div>

    </div>
  );
}