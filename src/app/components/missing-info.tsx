import React, { useState } from "react";
import { useMessages } from "../hooks/messages";

const MissingInformationForm = ({
  missingInformation = [],
}: {
  missingInformation: {
    field: string;
    question?: string;
    options?: { value: string; description: string }[];
  }[];
}) => {
  const { addMessage } = useMessages();
  const [isLoading, setLoading] = useState(false);
  const [formData, setFormData] = useState(
    (missingInformation || []).reduce((acc: Record<string, string>, item) => {
      acc[item.field] = "";
      return acc;
    }, {})
  );

  const [currentStep, setCurrentStep] = useState(0);

  const [showOtherInput, setShowOtherInput] = useState<Record<string, boolean>>(
    {}
  );

  const [isComplete, setIsComplete] = useState(false);

  interface SelectChangeEvent {
    target: {
      value: string;
    };
  }

  const handleSelectChange = (e: SelectChangeEvent, field: string): void => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));

    if (value === "other") {
      setShowOtherInput((prev) => ({
        ...prev,
        [field]: true,
      }));
    } else {
      setShowOtherInput((prev) => ({
        ...prev,
        [field]: false,
      }));
      handleNextStep();
    }
  };

  interface InputChangeEvent {
    target: {
      name: string;
      value: string;
    };
  }

  const handleInputChange = (e: InputChangeEvent): void => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNextStep = () => {
    if (currentStep < displayItems.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handleCustomConfirm = () => {
    handleNextStep();
  };

  interface FormEvent {
    preventDefault: () => void;
  }

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const formattedDetails = Object.entries(formData)
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n");

      addMessage({
        content: `Here are the missing details:\n\n${formattedDetails}`,
        sender: "User",
        timestamp: new Date(),
        userId: 1,
        state: [],
      });
      setLoading(false);
    }, 1000);
  };

  // Reset the form
  const handleReset = () => {
    setFormData({});
    setCurrentStep(0);
    setShowOtherInput({});
    setIsComplete(false);
  };

  const sampleData = [
    {
      field: "Deployment Target",
      question: "Where do you plan to deploy the application?",
      options: [
        { value: "AWS", description: "Amazon Web Services" },
        { value: "GCP", description: "Google Cloud Platform" },
        { value: "Azure", description: "Microsoft Azure" },
      ],
    },
    {
      field: "Container Port",
      question: "Which port will your React application listen on?",
      options: [
        { value: "3000", description: "Port 3000 (default for React)" },
        { value: "8080", description: "Port 8080" },
        { value: "other", description: "Other (please specify)" },
      ],
    },
  ];

  const displayItems =
    missingInformation && missingInformation.length > 0
      ? missingInformation
      : sampleData;

  const currentQuestion = displayItems[currentStep];

  return (
    <div className="bg-black/30 text-white p-3 rounded-lg shadow-2xl mx-auto">
      <div className="mb-6">
        <h3 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
          {isComplete
            ? "Information Complete"
            : "Please Provide the Missing Information"}
        </h3>

        {/* Progress indicator */}
        <div className="mt-3 flex items-center">
          <div className="flex-1">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-teal-400 rounded-full"
              style={{
                width: isComplete
                  ? "100%"
                  : `${(currentStep / (displayItems.length - 1)) * 100}%`,
              }}
            ></div>
          </div>
          <div className="ml-3 text-sm text-gray-400">
            {isComplete
              ? "Complete"
              : `${currentStep + 1}/${displayItems.length}`}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {!isComplete ? (
          <div className="form-group animate-fade-in">
            <label
              htmlFor={currentQuestion.field}
              className="block mb-2 text-sm font-medium text-blue-400"
            >
              {currentQuestion.question || currentQuestion.field}
            </label>

            {/* Dropdown for options */}
            <select
              id={currentQuestion.field}
              name={currentQuestion.field}
              value={formData[currentQuestion.field] || ""}
              onChange={(e) => handleSelectChange(e, currentQuestion.field)}
              required
              className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600 text-white"
            >
              <option value="" disabled>
                Select an option
              </option>
              {currentQuestion.options &&
                currentQuestion.options.map((option, optIndex) => (
                  <option key={optIndex} value={option.value}>
                    {option.description}
                  </option>
                ))}
            </select>

            {/* Show text input if "other" is selected */}
            {showOtherInput[currentQuestion.field] && (
              <div className="mt-2 space-y-2">
                <input
                  type="text"
                  name={`${currentQuestion.field}_custom`}
                  value={formData[`${currentQuestion.field}_custom`] || ""}
                  onChange={handleInputChange}
                  placeholder="Please specify"
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600 text-white placeholder-gray-600"
                />
                <button
                  type="button"
                  onClick={handleCustomConfirm}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md"
                >
                  Confirm
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="py-4 space-y-4">
            <div className="bg-gray-900 p-4 rounded-md">
              <h4 className="text-lg font-medium text-teal-400 mb-3">
                Summary
              </h4>
              {displayItems.map((item, index) => (
                <div key={index} className="mb-2">
                  <span className="text-gray-400">{item.field}: </span>
                  <span className="text-white">
                    {formData[item.field] === "other"
                      ? formData[`${item.field}_custom`]
                      : formData[item.field] || "Not specified"}
                  </span>
                </div>
              ))}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 font-medium rounded-md bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white transition duration-300 disabled:opacity-70"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Loading...
                </span>
              ) : (
                "Submit"
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="w-full px-4 py-2 font-medium rounded-md border border-gray-700 hover:bg-gray-800 text-gray-300 transition duration-300"
            >
              Start Over
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default MissingInformationForm;
