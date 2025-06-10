import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import eventStepConfig from "../../config/eventStepConfig";

const events = [
  { type: "shoot", label: "Shoot" },
  { type: "rebound", label: "Rebound" },
  { type: "freeThrow", label: "Free Throw" },
  { type: "turnover", label: "Turnover" },
  { type: "steal", label: "Steal" },
  { type: "block", label: "Block" },
  { type: "fault", label: "Fault" },
];

const EventCreateSteps = () => {
  const [eventType, setEventType] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [formData, setFormData] = useState({});
  const containerRef = useRef(null);

  const steps = eventType ? eventStepConfig[eventType] || [] : [];
  const currentStep = steps[stepIndex];
  const stepKey = currentStep?.step;

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" }
      );
    }
  }, [stepIndex, eventType]);

  const handleEventClick = (type) => {
    setEventType(type);
    setStepIndex(0);
    setFormData({});
  };

  const handleNext = (value) => {
    const updated = { ...formData, [stepKey]: value };
    setFormData(updated);

    if (stepIndex < steps.length - 1) {
      setStepIndex((prev) => prev + 1);
    } else {
      console.log("🎯 Final Event Created:", { eventType, ...updated });
      // Reset hoặc gửi API tại đây
    }
  };

  const handleBack = () => {
    if (stepIndex === 0) setEventType(null);
    else setStepIndex((prev) => prev - 1);
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="w-full max-w-md p-4" ref={containerRef}>
        {/* Step chọn Event Type */}
        {!eventType && (
          <div className="flex flex-wrap justify-center gap-3">
            {events.map((ev) => (
              <button
                key={ev.type}
                onClick={() => handleEventClick(ev.type)}
                className="bg-orange text-white px-4 py-2 rounded hover:bg-orange-600 shadow"
              >
                {ev.label}
              </button>
            ))}
          </div>
        )}

        {/* Các bước nhập dữ liệu */}
        {eventType && currentStep && (
          <div className="text-center space-y-4">
            <h2 className="text-lg font-semibold">{currentStep.label}</h2>

            {/* Nếu có options → tạo nút lựa chọn */}
            {currentStep.options ? (
              <div className="flex flex-wrap justify-center gap-2">
                {currentStep.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleNext(opt)}
                    className={`px-4 py-2 rounded ${
                      formData[stepKey] === opt
                        ? "bg-blue-700 text-white"
                        : "bg-sky-500 hover:bg-sky-600 text-white"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              <button
                onClick={() => handleNext("next")}
                className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-1 rounded"
              >
                Next
              </button>
            )}

            {/* Hiển thị dữ liệu đã chọn trước đó */}
            {formData[stepKey] && (
              <div className="text-sm text-gray-500 italic">
                Chọn: {formData[stepKey]}
              </div>
            )}

            <button
              onClick={handleBack}
              className="text-sky-500 hover:underline text-sm mt-4 block"
            >
              ← Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCreateSteps;
