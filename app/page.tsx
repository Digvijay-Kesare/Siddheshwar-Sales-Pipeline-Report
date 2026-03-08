import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-6">

      <div className="max-w-4xl text-center">

        {/* Title */}
        <h1 className="text-5xl font-bold text-green-700 mb-6">
          Agri Pipeline Survey Report System
        </h1>

        {/* Description */}
        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          The <b>Agriculture Pipeline Survey Report</b> is used to design and
          analyze irrigation pipeline systems for farms. It helps engineers and
          farmers calculate important parameters such as pipeline length,
          discharge rate, static head, friction loss, and total head required
          for efficient water distribution.
        </p>

        <p className="text-lg text-gray-700 leading-relaxed mb-10">
          This digital system allows you to easily create, manage, and generate
          detailed survey reports for agricultural pipeline installations. The
          platform automatically calculates friction losses, maintains survey
          records, and generates professional reports for field use.
        </p>

        {/* Button */}
        <div className="flex justify-center">

          <a
            href="/login"
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg transition-all duration-300 hover:scale-105"
          >
            Create Report
            <ArrowRight size={20} />
          </a>

        </div>

      </div>

    </div>
  );
}