

import { useState } from 'react';
import { Button } from '../ui/button';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { assessmentsAPI } from '../../../services/api';
import { toast } from 'sonner';

interface Question {
  _id: string;
  question: string;
  type: 'MCQ' | 'True/False';
  options: string[];
  points: number;
}

interface AssessmentResult {
  score: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
  attemptNumber: number;
}

interface Assessment {
  _id: string;
  title: string;
  questions: Question[];
  status: 'Draft' | 'Published';
}

interface AssessmentViewerProps {
  assessment?: Assessment | null;
  onBack: () => void;
}

export default function AssessmentViewer({ assessment, onBack }: AssessmentViewerProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  if (!assessment) return null;

  // Check if assessment is published
  if (assessment.status === 'Draft') {
    return (
      <div className="space-y-6">
        <Button onClick={onBack} variant="ghost" className="text-indigo-300 hover:text-white hover:bg-white/10">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Assessment Not Available</h2>
          <p className="text-indigo-300 mb-6">
            This assessment is currently in Draft mode and not yet available for taking.
          </p>
          <div className="bg-yellow-500/20 text-yellow-300 px-4 py-2 rounded-lg inline-block">
            Status: Draft
          </div>
        </div>
      </div>
    );
  }

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [currentQuestion]: answer });
  };

  const handleSubmit = async () => {
    try {
      const answerArray = assessment.questions.map((_, idx) => answers[idx] || '');
      const response = await assessmentsAPI.submit(assessment._id, answerArray, 0) as { result: AssessmentResult };
      setResult(response.result);
      setSubmitted(true);
      toast.success('Assessment submitted!');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to submit assessment');
    }
  };

  if (submitted && result) {
    return (
      <div className="space-y-6">
        <Button onClick={onBack} variant="ghost" className="text-indigo-300 hover:text-white hover:bg-white/10">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">Assessment Complete!</h2>
          <p className="text-indigo-200 mb-8">You scored {result.percentage.toFixed(0)}%</p>
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-indigo-300 text-sm">Score</p>
              <p className="text-white text-2xl font-bold">{result.score}/{result.totalPoints}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-indigo-300 text-sm">Percentage</p>
              <p className="text-white text-2xl font-bold">{result.percentage.toFixed(0)}%</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-indigo-300 text-sm">Status</p>
              <p className={`text-2xl font-bold ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
                {result.passed ? 'Passed' : 'Failed'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = assessment.questions[currentQuestion];

  return (
    <div className="space-y-6">
      <Button onClick={onBack} variant="ghost" className="text-indigo-300 hover:text-white hover:bg-white/10">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">{assessment.title}</h2>
            <span className="text-indigo-300">
              Question {currentQuestion + 1} of {assessment.questions.length}
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / assessment.questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl text-white mb-6">{question.question}</h3>
          <div className="space-y-3">
            {question.type === 'MCQ' ? (
              question.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    answers[currentQuestion] === option
                      ? 'bg-indigo-500 border-indigo-500 text-white'
                      : 'bg-white/5 border-white/10 text-indigo-200 hover:bg-white/10'
                  }`}
                >
                  {option}
                </button>
              ))
            ) : (
              <>
                <button
                  onClick={() => handleAnswer('True')}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    answers[currentQuestion] === 'True'
                      ? 'bg-indigo-500 border-indigo-500 text-white'
                      : 'bg-white/5 border-white/10 text-indigo-200 hover:bg-white/10'
                  }`}
                >
                  True
                </button>
                <button
                  onClick={() => handleAnswer('False')}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    answers[currentQuestion] === 'False'
                      ? 'bg-indigo-500 border-indigo-500 text-white'
                      : 'bg-white/5 border-white/10 text-indigo-200 hover:bg-white/10'
                  }`}
                >
                  False
                </button>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            variant="ghost"
            className="text-indigo-300 hover:text-white"
          >
            Previous
          </Button>
          {currentQuestion === assessment.questions.length - 1 ? (
            <Button onClick={handleSubmit} className="bg-gradient-to-r from-indigo-500 to-purple-600">
              Submit Assessment
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentQuestion(currentQuestion + 1)}
              className="bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30"
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
